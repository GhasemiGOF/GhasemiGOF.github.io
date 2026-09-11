---
heroImage: "/images/posts/phd-journal--how-my-research-questions-changed-over-time.svg"
ogImage: "/images/posts/phd-journal--how-my-research-questions-changed-over-time.svg"
title: "How My Research Questions Changed Over Time"
date: 2026-03-29
updatedDate: 2026-08-16
description: "I started by asking which model wins. I ended up asking what a label is allowed to claim — in three modalities at once."
category: "PhD Journal"
series: "PhD Journal"
tags:
  - phd
  - research direction
  - ShadoNet
  - SporeAI
  - TopoTrack
keywords:
  - research questions
  - computational pathology
  - supervision
  - morphology
  - evaluation
featured: true
toc: true
related:
  - research-notes/the-easiest-signal-is-the-wrong-task
  - research-notes/morphology-before-accuracy
  - phd-journal/why-writing-is-harder-than-coding
draft: false
---

I did not get more certain. I got more specific, and the specificity was uncomfortable.

The first question I knew how to ask was a task: can I build a model that finds nuclei well? That question is not foolish. It hides the decisions that actually decide whether the work is real. Which labels? Which errors are allowed? What would convince a skeptical reader that the model learned a cell, not a dye?

<span class="margin-note">Early: which architecture wins. Now: what would change my mind.</span>

## One question, rewritten until it had to split

**Version 1.** Which model finds nuclei best?

**Version 2.** Can I get away with clicks if dense outlines are too expensive?

**Version 3.** Under a click, what shape can a model still learn — and how would I know if stain did the work?

**Version 4, which is where I live now.** Extra information may write the label. What is it not allowed to be? I had to ask that in three rooms at once.

In [ShadoNet](/projects/shadonet) the extra information is an automatic outline and a stain that looks like class. The paper is out. The question is not.

In [SporeAI](/projects/sporeai) the extra information is a fluorescent marker. Mid-stage cells glow. Mature spores often do not. The question became: which stages am I actually claiming, if the glow wrote the middle and abandoned the end?

In [TopoTrack](/projects/topotrack) the extra information is local tissue organization. I can make neighbors stay neighbors. The question became: if identity falls when neighborhoods rise, which number is the paper allowed to lead with?

I did not plan a “research program” that spanned pathology, bacteria, and spatial transcriptomics. I kept meeting the same animal. The [house note](/blog/research-notes/the-easiest-signal-is-the-wrong-task) is me admitting that.

<aside class="callout callout--key-idea" role="note">
<p class="callout-label">Key idea</p>
<div class="callout-body">
<p>A research question improves when it says what would change your mind — not only what you hope to achieve.</p>
</div>
</aside>

## What I misunderstood

I thought reading more papers would narrow the map. It blurred the borders. Weak supervision, sparse supervision, representation learning — the words move depending on the dataset. A method that looks elegant in one room is brittle in the next.

The literature is not a map with fixed countries. It is a set of arguments you have to re-evaluate next to the image you actually have.

## What actually shifted the questions

Not a productivity system. Three unglamorous habits:

- A one-paragraph problem statement before I write new training code. After results, I am required to rewrite it.
- A list of seductive failures before the first run. Not random bugs. The output that would look good in a figure.
- Asking someone who is not in the notes: what would falsify this? If they cannot answer, I am not ready to write results.

Writing did more of this work than training did. [Writing is harder than coding](/blog/phd-journal/why-writing-is-harder-than-coding) because a paragraph has fewer hiding places than a repository.

## What I am still learning

I am still bad at scale. “Understand pathology” is too large. “Tune this loss by 0.01” is too small. The useful size, for me, is a named shortcut and the plot that would show it if the method failed. I do not always have the plot. I try not to pretend I do.

I still do not know whether the current questions are the right ones, or only better than the ones I started with. That distinction is probably only visible later. I would rather say that than perform a confidence I do not feel.
