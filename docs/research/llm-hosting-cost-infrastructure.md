---
sidebar_position: 1
title: LLM Hosting — Cost & Infrastructure
---

# Cost & Infrastructure for Co-op-Owned LLM Serving

*Research note for the Kootenay Lightweb Community Services Cooperative — May 2026*

## TL;DR

- The open-weight frontier in mid-2026 sits with **Kimi K2.6, DeepSeek V4, Qwen3.5 / Qwen3.6, GLM-5.1, MiMo-V2.5**, and refreshed **Mistral / Llama 4 / Gemma 4** lines. Several land within 1–3 points of top closed models on the Artificial Analysis Intelligence Index.
- For the Lightweb's ~144 active users today and ~1,000 user horizon, the **sweet spot is one or two MoE models in the 30B–122B-total / 3B–17B-active range** (Qwen3-30B-A3B, Qwen3.5-122B-A10B, Qwen3.5-Omni-30B-A3B, DeepSeek V3.x-Lite, GLM-Air). These deliver flagship-quality reasoning at a fraction of the compute of dense 70B+ models.
- The cheapest path to "ours, not theirs" is **upcycled enterprise hardware**: Tesla P40s (~$285 used / 24 GB), AMD MI50 32 GB (~$120–$210), refurbished EPYC Rome/Milan chassis (HPE DL385 Gen10 / Dell R7525, sub-$3K). One refurbished 4-GPU EPYC node with mixed P40/MI50 cards can serve the current member base for **CAD ~$4,500–$9,000 capex** plus power.
- For a low-watt single-box "magnetic core" demo, the **Framework Desktop / Strix Halo (Ryzen AI Max+ 395, 128 GB unified) at $1,999** runs 70B-class quantized models at desk-side power (65–120 W). It is the single best **"Good AI in a box"** artifact to put on stage at the AGM.
- At BC Hydro Tier 2 (~$0.141/kWh as of April 2026), a continuously-on 4-GPU rig at ~600 W draws roughly **CAD $740/year in electricity** — i.e., subsidising co-op-owned inference for 144 members runs about **$5/member/year in power**.
- **vLLM, not Ollama, is the right serving layer once you have more than one concurrent user.** Ollama for dev, vLLM (or SGLang/TGI) in front of Liberty for production.

---

## 1. Why this matters for the Lightweb specifically

The co-op already runs Ollama behind Chaz on Liberty. The next question — both for the AGM and the $500K raise — is whether co-op-owned AI can be financially sustainable at the federation scales the roadmap envisions (individual → group → community → regional → global), and whether the hardware story is consistent with the Good AI stance: community-owned, renewable-powered, running on repurposed gear.

This note answers three things:

1. **Which open-weight models** are worth tracking and serving for a 100–1,000 member community in 2026.
2. **What hardware** delivers those models at the lowest sustainable total cost — with strong bias to upcycled/refurbished gear.
3. **What it actually costs** in CAD, in capex and ongoing watts, to run as a co-op service.

The framing assumption is that the Lightweb is *not* trying to compete with Anthropic / OpenAI / Google on absolute capability. The differentiator is **sovereignty, locality, and opt-in**. A 90th-percentile open-weight model running on community hardware is enough — and the gap is closing every quarter.

---

## 2. The 2026 open-weight landscape

### 2.1 Qwen (Alibaba) — the workhorse family

Qwen has become the most prolific open-weight family and is the best default for a community deployment because of its breadth (0.6B → 1T+), Apache-2.0-style licensing on most sizes, and strong Ollama / vLLM / MLX support.

