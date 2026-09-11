---
heroImage: "/images/posts/small-explainers--what-is-representation-learning.svg"
ogImage: "/images/posts/small-explainers--what-is-representation-learning.svg"
title: "What Is Representation Learning?"
date: 2025-03-09
description: "A compact explanation of representations, why they matter, and why they are hard to evaluate."
category: "Small Explainers"
tags:
  - small explainer
  - representation learning
  - foundation models
  - machine learning
keywords:
  - representation learning
  - embeddings
  - self-supervised learning
  - foundation models
  - feature probing
toc: true
related:
  - paper-notes/dino-representation-learning-can-expose-structure-before-labels-arrive
  - paper-notes/simclr-augmentation-is-a-scientific-assumption
  - research-notes/morphology-before-accuracy
draft: true
---

Representation learning is not "better features" in the abstract. It is **training models to produce internal descriptions of data such that many downstream tasks become easier—while encoding assumptions about what should be preserved and what can be ignored.**

<div class="definition-card"><p class="definition-label">Definition</p><p class="definition-term">Representation (embedding)</p><div class="definition-body"><p>A vector (or structured set of vectors) produced by an encoder that summarizes an input image or patch. Downstream models use representations instead of raw pixels—trading interpretability of inputs for compactness and transfer.</p></div></div>

## The basic idea

Instead of hand-crafting features (color histograms, texture filters), we train encoders with objectives that do not require full task labels:

- **Contrastive** ([SimCLR](/blog/paper-notes/simclr-augmentation-is-a-scientific-assumption)): pull augmented views together
- **Distillation** ([DINO](/blog/paper-notes/dino-representation-learning-can-expose-structure-before-labels-arrive)): match teacher-student views
- **Reconstruction** ([MAE](/blog/paper-notes/mae-reconstruction-is-useful-only-when-the-missingness-is-meaningful)): predict masked pixels

Each objective installs different invariances.

<span class="margin-note">A representation is useful relative to a task family—not absolutely.</span>

<aside class="callout callout--key-idea" role="note">
<p class="callout-label">Key idea</p>
<div class="callout-body">
<p>Representations should be judged by what they make easier to measure, transfer, and understand—not by pretraining loss alone.</p>
</div>
</aside>

```mermaid
flowchart LR
  IMG[Image] --> ENC[Encoder]
  ENC --> Z[Representation]
  Z --> P1[Linear probe]
  Z --> P2[Fine-tune head]
  Z --> P3[Similarity / retrieval]
  Z --> P4[Attention visualization]
```

## Why it matters in pathology

Histology representations may encode nuclear morphology, tissue compartment, stain intensity, scanner signature, or batch effects—**simultaneously**. Without probing, fine-tuning AUC cannot tell you which.

[HIPT](/blog/paper-notes/hipt-histology-has-a-natural-scale-hierarchy) adds scale structure; [foundation models](/blog/research-notes/foundation-models-are-powerful-but-not-magic) add data scale. Neither removes evaluation obligation.

<aside class="callout callout--observation" role="note">
<p class="callout-label">Observation</p>
<div class="callout-body">
<p>Two encoders with similar linear-probe accuracy on tissue type can diverge on stain-shift robustness or nuclear boundary tasks—because they preserved different factors of variation.</p>
</div>
</aside>

## Self-supervised objective map

<div class="definition-card"><p class="definition-label">Definition</p><p class="definition-term">Linear probe</p><div class="definition-body"><p>A lightweight classifier trained on frozen representations to predict a labeled task. Measures how much label-relevant information is already linearly accessible—without full fine-tuning that can hide representation quality.</p></div></div>

```mermaid
flowchart TB
  subgraph contrastive["Contrastive"]
    C[Invariance via augmentations]
  end
  subgraph distillation["Distillation"]
    D[Cross-view agreement]
  end
  subgraph masked["Masked modeling"]
    M[Missingness pattern]
  end
```

## The common mistake

Treating " pretrained representation" as a universal substrate:

- pretraining distribution ≠ your scanner/stain
- probe task ≠ clinical task
- emergent attention ≠ pathologist-aligned structure

<aside class="callout callout--misconception" role="note">
<p class="callout-label">Common misconception</p>
<div class="callout-body">
<p>Better ImageNet pretraining automatically helps pathology. Transfer depends on whether pretraining invariances align with the morphology your labels require—see [morphology before accuracy](/blog/research-notes/morphology-before-accuracy).</p>
</div>
</aside>

## How I use it

Before fine-tuning, I probe:

1. **k-NN / linear** on coarse labels if available
2. **Stain and scanner stratification** of embedding space
3. **Qualitative review** of attention or retrieval neighbors on hard slides

Representation learning saves labels when the representation already encodes what you need. It wastes labels when fine-tuning overwrites emergent structure with shortcuts.

## Research question for my own work

**Does my encoder preserve the factor of variation my task treats as signal—or did pretraining declare it noise?**

Diagnostic test: apply controlled perturbations (stain shift, rotation, blur, mask nuclear boundaries) and measure embedding distance vs. downstream label sensitivity. Large embedding drift on perturbations that do not change clinical labels means the representation is misaligned.

Representations are contracts about invariance. Read the contract before trusting the embedding.
