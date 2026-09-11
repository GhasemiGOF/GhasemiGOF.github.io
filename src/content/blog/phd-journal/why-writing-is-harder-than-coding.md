---
heroImage: "/images/posts/phd-journal--why-writing-is-harder-than-coding.svg"
ogImage: "/images/posts/phd-journal--why-writing-is-harder-than-coding.svg"
title: "Why Writing Is Harder Than Coding"
date: 2025-05-11
description: "Writing is difficult because it exposes the parts of a research idea that code can temporarily hide."
category: "PhD Journal"
series: "PhD Journal"
tags:
  - phd
  - writing
  - research communication
  - papers
keywords:
  - academic writing
  - research communication
  - paper drafting
  - thinking
  - phd writing
toc: true
related:
  - phd-journal/how-my-research-questions-changed-over-time
  - research-notes/the-easiest-signal-is-the-wrong-task
  - research-notes/what-makes-a-medical-ai-paper-convincing
draft: false
---

Coding lets me postpone certain questions. Writing does not.

## A moment when drafting changed the work

During early ShadoNet paper drafting—described in [week 7 of the development journal](/blog/building-shadonet/week-7-preparing-the-paper)—I wrote a sentence claiming the method learned "morphology-aware representations" from center supervision. Staring at it, I realized I could not point to a figure that supported the adjective "morphology-aware" without leaning on qualitative patches I had not systematically curated.

<span class="margin-note">A paragraph has fewer hiding places than a repository.</span>

The code ran. The metrics existed. The sentence was the problem. I downgraded the claim, added a limitation paragraph, and made a note to build the audit set I had been deferring. Writing did not discover a new bug—it discovered a gap between what I was saying and what I had tested.

<aside class="callout callout--key-idea" role="note">
<p class="callout-label">Key idea</p>
<div class="callout-body">
<p>Writing is not documentation of finished thinking. It is a test of whether your thinking is finished enough to survive a skeptical reader.</p>
</div>
</aside>

## What code hides

Repositories can accumulate optional modules, experimental branches, and commented-out losses without forcing a single narrative. A paper cannot. Every sentence competes for space and scrutiny.

Code also lets me use shorthand variable names for vague concepts. Writing forces definitions: what is "sparse," what is "morphology," what is "failure"?

[What makes a medical AI paper convincing](/blog/research-notes/what-makes-a-medical-ai-paper-convincing) is essentially a checklist for what writing must surface: data realism, evaluation honesty, limitations adjacent to claims—not buried.

<aside class="callout callout--observation" role="note">
<p class="callout-label">Observation</p>
<div class="callout-body">
<p>Short problem statements written before experiments age badly in useful ways. When results arrive, revising those statements exposes whether the experiment tested what I thought it tested.</p>
</div>
</aside>

## The thing I misunderstood

I treated writing as something to do after results existed—as packaging. That produced two failures: late discovery of mismatched claims, and method sections that sounded complicated because the idea was not yet clear.

<aside class="callout callout--misconception" role="note">
<p class="callout-label">Common misconception</p>
<div class="callout-body">
<p>Good writing is not good decoration. Clear prose is clear thinking—or an alarm that thinking is still fuzzy.</p>
</div>
</aside>

## What helps now

- One-paragraph problem statements before coding; revised after results
- Replacing "achieves" with "under these assumptions" until figures exist
- Reading drafts aloud—not for style, but to hear where I skip steps
- Keeping development notes (like the ShadoNet journal) separate from the paper, then mining them for motivation and limitations

## Open question I am sitting with

I want to try drafting the limitations section before the results section on my next paper—not as a gimmick, but as a forcing function: if I cannot name what would falsify the work, I am not ready to write results.

I still do not know how much uncertainty belongs in a paper versus in lab notes. Too much hedging reads as weakness; too little reads as [the overconfidence I caught in week 7](/blog/building-shadonet/week-7-preparing-the-paper). Calibrating that voice is ongoing—and writing remains the instrument I trust most for detecting miscalibration.
