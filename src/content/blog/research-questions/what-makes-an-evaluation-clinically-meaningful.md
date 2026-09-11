---
heroImage: "/images/posts/research-questions--what-makes-an-evaluation-clinically-meaningful.svg"
ogImage: "/images/posts/research-questions--what-makes-an-evaluation-clinically-meaningful.svg"
title: "What Makes an Evaluation Clinically Meaningful?"
date: 2026-02-08
updatedDate: 2026-07-26
description: "If someone outside my notes cannot say what would falsify the claim, the evaluation section is not done. Clinical language does not get a discount."
category: "Research Questions"
series: "Research Questions"
tags:
  - research questions
  - evaluation
  - medical AI
keywords:
  - clinical evaluation
  - medical AI validation
  - intended use
  - failure analysis
toc: true
related:
  - research-notes/the-easiest-signal-is-the-wrong-task
  - research-notes/what-makes-a-medical-ai-paper-convincing
  - research-questions/can-we-measure-biological-understanding
draft: false
---

I do not work in a clinic. I should not borrow a clinic’s vocabulary unless the evaluation can survive a person who does.

The test I actually use is smaller and harder than a prospective trial. After reading a draft, can someone who is not in my notes answer: **what would falsify this claim?** If they cannot, the evaluation section is not done. Calling the work “clinical” does not fix that. It makes it worse.

<span class="margin-note">“Clinically meaningful” is not a tone. It is a match between the claim and the test.</span>

## What I mean when I am being careful

Not every methods paper should be judged as if it were entering a hospital next quarter. Early work can still be coherent. Coherent means:

- The task resembles something a person who looks at these images actually does
- Errors are described in words that person would recognize — missed a nucleus, named the wrong stage, matched across a tissue boundary
- The paper says what the model is *not* for
- The evaluation does not quietly upgrade a research number into a clinical sentence

[What makes a medical AI paper convincing](/blog/research-notes/what-makes-a-medical-ai-paper-convincing) is mostly this discipline. Language and evidence should be the same size.

## How this shows up in my tables

I do not score [ShadoNet](/projects/shadonet) against automatic outlines the test-time user does not have. I ask, at a clicked nucleus: did you find it, and did you name it? I keep the dataset that barely moves.

I do not score [SporeAI](/projects/sporeai) with pixel overlap against machine-drawn cells. I ask the same click question on 14,370 expert points. A model that only finds late bright spores is not clinically or scientifically interesting. Those spores were already obvious.

I do not give [TopoTrack](/projects/topotrack) one “overall” score. Geometry and identity moved in opposite directions. A tissue story that hides the identity drop is the spatial version of a clinical story that hides the dangerous error.

<aside class="callout callout--key-idea" role="note">
<p class="callout-label">Key idea</p>
<div class="callout-body">
<p>An evaluation is meaningful when the error it counts is the error the claim named. Frequency alone is not meaning. A rare wrong name can matter more than a common easy miss.</p>
</div>
</aside>

## What I will not demand

I will not demand a reader study for every conference paper. That standard would freeze methods work I still believe in.

I will demand that clinical *language* come with clinical *size*. If the abstract says decision support, the evaluation has to talk about misses a person would act on — not only AUC on curated tiles. If the work is early, the claim should sound early.

Retrospective performance on hospital images is not validation. It may be necessary. It is rarely enough, especially when the labels inherited the workflow’s habits.

## The parallel question

Clinical meaning and [biological understanding](/blog/research-questions/can-we-measure-biological-understanding) overlap and then diverge. A model can be sensitive to shape and still useless in a workflow. A model can help a narrow quality-control task without understanding tissue.

Both need an operational test. Mine, for now, is the falsification sentence. I try to write it before the results section. I do not always succeed. When I fail, the draft reads like a model announcement. I can hear it. That is usually the day I delete the adjective “clinical.”
