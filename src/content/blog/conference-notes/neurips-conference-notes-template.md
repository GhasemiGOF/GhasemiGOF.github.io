---
heroImage: "/images/posts/conference-notes--neurips-conference-notes-template.svg"
ogImage: "/images/posts/conference-notes--neurips-conference-notes-template.svg"
title: "NeurIPS Conference Notes Template"
date: 2025-12-02
description: "A research notebook template for NeurIPS — evaluation culture, learning assumptions, and what actually changed."
category: "Conference Notes"
tags:
  - conference notes
  - NeurIPS
  - machine learning
  - evaluation
toc: true
keywords:
  - NeurIPS notes
  - machine learning conference
  - evaluation methodology
  - uncertainty
  - data-centric AI
related:
  - research-notes/why-evaluation-matters-more-than-another-1-accuracy
  - paper-notes/clam-weak-supervision-works-best-when-it-admits-its-own-uncertainty
  - small-explainers/how-i-read-a-research-paper
draft: true
---

This is my template for writing NeurIPS notes. I do not want conference notes to become a travel diary or a list of talks I attended. I want them to become a record of what changed in my thinking.

<span class="margin-note">NeurIPS rewards clean theory and clever benchmarks. My job in these notes is to ask which results survive contact with messy biomedical data.</span>

The theme I will pay attention to at NeurIPS: machine learning ideas, evaluation culture, data-centric AI, uncertainty, and the assumptions behind learning systems.

## How I use this notebook

```mermaid
flowchart LR
    A[Before: write priors] --> B[During: raw capture]
    B --> C[Same evening: tag shifts]
    C --> D[Within 3 days: synthesis]
    D --> E[Link to research notes]
    E --> F[Queue methods to try]
```

<aside class="callout callout--key-idea" role="note">
<p class="callout-label">Key idea</p>
<div class="callout-body">
<p>Callouts mark ideas worth retrieving later. Replace this with something like: "A benchmark can be 'solved' while the underlying scientific question remains open."</p>
</div>
</aside>

## Before the conference

What am I hoping to learn?

- [Replace with 3–5 questions you are carrying into the conference.]
- [Add one question about computational pathology — e.g., do MIL assumptions hold when labels are slide-level but errors are patch-level?]
- [Add one question about evaluation or annotation.]
- [Add one question about a method you are skeptical of but curious about.]

The point of this section is to make my priors visible. Conferences are overwhelming because every talk sounds important while it is happening.

## Talks that shifted something

### Talk 1: [title / speaker]

What I expected:

[Placeholder.]

What surprised me:

[Placeholder.]

The idea I want to keep:

[Placeholder.]

### Talk 2: [title / speaker]

What I expected:

[Placeholder.]

What surprised me:

[Placeholder.]

The idea I want to keep:

[Placeholder.]

## Papers that changed thinking

1. **[Paper title / arXiv ID]** — Before I thought: [placeholder]. After NeurIPS I think: [placeholder]. Worth a full read? [yes / maybe / no]
2. **[Paper title]** — The assumption it challenged: [placeholder]
3. **[Paper title]** — Connection to my work: [placeholder — e.g., relates to [why evaluation matters](/blog/research-notes/why-evaluation-matters-more-than-another-1-accuracy)]

Papers I queued but did not read yet:

- [Placeholder]
- [Placeholder]

## Open questions surfaced

Questions that became sharper at NeurIPS:

1. [Placeholder — e.g., when does weak supervision actually hurt calibration?]
2. [Placeholder — e.g., are we measuring epistemic or aleatoric uncertainty in pathology tasks?]
3. [Placeholder]

<span class="margin-note">A good open question should be falsifiable. "Is uncertainty important?" is too soft. "Does CLAM-style attention correlate with pathologist disagreement?" is better.</span>

<aside class="callout callout--research-question" role="note">
<p class="callout-label">Research question</p>
<div class="callout-body">
<p>Replace with a question you could turn into an ablation — e.g., "Does adding an uncertainty head change F1 on imbalanced nucleus classes, or only the confidence plots?"</p>
</div>
</aside>

## Methods to try

| Method / idea | Why it might matter | Effort | Priority |
|---|---|---|---|
| [e.g., conformal prediction for patch scores] | [placeholder] | [low / med / high] | [now / later / maybe] |
| [placeholder] | [placeholder] | [placeholder] | [placeholder] |
| [placeholder] | [placeholder] | [placeholder] | [placeholder] |

Concrete next step for the top item: [placeholder]

## Conversations worth remembering

- **[Name / affiliation]** — Topic: [placeholder]. The sentence I want to keep: "[placeholder]" — Follow-up: [placeholder]
- **[Name]** — They pushed back on: [placeholder]. My response now: [placeholder]
- **[Name]** — Hallway detail: [placeholder — e.g., their "simple baseline" took three months to tune]

## Failure modes noticed

- **[Failure mode]** — Where I saw it: [talk / poster / my project]. Why it matters: [placeholder]
- **[e.g., leaderboard overfitting]** — [placeholder]
- **[e.g., reporting mean metrics on heavy-tailed error distributions]** — [placeholder]

<aside class="callout callout--misconception" role="note">
<p class="callout-label">Common misconception</p>
<div class="callout-body">
<p>Replace with a misconception you heard repeated — e.g., "Higher validation AUC automatically means the model learned biology, not shortcuts."</p>
</div>
</aside>

## Posters worth returning to

1. **[Poster title]** — Decision worth remembering: [placeholder]
2. **[Poster title]** — Decision worth remembering: [placeholder]
3. **[Poster title]** — Decision worth remembering: [placeholder]

## Patterns I noticed

Field-level motion at NeurIPS this year:

- Is "data-centric AI" changing experimental practice or mostly changing language?
- Are uncertainty methods being evaluated on tasks where uncertainty actually changes decisions?
- Are negative results visible, or only implied by what people avoided discussing?
- Are biomedical papers borrowing ML methods without borrowing ML skepticism?

[Write 3–6 paragraphs here after the conference.]

## What this changes for my own work

After NeurIPS, I want to ask:

- Which idea should I read more deeply? (See [how I read a paper](/blog/small-explainers/how-i-read-a-research-paper) for my process.)
- Which method should I test or adapt carefully?
- Which assumption in my evaluation plan feels weaker now?
- Which result made me more or less confident about [weak supervision with admitted uncertainty](/blog/paper-notes/clam-weak-supervision-works-best-when-it-admits-its-own-uncertainty)?

[Write the answer as prose, not a checklist.]

## After-conference synthesis

**What idea followed me home?** [One idea, not a list.]

**What assumption became weaker?** [Placeholder.]

**What should I do next?** [Read / reproduce / email / redesign experiment / write a short note.]

## What not to write

I should not write that a talk was "inspiring" without saying what shifted. The useful unit is a changed question.

[Placeholder: before NeurIPS I thought…; after it…]
