---
heroImage: "/images/posts/building-shadonet--week-6-lessons-from-debugging.svg"
ogImage: "/images/posts/building-shadonet--week-6-lessons-from-debugging.svg"
title: "Week 6: Lessons from Debugging"
date: 2025-04-07
description: "A ShadoNet note on debugging as a way to learn what the model and data are actually doing."
category: "Building ShadoNet"
series: "Building ShadoNet"
tags:
  - ShadoNet
  - debugging
  - experiments
  - research process
keywords:
  - debugging
  - experiment validation
  - computational pathology
  - model inspection
  - research process
toc: true
related:
  - building-shadonet/week-5-why-morphology-became-the-central-idea
  - building-shadonet/week-7-preparing-the-paper
  - building-shadonet/week-3-the-first-failed-experiments
draft: true
---

Week six of ShadoNet was supposed to be about scaling experiments. Instead it became about debugging—and about learning that some bugs look like modeling failures, and some modeling failures initially look like bugs. After [week 5](/blog/building-shadonet/week-5-why-morphology-became-the-central-idea) reframed the project around morphology, I needed to trust the pipeline before I could trust any morphology claim.

## Aggregate plots lied politely

The most useful sentence in my notes this week: I trusted aggregate plots before checking enough individual examples.

<span class="margin-note">A mean detection score across patches hides whether errors cluster on hard biology or easy shortcuts.</span>

I had a validation loop that reported reasonable numbers. When I finally stepped through twenty patches manually—something I should have done in [week 3](/blog/building-shadonet/week-3-the-first-failed-experiments)—I found inconsistent behavior on edge cases I had named but not instrumented: nuclei clipped by tile boundaries, overlap clusters, stain outliers.

<aside class="callout callout--observation" role="note">
<p class="callout-label">Observation</p>
<div class="callout-body">
<p>Two bugs and one real modeling limitation were entangled in the same "something looks off" feeling. Without a checklist, I would have spent days tuning hyperparameters for a coordinate scaling error.</p>
</div>
</aside>

## Pipeline validation vs. hypothesis testing

I separated two activities that I had been running together:

**Pipeline validation** asks: are labels, augmentations, and metrics doing what I think? Fixed coordinates, verified train/val splits by slide ID, confirmed center targets align with visible nuclei on a frozen set of ten patches.

**Hypothesis testing** asks: does this loss or architecture reject the texture shortcuts I named in [week 4](/blog/building-shadonet/week-4-rethinking-the-loss-function)? That requires the pipeline to be trustworthy first.

<aside class="callout callout--key-idea" role="note">
<p class="callout-label">Key idea</p>
<div class="callout-body">
<p>Debugging is not a detour from research. It is how you learn what your experiment is actually measuring.</p>
</div>
</aside>

I started a "boring validation set"—patches chosen not for difficulty but for diagnosability: one nucleus centered in frame, one overlap cluster, one stain-heavy background region with sparse centers. Its only job is to catch impossible behavior before I interpret real-data trends.

## What debugging taught me about the model

Once the pipeline was stable, the remaining issues looked like the modeling problems I suspected earlier:

- responses still slightly drift toward stain intensity in regions without centers
- overlap separation improved on sanity cases but not consistently on real tissue
- augmentations that helped natural-image models made some nuclear boundaries harder to read

None of these are solved. They are named, which is a low bar but a necessary one.

<aside class="callout callout--misconception" role="note">
<p class="callout-label">Common misconception</p>
<div class="callout-body">
<p>Reproducibility is not only about seeds and configs. It is also about whether you can reproduce the <em>failure</em> on a patch you have looked at with your eyes.</p>
</div>
</aside>

## The current decision

For now, the decision is to keep pipeline validation and hypothesis testing in separate notebooks with separate success criteria. A green validation run does not authorize a morphology conclusion. A morphology failure on the boring set does not automatically mean the pipeline is broken.

## Open question for next week

Before drafting the paper in [week 7](/blog/building-shadonet/week-7-preparing-the-paper), I want every figure in my notes to trace back to a specific patch I have inspected—not only to a metric aggregated across hundreds of tiles.

I still do not know how many individual examples are "enough" to trust a morphology claim. That number feels like a methodological question, not a hyperparameter—and I have not found a satisfying answer in the literature yet.
