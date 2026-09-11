---
heroImage: "/images/posts/research-notes--morphology-before-accuracy.svg"
ogImage: "/images/posts/research-notes--morphology-before-accuracy.svg"
title: "Morphology Before Accuracy"
date: 2026-01-18
updatedDate: 2026-06-21
description: "Accuracy is a useful number. Shape is often the language the biology is speaking. I will not let the number speak first."
category: "Research Notes"
series: "Research Notes"
tags:
  - morphology-aware learning
  - nucleus analysis
  - computational pathology
  - ShadoNet
keywords:
  - computational pathology
  - morphology-aware learning
  - weak supervision
  - nucleus analysis
featured: true
toc: true
related:
  - research-notes/the-easiest-signal-is-the-wrong-task
  - research-notes/why-pixel-perfect-labels-arent-always-necessary
  - small-explainers/center-points-vs-segmentation-masks
draft: false
---

I used to think a good nucleus model was a model with a good score.

Then I watched a network find almost every nucleus on a tile and still feel, to a person who looks at cells for a living, slightly wrong. The blobs sat in the right places. The dye had done too much of the work. The shape had done too little.

<span class="margin-note">A click says a nucleus is here. It does not say the stain is the class.</span>

Accuracy is a useful number. In pathology, morphology is often the language the question is speaking. I want the method to be fluent in that language first.

## The label is a hypothesis

A dense outline looks like certainty. It is still a compressed sentence: where someone put an edge, what they skipped, which tool they used. A center click looks poor. It is a cleaner sentence if the question is “is there a nucleus here, and what kind.”

I do not start from the most detailed label I can afford. I start from the phenomenon and ask what kind of supervision would make a model sensitive to it. That is the argument in [why pixel-perfect labels aren't always necessary](/blog/research-notes/why-pixel-perfect-labels-arent-always-necessary). Resolution and relevance are different questions.

[ShadoNet](/projects/shadonet) is the place I had to mean it. A person clicks. An automatic outline may donate a shape. The loss is still scored at centers. The network never sees the outline later. If I then evaluate against those outlines, I have scored privileged geometry the user will not have. I refuse that number as the scientific claim.

<aside class="callout callout--key-idea" role="note">
<p class="callout-label">Key idea</p>
<div class="callout-body">
<p>The label format is a hypothesis about what the model needs to learn, not a neutral input. A center can be exactly right. A dense mask can be expensive and still irrelevant.</p>
</div>
</aside>

## The failure I actually fear

The obvious fear is that cheaper labels produce a worse score. Sometimes they do. That is not the failure that keeps me in the lab at night.

The failure is a model that improves the score by reading the dye, the scanner, the easy cells, the late bright objects. The number goes up. The morphology was never learned.

On ShadoNet, detection is 0.89. Classification is 0.80. One dataset lifts in every class. Another barely moves. I keep the one that barely moves. If I average them, I have written a stain paper and called it morphology.

I still do not know how to detect that failure automatically. I look at tiles. I want every figure tied to a patch I have actually inspected. That is slower than a leaderboard. It is also the only way I have found to catch a seductive map.

## What I am trying to preserve

Do not annotate what you cannot evaluate. Do not evaluate what you did not intend to learn. If a method claims morphology, the evaluation has to include morphology. If it claims to work from clicks, the paper has to show where a click is enough and where it is not.

This is not nostalgia for hand-crafted shape features. It is a constraint on what a modern model is allowed to claim. The same constraint shows up when a fluorescent marker wants to be a developmental stage, and when a smooth matching wants to be a trajectory. [The easiest signal is the wrong task](/blog/research-notes/the-easiest-signal-is-the-wrong-task).

I do not have a universal rule. There are tasks where pixel-perfect labels are necessary. There are tasks where they create a false sense of rigor. The useful move is to say, out loud, which kind of task I think I am in — and what would change my mind.
