---
title: SporeAI
tagline: Weak supervision for Bacillus sporulation in microscopy.
description: Two-part method for Bacillus subtilis sporulation — build cell-level labels from Omnipose, GFP, and phase-bright centers, then train a phase-only 2D nnU-Net that is not allowed to see fluorescence at test time.
icon: spore
tag: Microbiology
status: Under revision
order: 2
keywords:
    - SporeAI
    - Bacillus subtilis
    - sporulation
    - weak supervision
    - microscopy
    - fluorescence
    - GFP
    - Omnipose
    - nnU-Net
    - soft labels
---

This is the working page for SporeAI—the *Bacillus* sporulation project. I want one place to think in public about the biology, the images, and the supervision problem, instead of scattering it across a week-by-week series.

The short version: detect sporulation-related visual patterns in *Bacillus subtilis* when the available labels are incomplete, indirect, or cheaper than the biological event I actually care about.

The method is two parts, and the order matters. First I **build supervision**. Then I **train a phase-only nnU-Net**. Fluorescence is allowed in the first part. It is not allowed in the second.

This is the interface we are working toward. A phase field in. Cells as circles. Stage as color. No GFP on the screen the user sees.

<figure class="figure">
  <img src="/images/projects/sporeai/fig_sporevision.jpg" alt="SporeVision working interface: a phase-contrast field with cells marked as vegetative, developing, or mature circles, plus stage counts and a confidence panel." />
  <figcaption>SporeVision, the reader-facing sketch. Detection plus classification on phase. The dashboard numbers in the mockup are not a result. The scientific claim is still the click table below.</figcaption>
</figure>

This is what the images actually look like. Phase contrast, not H&E. Rods, a few phase-bright interiors, a mixed field.

<figure class="figure">
  <img src="/images/projects/sporeai/fig_field_phase.png" alt="Phase-contrast field Bacillus_054 next to a color prediction map, with a zoomed cluster of rods. Vegetative is green, stage 5 purple, mature red in the stored complete class." />
  <figcaption>Field <code>Bacillus_054</code>. Left is the phase the model is allowed to see. Right is a phase-only prediction. The zoom is so a reader who has never looked at this stain can see a rod and a bright spore. On disk the red class is still stored as <code>complete</code>; in prose I call it mature.</figcaption>
</figure>

<span class="margin-note">GFP is privileged information. The network that has to work later is not allowed to depend on it.</span>

<figure class="figure">
  <img src="/images/projects/sporeai/fig_pipeline.svg" alt="Pipeline: phase and GFP enter Omnipose and center rules, become soft stage labels, then a 2D nnU-Net trained on phase only." />
  <figcaption>The split I keep returning to. Phase is the image. GFP is evidence used to write labels. The trained model sees only phase.</figcaption>
</figure>

## What this project is

SporeAI is a biomedical image analysis project. The images are microscopy, not whole-slide histopathology. The organism is *Bacillus subtilis*. The event is sporulation: a developmental program with visual stages that are biologically meaningful and, in practice, expensive to annotate densely.

The method question is the same thread as [ShadoNet](/projects/shadonet), in a different modality: what can a model learn from weak or heterogeneous supervision without collapsing the biology into a texture shortcut?

In pathology the seductive failure was stain. Here I expect it to be GFP blobs, late-stage phase-bright spores, and any rule that treats “bright in the fluorescent channel” as the definition of the class.

<aside class="callout callout--key-idea" role="note">
<p class="callout-label">Key idea</p>
<div class="callout-body">
<p>Sporulation is not an object-detection task with a convenient binary label. The supervision has to respect a process—cells changing state—rather than only the presence of a blob that looks spore-like.</p>
</div>
</aside>

## The biological question

Under stress, *B. subtilis* can leave vegetative growth and form an endospore. That program is ordered:

**vegetative → stage 1 → stage 2 → stage 3 → stage 4 → stage 5 → mature**

A microscopist can often see those states in phase contrast. Fluorescent reporters can mark related molecular events—polarization, engulfment, coat assembly—but the two views of the same cell are not guaranteed to agree, and they are not equally trustworthy as labels.

What I want the model to help with:

- finding sporulation-related patterns in phase / brightfield
- using fluorescence as a *signal*, not as an unexamined gold standard
- being honest when morphology and the fluorescent marker diverge

