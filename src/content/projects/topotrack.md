---
title: TopoTrack
tagline: Structure-aware trajectories in spatial transcriptomics.
description: Couple two spatial-transcriptomics slices with fused Gromov–Wasserstein. Expression sets the cross-slice cost; multi-view tissue structure (Euclidean, geodesic, local context) sets the within-slice geometry. Quantitative held-out comparisons are withheld while the manuscript is under revision.
icon: topo
tag: Spatial biology
status: Under revision
order: 3
keywords:
    - TopoTrack
    - spatial transcriptomics
    - trajectory inference
    - optimal transport
    - tissue structure
    - fused Gromov-Wasserstein
    - SpaTrack
---

![Two spatial point clouds linked by faint transport lines: a trajectory as a coupling, not a curve in an embedding.](/images/projects/topotrack/fig_header_trajectory.png)

*The sign of the project: a plan, not a path. Mass moving from one tissue geometry to the next.*

This is the working page for TopoTrack. Like [ShadoNet](/projects/shadonet) and [SporeAI](/projects/sporeai), I want the project in one place: the question, the current bets, and the notes I will keep adding.

The short version: infer correspondences between spatial-transcriptomics slices without throwing away the fact that cells have neighbors.

<span class="margin-note">Local organization is not decoration around a gene-expression embedding. It is part of the process I am trying to recover.</span>

The method is two objects, then one plan. First I build an **expression cost** \(M\) between slices. Then I build **within-slice structure** \(G_1, G_2\) from more than Euclidean distance. Fused Gromov–Wasserstein has to listen to both.

![Pipeline from two spatial slices through expression cost M and multi-view structure G into fused Gromov-Wasserstein and a transport plan T.](/images/projects/topotrack/fig_pipeline.png)

*SpaTrack already does expression-cost transport. TopoTrack-G keeps that cost and replaces the Euclidean within-slice matrices with a multi-view structural \(G\).*

## What this project is

TopoTrack is a spatial-biology project. The data are spatially resolved transcriptomes: cells (or spots) with expression profiles and positions in tissue, observed at two (or more) times or conditions. The usual trajectory toolkit was built for dissociated single-cell data, where “nearby in state space” does not have to mean “nearby in the tissue.”

I am interested in the cases where that assumption is wrong. Development, injury, and many tissue programs are spatially structured. A coupling that ignores local cell organization can still produce a smooth plan. Smooth is not the same as spatially plausible.

Code lives in `NexTrack/topotrack_variants/`. The public comparison set is SpaTrack, moscot, PASTE2, DeST-OT, STORIES, TOAST, and SOCS. I will not pretend a composite “TopoTrack wins 10/17 metrics” is a scientific score. Metrics are correlated. Families matter.

<aside class="callout callout--key-idea" role="note">
<p class="callout-label">Key idea</p>
<div class="callout-body">
<p>Expression similarity says which cells look alike. Spatial structure says which cells could have influenced, adjoined, or succeeded one another in tissue. The transport plan should have to listen to both.</p>
</div>
</aside>

## The spatial problem

Standard pipelines often look like this: embed cells by expression, build a graph in that embedding, walk from early to late. Space, if used at all, is a coloring on the resulting plot.

That can be fine when the biology is well mixed. It is a problem when:

- adjacent cells are in different states on purpose (boundaries, niches)
- similar expression appears in disconnected regions
- the process of interest is a wave, a gradient, or a neighborhood-dependent fate
- “pseudotime” orders cells that never could have been on the same physical path

If a trajectory fits expression and still jumps across the tissue, the structure was never part of the method.

<aside class="callout callout--misconception" role="note">
<p class="callout-label">Common misconception</p>
<div class="callout-body">
<p>Adding spatial coordinates to a plot is not the same as putting spatial constraints into the inference. If the algorithm never pays a cost for jumping across the tissue, the structure was never part of the method.</p>
</div>
</aside>

## Structure as context

“Structure” here is local cell organization: who sits next to whom, which interfaces exist, which regions are coherent. It is the spatial analogue of morphology in ShadoNet. Morphology is what a nucleus looks like. Structure is how cells are arranged.

That analogy is useful and also dangerous. I should not import pathology vocabulary and pretend it solves spatial transcriptomics. What I *can* import is the habit: name the shortcut, then refuse to treat a pretty embedding as evidence.

Possible shortcuts I already expect:

