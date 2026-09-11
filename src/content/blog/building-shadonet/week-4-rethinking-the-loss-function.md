---
heroImage: "/images/posts/building-shadonet--week-4-rethinking-the-loss-function.svg"
ogImage: "/images/posts/building-shadonet--week-4-rethinking-the-loss-function.svg"
title: "Week 4: Rethinking the Loss Function"
date: 2025-03-24
description: "A ShadoNet note on why loss functions are arguments about what errors should matter."
category: "Building ShadoNet"
series: "Building ShadoNet"
seriesOrder: 4
tags:
  - ShadoNet
  - loss functions
  - morphology-aware learning
  - weak supervision
keywords:
  - loss functions
  - morphology-aware learning
  - weak supervision
  - nucleus analysis
  - spatial structure
toc: true
related:
  - building-shadonet/week-3-the-first-failed-experiments
  - building-shadonet/week-5-why-morphology-became-the-central-idea
  - research-notes/morphology-before-accuracy
draft: true
---

Week four of ShadoNet followed directly from [week 3's failed experiments](/blog/building-shadonet/week-3-the-first-failed-experiments). The pipeline worked. The outputs looked organized. The loss was satisfied. The morphology was not. That combination pointed at the objective, not the dataloader.

## A loss is an argument about errors

I had been treating the loss function as an implementation detail—something you pick from a menu after the architecture is fixed. That framing was wrong for this project. A loss specifies which mistakes are expensive and which are free. If texture shortcuts are free, the model will use them.

<span class="margin-note">The first objective was too willing to accept visually convenient but biologically unhelpful solutions.</span>

The most useful sentence in my notes this week: the first objective was too willing to accept visually convenient but biologically unhelpful solutions. Center-point supervision does not automatically fix that. It can make it worse, because the loss has fewer constraints to violate.

<aside class="callout callout--key-idea" role="note">
<p class="callout-label">Key idea</p>
<div class="callout-body">
<p>Changing the loss is not tuning. It is revising the claim about what the model should preserve when labels are sparse.</p>
</div>
</aside>

I re-read [morphology before accuracy](/blog/research-notes/morphology-before-accuracy) and tried to translate its argument into loss terms: if morphology matters, the objective must penalize shape-level failures even when pixel labels are absent. That translation is harder than it sounds.

## What I tried

I sketched three directions—not all implemented, not all successful:

1. **Tighter spatial localization around centers** — penalize diffuse responses. This reduced blob-like activations on sanity patches but did not obviously improve overlap regions.
2. **Auxiliary structure terms** — encouraging compact, roughly elliptical responses without claiming exact boundaries. Promising on isolated nuclei; unclear on crowded tissue.
3. **Harder negative mining near stain-heavy background** — forcing the model to distinguish "looks like a nucleus" from "is near a center label." Still tuning where the negative samples come from.

<aside class="callout callout--observation" role="note">
<p class="callout-label">Observation</p>
<div class="callout-body">
<p>Each loss variant improved something on the hand-designed sanity cases from week 3 and broke something else. That tradeoff is exactly why I need morphology-aware evaluation, not a single scalar to optimize.</p>
</div>
</aside>

I have not settled on a final objective. I am writing that plainly because pretending otherwise would be the kind of paper-draft confidence [week 7](/blog/building-shadonet/week-7-preparing-the-paper) warns against.

## Loss vs. evaluation

A recurring mistake in my notes: improving the loss while keeping evaluation unchanged. If evaluation still only counts detection proximity to center points, a texture shortcut and a morphology-aware model can score similarly. [Why evaluation matters more than another 1% accuracy](/blog/research-notes/why-evaluation-matters-more-than-another-1-accuracy) applies here directly—the loss and the evaluation have to tell the same story.

<aside class="callout callout--misconception" role="note">
<p class="callout-label">Common misconception</p>
<div class="callout-body">
<p>A more complicated loss is not a more scientific loss. Complexity is justified only when it rejects a failure mode you can name and show.</p>
</div>
</aside>

## The current decision

For now, the decision is to make the objective more explicit about spatial structure and to test every change against sanity cases before trusting real-data metrics. This may change. The direction feels right; the exact formulation does not.

## Open question for next week

Before running larger experiments, I want to write a one-paragraph "failure contract" for each loss variant: what seductive solution it is designed to reject, and what patch type would expose it if the design failed.

I still do not know whether the right pressure comes from the loss, from the architecture, or from both. [Week 5](/blog/building-shadonet/week-5-why-morphology-became-the-central-idea) is where I stopped describing the project by label format and started describing it by biological structure—and that reframing may matter more than any single loss term.