The interesting cases are the ambiguous ones: early stages, crowded fields, mixed populations, and cells that look sporulating in one channel and not in another. A model that only finds late, high-contrast spores has not understood the process.

## Two parts, on purpose

I used to talk about this as “train nnU-Net on Bacillus images.” That hides the actual work. The bottleneck is not the architecture. It is how a cell becomes a training target.

| Part | What it is allowed to use | What it is not allowed to pretend |
| --- | --- | --- |
| **1. Label generation** | Phase, GFP, Omnipose instances, culture-stage prior, sparse expert clicks | That GFP *is* the stage, or that a click drew a boundary |
| **2. nnU-Net** | Phase contrast only | That test-time fluorescence will be there, or that pixel Dice against machine masks is the scientific claim |

The dataset that comes out of part 1 is `Dataset001_Bacilus`: 179 training fields, 71 test fields, single-channel phase NIfTI. GFP is not channel 1. If I later want to ask whether fluorescence should be a privileged train-time input, that is a different experiment (`TS/`), not the default inference story.

## Part 1 — Label generation

Dense outlines of every cell and every spore stage are possible in principle and unrealistic as the default. What I actually have is closer to how this kind of data gets labeled: instance masks from a bacterial segmenter, fluorescent spots, phase-bright mature spores, and a handful of expert point clicks.

### What GFP is doing here

GFP is not “the spore class.” It is a reporter of a molecular event that is *related* to a developmental stage, and the reporter changes with the culture collection.

| Collection | Reporter background | Developing class it is allowed to support |
| --- | --- | --- |
| Stage 1 | spo0A | stage 1 |
| Stage 2 | sigF | stage 2 |
| Stage 3 | spoIIIAH | stage 3 |
| Stage 4 | cwlD | stage 4 |
| Stage 5 | cotZ | stage 5 |

The folder name is a **prior on the mixture**, not a label for every cell. A Stage 3 field still contains vegetative cells and the occasional mature spore. A GFP hit in that field is evidence for *stage 3 developing*, not for “some spore-like thing.”

Two imaging facts matter more than any architecture choice:

- Strong, compact GFP supports mid-stage developing cells. Stage 1 spo0A is often a faint whole-cell glow, which is easy to confuse with background autofluorescence.
- A mature spore is typically **phase-bright and GFP-dark**. If I let fluorescence define the positive class, I systematically miss the end of the program.

<span class="margin-note">A mature spore that has already turned off the reporter is not a negative. It is the class the fluorescent shortcut cannot see.</span>

### Omnipose finds cells. It does not find stages.

I run Omnipose (`bact_phase_omni`) on phase to get instances. Components below 120 pixels are dropped. Cells that overlap a GFP-derived spore mask get interior holes filled, because a forespore can punch a hole in an otherwise good outline.

That mask is geometry, not biology. Omnipose is allowed to say *this is a cell*. It is not allowed to say *this is stage 4*. Irregular debris, touching rods, and missed small spores are still in the pipeline, which is why later evaluation refuses to treat Omnipose boundaries as expert truth.

### Centers, then a deliberately imperfect rule

Connected components on thresholded GFP and phase produce candidate **centers**. Phase centers are further restricted to locally bright patches, so a gray halo does not become a mature spore. A center is assigned to an instance if that instance owns the majority of pixels in a 2 px disk.

Then the rule, which is the entire hard-label story:

```python
# every Omnipose cell starts vegetative
labels[cell_mask > 0] = 1

# GFP center (or GFP signal floor) → this collection's developing ID
# Stage2 fields → 2, Stage1 fields → 7, Stage5 fields → 4, ...
if gfp_center_hits(cell):
    labels[cell] = gfp_hit_label

# phase-bright center → mature, but only if still vegetative
# a developing GFP assignment is not overwritten by phase
if phase_center_hits(cell) and labels[cell] == 1:
    labels[cell] = 3  # mature (stored as "complete" in dataset.json)
```

Expert clicks (`veg.cell`, `developing.spore`, `mature.spore`) are used to tune those thresholds and to **score** the model. They are not painted as dense training masks in the 179-image generator. A click is certain about a location and a coarse name. It is not a pixel-perfect outline.