| Model | Total / Active | Approx. local fit | Notes |
|---|---|---|---|
| **Qwen3-0.6B / 1.7B / 4B** | dense | CPU / phone / SBC | Edge nodes, Reticulum/LoRa devices |
| **Qwen3-8B / 14B** | dense | 1× 24 GB GPU (Q4) | Solid generalist for a small group |
| **Qwen3-30B-A3B** (MoE) | 30B / 3B | 8 GB VRAM (Q4) | **Best price/performance for community chat.** Outperformed the previous flagship QwQ-32B. |
| **Qwen3.5-35B-A3B / 122B-A10B** (MoE) | 35B/3B • 122B/10B | 24 GB / 80 GB | Late-2025 refresh; 122B is the strong "flagship at home" tier. |
| **Qwen3.5-Omni-30B-A3B** | 30B / 3B + speech | ~24 GB | **Native voice in & out**, 113 ASR languages, 36 TTS languages. The right model behind Chaz once you want voice. |
| **Qwen3.6-27B (dense) / 35B-A3B** | — | 16–24 GB | April 2026 refresh; 1M native context; ~120 tok/s on a 4090 at Q4. |
| **Qwen3-235B-A22B / Qwen3.5-397B-A17B** | 235B/22B • 397B/17B | multi-GPU or 256 GB+ Mac | Top of stack; only worth hosting at the regional/global federation layer. |

**Lightweb take:** Run **Qwen3.5-35B-A3B** (or 3.6 equivalent) as the daily-driver, and **Qwen3.5-Omni-30B-A3B** as the voice/multimodal model behind Chaz. Both fit on a single 24 GB GPU at Q4.

### 2.2 DeepSeek — frontier-class reasoning, MIT-style license

DeepSeek pushed the frontier in 2024–2025 (V3, R1) and has continued through V4. The headline models are huge — **DeepSeek V4 Pro / R1 at 671B-class total parameters** — and only fit on systems with ≥400 GB combined memory, but DeepSeek also ships smaller distilled and Lite variants intended for local use.

| Model | Local fit | Notes |
|---|---|---|
| **DeepSeek R1 distill 7B–14B** | 8–16 GB VRAM (Q4) | Reasoning at consumer scale |
| **DeepSeek R1 distill 32B** | 24 GB (Q4) | Strong on a single 3090 / 7900 XTX |
| **DeepSeek R1 distill 70B** | ~40+ GB (Q4_K_M) | Two 24 GB cards or one A6000 |
| **DeepSeek V3 / V3.2 / V4 (671B-class)** | ~405 GB at Q4 | Mac Studio M3 Ultra 512 GB at ~20 tok/s; otherwise multi-GPU server |
| **DeepSeek V4 Pro (Max Reasoning)** | API or full server | Leads LiveCodeBench at 93.5 |

**Lightweb take:** Host **DeepSeek R1-distill-32B** for reasoning-heavy queries (planning, code, governance synthesis). Skip the 671B-class tier until the federation is large enough to share one across multiple bioregions.

### 2.3 Newcomers worth tracking

These are the models that have moved the needle in the past 12 months and that the Lightweb should evaluate alongside Qwen / DeepSeek.

- **Kimi K2.6 (Moonshot)** — 1T total / 32B active, 384 experts, 256K context. **Currently the highest-ranked open-weights model on the Artificial Analysis Intelligence Index (54),** within 3 points of Anthropic/Google/OpenAI flagships. Best-in-class for long-horizon coding and autonomous agents. Large; needs serious memory (multi-GPU server or Mac Studio M3 Ultra).
- **GLM-5 / GLM-5.1 (Zhipu)** — strong coding model, 96 on MMLU, 94 on GPQA, 92 on SuperGPQA. The "GLM-Air" subset of the family is built specifically for single-GPU serving. Watch this one — closest competitor to Qwen for a community default.
- **MiMo-V2.5-Pro** — ties Kimi K2.6 at 54 on the Intelligence Index. Newer entrant, smaller community footprint, worth monitoring.
- **Llama 4 (Meta)** — Scout variant has very large context windows; useful as the **long-document model** for the Lightweb Brain over Nextcloud archives.
- **Gemma 4 (Google) — Apache 2.0** — the most permissively licensed quality model in the lineup. The Apache-2.0 license is the single most important fact for a co-op: no MAU caps, no commercial-use restrictions, no field-of-use clauses. Use Gemma 4 wherever you have any legal ambiguity about Qwen's or DeepSeek's licenses.
- **Mistral Small 4 / Medium 3.5** — efficient European-licensed models, still strong for production deployment, good fallback for any concern about Chinese-origin models in funding contexts (grants, government).
- **Phi-4-mini-instruct** — Microsoft's small-but-mighty line, useful on the edge (Reticulum nodes, offline mesh devices).

