---
title: ShadoNet
tagline: Morphology-aware nucleus analysis from sparse supervision.
description: Single-stage Ki-67 nucleus detection and classification. Human centers name the object; SAM supplies optional shape; a fully convolutional network regresses class-specific proximity maps with rotation-aware SIoU and Hausdorff losses.
icon: shadonet
tag: Computational pathology
status: Paper accepted
order: 1
keywords:
    - ShadoNet
    - sparse supervision
    - nucleus analysis
    - morphology-aware learning
    - computational pathology
    - Ki-67
    - SAM
    - proximity maps
---

This is the working page for ShadoNet. I used to keep a week-by-week development journal. The useful decisions are here now, in one place—including the ones that did not fit the accepted paper.

<aside class="callout callout--update" role="note">
<p class="callout-label">Paper</p>
<div class="callout-body">
<p><em>ShadoNet: A Cell Detection and Classification Framework for Ki-67 Pathology Images</em> was accepted at Oxford <em>Bioinformatics</em>.</p>
</div>
</aside>

The motivating question is simple to state and difficult to answer: can we design a model that learns useful morphology from supervision that is cheaper and sparser than dense masks?

The method is two parts, and the order matters. First I **build proximity targets** from human centers and optional SAM shapes. Then I **regress those maps** from the Ki-67 tile in one stage. SAM is allowed in the first part. It is not an extra input at test time.

<span class="margin-note">The label format is a hypothesis about what the model needs to learn, not a neutral input.</span>

