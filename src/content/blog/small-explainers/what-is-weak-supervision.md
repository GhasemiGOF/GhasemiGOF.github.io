---
heroImage: "/images/posts/small-explainers--what-is-weak-supervision.svg"
ogImage: "/images/posts/small-explainers--what-is-weak-supervision.svg"
title: "What Is Weak Supervision?"
date: 2025-02-16
updatedDate: 2026-07-12
description: "Not bad labels. Labels that are useful and still incomplete relative to the thing you named. Three examples from my own work."
category: "Small Explainers"
tags:
  - small explainer
  - weak supervision
  - ShadoNet
  - SporeAI
keywords:
  - weak supervision
  - center-point labels
  - fluorescence
  - computational pathology
toc: true
related:
  - research-notes/the-easiest-signal-is-the-wrong-task
  - small-explainers/center-points-vs-segmentation-masks
  - research-notes/what-makes-weak-supervision-difficult
draft: false
---

Weak supervision is not “bad labels.”

It is learning when the labels you have are useful and still incomplete relative to the concept you told the reader you care about.

A perfect label, in a fantasy, is a careful outline of every object and every state. What I actually have is closer to this: a click on a nucleus, a fluorescent glow that marks a related event, a cheap automatic outline, a culture-level guess about stage. Those are not insults. They are incomplete sentences. The method has to say how it finishes the sentence — and what it is not allowed to invent.

<span class="margin-note">The weakness is a relationship between label and target, not a property of the label alone.</span>

## Three incomplete sentences I actually use

**A click on a nucleus.** Says: something is here, and it has a class. Silent on the exact edge. In [ShadoNet](/projects/shadonet) that is often the right sentence. The pathology question is usually not “which pixels belong to this nucleus.” It is “is there a nucleus, and what kind.” See [center points vs. masks](/blog/small-explainers/center-points-vs-segmentation-masks).

**A fluorescent marker on a bacterium.** Says: a related molecular event happened. Silent on whether the cell *looks* like the stage I named. In [SporeAI](/projects/sporeai) I may use the glow to write a label. The trained model only sees the ordinary microscope image. [Mature spores often do not glow](/blog/research-notes/mature-spores-dont-glow). If I forget that, the glow becomes the class.

**Local tissue organization.** Says: these spots sit next to each other. Silent on whether they are the same type, or whether they should be matched. In [TopoTrack](/projects/topotrack) I ask a matching to listen to neighbors. [Neighbors are not free](/blog/research-notes/neighbors-are-not-free). If identity collapses, the incomplete sentence was finished the wrong way.

<aside class="callout callout--key-idea" role="note">
<p class="callout-label">Key idea</p>
<div class="callout-body">
<p>Weak supervision is a contract. Write down what the label can support, what it cannot, and which held-out test would break the contract.</p>
</div>
</aside>

## What people get wrong

They hear “weak” and think “we do not need experts.”

You need experts differently. On the protocol. On a gold subset of clicks. On the cases where the extra signal and the image disagree. Not necessarily on every pixel of every object.

They also use the phrase as a slogan and never say *what* is weak. Spatial resolution? Noise? Indirectness? A slide-level diagnosis and a nucleus click are both “weak” relative to a dense map. They are not the same method problem.

## The test I use before I pick a model

1. Which objects could honestly carry this label?
2. What cheap signal could satisfy the label without the biology I named?
3. What gold I actually have — clicks, not machine outlines — will I use to catch that?

If I cannot answer those, I do not have a weak-supervision method. I have a training script.

The longer version of this habit is [the easiest signal is the wrong task](/blog/research-notes/the-easiest-signal-is-the-wrong-task). The difficulty, once you are inside a project, is [what makes weak supervision difficult](/blog/research-notes/what-makes-weak-supervision-difficult).