### 2.4 Licensing — the boring part that actually matters

For a registered co-op offering paid services, licensing is load-bearing:

- **Apache 2.0** (Gemma 4, Mixtral 8x22B, Command R+, many Qwen sizes) — fully fine. Attribute and ship.
- **Custom open-weight licenses** (Qwen2 family had some, DeepSeek uses MIT-style on most, Llama has "Llama Community License" with MAU clauses at very large scale) — almost always fine for a 100–10,000 user co-op but verify before hitting publicity around the AGM.
- Always include the model name, version, and license in the **Lightweb Brain's attribution page**. This is both legally clean and on-brand for a transparency-first stack.

---

## 3. Hardware: what to buy, what to scavenge

The conviction here: **for the next 24 months, used and refurbished hardware delivers more bang per dollar than anything new under $5K, with the single exception of the Strix Halo / Framework Desktop class**.

### 3.1 The four hardware archetypes

| Archetype | Example | Approx. CAD | Strength | Where it fits in the Lightweb |
|---|---|---|---|---|
| **A. The $300 budget beast** | Tesla P40 24 GB (used) | $390 | Most VRAM per dollar | Per-node inference for 8B–14B dense models; experimentation |
| **B. The consumer reference** | RTX 3090 24 GB (used) | $900 | 3× P40's bandwidth | Daily-driver GPU on Liberty; vLLM batching for 30B-A3B class |
| **C. The desk-side appliance** | Framework Desktop (Strix Halo, 128 GB) | $2,700 | 70B at Q4 in a fanless-ish box | The **AGM demo box**; replicable across bioregions |
| **D. The single-box flagship** | Mac Studio M3 Ultra 512 GB | $13,500+ | Runs DeepSeek 671B at ~20 tok/s | Regional flagship; one per federation hub |

### 3.2 GPU options ranked for the Lightweb context

**Tesla P40 (24 GB, Pascal, used)** — ~CAD $285–$420
- 24 GB VRAM for the price of a Nintendo Switch. Roughly 3× slower than a 3090; no FP16 acceleration; 347 GB/s bandwidth.
- Real numbers: Qwen2.5 14B Q4 at ~16 tok/s, Llama 7B Q4 at ~41 tok/s via llama.cpp.
- Needs blower-shroud cooling mod and an EPS-to-PCIe power adapter. Fan-noise risk for any space humans actually sit in.
- **Best as:** the bulk-VRAM card in a server-class chassis. Pair 2–4 of them in a refurbished EPYC and you have 48–96 GB of pooled VRAM for under CAD $1,500.

**AMD Instinct MI50 32 GB (Vega/gfx906, used)** — ~CAD $160–$280
- *Wildly* underpriced — 32 GB HBM2 for the cost of a P40. Bandwidth far better than P40 (~1 TB/s class HBM).
- ROCm officially capped at 5.7 but community ROCm 6.0–6.2 builds work; **community vLLM forks exist specifically for gfx906**.
- Users report ~100–110 tok/s on Llama-3 70B Q4_K_M with llama.cpp + ROCm 5.7.
- **Best as:** *the* upcycled play for the Lightweb. Eight MI50s = 256 GB of VRAM under CAD $2,500 and runs 70B-class production workloads.
- Caveat: ROCm tooling is more fiddly than CUDA. Budget the engineering time.

**RTX 3090 24 GB (Ampere, used)** — ~CAD $900–$1,100
- The best $/VRAM consumer card if speed matters. 936 GB/s, bf16 + INT8 tensor cores, very mature CUDA stack.
- Power: stock 350 W, can be limited to 260 W with ~80% of peak performance retained — the easiest dial to turn for renewable-power alignment.
- **Best as:** Liberty's frontline inference card. One 3090 per node, behind vLLM, serves the current 144-user base comfortably.

**RTX 4090 24 GB (Ada, used or new)** — ~CAD $2,400–$3,000
- Faster than 3090 but same VRAM. Not a great upgrade for inference unless prompt-processing latency is the bottleneck.
- **Skip** unless someone donates one.

