---
heroImage: "/images/posts/research-notes--why-evaluation-matters-more-than-another-1-accuracy.svg"
ogImage: "/images/posts/research-notes--why-evaluation-matters-more-than-another-1-accuracy.svg"
title: "Neighbors Are Not Free"
date: 2026-07-20
updatedDate: 2026-08-24
description: "I can keep a cell’s neighbors with it when I match two tissue slices. The bill arrives as identity."
category: "Research Notes"
series: "Research Notes"
tags:
  - TopoTrack
  - spatial biology
  - evaluation
keywords:
  - spatial transcriptomics
  - optimal transport
  - tissue structure
  - trajectory inference
  - evaluation
featured: true
toc: true
related:
  - research-notes/the-easiest-signal-is-the-wrong-task
  - research-questions/can-we-measure-biological-understanding
  - research-notes/why-evaluation-matters-more-than-another-1-accuracy
draft: false
---

A trajectory, in the pictures, is a curve. In the method I actually run, it is a plan: mass moving from one tissue geometry to the next.

[TopoTrack](/projects/topotrack) couples two spatial-transcriptomics slices. Each spot has a gene-expression profile and a place in the tissue. Expression says which spots look alike. Local organization says who sits next to whom. I ask a matching to listen to both.

<span class="margin-note">A smooth plan can still jump the tissue. Smooth is not the same as spatially plausible.</span>

That sentence is easy to agree with. The part that is not easy is the bill.

## What I bought

On a held-out freeze from 10 September 2026 — lung, midbrain, axolotl, seven units I did not tune on — a structure-aware matching beats a strong expression-only baseline on spatial consistency and neighborhood preservation. Every unit. Not a mean that hides a loss.

I can make neighbors stay neighbors.

## What I paid

The same methods lose on type. Mass that should have stayed inside a named cell type spreads. The variant that is best at neighborhoods is the one that smears identity the most. Another method, which is allowed to use annotations as structure on several of these datasets, wins the type numbers. I will not hide that bar.

I do not average geometry and identity into one score. They moved in opposite directions. That opposition is the result.

<aside class="callout callout--key-idea" role="note">
<p class="callout-label">Key idea</p>
<div class="callout-body">
<p>Neighborhoods are not free. If a method buys local structure by smearing cell identity, it has not discovered tissue. It has discovered a cheaper way to look organized.</p>
</div>
</aside>

## What I will not say

I will not say TopoTrack is better. Better at what. Versus the expression-only baseline, yes on space, no on type. Versus the strongest competitors, the default version does not win. A later variant can close the geometry gap on some pairs and still lose axolotl neighborhoods to someone else. On synthetic data with known descendants, the default does not beat the baseline.

The manuscript is under group revision. The tradeoff stays in the draft. If a revision asks me for a single “overall” number, the honest answer is that I refuse to invent one.

## The plot I do not have

A shuffled-coordinate pair that still “wins” neighborhood preservation would tell me the spatial term never did real work. I do not have that figure yet. Until I do, “structure-aware” is a method description, not a medal.

This is the spatial version of a habit I already have in pathology and microscopy. In [ShadoNet](/projects/shadonet) the cheap signal is stain. In [SporeAI](/projects/sporeai) it is a fluorescent glow. Here it is a pretty coupling. Same animal. [The easiest signal is the wrong task](/blog/research-notes/the-easiest-signal-is-the-wrong-task).

If you take one thing from this page, take the invoice. I can keep a cell’s neighbors. I cannot pretend that was free.