<aside class="callout callout--observation" role="note">
<p class="callout-label">Observation</p>
<div class="callout-body">
<p>The rule layer is supposed to be imperfect. It exists so unlabeled cells still receive a training target. Mature spores are the known failure: GFP-dark, easy to leave vegetative, easy to confuse with late developing if the phase patch is only sort of bright.</p>
</div>
</aside>

The class IDs in `dataset.json` are historical. Biological order is not index order. I keep both, because nnU-Net was already trained on the messy map. On disk, class 3 is still stored as `complete`; I call it **mature** here, matching the annotation name `mature.spore`.

| nnU-Net ID | Name | Biological rank |
| --- | --- | --- |
| 0 | background | — |
| 1 | vegetative | 0 |
| 7 | stage 1 | 1 |
| 2 | stage 2 | 2 |
| 5 | stage 3 | 3 |
| 6 | stage 4 | 4 |
| 4 | stage 5 | 5 |
| 3 | mature | 6 |

<figure class="figure">
  <img src="/images/projects/sporeai/fig_train_mix.svg" alt="Bar chart of training cell counts. Vegetative is about 16,000 cells; stage 1 and stage 5 are a few hundred." />
  <figcaption>28,161 Omnipose instances on the 179 training maps. Vegetative dominates. Stage 1 (723) and stage 5 (504) are the rare developing classes — which is already a hint about where the model will fail.</figcaption>
</figure>

## How a soft label is found

Hard one-hots are too certain for this biology. Stage 3 and 4 sit on a continuum. Vegetative and stage 1 look alike in phase. Mature can still resemble late developing, or look like vegetative once the reporter is gone. Neighboring cells in a cluster often share a stage.

I do not invent a second annotation. I start from the hard map we already made, then ask: *given GFP, phase, Omnipose geometry, and the cells next door, how sure should this instance be?* Soft labels are computed per Omnipose cell, then painted. Background is never softened. Code: `generate_7class_soft_labels.py`.

The contract is narrower than “make every pixel uncertain”:

- **True background** stays one-hot background.
- **Every cell pixel** has \(P(\text{background}) = 0\). The cell is certainly foreground.
- Uncertainty lives only on the **seven-stage simplex**.
- The whole instance gets **one** vector. I do not flatten the Omnipose boundary into background.

That is not label smoothing with a uniform \(\varepsilon\). The leftover mass is evidence-dependent.

### 1. Features on the cell

For each Omnipose ID I compute a small evidence vector. GFP is scored as a **compact bright patch**, not whole-cell spo0A glow — otherwise every Stage 1 cell looks fluorescent. Phase score looks for a locally white spore. Geometry (solidity, circularity, typical area) is recorded as Omnipose quality; by default it is a feature, not a license to smear into background.

```python
# spore-like GFP: localized bright fraction, not mean intensity
bright_frac = mean(gfp > gfp_background + 0.25)
gfp_score = 0.50 * localized + 0.30 * gfp_p90 + 0.15 * center_hit + 0.20 * coverage

phase_score = max(phase_center_hit,
                  bright_patch_fraction,   # pixels ≥ 0.85
                  high_phase_p90)
```

Neighbors inside ~55 px contribute a class histogram. Crowded fields can flatten the stage distribution a little; they still cannot create background probability on a cell.

### 2. Logits: adjacency, then evidence

I put a Gaussian on **biological rank**, not on the messy nnU-Net index:

\[
\text{logit}(c) \;=\; -\tfrac12 \left(\frac{|r(c)-r(c^\star)|}{\sigma}\right)^2
\]

with \(\sigma \approx 0.58\) in the conservative preset. Far classes (mature vs vegetative) would get ~0 from that Gaussian alone, so lookalike pairs are **lifted relative to the hard class** rather than added as tiny logits.

```python
LOOKALIKE_PAIRS = (
    (vegetative, stage1,   0.28),
    (stage1,     stage2,   0.16),
    (stage3,     stage4,   0.32),  # the pair that really does look alike
    (stage4,     stage5,   0.16),
    (stage5,     mature,   0.20),
    (stage4,     mature,   0.16),
)
```

Then GFP and phase are allowed to talk, but only in the direction the biology permits:

| Hard class | What extra evidence is allowed to do |
| --- | --- |
| vegetative | faint GFP → leak to stage 1; strong GFP → leak toward this field’s developing prior; phase-bright → a little mature |
| stage 1 | no GFP → vegetative; strong GFP → stage 2 (spo0A glow that got too bright looks later) |
| stage 2–5 | weak GFP → leak backward; stage 3/4 always share; strong GFP should not look mature |
| mature | white spore keeps mature; leftover GFP → stage 5/4; weak phase and weak GFP → vegetative |

Neighbors only lift adjacent ranks and the known lookalikes (veg/stage 1, stage 3/4, veg/mature). Softmax is taken over the **seven foreground classes**. In the conservative preset the hard class is forced to remain the mode (`min_peak = 0.60`). Mild on purpose. I do not want to train on soup.

```python
vec = softmax(logits[vegetative, s1, s2, s3, s4, s5, mature])
vec[background] = 0
# keep_hard_argmax: steal mass from donors until P(hard) ≥ 0.60
```

### 3. What that looks like

A few conservative-preset examples (`python generate_7class_soft_labels.py --show-examples`). Zeros are omitted; the highlighted number is the mode.

<figure class="soft-examples">
  <p class="soft-examples__legend">
    <span><span class="soft-examples__swatch is-veg"></span>veg</span>
    <span><span class="soft-examples__swatch is-s1"></span>s1</span>
    <span><span class="soft-examples__swatch is-s2"></span>s2</span>
    <span><span class="soft-examples__swatch is-s3"></span>s3</span>
    <span><span class="soft-examples__swatch is-s4"></span>s4</span>
    <span><span class="soft-examples__swatch is-s5"></span>s5</span>
    <span><span class="soft-examples__swatch is-mature"></span>mature</span>
  </p>
  <div class="soft-example">
    <div class="soft-example__head">
      <p class="soft-example__case">Vegetative, no GFP</p>
      <p class="soft-example__mass"><b>veg 0.73</b><span>s1 0.27</span></p>
    </div>
    <div class="soft-example__bar" role="img" aria-label="vegetative 0.73, stage 1 0.27">
      <span class="is-veg" style="flex:73 1 0"></span>
      <span class="is-s1" style="flex:27 1 0"></span>
    </div>
  </div>
  <div class="soft-example">
    <div class="soft-example__head">
      <p class="soft-example__case">Vegetative, faint GFP</p>
      <p class="soft-example__mass"><b>veg 0.60</b><span>s1 0.40</span></p>
    </div>
    <div class="soft-example__bar" role="img" aria-label="vegetative 0.60, stage 1 0.40">
      <span class="is-veg" style="flex:60 1 0"></span>
      <span class="is-s1" style="flex:40 1 0"></span>
    </div>
  </div>
  <div class="soft-example">
    <div class="soft-example__head">
      <p class="soft-example__case">Vegetative, bright GFP in a Stage 3 field</p>
      <p class="soft-example__mass"><b>veg 0.60</b><span>s1 0.09</span><span>s3 0.31</span></p>
    </div>
    <div class="soft-example__bar" role="img" aria-label="vegetative 0.60, stage 1 0.09, stage 3 0.31">
      <span class="is-veg" style="flex:60 1 0"></span>
      <span class="is-s1" style="flex:9 1 0"></span>
      <span class="is-s3" style="flex:31 1 0"></span>
    </div>
  </div>
  <div class="soft-example">
    <div class="soft-example__head">
      <p class="soft-example__case">Stage 3, strong GFP, stage 4 neighbors</p>
      <p class="soft-example__mass"><span>s2 0.03</span><b>s3 0.71</b><span>s4 0.26</span></p>
    </div>
    <div class="soft-example__bar" role="img" aria-label="stage 2 0.03, stage 3 0.71, stage 4 0.26">
      <span class="is-s2" style="flex:3 1 0"></span>
      <span class="is-s3" style="flex:71 1 0"></span>
      <span class="is-s4" style="flex:26 1 0"></span>
    </div>
  </div>
  <div class="soft-example">
    <div class="soft-example__head">
      <p class="soft-example__case">Mature, white spore</p>
      <p class="soft-example__mass"><span>s4 0.05</span><span>s5 0.06</span><b>mature 0.89</b></p>
    </div>
    <div class="soft-example__bar" role="img" aria-label="stage 4 0.05, stage 5 0.06, mature 0.89">
      <span class="is-s4" style="flex:5 1 0"></span>
      <span class="is-s5" style="flex:6 1 0"></span>
      <span class="is-mature" style="flex:89 1 0"></span>
    </div>
  </div>
  <div class="soft-example">
    <div class="soft-example__head">
      <p class="soft-example__case">Mature, leftover GFP</p>
      <p class="soft-example__mass"><span>s4 0.15</span><span>s5 0.25</span><b>mature 0.60</b></p>
    </div>
    <div class="soft-example__bar" role="img" aria-label="stage 4 0.15, stage 5 0.25, mature 0.60">
      <span class="is-s4" style="flex:15 1 0"></span>
      <span class="is-s5" style="flex:25 1 0"></span>
      <span class="is-mature" style="flex:60 1 0"></span>
    </div>
  </div>
  <div class="soft-example">
    <div class="soft-example__head">
      <p class="soft-example__case">Mature, weak evidence</p>
      <p class="soft-example__mass"><span>veg 0.31</span><span>s4 0.04</span><span>s5 0.05</span><b>mature 0.60</b></p>
    </div>
    <div class="soft-example__bar" role="img" aria-label="vegetative 0.31, stage 4 0.04, stage 5 0.05, mature 0.60">
      <span class="is-veg" style="flex:31 1 0"></span>
      <span class="is-s4" style="flex:4 1 0"></span>
      <span class="is-s5" style="flex:5 1 0"></span>
      <span class="is-mature" style="flex:60 1 0"></span>
    </div>
  </div>
  <figcaption>The hard name stays the usual mode. The interesting mass is the leak: veg↔stage 1, stage 3↔4, mature that might still be late developing, mature that might still be vegetative.</figcaption>