Code: [github.com/GhasemiGOF/ShadoNet](https://github.com/GhasemiGOF/ShadoNet). The microbiology sibling of this argument is [SporeAI](/projects/sporeai).

<figure class="figure">
  <img src="/images/projects/shadonet/fig_pipeline.svg" alt="Pipeline: Ki-67 tile and human centers enter SAM filters, become class-specific proximity maps, then a ki67net FCN, then detection peaks." />
  <figcaption>Centers name the nucleus and its class. SAM, when it agrees with exactly one center, donates a shape. The network never sees SAM at inference.</figcaption>
</figure>

## What this project is

ShadoNet is a nucleus-centered method for computational pathology, built for **Ki-67-stained** tiles. The practical constraint is annotation: dense nucleus masks are slow, difficult, and not always reproducible. The scientific constraint is morphology: a model can detect nuclei without learning anything I would trust about shape.

Unlike pipelines that detect first and classify later, ShadoNet is a **single-stage structured regression**. The network predicts one proximity map per class. Peaks are nuclei. Which channel peaks is the class.

I do not want ShadoNet to succeed because the supervision was made artificially easy. I also do not want it to require a label type that removes the practical motivation for the work.

<aside class="callout callout--key-idea" role="note">
<p class="callout-label">Key idea</p>
<div class="callout-body">
<p>Sparse supervision alone is not a scientific contribution. Morphology-aware learning under sparse supervision is a claim about what representations should preserve when boundaries were never drawn by a person.</p>
</div>
</aside>

Related writing: [morphology before accuracy](/blog/research-notes/morphology-before-accuracy), [what is weak supervision](/blog/small-explainers/what-is-weak-supervision), [center points vs. segmentation masks](/blog/small-explainers/center-points-vs-segmentation-masks).

## Why shape is even a hypothesis

Ki-67 grading for pancreatic neuroendocrine tumors is a counting problem. WHO guidance is on the order of 500–2000 cells per hotspot. The tiles mix immunopositive tumor, immunonegative tumor, and non-tumor cells. H&E detectors are abundant. Ki-67 ones are not: staining is more expensive, annotation is less standardized, and H&E-pretrained models do not transfer for free.

The reason I keep talking about morphology is not aesthetic. In these tiles the classes look different.

<figure class="figure">
  <img src="/images/projects/shadonet/fig_shape_variation.png" alt="Three Ki-67 patches with ellipse overlays: immunonegative cells in blue, non-tumor cells in green, immunopositive cells in orange." />
  <figcaption>From the paper. Immunopositive cells tend to be larger and rounder. Non-tumor cells are often elongated. If those cues were not there, SAM plus a shape loss would be decoration.</figcaption>
</figure>

## Two parts, on purpose

I used to describe this as “train a nucleus detector.” That hides the actual work. The bottleneck is what a click is allowed to become.

| Part | What it is allowed to use | What it is not allowed to pretend |
| --- | --- | --- |
| **1. Label generation** | Human centers + class, SAM masks, area / nesting / one-center filters, fallback circles | That SAM *is* an expert outline, or that a click drew a boundary |
| **2. ki67net** | The RGB Ki-67 tile only | That SAM will be there at test time, or that mask IoU is the scientific claim |

The on-disk targets are three proximity channels, matching the class IDs in the `.mat` files:

| ID | Public name | Map |
| --- | --- | --- |
| 1 | positive (Ki-67+) | `labels_postm` |
| 2 | negative (Ki-67−) | `labels_negtm` |
| 3 | non-tumour / other | `labels_other` |

BCD is two-class (positive / negative). NETnewClass and PNET keep the third channel.

## Part 1 — How a proximity label is found

Center points preserve object existence. Masks preserve boundary detail. Those are not the same signal, even when both are applied to the same nuclei.

| Centers | Masks |
| --- | --- |
| Object existence | Object existence |
| Approximate location | Boundary detail |
| Shape unspecified | Shape enforced |

If the task needs boundaries, centers need additional evidence. If it does not, centers may suffice. ShadoNet’s compromise: **the person clicks; SAM may donate a shape; the loss is still scored at centers.**

`Gen_refactored.py` is the generator. SAM (`vit_h`) proposes masks. I do not keep every blob. A mask has to survive filters, then I paint a decayed proximity field *inside* that shape, from the human center (or the mask centroid in `sam_all`).

```python
# sam_full: keep a mask only if it looks nucleus-sized,
# is not a nested outer bag, and contains exactly one click
if area > 0.02 * H * W: drop
if another mask sits entirely inside it: drop the outer one
if n_centers_inside != 1: drop

# paint class channel: high at the center, decaying to the SAM border
value = regression_decay(dist_to_center, d, alpha, min_border)
map[class][shape] = max(map[class][shape], value)

# no SAM mask for this click → fallback circle
```

<figure class="figure">
  <img src="/images/projects/shadonet/fig_sam_filter.png" alt="Three panels: human center clicks, SAM masks kept in blue and dropped in red, then morphology-constrained proximity decay." />
  <figcaption>Paper Figure 2. (A) Human centers. (B) All SAM masks — blue kept, red dropped. (C) Decay constrained to the kept shape, not a circle, unless SAM missed the click.</figcaption>
</figure>

If SAM misses the click, I fall back to a small circle with \(d = 15\) px and \(\alpha = 3\). That is honest: a circle is a prior on extent, not a measured boundary. Raw SAM is not enough. In the paper ablation, unfiltered masks sat below 0.70 classification F1; keeping masks that own a click rose to 0.81 / 0.71; the full filter reached 0.89 / 0.79. Gains mostly saturate once about 60% of cells have a SAM shape.

Strategies exist so I can turn those knobs off one at a time.

| Strategy | SAM | Area | Nesting | One-center | Fallback circle |
| --- | --- | --- | --- | --- | --- |
| `no_sam` | no | — | — | — | yes |
| `raw_sam` | yes | no | no | no | yes |
| `sam_area` | yes | yes | no | no | yes |
| `sam_geom` | yes | yes | yes | no | yes |
| `sam_full` | yes | yes | yes | yes | yes |
| `sam_cell_p20` … `p80` | yes | yes | yes | yes | yes, and only a fraction of cells get SAM shape |

`sam_all` is the other extreme: paint every SAM mask, ignore human centers. That is an ablation, not the default claim.

<aside class="callout callout--misconception" role="note">
<p class="callout-label">Common misconception</p>
<div class="callout-body">
<p>Training with centers and evaluating with mask IoU is not a fair test of whether center supervision works. It tests whether the model guessed boundaries you never asked a person to draw. SAM shapes are privileged training geometry. Evaluation stays at the clicks.</p>
</div>
</aside>

## Part 2 — The network, and the loss as an argument

The architecture is a fully convolutional **Ki-Net**: a U-Net-style encoder–decoder with residual blocks, skip connections, and three (or two) proximity heads. Input: the stain. Output: class-specific maps. No region proposals. No second classifier head. The **baseline** in the paper is this same network trained with MSE on circular maps — no SAM shape, no SIoU, no HDT.

<figure class="figure">
  <img src="/images/projects/shadonet/fig_architecture.png" alt="Ki-Net encoder-decoder producing three proximity maps, trained with Hausdorff, rotated SIoU, and MSE." />
  <figcaption>Paper Figure 1. The network regresses maps. The shape losses compare a predicted blob to a SAM-informed target — distance field, rotated box, and pixel MSE.</figcaption>
</figure>

The first training runs failed in a way that was more informative than success would have been. Detection scores moved in the right direction. Visual inspection told a different story: responses clustered on stain intensity and tissue texture rather than on nucleus-shaped objects.

I had been looking for crashes and NaNs. I found organized wrongness instead.

<aside class="callout callout--observation" role="note">
<p class="callout-label">Observation</p>
<div class="callout-body">
<p>Aggregate loss curves looked healthy. Individual patches revealed the model attending to eosinophilic regions that correlated with nucleus density but were not nucleus-shaped. The metric and the morphology diverged quietly.</p>
</div>
</aside>

A loss specifies which mistakes are expensive and which are free. If texture shortcuts are free, the model will use them. The settled objective is a weighted mix — not because 0.8 / 0.1 / 0.1 is magic, but because each term forbids a different cheap solution:

```text
L = α L_MSE(proximity)     # be near the painted map
  + β L_SIoU(rotated boxes) # match extent and orientation
  + γ L_HDT(distance field) # pay extra at the boundary
```

Typical run: `α=0.8`, `β=0.1`, `γ=0.1`. The paper ablation also peaks near 0.80 F1 at 0.6 / 0.2 / 0.2. Moderate shape, not shape instead of MSE. Weight 1.0 on SIoU or HDT alone falls below 0.75.

- **MSE** on the proximity volume is the center-supervision term. Alone, it allows shapeless blobs.
- **Rotation-aware SIoU** compares oriented boxes extracted from predicted vs target blobs. Diffuse stain clouds become expensive.
- **Hausdorff distance-transform** weights the residual by how far a pixel is from a boundary. Getting the interior vaguely right is not enough.

```bash
bash train_fcn_cell_class.sh 0 NETnewClassSam true 0.8 0.1 0.1
```

Inference is a peak-finder on the predicted maps. A peak is a detection. The winning channel is the class. SAM is gone.

<aside class="callout callout--key-idea" role="note">
<p class="callout-label">Key idea</p>
<div class="callout-body">
<p>Changing the loss is not tuning. It is revising the claim about what the model should preserve when labels are sparse.</p>
</div>
</aside>

## Morphology as the organizing idea

At some point the project had a naming problem. I was describing it as a sparse-supervision method. That was accurate but incomplete. Sparse supervision explains the annotation constraint. It does not explain what the model should preserve about the tissue.

<span class="margin-note">“Sparse supervision” tells you what I don’t have. Morphology tells you what I’m trying not to lose.</span>

In ShadoNet, morphology is not a vague synonym for “looks good under a microscope.” It means a specific set of properties I want the representation to respect:

- approximate nucleus extent and orientation where centers are provided
- separation of touching or overlapping nuclei where the tissue demands it
- invariance to stain intensity without invariance to nuclear shape
- failure modes that a pathologist would recognize as wrong, not only a low F1

I am **not** claiming ShadoNet recovers full segmentation from centers. I am **not** claiming equivalence to mask-supervised methods on boundary metrics I did not train a person for. I am claiming that center supervision, plus optional SAM shape, plus a geometry-aware objective, can produce representations useful for nucleus-centered Ki-67 analysis.

<aside class="callout callout--research-question" role="note">
<p class="callout-label">Research question</p>
<div class="callout-body">
<p>Which morphology properties are identifiable from center supervision, and which require boundaries or additional weak signals? SAM is one extra weak signal. It is not a substitute for asking that question.</p>
</div>
</aside>

## How I refuse to evaluate

Pixel overlap against SAM masks would score privileged geometry the test-time user does not have. The protocol I trust is **center matching**, the same family of question as SporeAI: at this annotated location, did you find something, and did you name it correctly?

The paper numbers use a **16 px** matching radius and Hungarian one-to-one assignment. I also sweep the peak threshold \(t \in [0.40, 0.70]\) and the minimum peak distance \(r \in \{2,\ldots,16\}\) — 56 settings. Across that sweep, ShadoNet’s median classification F1 on NETnewClass is 0.795 against 0.734 for the no-shape baseline, and the interquartile range is tighter. Shape is not only a mean lift. It is less brittle post-processing.

I keep a “boring validation set”—patches chosen not for difficulty but for diagnosability. Its only job is to catch impossible behavior before I interpret real-data trends: nuclei clipped by the tile, overlap clusters, stain outliers.

<aside class="callout callout--observation" role="note">
<p class="callout-label">Observation</p>
<div class="callout-body">
<p>Reproducibility is not only about seeds and configs. It is also about whether you can reproduce the failure on a patch you have looked at with your eyes.</p>
</div>
</aside>

## What the current numbers are allowed to say

These are the accepted-paper tables, not the older `NETnewClassSam` dump I had on this page. Bold is the best entry in that column for the dataset. PNET is reported without a fold std.

<figure class="figure">
  <img src="/images/projects/shadonet/fig_paper_table1.png" alt="Paper Table 1. Detection and classification precision, recall, and F1 for CellViT, NuLite, Hover-Net, Baseline, and ShadoNet on NETnewClass, BCD, and PNET." />
  <figcaption>Paper Table 1. Headline detection and classification. ShadoNet takes F1 on all three datasets.</figcaption>
</figure>

<div class="table-scroll">

| Dataset | Method | Det. P | Det. R | Det. F1 | Cls. P | Cls. R | Cls. F1 |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: |
| NETnewClass | CellViT | 0.76±0.01 | 0.88±0.03 | 0.81±0.01 | 0.61±0.01 | 0.74±0.01 | 0.65±0.01 |
| | NuLite | 0.79±0.01 | 0.90±0.01 | 0.84±0.01 | 0.66±0.01 | 0.74±0.01 | 0.70±0.00 |
| | Hover-Net | 0.84±0.00 | **0.93±0.00** | 0.88±0.00 | 0.77±0.02 | **0.86±0.01** | 0.81±0.02 |
| | Baseline | 0.85±0.02 | 0.88±0.01 | 0.87±0.01 | 0.74±0.02 | 0.79±0.02 | 0.77±0.01 |
| | **ShadoNet** | **0.88±0.02** | 0.90±0.01 | **0.89±0.01** | **0.79±0.01** | 0.83±0.02 | **0.81±0.01** |
| BCD | CellViT | 0.63±0.03 | 0.27±0.02 | 0.38±0.02 | 0.41±0.02 | 0.25±0.02 | 0.31±0.01 |
| | NuLite | 0.73±0.12 | 0.62±0.01 | 0.66±0.06 | 0.71±0.11 | 0.60±0.01 | 0.64±0.06 |
| | Hover-Net | 0.75±0.11 | 0.69±0.02 | 0.71±0.06 | **0.74±0.11** | 0.66±0.02 | 0.69±0.06 |
| | Baseline | 0.72±0.03 | **0.86±0.01** | 0.78±0.01 | 0.70±0.03 | **0.83±0.01** | 0.76±0.01 |
| | **ShadoNet** | **0.76±0.02** | 0.84±0.01 | **0.80±0.01** | 0.73±0.02 | 0.81±0.01 | **0.77±0.01** |
| PNET | CellViT | 0.81 | **0.88** | 0.84 | 0.55 | 0.71 | 0.58 |
| | NuLite | 0.81 | 0.75 | 0.78 | 0.58 | 0.67 | 0.62 |
| | Hover-Net | 0.82 | 0.82 | 0.82 | 0.69 | 0.69 | 0.69 |
| | Baseline | 0.87 | 0.79 | 0.83 | 0.77 | 0.70 | 0.73 |
| | **ShadoNet** | **0.88** | 0.80 | **0.84** | **0.79** | 0.73 | **0.76** |

</div>

<figure class="figure">
  <img src="/images/projects/shadonet/fig_netnew_cv.svg" alt="Grouped bars of NETnewClass detection and classification F1 for CellViT, NuLite, Hover-Net, Baseline, and ShadoNet. ShadoNet is 0.89 and 0.81." />
  <figcaption>NETnewClass headline F1 from the paper table. ShadoNet 0.89 / 0.81. Hover-Net is 0.88 / 0.81.</figcaption>
</figure>

Per-class classification F1. BCD has no non-tumour class.

<figure class="figure">
  <img src="/images/projects/shadonet/fig_paper_table2.png" alt="Paper Table 2. Per-class classification F1 for positive, negative, and non-tumour on NETnewClass, BCD, and PNET." />
  <figcaption>Paper Table 2. Per-class F1. Hover-Net still wins NETnewClass non-tumour and PNET positive.</figcaption>
</figure>

| Dataset | Method | Positive | Negative | Non-tumour |
| --- | --- | ---: | ---: | ---: |
| NETnewClass | CellViT | 0.04±0.05 | 0.76±0.02 | 0.40±0.05 |
| | NuLite | 0.58±0.13 | 0.78±0.01 | 0.45±0.03 |
| | Hover-Net | 0.76±0.04 | **0.85±0.01** | **0.68±0.04** |
| | Baseline | 0.71±0.07 | 0.81±0.02 | 0.62±0.02 |
| | **ShadoNet** | **0.77±0.05** | 0.85±0.02 | 0.67±0.03 |
| BCD | CellViT | 0.00±0.00 | 0.46±0.01 | — |
| | NuLite | 0.66±0.06 | 0.63±0.06 | — |
| | Hover-Net | 0.72±0.06 | 0.68±0.05 | — |
| | Baseline | 0.78±0.01 | 0.74±0.01 | — |
| | **ShadoNet** | **0.79±0.01** | **0.76±0.01** | — |
| PNET | CellViT | 0.00 | 0.65 | 0.32 |
| | NuLite | 0.70 | 0.80 | 0.00 |
| | Hover-Net | **0.76** | 0.77 | 0.41 |
| | Baseline | 0.62 | 0.81 | 0.50 |
| | **ShadoNet** | 0.71 | **0.83** | **0.52** |

<figure class="figure">
  <img src="/images/projects/shadonet/fig_pannet_class.svg" alt="Grouped bars of NETnewClass per-class F1 for CellViT, NuLite, Hover-Net, Baseline, and ShadoNet on positive, negative, and non-tumour." />
  <figcaption>NETnewClass per-class F1 from the paper table. ShadoNet 0.77 / 0.85 / 0.67. Hover-Net still wins non-tumour (0.68). CellViT’s positive bar is 0.04.</figcaption>
</figure>

The honest reading: **ShadoNet takes the headline F1 on all three datasets, and it does not win every class.** Hover-Net is the serious comparison — better detection recall on NETnewClass, tied or better on some class F1s, and the best PNET positive score. CellViT’s near-zero positive F1 is a collapse, not a close second. NuLite’s PNET non-tumour F1 of 0.00 is the same kind of failure. I will not average those away.

Hover-Net from ImageNet, no Ki-67 fine-tune, sits around classification F1 0.58–0.59. After full fine-tune it reaches 0.88 / 0.81 on NETnewClass and matches us. That is the H&E-to-Ki-67 tax: the model can get there, but only after most of the Ki-67 training set.

The remaining confusion is not random. The dominant error is **non-tumor → immunonegative** (23% of misclassified cells on NETnewClass, 40% on SHIDC, 50% when transferring NETnewClass → SHIDC). Positive ↔ non-tumor is rare. Shape helps, and it does not dissolve that boundary.

### Transfer and SHIDC

SHIDC is lower quality and more variable stain. Training on NETnewClass or BCD and testing on SHIDC drops classification F1 to 0.63. Training on SHIDC and testing the other way is easier: 0.83 on BCD, 0.80 on NETnewClass.

| Transfer | Det. F1 | Cls. F1 |
| --- | ---: | ---: |
| SHIDC → BCD | 0.85 | 0.83 |
| SHIDC → NETnewClass | 0.89 | 0.80 |
| BCD → SHIDC | 0.65 | 0.63 |
| NETnewClass → SHIDC | 0.65 | 0.63 |

On SHIDC itself, trained there:

| Method | Det. F1 | Cls. F1 |
| --- | ---: | ---: |
| Baseline | 0.58 | 0.56 |
| Hover-Net | 0.66 | 0.56 |
| **ShadoNet** | **0.66** | **0.63** |

Detection ties Hover-Net. Classification does not. That is the number I would have been wrong to hide just because SHIDC is “supplementary.”

### Cost of the model

On NETnewClass, one A40, batch 1 for inference:

| Method | Params | Infer. |
| --- | ---: | ---: |
| **ShadoNet** | 11.7 M | 8.0 ms |
| NuLite | 48.0 M | 27.2 ms |
| Hover-Net | 54.7 M | 35.8 ms |
| CellViT-256 | 46.8 M | 40.4 ms |

Smaller, and not because I dropped the scientific claim.

## Datasets I actually run

| Name | Images | Cells | Split | Classes |
| --- | ---: | ---: | --- | --- |
| NETnewClass | 114 × 500², 38 cases | 22,198 (1,217 / 15,529 / 5,452) | 45 / 12 / 57 | pos / neg / other |
| BCD (BCData) | 1,338 × 640² | 181,074 (62,623 / 118,451) | 803 / 133 / 402 | pos / neg |
| PNET | 72 × 1192²; 20 annotated | 11,780 (1,519 / 7,989 / 2,272) | 8 / 2 / 10 | pos / neg / other |
| SHIDC-B-Ki-67 | 2,357 patches | 162,998 (50,861 / 107,647 / 4,490 lymph.) | 1,656 / 701 | pos / neg / lymph. |

PNET is a fine-tune / test set, not a five-fold. SAM variants (`*Sam`, `*_sam_full`, `*_sam_cell_p*`) are the same images with different label generators. They are not new biology.

## Debugging before claims

I trusted aggregate plots before checking enough individual examples. I now separate two activities:

**Pipeline validation** asks whether labels, augmentations, and metrics are doing what I think. Fixed coordinates. Verified train/val splits by slide ID. Confirmed center targets align with visible nuclei on a frozen set of ten patches.

**Hypothesis testing** asks whether SIoU / HDT / SAM-shape reject the texture shortcuts I named. That requires the pipeline to be trustworthy first.

Once the pipeline was stable, the remaining issues looked like modeling problems: stain drift in unlabeled regions, overlap separation that works on sanity cases but not consistently on real tissue, augmentations that helped natural-image models and made some nuclear boundaries harder to read.

None of these are solved. They are named.

## The paper

*ShadoNet: A Cell Detection and Classification Framework for Ki-67 Pathology Images* was accepted at Oxford *Bioinformatics*. The paper still has to explain not only what worked, but why center supervision is scientifically reasonable for the morphology claims. If the introduction reads like a detection paper with sparse labels as a footnote, the argument is incomplete.

Writing forced cuts I had avoided while coding: architecture details that did not connect to a named failure mode, ablations I ran without a hypothesis, language implying full segmentation when the person only clicked.

Every time I wrote “our method achieves,” I replaced it with “under these assumptions, the model” until I could point to a figure tied to a patch I had actually inspected.

Related: [what makes a medical AI paper convincing](/blog/research-notes/what-makes-a-medical-ai-paper-convincing), [clinical-grade weak supervision](/blog/paper-notes/clinical-grade-weak-supervision-real-data-is-not-a-footnote).

```bibtex
@article{ghasemi2026shadonet,
  title={ShadoNet: A Cell Detection and Classification Framework for Ki-67 Pathology Images},
  author={Ghasemi, Mahsa and Xing, Fuyong and Cornish, Toby C and Ghosh, Debashis and Bian, Jiang and Zhang, Xuhong},
  journal={Bioinformatics},
  year={2026},
  note={Accepted}
}
```

## Open questions

- Can a center-supervised objective reject texture shortcuts without dense *human* boundaries? SAM is a weak substitute, not a proof.
- How large does a morphology audit set need to be before a qualitative claim is more than a gallery?
- Why does Hover-Net still win some class F1s if the headline detection number is ours? Is that stain, class definition, or the circle fallback?
- What would falsify the morphology claim for an external reader?

A reader who is not embedded in these notes should still be able to answer one question after the paper: *What would falsify this claim?* If they cannot, the evaluation section is not done.

## Working notes

- Paper: accepted at Oxford *Bioinformatics* — *ShadoNet: A Cell Detection and Classification Framework for Ki-67 Pathology Images*.
- Current supervision: human centers + class; SAM shape when `sam_full` (or a `sam_cell_p*` fraction) accepts the mask; circles otherwise.
- Current objective: MSE + rotation-aware SIoU + Hausdorff DT, typically 0.8 / 0.1 / 0.1.
- Current evidence (paper): NETnewClass detect F1 0.89, classify F1 0.81; BCD 0.80 / 0.77; PNET 0.84 / 0.76. SHIDC classify F1 0.63 vs Hover-Net 0.56. Dominant error is other→negative.
- Next: keep every figure tied to a specific inspected patch, not only to a metric aggregated across tiles.
- Code: [github.com/GhasemiGOF/ShadoNet](https://github.com/GhasemiGOF/ShadoNet)