- mixing spatially distant but transcriptionally similar populations
- smoothing over a sharp tissue boundary because the transport cost in expression space is low
- calling a gradient a lineage because both are ordered
- using space only as a regularizer while the story in the paper is about tissue organization
- buying neighborhood preservation by smearing mass so widely that cell-type identity collapses

## Variants: what is allowed to change

All variants share a component builder. They differ in *which* matrices enter fused Gromov–Wasserstein.

| Variant | Cross-slice cost \(M\) | Within-slice \(G_1, G_2\) | What it is asking |
| --- | --- | --- | --- |
| SpaTrack | expression | Euclidean | look-alikes, ignore neighborhood shape |
| **TopoTrack-G** | expression | multi-view structure | keep the SpaTrack cost; change the geometry |
| TopoTrack-M | context-enriched expression | Euclidean | put neighborhood into the cost instead |
| TopoTrack-GM | context-enriched | multi-view | both |
| TopoTrack-Lap | G, M, or GM, then linearized Laplacian | refinement of an existing plan |
| **TTG-BM** | G’s matrices, balanced mean-scaled FGW | same geometry, different solver |
| **TTG-BM-P2** | TTG-BM with larger structure weight \(\lambda=0.5\) | more G, less \(M\) |

TopoTrack-G is the default scientific object. TTG-BM / TTG-BM-P2 are probe-selected solver changes that I then froze and re-ran on held-out units. They are not a silent rename of G.

The multi-view \(G\) is a simplex-weighted mix of normalized distances:

\[
G \;=\; w_{\mathrm{euc}}\,G^{\mathrm{euc}}
\;+\; w_{\mathrm{geo}}\,G^{\mathrm{geo}}
\;+\; w_{\mathrm{ctx}}\,G^{\mathrm{ctx}}
\;+\; \sum_h w_h\,G^{\mathrm{prop},h}
\]

![TopoTrack-G: coordinates and expression go through a shared embedding and a spatial kNN graph into four within-slice views — Euclidean, geodesic, context, and propagated features — which are normalized and fused with simplex weights into G.](/images/projects/topotrack/fig_topotrack_g.png)

*How TopoTrack-G builds the within-slice graph. Four views, each normalized per slice, then fused with \(w_v \ge 0\), \(\sum_v w_v = 1\). This is \(G\). It is not yet the transport plan.*

Default lung-ablation weights (must sum to 1): Euclidean \(0.80\), geodesic \(0.15\), local context \(0.05\). Geodesic is shortest-path distance on the spatial \(k\)NN graph (\(k=8\)). Context is a neighborhood-profile distance. Propagation hops, when used, move expression along that graph. Infinity in the geodesic matrix means *disconnected*, and only that.

```python
# topotrack_G.py — SpaTrack-style M, neighborhood-aware G
alpha = 0.6          # structure vs expression in FGW
soft_type_weight = 0.35
view_weights = {"euclidean": 0.80, "geodesic": 0.15, "context": 0.05}
```

## The transport objective

Let \(T \ge 0\) be the plan, \(p,q\) the slice mass priors, \(M\) the cross-slice cost, \(C^1,C^2\) the within-slice structure, \(L(a,b)=(a-b)^2\).

**Balanced fused Gromov–Wasserstein** (`transport_mode="balanced"`):

\[
\min_{T\mathbf{1}=p,\; T^{\mathsf T}\mathbf{1}=q,\; T\ge 0}
(1-\alpha)\langle T,M\rangle_F
+\alpha\sum_{i,j,k,l} L(C^1_{ik},C^2_{jl})\,T_{ij}T_{kl}
-\varepsilon H(T)
\]

The first term says: do not map cells that look unlike in expression. The second says: if \(i\) and \(k\) are neighbors in slice 1, their images \(j\) and \(l\) should be neighbors in slice 2. Entropy keeps the plan from collapsing to a matching that the Sinkhorn loop cannot represent.

Semi-relaxed FGW drops the target marginal. Unbalanced / FUGW converts distances to similarities and relaxes both marginals with a KL (or L2) divergence. Omitting `transport_mode` keeps a historical FUGW route for reproduction. Those are **different POT objective families**, not one loss with three constraint sets.

I still have to say what is being transported. A “cell state” here is a spot with a PCA/SVD expression vector and a spatial neighborhood, not a named lineage unless the dataset gives one.

<aside class="callout callout--research-question" role="note">
<p class="callout-label">Research question</p>
<div class="callout-body">
<p>When does local tissue organization change the coupling we should infer—and how would we know the spatial term did real work, rather than slightly smoothing an expression-only path or buying kNN by smearing type?</p>
</div>
</aside>

