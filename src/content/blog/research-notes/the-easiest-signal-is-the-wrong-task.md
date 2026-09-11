---
heroImage: "/images/posts/research-notes--morphology-before-accuracy.svg"
ogImage: "/images/posts/research-notes--morphology-before-accuracy.svg"
title: "The Easiest Signal Is the Wrong Task"
date: 2026-06-08
updatedDate: 2026-08-30
description: "Three projects. One habit. Extra information may help me write a label. It is not allowed to become the job."
category: "Research Notes"
series: "Research Notes"
tags:
  - ShadoNet
  - SporeAI
  - TopoTrack
  - supervision
  - evaluation
keywords:
  - weak supervision
  - computational pathology
  - microscopy
  - spatial transcriptomics
  - shortcut learning
featured: true
toc: true
related:
  - research-notes/morphology-before-accuracy
  - research-notes/mature-spores-dont-glow
  - research-notes/neighbors-are-not-free
draft: false
---

I keep meeting the same animal in three different rooms.

A pathology tile. A field of bacteria under a microscope. Two slices of tissue with a gene-expression profile on every spot. Different images, different collaborators, different papers. The animal is always this: **the extra signal that makes the problem look solved**.

<span class="margin-note">If a model can cheat using something I will not have later, I have not trained a method. I have trained a look-alike.</span>

I am a Ph.D. student. I write code. I train models. What I actually do, on a good week, is decide what a label is allowed to claim.

## Room one: the dye

[ShadoNet](/projects/shadonet) finds nuclei on Ki-67 slides and names them. A pathologist clicks a center. Sometimes an automatic outline donates a shape. The network never sees that outline at test time. It sees the tile.

The seductive failure here is the stain. Brown looks like “positive.” Blue looks like “negative.” A model can get a respectable score by reading the dye and ignoring the nucleus. Detection is the easy number — 0.89 on the set I trust. Classification is where the shortcut shows up. One collection of images moves. Another almost does not. I keep the one that refuses to move. Averaging it away is how a stain detector becomes a morphology paper.

The paper is in *Bioinformatics*, 2026. The working problem survived the paper. That is the point.

## Room two: the glow

[SporeAI](/projects/sporeai) follows *Bacillus* as it forms a spore. A fluorescent marker can light up a related molecular event. That glow is useful when I am writing training labels. It is not allowed into the model that has to work later. That model sees only the ordinary microscope image — the one a person could take without the extra channel.

The seductive failure is obvious once you have looked at enough fields. Mid-stage cells glow. Late spores often do not. A mature spore is typically bright under ordinary light and dark under the fluorescent lamp. If I let the glow define the class, I systematically miss the end of the program.

The number I trust is not a pixel score against machine-drawn outlines. It is a click. At this cell, did you find something, and did you name the stage? End-to-end, 0.855. That number is real, and it is also heavy with ordinary growing cells. The weakest class is the mature spore. The manuscript is with the group. The blind spot stays in the draft.

## Room three: the smooth plan

[TopoTrack](/projects/topotrack) matches cells between two slices of tissue. Expression says which cells look alike. Local organization says who sits next to whom. The method has to listen to both.

The seductive failure is a pretty matching. Neighbors stay neighbors. The plot looks like a trajectory. Meanwhile the mass has smeared so widely that a cell no longer keeps its name. I can buy neighborhood preservation. I pay for it in identity.

Held-out, September 2026: the structure-aware method beats a strong expression-only baseline on spatial consistency and neighborhood preservation on every unit I froze. It does not win on type. I will not average those families into one score that says “we win.” Geometry yes. Identity no. That opposition is the result.

## The habit

I do not have a slogan I want on a lab door. I have a split I refuse to collapse.

| Allowed | Not allowed |
| --- | --- |
| Extra information may help me write the label | Extra information as an input at test time |
| A cheap click, a fluorescent channel, an automatic outline | Pretending any of those *is* the biology |
| Separate numbers for finding and naming, for shape and identity | One score that hides a tradeoff |
| The dataset that did not move | Averaging it until the story is clean |

<aside class="callout callout--key-idea" role="note">
<p class="callout-label">Key idea</p>
<div class="callout-body">
<p>The easiest extra signal is usually the wrong definition of the task. Dye looks like a diagnosis. A fluorescent marker looks like a stage. A smooth matching looks like a trajectory. None of those is the biology I named.</p>
</div>
</aside>

If you are reading this because you hire people: I am not looking for a larger model. I am looking for a place where the label, the metric, and the claim have to survive each other. The project pages are where the numbers live. [What I am doing this month](/now) is dated on purpose.

If you are reading this because you work on the same animal — I want the plot that would prove me wrong. I do not have all of them yet. A shuffled-coordinate pair that still “wins” neighborhood preservation would falsify a structure claim. I have not made that figure. That sentence is doing more work than a citation.