**Nvidia RTX A6000 / A6000 Ada (48 GB)** — ~CAD $4,500–$8,000 used
- The "I want to run 70B without tricks" card.
- **Best as:** a single-card upgrade if a grant or major donor lands.

**AMD Strix Halo / Ryzen AI Max+ 395 (Framework Desktop, 128 GB unified)** — ~CAD $2,700
- 16 Zen 5 cores + 40 RDNA 3.5 CUs + 50 TOPS NPU + **128 GB LPDDR5X shared between CPU and GPU**.
- Runs **70B at Q4** in a Mini-ITX box at 65 W typical / 120 W boost.
- **This is the unit to put on stage at the AGM.** It is the Good AI thesis as an object: low power, single chassis, repairable Framework design, runs frontier-quality open models, replicable in any bioregion for under CAD $3K.

**Mac Studio M3 Ultra 512 GB** — ~CAD $13,500
- Runs DeepSeek 671B Q4 at ~20 tok/s on MLX, in under 200 W.
- **Best as:** one regional flagship per federation cluster. Bring it out for "yes, we run the same models OpenAI sells" demos.
- Stretch context (16K+) slows it materially; don't promise long-context performance on it.

### 3.3 The chassis question: refurbished EPYC

For a serious node on Liberty, the right chassis is a **refurbished AMD EPYC Rome (7002) or Milan (7003) server**. SP3 socket, DDR4, dual-PSU, hot-swap NVMe. Sub-$3K USD for 2U, 32–64 cores, 256–512 GB RAM, room for 4–8 GPUs.

Specific picks called out in vendor channels:

- **HPE DL385 Gen10** (SP3) — well-known, abundant on the secondary market, easy firmware flow.
- **Dell PowerEdge R7525** (SP3) — same generation, slightly better PCIe layout for multi-GPU.
- Avoid SP5 (Genoa/Bergamo) refurb until pricing comes down in late 2026.

A typical Lightweb build: one refurbished EPYC chassis + 2× 3090 + 2× MI50 32 GB = **160 GB pooled VRAM for CAD ~$5,000–$6,000 capex**. This single box serves the current 144 active members for everything from Chaz chat to Lightweb Brain RAG, with headroom for voice/Omni and reasoning workloads.

### 3.4 Sourcing in BC / Canada

- **eBay (US sellers, ship to BC)** — best selection for P40 / MI50. Budget GST + duty (~15%). Vancouver border-broker workflow is well-trodden.
- **ServerMonkey / TechMikeNY / SaveMyServer (US refurb)** — primary channels for refurbished EPYC chassis with warranty.
- **Canadian Computer Recycling / Greentec / FreeGeek Vancouver** — sometimes carry pulled enterprise gear at scrap-adjacent prices; worth a quarterly check.
- **BCIT / SFU / UBC surplus auctions** — university IT cycles produce reliable streams of 4-year-old workstations and servers.
- **Local biz networks via Avatar Computer Tech** — the strongest channel. End-of-lease workstations from accounting firms, law offices, and small ISPs are exactly the substrate the Lightweb is built to upcycle.

### 3.5 Power: the renewable-power story made concrete

BC Hydro Tier 2 residential is **~$0.141/kWh as of April 2026** (3.75% annual increase locked in by BCUC through 2027). General Service Business rates are in a similar band when including demand charges.

Steady-state load for the typical Lightweb GPU box (one EPYC chassis, 2× 3090 at 260 W power-limited, 2× MI50, idle baseline ~150 W):

- **Average draw under member load:** ~600 W
- **Annual energy:** 600 W × 24 × 365 = 5,256 kWh/year
- **Annual electricity cost:** 5,256 × $0.141 ≈ **CAD $741/year**
- **Per active member (n=144):** ~CAD $5.15/year
- **Per active member at 1,000 members on the same hardware:** ~CAD $0.74/year

Two implications:

1. The marginal energy cost of co-op AI is **trivially small** compared to a typical $5–$25/month commercial AI subscription. The story to members is: "your $25 annual co-op contribution covers your AI compute many times over, on community-owned hardware, on BC Hydro's 98%-renewable grid."
2. Power-limiting the 3090s to 260 W (80% peak) costs roughly 5% throughput and removes ~270 W from the bill — the cleanest, fastest "Good AI" optimization there is.

