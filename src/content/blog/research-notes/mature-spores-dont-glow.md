---
heroImage: "/images/posts/research-notes--why-pathology-is-different-from-natural-images.svg"
ogImage: "/images/posts/research-notes--why-pathology-is-different-from-natural-images.svg"
title: "Mature Spores Do Not Glow"
date: 2026-08-31
updatedDate: 2026-09-07
description: "If the fluorescent marker is the class, you miss the end of sporulation. A note on what a glow is allowed to claim."
category: "Research Notes"
series: "Research Notes"
tags:
  - SporeAI
  - microscopy
  - weak supervision
  - Bacillus
keywords:
  - sporulation
  - fluorescence
  - weak supervision
  - microscopy
  - Bacillus subtilis
featured: true
toc: true
related:
  - research-notes/the-easiest-signal-is-the-wrong-task
  - research-notes/why-pixel-perfect-labels-arent-always-necessary
  - small-explainers/what-is-weak-supervision
draft: false
---

Look at a late field of *Bacillus* under two lamps.

Under ordinary light the mature spore is a bright, compact object. Under the fluorescent lamp it is often dark. The program is finished. The marker that helped you see the middle of the story has gone quiet.

<span class="margin-note">I lost months to the opposite assumption: bright in fluorescence means the class I want.</span>

That is the whole project, if I am honest. [SporeAI](/projects/sporeai) is not “train a segmenter on bacteria.” It is a decision about what a glow is allowed to claim.

## Two lamps, two statements

A fluorescent marker is a statement about a molecular or reporter event. The ordinary microscope image is a statement about how the cell looks. They are measurements of the same cell. They are not the same sentence.

I use the glow when I write training labels. I use cell outlines from a bacterial segmenter, a handful of expert clicks, and a prior about which stage a culture is likely to be in. Then I train a model that is not allowed to see the fluorescent channel. At test time there is only the ordinary image.

If that sounds like I am throwing away information, I am. On purpose. A method that needs the glow at inference has not learned sporulation. It has learned a lamp.

<aside class="callout callout--key-idea" role="note">
<p class="callout-label">Key idea</p>
<div class="callout-body">
<p>A mature spore is typically bright under ordinary light and dark under fluorescence. If you let the glow define the positive class, you systematically miss the end of the program.</p>
</div>
</aside>

## What I will not call a result

I can score the model against the outlines the segmenter already drew. The number will look serious. No expert drew those outlines. Scoring against them is a debugging habit. It is not the scientific claim.

The protocol I trust is a click. We have 14,370 of them on held-out fields. At this cell: did you find something? Did you name the stage? End-to-end accuracy is 0.855. Detection is 0.958. Among the cells we find, class accuracy is 0.892.

Those are good numbers. They are also heavy with ordinary growing cells. Mid-stage developing classes — the ones the glow can help me label — are the ones the phase-only model holds. Mature is the weakest class. Stage 1 still leaks into vegetative. The network inherited the structure of the supervision, including its blind spots.

I used to think stage 1 was the collapse. It is not. The end of the program is.

## Soft labels are not a personality

I can paint each cell with a distribution over stages instead of a single hard name. The cell is certainly a cell. Uncertainty lives only on the stages. That is a hypothesis about adjacency — stage 2 should not jump to mature — not a way to look humble in a paper.

I do not yet have a finished comparison I am willing to put next to the table above. Soft labels exist. The sentence that says they helped does not. The manuscript is under group revision anyway. I would rather be late than invent a win.

## What a useful error looks like

A microbiologist does not need another detector that finds late, high-contrast spores. Those are already obvious. A useful error is an early cell called vegetative, or a mature spore called something that still glows in the training recipe. Those errors tell me whether I learned a process or a blob.

[ShadoNet](/projects/shadonet) taught me this habit on stain. Here the stain is a lamp. Same animal, different room. The [house note](/blog/research-notes/the-easiest-signal-is-the-wrong-task) is the map. This page is the field I keep going back to.

If phase and fluorescence disagree on the same cell, I do not get to call that noise by default. It might be the most honest slice in the dataset.
