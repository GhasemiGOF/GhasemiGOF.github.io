---
heroImage: "/images/posts/phd-journal--what-my-literature-review-actually-looked-like.svg"
ogImage: "/images/posts/phd-journal--what-my-literature-review-actually-looked-like.svg"
title: "What My Literature Review Actually Looked Like"
date: 2025-03-02
description: "A realistic account of reading papers as a messy process of building a map, not a bibliography."
category: "PhD Journal"
series: "PhD Journal"
tags:
  - phd
  - literature review
  - paper reading
  - research process
keywords:
  - literature review
  - paper reading
  - note-taking
  - research map
  - computational pathology
toc: true
related:
  - small-explainers/how-i-read-a-research-paper
  - phd-journal/things-i-wish-i-knew-before-starting-my-phd
  - paper-notes/clam-weak-supervision-works-best-when-it-admits-its-own-uncertainty
draft: true
---

From the outside, a literature review looks like a clean path through the field. Mine did not feel like that. It felt like building a map while the territory shifted—organizing papers by method family, then reorganizing by question, then realizing the questions I cared about did not match the section headers in any survey paper.

## My actual system (messy but usable)

I use Zotero for storage and a simple spreadsheet for thinking. Columns I actually fill in:

- **Question the paper answers** (in my words, one sentence)
- **Supervision type** (not only method name)
- **What it makes possible / impossible**
- **Evaluation I trust / distrust and why**
- **Link to my projects** (ShadoNet, reading notes, dead ends)

<span class="margin-note">The goal is not to remember every paper—it is to understand what each paper makes possible or impossible.</span>

Tags in Zotero are coarse: `weak-supervision`, `evaluation`, `pathology-specific`, `representation`, `to-re-read`. The spreadsheet holds the argument-level notes. When the two disagree, the spreadsheet wins.

<aside class="callout callout--key-idea" role="note">
<p class="callout-label">Key idea</p>
<div class="callout-body">
<p>Organize papers by the question they answer, not only by architecture family. Method families hide incompatible assumptions about labels and clinical claims.</p>
</div>
</aside>

## What reading looked like in practice

Early passes were shallow by design—[how I read a research paper](/blog/small-explainers/how-i-read-a-research-paper) describes the first pass. Second passes happened when a project stalled. That is when papers changed meaning.

Example: I read CLAM early as a multiple-instance learning paper. During ShadoNet, I re-read it as a paper about what weak supervision can claim when bags are uncertain—see [CLAM and admitted uncertainty](/blog/paper-notes/clam-weak-supervision-works-best-when-it-admits-its-own-uncertainty). Same PDF, different question, different takeaway.

<aside class="callout callout--observation" role="note">
<p class="callout-label">Observation</p>
<div class="callout-body">
<p>The most useful papers in my review were not always the newest. They were the ones that named a limitation I had already hit in experiments but had not yet articulated.</p>
</div>
</aside>

## The thing I misunderstood

I thought a literature review was a phase you complete. It is closer to infrastructure you maintain. When my research question shifted—described in [how my research questions changed](/blog/phd-journal/how-my-research-questions-changed-over-time)—whole folders became irrelevant and quiet papers became central.

<aside class="callout callout--misconception" role="note">
<p class="callout-label">Common misconception</p>
<div class="callout-body">
<p>A long bibliography is not a map. A map tells you where to go next when an experiment fails—which papers to re-read with a sharper question.</p>
</div>
</aside>

## What I stopped doing

I stopped copying abstract conclusions into notes without rewriting them in my own task language. I stopped treating survey papers as authoritative taxonomies. I stopped feeling guilty about unread citations on related-work lists—unread because irrelevant is fine; unread because avoided is worth examining.

## Open question I am sitting with

I want to try a quarterly "literature reset": pick five papers from the spreadsheet marked `to-re-read`, re-read them with my current project question, and update the possibility/impossibility column. Not to expand the bibliography—to compress the map.

I still do not know how to tell when I am reading to avoid coding versus reading because the question genuinely requires new context. That balance remains manual—and I suspect it always will.