---

## 4. Serving stack: Ollama vs vLLM vs SGLang

Liberty already runs Ollama. That is the right development stack. It is *not* the right production stack at concurrency.

| Concern | Ollama | vLLM | SGLang / TGI |
|---|---|---|---|
| Single user latency | ~45 tok/s | ~38 tok/s | similar |
| 8 concurrent users (Llama-3 8B FP16) | 82 tok/s | 187 tok/s | comparable to vLLM |
| Peak throughput (heavy load) | ~41 tok/s | ~793 tok/s | 600–800+ |
| 10 concurrent users response time | 2 → 45+ s | flat | flat |
| Tooling / model pull UX | excellent | manual | manual |
| Best at | dev, demos, prototyping | production, batching | production, structured output |

**Architecture recommendation for Liberty:**

```
Members → Keycloak SSO → API gateway → {
    Chaz (Matrix bot)           ──► vLLM (Qwen3.5-Omni / 35B-A3B)
    Lightweb Brain (RAG)        ──► vLLM (DeepSeek R1-distill-32B for reasoning)
    Embeddings                  ──► dedicated bge-m3 / nomic on small GPU
    Dev / experimentation       ──► Ollama (developer machines, not prod)
}
```

vLLM's continuous batching is the difference between 144 members sharing the box gracefully and the box falling over at 10 concurrent prompts. SGLang is a strong alternative if structured-output / agent workflows dominate.

---

## 5. Three reference builds for the Lightweb

### Build A — "Magnetic core demo" (AGM stage box)

**Goal:** the object that lives on the AGM stage, gets photographed, and that members can identify as "this is the Lightweb's AI."

- Framework Desktop, AMD Ryzen AI Max+ 395, 128 GB unified — **CAD ~$2,700**
- USB-C dock, mechanical keyboard, e-ink-style nameplate — **~$200**
- Software: Ollama + Open WebUI for the demo loop, llama.cpp ROCm under the hood
- Runs Qwen3.5-122B-A10B at Q4, Qwen3.5-Omni for voice, DeepSeek R1-distill-32B
- Power: 65 W typical → ~$80/year on BC Hydro
- **Total: ~CAD $2,900**

This is the single piece of hardware most worth buying first. It anchors the story.

### Build B — "Liberty production node" (the workhorse)

**Goal:** the box that actually serves members in production, sized for 144 → 1,000 active users.

- Refurbished HPE DL385 Gen10 or Dell R7525 (EPYC Rome/Milan, 256 GB DDR4) — **CAD ~$2,500**
- 2× RTX 3090 24 GB used, power-limited to 260 W — **CAD ~$1,800**
- 2× AMD MI50 32 GB used (offload tier, embeddings, batch jobs) — **CAD ~$500**
- 2× 4 TB NVMe (model storage) — **CAD ~$700**
- Power cables, blower shrouds, 10 GbE NIC if not stock — **CAD ~$300**
- **Total: ~CAD $5,800 capex; ~$740/year power**

Pooled VRAM: ~112 GB. Runs Qwen3.5-122B-A10B at Q4 with substantial headroom, vLLM-batched.

### Build C — "Regional flagship" (one per federation hub)

**Goal:** the system that runs frontier-class models for several bioregions sharing a federation hub.

- Option C1: Mac Studio M3 Ultra 512 GB — **CAD ~$13,500**, runs DeepSeek V3/V4 671B-class at Q4 in MLX, ~200 W
- Option C2: Refurb EPYC + 4× RTX 3090 (96 GB VRAM) + 4× MI50 (128 GB) = 224 GB pooled — **CAD ~$10,000–$12,000**, ~1.2 kW
- Both run Kimi K2.6 / DeepSeek V4 / Qwen3.5-397B in production at multi-user scale

The Mac Studio wins on watts-per-token and on stage presence. The EPYC build wins on repairability and on being explicitly upcycled. Pick one based on which story is more important at the moment.

