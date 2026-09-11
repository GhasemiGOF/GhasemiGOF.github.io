---
heroImage: "/images/posts/research-questions--can-we-measure-biological-understanding.svg"
ogImage: "/images/posts/research-questions--can-we-measure-biological-understanding.svg"
title: "Can We Measure Biological Understanding?"
date: 2026-04-19
updatedDate: 2026-08-02
description: "Not with one score. With a named shortcut and the plot that would show it if the model took it."
category: "Research Questions"
series: "Research Questions"
tags:
  - research questions
  - evaluation methodology
  - ShadoNet
  - SporeAI
  - TopoTrack
keywords:
  - biological understanding
  - model evaluation
  - shortcut learning
  - morphology
toc: true
related:
  - research-notes/the-easiest-signal-is-the-wrong-task
  - research-notes/morphology-before-accuracy
  - research-notes/neighbors-are-not-free
draft: false
---

Can we measure biological understanding?

I do not think we measure it with a headline number. I think we measure it by naming a shortcut and then seeing whether the model took it.

<span class="margin-note">“Learned meaningful patterns” is doing too much work in too many abstracts.</span>

*Understanding* suggests the model internalized something about a cell, a tissue, or a process — not that it correlated pixels with a label. I want that claim to be expensive. If it cannot be falsified, we should use a smaller word: *useful*, *predictive*.

## Three measurements I actually run

They are not a philosophy. They are the tests my projects already forced.

**Did it learn a nucleus, or a dye?** In [ShadoNet](/projects/shadonet) I trust center matching, not overlap against automatic outlines. Detection can be high while classification still reads the stain. One dataset moves. Another almost does not. If “understanding morphology” were a real measurement, the second dataset would have to be in the paper. It is.

**Did it learn a stage, or a lamp?** In [SporeAI](/projects/sporeai) I score clicks, not pixels against machine masks. A model that only finds late bright spores has not understood sporulation. [Mature spores often do not glow](/blog/research-notes/mature-spores-dont-glow). If fluorescence and ordinary appearance disagree on the same cell, that disagreement is a measurement, not noise I get to drop.

**Did it learn tissue, or a smear?** In [TopoTrack](/projects/topotrack) I refuse to average spatial consistency and cell-type identity. [Neighbors are not free](/blog/research-notes/neighbors-are-not-free). A plan that keeps neighborhoods and loses names has not demonstrated understanding of tissue. It has demonstrated a cheaper way to look organized.

<aside class="callout callout--key-idea" role="note">
<p class="callout-label">Key idea</p>
<div class="callout-body">
<p>Understanding is not a scalar. It is a claim about what the representation responds to — and what it ignores — when you change the thing you named and when you change the cheap extra signal.</p>
</div>
</aside>

## What I do not count

A heatmap that looks like a pathologist’s circle. A force-directed plot of a matching. A pixel score against outlines no person drew. An attention map under a slide-level label. Those can be useful pictures. They are not a meter.

I also do not count “the model transferred, therefore it understood.” Transfer can ride the same shortcut to a new folder of images.

## What would move me

A controlled change in the biology that moves the representation, paired with a change in the cheap signal that does not. Stain held still, shape changed. Glow removed, stage still correct. Coordinates shuffled, neighborhood win gone.

I do not have the shuffled-coordinate plot yet. Until I do, “structure-aware” is a method name. I am trying to be a person who can say that in public.

The field will keep rewarding prediction. Understanding will stay a rhetorical bonus until it has a cost in the evaluation. I am trying to put that cost in my own tables first. The map is [the easiest signal is the wrong task](/blog/research-notes/the-easiest-signal-is-the-wrong-task).