</figure>

<figure class="figure">
  <img src="/images/projects/sporeai/fig_soft_mass.svg" alt="Stacked bars showing that each hard class keeps most of its probability, with leftover mass on neighboring stages." />
  <figcaption>Mean soft vectors on the 179 training maps. The claimed class stays the mode. Neighbors get the remainder.</figcaption>
</figure>

Each case writes `Bacillus_XXX.soft_labels.npz` with `training_prob_volume` of shape `(8, H, W)`, plus a CSV of per-cell scores if I want to audit a field. Soft trainers consume the volume. The headline test numbers below were still scored from hard 7-class training. I am not going to pretend the soft run has already won.

## Part 2 — nnU-Net, phase only

Once the maps exist, the learning problem is ordinary 2D semantic segmentation: eight output channels, deep supervision, five-fold splits on the 179 training images. The unusual part is the **loss contract**.

Detection of “this is a cell” is trained from the hard foreground. Stage identity is trained only on those foreground pixels, with softmax over the seven stage logits — never jointly over background. An optional ordinal term pulls the expected biological rank toward the soft expected stage.

```text
L = λ_fg  L_foreground_BCE(hard)
  + λ_st  L_stage_CE(soft, 7-way, fg only)
  + λ_dice L_Dice
  + λ_ord L_ordinal(expected biological stage)
```

Inference is unchanged: argmax over the original eight channels, on phase, with no GFP.

Why nnU-Net and not a custom detector: I want the inductive bias of a well-tuned biomedical segmenter, then spend the originality on supervision. If the labels are dishonest, a fancier backbone will just learn the same shortcut faster.

## How I refuse to evaluate

Pixel Dice against generated masks scores Omnipose-inherited boundaries that no expert drew. That is a useful debugging number. It is the wrong scientific claim.

The protocol I trust is **center-based**, on 14,370 expert clicks across the 71 test fields, radius 15 px:

1. **Detection** — is there any non-background prediction near the click?
2. **Classification** — among detections, majority vote of non-background pixels in the disk.
3. **End-to-end** — detected *and* the majority class matches the mapped click.

A developing click is mapped to that collection’s stage ID. A `mature.spore` click maps to mature. Vegetative maps to vegetative. This answers the question the annotation actually asked: *at this cell, did you get the state right?*

## What the current numbers are allowed to say