---

## 6. Capex / opex summary for the AGM pitch

| Tier | Members served | Capex (CAD) | Annual power (CAD) | Cost per active member-year |
|---|---|---|---|---|
| Strix Halo demo | up to ~40 light users | $2,900 | ~$80 | $2 capex/yr (5-yr amort) + $2 power |
| Liberty production node | 144 → 1,000 | $5,800 | ~$740 | $8 capex (5-yr amort) + $0.74–$5 power |
| Regional flagship | several federations | $10K–$14K | $1,200–$2,000 | depends on federation scale |

A useful one-liner for the deck:

> *Co-op-owned AI for 1,000 Kootenay members runs us about CAD $1,800/year all-in — less than one OpenAI Pro subscription. The hardware is upcycled. The grid is 98% renewable. The models are ours to choose.*

---

## 7. Strategic recommendations

1. **Pick a "default" model and a "reasoning" model** for the production stack and commit. Recommendation: **Qwen3.5-35B-A3B** as the daily-driver (and Qwen3.5-Omni-30B-A3B once voice ships behind Chaz), with **DeepSeek R1-distill-32B** as the reasoning fallback. Both fit a single 24 GB GPU at Q4.

2. **Move production from Ollama to vLLM.** Keep Ollama on developer machines and the AGM demo box. The 4–9× throughput gap at concurrency is the difference between Chaz feeling instant and Chaz timing out as the co-op grows.

3. **Buy the Strix Halo box first.** Before any new server gear, get the Framework Desktop on stage at the AGM. It is the single best physical artifact for the Good AI narrative and pays for itself in pitch credibility.

4. **Standardize one upcycled GPU recipe.** Recommendation: 2× used 3090 + 2× MI50 32 GB in a refurbished EPYC SP3 chassis. Document it as the "Lightweb Reference Node v1" so other bioregions can replicate. This is also the right artifact for partner orgs (SOS City Japan, Salt Spring DWeb folk) to clone.

5. **Track Kimi K2.6 and GLM-5.1 quarterly.** They are the two most likely models to displace Qwen/DeepSeek as the default. Set a calendar reminder for AGM+90d to re-evaluate.

6. **Publish the licensing audit.** A short page in the Lightweb Brain ("Models we run, licenses we run them under, where to read the originals") is both legally clean and exactly the kind of transparency artifact that distinguishes Good AI from the surveillance default.

7. **Power-limit GPUs by default.** 260 W on a 3090 gives back ~80% of the throughput for ~67% of the watts. This belongs in the standard `nvidia-smi` boot script across Liberty and in the Reference Node documentation.

8. **Watch the funding optics on Chinese-origin models.** Qwen and DeepSeek are technically excellent and openly licensed, but municipal grants, federal funding, or certain partnership contexts may surface concerns. Keep Gemma 4 (Apache 2.0) and Mistral Small 4 hot-swappable as fallbacks. The Lightweb's stance — *"we choose models on capability and license, not nationality"* — is defensible if it is articulated proactively.

---

## 8. Open questions to raise at the next working session

- **Voice as the magnetic core?** Qwen3.5-Omni's real-time speech I/O at 30B/3B is the most direct lever for a non-technical-member-friendly Chaz. Worth a dedicated session.
- **Mesh + edge AI.** Phi-4-mini / Qwen3-4B on Reticulum/LoRa nodes — does the federation extend to the edge as actual local-on-device inference, not just routing?
- **Member ↔ compute relationship.** Should higher-tier members get higher per-day token allowances, or should compute be pooled flat? The economic answer (pooled is cheaper) and the cooperative answer (flat is more on-brand) likely agree, but worth saying out loud.
- **Solar tie-in.** BC Hydro is already 98% renewable, but a small rooftop solar + battery layer at the Liberty colo site makes the Good AI story photographable — a worthwhile capex item in the $500K raise.
- **Failover.** What happens to Chaz if Liberty's GPU node fails? The Strix Halo box doubles as warm spare for ~40 light users — make that part of the architecture.

---

## Sources

