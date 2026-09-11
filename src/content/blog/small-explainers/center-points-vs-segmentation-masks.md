---
heroImage: "/images/posts/small-explainers--center-points-vs-segmentation-masks.svg"
ogImage: "/images/posts/small-explainers--center-points-vs-segmentation-masks.svg"
title: "Center Points vs Segmentation Masks"
date: 2025-06-08
description: "A short technical explainer on what center annotations and segmentation masks each say about an object."
category: "Small Explainers"
tags:
  - small explainer
  - annotation
  - nucleus analysis
  - sparse supervision
keywords:
  - center-point supervision
  - segmentation masks
  - sparse annotation
  - nucleus detection
  - weak supervision
toc: true
related:
  - research-notes/morphology-before-accuracy
  - research-notes/why-pixel-perfect-labels-arent-always-necessary
  - paper-notes/segment-anything-promptability-changes-annotation-but-not-responsibility
draft: false
---

Center points and segmentation masks are not two qualities of the same label. They are **two different scientific statements about what the model is allowed to know about an object.**

<div class="definition-card"><p class="definition-label">Definition</p><p class="definition-term">Center-point annotation</p><div class="definition-body"><p>A label that marks a single coordinate (or small region) as indicating object presence—typically near the object centroid. It asserts <em>that</em> an object exists and <em>roughly where</em>, not <em>which pixels belong to it</em>.</p></div></div>

<div class="definition-card"><p class="definition-label">Definition</p><p class="definition-term">Segmentation mask</p><div class="definition-body"><p>A per-pixel label map assigning each pixel to object or background (or to instance IDs). It asserts <em>boundary ownership</em>—including area, shape, and overlap resolution at pixel granularity.</p></div></div>

## The basic idea

| | Center point | Segmentation mask |
|---|--------------|-------------------|
| Asserts | Presence + location | Pixel ownership |
| Silent on | Boundary, area, overlap | Nothing at pixel level—if drawn carefully |
| Collection cost | Lower | Higher |
| Ambiguity | Where exactly is "center" for irregular nuclei? | Where is the edge on overlap? |

<span class="margin-note">Center points are not poor masks. They are a different—and sometimes stricter—claim about sufficiency.</span>

<aside class="callout callout--key-idea" role="note">
<p class="callout-label">Key idea</p>
<div class="callout-body">
<p>Choose annotation based on what the downstream task needs to <em>know</em>, not on what tools make easiest to draw.</p>
</div>
</aside>

```mermaid
flowchart TB
  Q[Downstream question]
  Q -->|Need exact area / boundary?| M[Mask supervision]
  Q -->|Need count / presence / morphology via patches?| C[Center supervision]
  Q -->|Need interactive refinement?| P[Promptable masks — SAM]
  M --> E[Evaluate with boundary metrics]
  C --> E2[Evaluate detection + morphology probes]
  P --> E3[Evaluate protocol alignment]
```

## Why it matters in pathology

Nuclei overlap, stain heterogeneity, and partial sectioning make boundaries genuinely hard. A mask drawn in 3 seconds with a large brush teaches a different task than a mask adjudicated by two pathologists.

[Annotation quality](/blog/small-explainers/why-annotation-quality-matters) is about alignment—not density. [Morphology before accuracy](/blog/research-notes/morphology-before-accuracy) argues label resolution ≠ label relevance.

<aside class="callout callout--observation" role="note">
<p class="callout-label">Observation</p>
<div class="callout-body">
<p>Sparse center labels can produce better <em>scientific</em> models than dense masks when masks encode the wrong edge convention—while looking more impressive in a qualitative figure.</p>
</div>
</aside>

[Segment Anything](/blog/paper-notes/segment-anything-promptability-changes-annotation-but-not-responsibility) blurs the cost line by making masks fast—but not by changing what a mask means.

## Supervision information content

```mermaid
flowchart LR
  subgraph sparse["Less pixel information"]
    CP[Center]
    BX[Bounding box]
  end
  subgraph dense["More pixel information"]
    MS[Instance mask]
    SEM[Semantic mask]
  end
  CP --> BX --> MS --> SEM
```

Moving right adds information—and **adds opportunities for protocol error**.

## The common mistake

- Training on centers, evaluating with mask Dice (mismatched target)
- Treating SAM masks as ground truth without SOP review
- Assuming masks are always "stronger" supervision—they are stronger only when boundaries matter for the question

<aside class="callout callout--misconception" role="note">
<p class="callout-label">Common misconception</p>
<div class="callout-body">
<p>Center supervision cannot support morphology-aware learning. It can—if the model and losses connect centers to patch-level morphology without pretending centers are mini-masks.</p>
</div>
</aside>

See [why pixel-perfect labels aren't always necessary](/blog/research-notes/why-pixel-perfect-labels-arent-always-necessary).

## How I use it

For nucleus work, I ask:

1. Does the clinical or biological question need **area** or **count and appearance**?
2. Can annotators agree on **edges** at acceptable cost?
3. What **probe** validates morphology beyond detection F1?

Building ShadoNet, this choice is week-one material—see [building ShadoNet week 2](/blog/building-shadonet/week-2-center-annotations-vs-segmentation-masks).

## Research question for my own work

**If I switched from masks to centers (or vice versa), what would change in the model's permissible shortcuts—not only in annotation time?**

Diagnostic test: train matched models on centers-only vs. masks on the same images (masks held out for eval only). Compare detection, size distribution error, and boundary-sensitive morphology metrics. If centers match masks on biology-relevant probes but not on Dice, centers may be the higher-quality supervision for the actual question.

Center points and masks answer different questions. Pick the question first.
