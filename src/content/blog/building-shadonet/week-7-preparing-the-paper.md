---
heroImage: "/images/posts/building-shadonet--week-7-preparing-the-paper.svg"
ogImage: "/images/posts/building-shadonet--week-7-preparing-the-paper.svg"
title: "Week 7: Preparing the Paper"
date: 2025-04-14
description: "A development note on turning ShadoNet from experiments into an argument that a reader can evaluate."
category: "Building ShadoNet"
series: "Building ShadoNet"
seriesOrder: 7
tags:
  - ShadoNet
  - paper writing
  - evaluation
  - research communication
keywords:
  - paper writing
  - research communication
  - morphology-aware learning
  - evaluation design
  - weak supervision
toc: true
related:
  - building-shadonet/week-6-lessons-from-debugging
  - research-notes/what-makes-a-medical-ai-paper-convincing
  - paper-notes/clinical-grade-weak-supervision-real-data-is-not-a-footnote
draft: true
---

Week seven of ShadoNet is not a victory lap. It is the week I tried to turn six weeks of messy decisions into an argument a reader can evaluate—and discovered that several sentences in my draft sounded more confident than the evidence allowed.

## The paper has to explain the supervision choice

The central tension this week: the paper must explain not only what worked, but why center supervision was scientifically reasonable for the morphology claims I want to make. That thread runs from [week 1](/blog/building-shadonet/week-1-choosing-the-supervision-signal) through [week 5](/blog/building-shadonet/week-5-why-morphology-became-the-central-idea). If the introduction reads like a detection paper with sparse labels as a footnote, I have failed the project.

<span class="margin-note">Some parts of the draft sounded more confident than the evidence allowed. Writing exposed gaps the code hid.</span>

I re-read [what makes a medical AI paper convincing](/blog/research-notes/what-makes-a-medical-ai-paper-convincing) and [clinical-grade weak supervision](/blog/paper-notes/clinical-grade-weak-supervision-real-data-is-not-a-footnote). Both pushed the same point: real data and honest limitations are not appendix material. For ShadoNet, the limitations include what center supervision cannot recover and where [week 3's texture shortcuts](/blog/building-shadonet/week-3-the-first-failed-experiments) still appear.

<aside class="callout callout--key-idea" role="note">
<p class="callout-label">Key idea</p>
<div class="callout-body">
<p>Method, dataset, and evaluation should read as one argument—not three sections pasted together. Each claim needs a corresponding experiment, visualization, or explicit limitation.</p>
</div>
</aside>

## What I cut from the draft

Writing forced cuts I had avoided while coding:

- architecture details that did not connect to a named failure mode from [week 4](/blog/building-shadonet/week-4-rethinking-the-loss-function)
- ablations I ran without a hypothesis—curiosity runs that do not belong in a short paper
- language implying full segmentation when supervision was center-based

<aside class="callout callout--observation" role="note">
<p class="callout-label">Observation</p>
<div class="callout-body">
<p>Every time I wrote "our method achieves," I replaced it with "under these assumptions, the model" until I could point to a figure tied to a patch I had inspected in [week 6](/blog/building-shadonet/week-6-lessons-from-debugging).</p>
</div>
</aside>

## What belongs in the paper vs. these notes

These development notes preserve the reasoning the paper will compress. The paper should not pretend the method arrived fully formed. It should translate discomfort into clear motivation and limitations—not erase the sequence.

I am keeping a private list of "seductive failures" that still appear on some patches. Whether all of them belong in the camera-ready version is a judgment call I have not finished making. Hiding them would be dishonest; listing all of them might obscure the main claim.

<aside class="callout callout--misconception" role="note">
<p class="callout-label">Common misconception</p>
<div class="callout-body">
<p>A polished paper narrative is not the same as a polished method. Readers deserve to see which conclusions required qualitative inspection because metrics alone were insufficient.</p>
</div>
</aside>

## Note to future me

When this project becomes a paper, the story will probably look more inevitable than it felt. These seven weeks are a reminder that ShadoNet came from disagreements between annotation, objective, morphology, and evidence—not from a single insight.

Future me should not erase that completely. Some of it belongs in the paper as motivation. The goal is not to make ShadoNet sound flawless. The goal is to make the reader understand what problem it tries to solve and what evidence would make the solution believable.

## Open question after week seven

Before submitting anything, I want an external reader—someone not embedded in these notes—to answer one question after reading the draft: "What would falsify this claim?" If they cannot answer, the evaluation section is not done.

I still do not know whether the morphology audit set I mentioned in week 5 is large enough to support the claims I want to make. Curating it properly is the experiment that outlives this development journal—and the one I am least ready to rush.