<aside class="embargo" role="region" aria-label="Results withheld pending publication">
  <div class="embargo__card">
    <p class="embargo__label">Paper under revision</p>
    <p class="embargo__text">Detailed results and metrics are hidden while the manuscript is under review. For more information, <a href="mailto:mghasemi@iu.edu">email me</a>.</p>
  </div>
  <div class="embargo__blur" aria-hidden="true">
    <p>Phase-only evaluation on expert clicks. Detection, classification, and end-to-end scores; per-class precision / recall / F1; confusion structure.</p>
    <table>
      <thead>
        <tr><th>Metric</th><th>Value</th></tr>
      </thead>
      <tbody>
        <tr><td>Annotated cells</td><td>—</td></tr>
        <tr><td>Detection rate</td><td>—</td></tr>
        <tr><td>Classification accuracy</td><td>—</td></tr>
        <tr><td>Macro-F1</td><td>—</td></tr>
        <tr><td>End-to-end accuracy</td><td>—</td></tr>
      </tbody>
    </table>
    <p>Per-class tails, vegetative-heavy aggregates, and the metric figure stay in the manuscript draft.</p>
    <div class="embargo__placeholder"></div>
  </div>
</aside>

<aside class="callout callout--research-question" role="note">
<p class="callout-label">Research question</p>
<div class="callout-body">
<p>Can weakly labeled microscopy, optionally paired with fluorescence, recover sporulation-related morphology—or only the imaging correlates of a fluorescent marker?</p>
</div>
</aside>

## Heterogeneous signals

Microscopy appearance and fluorescence are both measurements of the same cells. They measure different things. Using them together is useful only if I say what each is allowed to claim.

| Signal | What it can support | What it cannot decide alone |
| --- | --- | --- |
| Phase morphology | Visible shape, crowding, stage-like appearance | Molecular identity of the event |
| GFP / other reporters | A related molecular or reporter event | Whether the cell *looks* like the stage I care about |
| Omnipose instance | Support of a cell | Which developmental state that support is in |
| Expert click | Location + coarse name | A dense outline, or a guarantee that GFP agrees |

Current working rule: do not let the easiest channel silently become the definition of the task. If fluorescence is abundant and morphology is the scientific interest, the method has to be evaluated on morphology, not only on how well it recapitulates the fluorescent map.

This is the microbiology version of a point I already care about in pathology: [pixel-perfect labels are not always necessary](/blog/research-notes/why-pixel-perfect-labels-arent-always-necessary), but the label you *do* use still has to match the claim.

## What I am trying to learn

A narrower question than “can deep learning detect spores?”

- Which visual cues of sporulation survive weak labels?
- When does GFP help, and when does it leak a shortcut?
- What would a useful error look like to a microbiologist, not only to a detection metric?
- Can the same weak-supervision habits from nucleus analysis transfer, or does an ordered developmental process demand a different objective?
- Do soft stage targets fix the errors the hard maps already admit — adjacency, veg/stage 1, mature/veg — or do they just smear a bad rule?

I do not have a settled architecture story, and I am not going to invent one on this page. The page exists so the next experiment has somewhere to land.

## Open questions

- What is the right unit of supervision: cell, field, well, or time point?
- Which sporulation stages am I actually claiming to detect, given that stage 1 still loses a large fraction to vegetative and mature is the weakest class?
- How should disagreement between morphology and fluorescence be treated—as noise, as a feature, or as a separate evaluation slice?
- Did the greedy threshold search on test annotations couple label-generation hyperparameters to the evaluation split? The weights never saw test *images*, but the GFP/phase thresholds might have seen test *clicks*.
- What is the analogue of ShadoNet’s “boring validation set” for this data—fields where late spores are rare and the shortcut cannot hide?
- Soft vs hard 7-class, and GFP-privileged teacher–student vs phase-only: both are implemented. Neither has a finished number I am willing to put next to the table above.

## Working notes

- Current framing: two-part pipeline. Labels from Omnipose + GFP + phase centers + a stage prior. Learning on phase only. The reader-facing object is SporeVision — phase field, circles, stage color.
- Current risk: late-stage, high-contrast spores, and GFP-supported mid-stages, making the problem look easier than the early and mature tails.
- Current evidence: held under revision with the manuscript. The public page keeps the protocol; the numbers stay off the open web.
- Next: finish the soft-stage comparison, and write down, for each label type I actually have, the biological claim it is allowed to support.