## How I refuse to evaluate

A pretty force-directed plot of \(T\) is not a result. The metrics I keep on the table, from `final_verified_results/HELDOUT_RESULTS_REPORT.md` (10 September 2026), are:

| Family | Metric | What a win would mean |
| --- | --- | --- |
| Global geometry | spatial correlation \(r\) | mapped neighbors stay spatially consistent |
| Local structure | kNN@8 preservation | 8-neighborhoods survive the coupling |
| Local geometry | local-edge distance correlation | nearby pairs stay nearby |
| Identity / type | same-label mass | mass stays inside annotated cell types |
| Concentration | Hill number | how many effective partners a cell has |

I do **not** average these into one score. Geometry and type can move in opposite directions. That opposition is the result.

Synthetic identity (known descendants after a warp) is the only place I have ground-truth correspondence. Frozen default TopoTrack-G does **not** beat SpaTrack there on the frozen synthetic. A ceilinged earlier synthetic established nothing. I will not mix a later tuned synthetic into the held-out table. Quantitative synthetic and held-out numbers stay in the manuscript draft.

## What the held-out numbers are allowed to say

<aside class="embargo" role="region" aria-label="Results withheld pending publication">
  <div class="embargo__card">
    <p class="embargo__label">Paper under revision</p>
    <p class="embargo__text">Detailed held-out results and metrics are hidden while the manuscript is under review. For more information, <a href="mailto:mghasemi@iu.edu">email me</a>.</p>
  </div>
  <div class="embargo__blur" aria-hidden="true">
    <p>Held-out comparisons across lung, midbrain, and axolotl pairs. Geometry families versus type-mass families. Competitor baselines including SpaTrack and related transport methods.</p>
    <table>
      <thead>
        <tr><th>Unit</th><th>SpaTrack</th><th>TopoTrack</th><th>Competitor</th></tr>
      </thead>
      <tbody>
        <tr><td>Lung</td><td>—</td><td>—</td><td>—</td></tr>
        <tr><td>Midbrain</td><td>—</td><td>—</td><td>—</td></tr>
        <tr><td>Axolotl</td><td>—</td><td>—</td><td>—</td></tr>
      </tbody>
    </table>
    <p>Spatial, neighborhood-preservation, and type-mass figures stay in the manuscript draft.</p>
    <div class="embargo__placeholder"></div>
  </div>
</aside>

## What remains unresolved

- Optional ε / PCA / paper-default sweeps for SOCS, PASTE2, TOAST, DeST-OT were not run on this freeze.
- STORIES is trained and scored under different FGW settings.
- Default TopoTrack-G was picked on a lung ablation, so lung full is not a fully independent test of the *default* (it is held-out for TTG-BM / P2).
- Axolotl type mixes missing classes (D10 lacks rIPC; D20 lacks reaEGC). The D10 type collapse may partly be that.
- Whether TTG-BM-P2’s extra kNN (with a *higher* Hill number than TTG-BM) is over-smoothing cannot be decided without identity ground truth on real tissue.
- Git could not be pinned on that freeze; reproducibility is file SHA-256 plus sample-identity hashes.

This sits downstream of the representation questions in [what should pathology foundation models actually learn](/blog/research-questions/what-should-pathology-foundation-models-actually-learn) and [can we measure biological understanding](/blog/research-questions/can-we-measure-biological-understanding): a transport plan is another place where a model can look biologically fluent while following a shortcut.

## Open questions

- What spatial negative control would falsify a structure-aware claim? A shuffled-coordinate pair that still “wins” kNN would.
- How much of the gain comes from better neighborhoods versus a more flexible FGW mode?
- Should evaluation recover known lineages, known spatial patterns, or both at once—and what do I do when those two disagree, as they do here?
- What is the smallest synthetic case that makes the spatial term *necessary* without hitting a 100% ceiling?
- Is there a reliability gate on \(G\) that keeps type mass from falling off a cliff on axolotl?

## Working notes

- Current framing: structure-aware slice coupling. Expression \(M\), multi-view \(G\), fused Gromov–Wasserstein.
- Current best geometry object and default story object live in the draft under revision.
- Current evidence: held under revision with the manuscript. The public page keeps the evaluation families; the numbers stay off the open web.
- Current risk: telling a tissue story while the plan buys neighborhoods by smearing identity.
- Next: a failure contract—one spatial shortcut the method is supposed to refuse, and the plot that would show it if the method failed.