### Qwen family
- [Qwen 3 GPU Requirements — Original Family (0.6B–235B) VRAM Guide (2026)](https://willitrunai.com/blog/qwen-3-gpu-requirements)
- [Best Qwen Models in 2026 — Alibaba's Open-Source AI Powerhouse](https://www.remoteopenclaw.com/blog/best-qwen-models-2026)
- [Best Qwen Models Ranked: Which to Run Locally (May 2026)](https://insiderllm.com/guides/qwen-models-guide/)
- [Qwen3 Complete Guide: Every Model from 0.6B to 235B](https://insiderllm.com/guides/qwen3-complete-guide/)
- [Qwen3.6-Max-Preview: Benchmarks, API & Review (2026)](https://www.buildfastwithai.com/blogs/qwen3-6-max-preview-review-2026)
- [How to Run Qwen 3.6 Locally: 27B Dense vs 35B MoE (2026 Guide)](https://codersera.com/blog/how-to-run-qwen-3-6-locally-2026/)
- [Qwen3-Omni GitHub](https://github.com/QwenLM/Qwen3-Omni)
- [Qwen/Qwen3-Omni-30B-A3B-Instruct · Hugging Face](https://huggingface.co/Qwen/Qwen3-Omni-30B-A3B-Instruct)
- [Deploy Qwen3.5-Omni on GPU Cloud (2026)](https://www.spheron.network/blog/deploy-qwen3-5-omni-gpu-cloud/)

### DeepSeek
- [DeepSeek R1 Local Deployment: Complete Guide 2026](https://www.sitepoint.com/deepseek-r1-local-deployment-guide-2026/)
- [DeepSeek R1 Local Setup: Ollama Guide and VRAM Requirements](https://localaimaster.com/blog/deepseek-r1-local-setup-guide)
- [Running DeepSeek V4 Locally: VRAM Estimates for Pro, Flash, and Base Versions](https://knightli.com/en/2026/05/01/deepseek-v4-local-vram-quantization-table/)
- [DeepSeek V3 Complete Guide: Deploy and Optimize Local AI in 2026](https://www.sitepoint.com/deepseek-v3-complete-guide-deploy-and-optimize-local-ai-in-2026/)
- [DeepSeek-R1 Hardware requirements discussion](https://huggingface.co/deepseek-ai/DeepSeek-R1/discussions/19)

### Newcomers and leaderboards
- [Artificial Analysis LLM Leaderboard](https://artificialanalysis.ai/leaderboards/models)
- [Best Open Source LLM in 2026: Rankings, Benchmarks, and the Models Worth Running (BenchLM)](https://benchlm.ai/blog/posts/best-open-source-llm)
- [Best Self-Hosted LLM Leaderboard 2026 (Onyx)](https://onyx.app/self-hosted-llm-leaderboard)
- [Best Open-Source LLM in May 2026: Llama 4 vs Qwen 3.5 vs DeepSeek V4 vs Gemma 4 vs Mistral Medium 3.5](https://codersera.com/blog/best-open-source-llm-2026-llama-4-qwen-3-5-deepseek-v4-gemma-4-mistral/)
- [Best Open-Source LLM Models in 2026 (Hugging Face)](https://huggingface.co/blog/daya-shankar/open-source-llms)

### Hardware — upcycled GPUs
- [Tesla P40 24GB New & Used Price — Updated May 2026 (GPUDojo)](https://gpudojo.com/tesla-p40)
- [Used Tesla P40 for Local AI: The $200 Budget Beast](https://insiderllm.com/guides/used-tesla-p40-local-ai/)
- [Used RTX 3090 for LLMs in 2026: Still King? (D-Central)](https://d-central.tech/used-rtx-3090-for-llms-2026/)
- [What the AI Boom Did to Used GPU Prices (2022–2026)](https://gpudojo.com/articles/used-gpu-prices-ai-boom)
- [AMD MI50 LLM Benchmark: The Budget VRAM King](https://www.ywian.com/blog/amd-mi50-llm-benchmark-the-budget-vram-king)
- [How to Choose the AMD Radeon Instinct MI50 for Local AI](https://electronics.alibaba.com/buyingguides/mi50-32gb-guide-is-it-worth-it-for-local-llms)
- [vLLM for AMD gfx906 GPUs (Radeon VII / MI50 / MI60) — GitHub fork](https://github.com/nlzy/vllm-gfx906)
- [Guidances for Test setup of 8 AMD MI50 32GB (LLM) — GitHub](https://github.com/ai-infos/guidances-setup-8-mi50-llm)

### Hardware — single-box flagships
- [Apple M3 Ultra Mac Studio: Run DeepSeek R1 671B in memory (TechRadar)](https://www.techradar.com/pro/apple-mac-studio-m3-ultra-workstation-can-run-deepseek-r1-671b-ai-model-entirely-in-memory-using-less-than-200w-reviewer-finds)
- [Apple Mac Studio with M3 Ultra Review: The Ultimate AI Developer Workstation](https://creativestrategies.com/mac-studio-m3-ultra-ai-workstation-review/)
- [AMD Ryzen AI Max+ 395 (Strix Halo) for Local AI 2026](https://localaimaster.com/blog/strix-halo-ai-max-395-guide)
- [AMD Strix Halo: Run 70B+ LLMs on 128GB Unified Memory (ToolHalla)](https://toolhalla.ai/blog/amd-strix-halo-local-llm-guide-2026)
- [Framework Desktop Review — Strix Halo (ServeTheHome)](https://www.servethehome.com/framework-desktop-review-a-solid-amd-strix-halo/)
- [Strix Halo, Unleashed: Real LLM Workflows on 128GB Ryzen AI Max+ 395](https://medium.com/@orami98/strix-halo-unleashed-real-llm-workflows-on-128gb-ryzen-ai-max-395-mini-pcs-and-laptops-5dabdd3fcae3)

### Hardware — server class
- [How to Build a Local LLM Server in 2026 (VRLA Tech)](https://vrlatech.com/how-to-build-a-local-llm-server-in-2026/)
- [Best GPU Server for LLM Inference in 2026 (VRLA Tech)](https://vrlatech.com/best-gpu-server-for-llm-inference-in-2026/)
- [How to Buy a Used AMD EPYC Server: Practical Guide](https://electronics.alibaba.com/buyingguides/used-amd-epyc-server-buying-guide)

### Serving stack
- [Ollama vs vLLM Throughput Benchmark 2026 (Markaicode)](https://markaicode.com/ollama-vs-vllm-performance/)
- [vLLM vs Ollama 2026: 9x Throughput Gap (Tech Insider)](https://tech-insider.org/vllm-vs-ollama-2026/)
- [vLLM vs Ollama vs LM Studio: 2026 Production Self-Host Benchmark (Codersera)](https://codersera.com/blog/vllm-vs-ollama-vs-lm-studio-production-2026/)
- [Ollama vs vLLM: A deep dive into performance benchmarking (Red Hat)](https://developers.redhat.com/articles/2025/08/08/ollama-vs-vllm-deep-dive-performance-benchmarking)

### Licensing
- [Apache License, Version 2.0](https://www.apache.org/licenses/LICENSE-2.0)
- [Open-Source vs Commercial LLMs: The Complete Guide (2026)](https://www.sitepoint.com/opensource-vs-commercial-llms-the-complete-guide-2026/)
- [open-llms — A list of open LLMs available for commercial use (eugeneyan / GitHub)](https://github.com/eugeneyan/open-llms)
- [What Is Gemma 4's Apache 2.0 License? Why It Matters More Than the Model Itself](https://www.mindstudio.ai/blog/gemma-4-apache-2-license-commercial-use)

### Power and cost basis
- [BC Hydro Electricity rates](https://app.bchydro.com/accounts-billing/rates-energy-use/electricity-rates.html)
- [BC Hydro Residential tiered rate](https://app.bchydro.com/accounts-billing/rates-energy-use/electricity-rates/residential-rates/tiered.html)
- [BC Hydro Rates 2026: Pricing, Increases & How to Save Money (Neobanc)](https://www.neobanc.com/articles/bc-hydro-rates)
- [Optimal power limit for deep learning tasks on RTX 3090](https://blog.qwertyforce.dev/posts/optimal_power_limit)
