---
sidebar_position: 2
title: OSS Tools to Extend the Lightweb
---

# Open Source Tools to Extend the Lightweb Ecosystem

*Research note for the Kootenay Lightweb Community Services Cooperative — May 2026. Companion to [Background](../background), [Technical Stack](../technical-stack), and [LLM Hosting](./llm-hosting-cost-infrastructure).*

## TL;DR

- **Stay with Keycloak.** Switching Identity Providers for a working 144-user stack is the highest avoidable risk in scope. Authentik is the right candidate to evaluate fresh at the Kaslo replication site, not to migrate Liberty into.
- **The brain has a real off-the-shelf candidate: Onyx (ex-Danswer, MIT).** Connector framework, per-source ACL sync, citations, hybrid search. Native Discourse connector ships; Nextcloud / Matrix / Gitea connectors must be written. Pair with **LiteLLM** as the single gateway in front of Ollama (+ vLLM later) and **Langfuse** for the "every prompt member-readable" requirement.
- **Avoid Open WebUI past v0.6.5.** Its post-2025 "Open WebUI License" is not OSI-open and breaks the "replication-ready template" goal. **LibreChat (MIT)** is the safer web-chat surface; Keycloak OIDC works today.
- **The magnetic core has a distinctively Lightweb shape that no single tool delivers.** The recommended combo: **Uluntu Marketplace + Karrot-style mutual-aid coordination + ValueFlows-modelled Postgres ledger + Credit Commons Protocol settlement + double-referral graph evaluated by Open Policy Agent + Loomio governance.** All AGPL-compatible, deliverable in ~12 weeks because the only new runtime is OPA.
- **Federation gets cheap wins fast.** Enabling `discourse-activity-pub` on the existing Discourse turns the forum into the co-op's federated voice with one plugin; **Mobilizon** for events and **PeerTube** for Chris McLeod's VLog are both Keycloak-OIDC-ready today. **Murmurations** is the right cross-bioregion discovery substrate — protocol exists, 7,000+ profiles live in early 2026.
- **Resilience is buildable now.** **Meshtastic + meshtastic-matrix-relay** gives a real off-grid story bridged to Matrix that can be demoed at the AGM. **Yjs + Hocuspocus** + **ElectricSQL** make Uluntu tolerate intermittent rural connectivity without rewriting the data layer.
- **The public scrolly site should be its own codebase.** **Astro + Starlight + GSAP/ScrollTrigger + Scrollama + Vidstack player + PeerTube backend** is the modern stack and matches Uluntu's TS/React skills. Keep Docusaurus for the internal handbook; do not entangle marketing pace with product pace.
- **License flags to take seriously**: HashiCorp Vault (BSL → use **OpenBao**), Outline (BSL → use **BookStack**), MinIO (community repo archived Feb 2026 → use **SeaweedFS** or **Garage**), n8n (Sustainable Use — fair-code, internal use OK), Open WebUI (custom license post-0.6.5), tldraw SDK (paid for production embed → use **Excalidraw**), Anytype (bespoke "Any Source Available"), Jina v3 embeddings (CC-BY-NC, disqualifies a registered co-op).

---

## 1. How to read this note

This is the synthesis of four parallel research streams (AI/brain, federated comms/identity, magnetic-core economy/governance, resilience/ops/storytelling). The structure below maps to the integration points already named in [Technical Stack §3](../technical-stack#3-ecosystem-integration-points). Each section gives:

- The **recommended primary tool(s)** and why
- The **integration touchpoint** in the existing Liberty stack
- The **first user-visible win**
- **Watch-outs** (license traps, abandonware risk, philosophical misalignment)

Conservatism bias: where the Lightweb already has a working service (Nextcloud, Matrix/Synapse, Keycloak, Gitea, Discourse), recommendations default to *extending* rather than *replacing*.

---

## 2. Identity & SSO (Technical Stack §3.1)

**Primary: Keep Keycloak 26. Evaluate Authentik (MIT) for Kaslo.**

Keycloak already integrates cleanly with Synapse, Nextcloud, Gitea, and Discourse in production via OIDC; Keycloak 26 added HTTP-Artifact SAML binding and OIDC back-channel logout that flows through to Synapse correctly. The switching cost (re-mapping 144+ Nextcloud users, re-issuing client secrets across six services, retraining admins) is high and the wins are marginal. **Authentik** is the right "second IdP" candidate when standing up Kaslo from scratch — its visual authentication-flow builder is genuinely easier for non-technical co-op admins, and it ships first-class integration guides for Nextcloud, Synapse, and Gitea.

| Also considered | Verdict |
|---|---|
| Zitadel | Switched to AGPL-3.0 in 2025 — copyleft inherits to anything built on top |
| Authelia | Forward-auth proxy, not a full IdP — wrong shape |
| Pocket-ID | Passkey-only — too narrow |
| ORY Kratos+Hydra | Library-quality; needs a dedicated identity engineer |

**Watch-out:** Authentik's enterprise directory (Google Workspace sync, mTLS, FIPS, audit retention) ships under a separate non-FOSS license — verify any feature you depend on is in the MIT tree before adopting.

---

## 3. The Lightweb Brain (Technical Stack §3.2)

This is the highest-leverage area of the entire scope. Four moving parts: the **RAG pipeline**, the **vector store**, the **document/audio ingestion**, and the **observability layer**.

### 3.1 RAG pipeline — Onyx (ex-Danswer)

**Primary: Onyx (MIT).** Closest off-the-shelf match to the brain as described in [Technical Stack §3.2](../technical-stack#32-the-lightweb-brain--knowledge-ingest--retrieval). 40+ connectors *including a native Discourse connector*; per-source ACL sync as a core design principle; pluggable LLM backend (Ollama via OpenAI-compatible interface); hybrid search + knowledge graph; citations baked in.

Connectors that don't exist upstream and must be written:
- **Nextcloud** (closed-as-"not planned" GitHub issue — own the work)
- **Matrix room history** (via Synapse admin API + an appservice)
- **Gitea** (REST is straightforward)
- **Uluntu entities** (Postgres logical replication)

| Also considered | Verdict |
|---|---|
| RAGFlow | Apache-2.0, very strong document understanding, native Ollama. "Upload-files-to-knowledge-base" rather than "ingest-live-systems." Strong runner-up. |
| Kotaemon | Apache-2.0, clean UI, MCP — no native connectors for this stack. |
| Khoj | AGPL-3.0; RAG over user files/GitHub/Notion, not the Liberty services. |
| Quivr | Pivoted toward hosted product; self-host quality declining. |
| Nextcloud Context Chat | **Does not honour File Access Control at retrieval** — disqualifies it as *the* brain. Fine as the Nextcloud-internal surface. |

**Critical correctness note:** Nextcloud Context Chat explicitly does not enforce File Access Control rules at answer time. For a co-op handling member-private files, this is a compliance hazard. The fix is enforcing ACL at the brain layer (Onyx's permission-sync model is the right pattern to copy), not relying on Context Chat.

### 3.2 Vector store — pgvector now, Qdrant escape hatch

**Primary: pgvector** inside the existing Liberty Postgres. One database to back up, one auth model, ACL joins in plain SQL. Switch to **Qdrant** (Rust, Apache-2.0) when the corpus passes ~2–3M vectors — likely once Matrix room history is ingested.

| Also considered | Verdict |
|---|---|
| Weaviate | Heavier JVM footprint, GraphQL learning curve — overkill |
| Milvus | Billion-scale design, operationally heavy for a 4-node cluster |
| Chroma | Easy start, less mature for production |
| LanceDB | Embedded/columnar, multi-process concurrency still limited |

### 3.3 Document & audio ingestion

**Primary doc parser: Docling (MIT, IBM Research, LF AI & Data Foundation).** Best-in-class OCR + table structure + reading-order in 2026, MIT-licensed, plugs into LangChain/LlamaIndex/Haystack. Pair with **Apache Tika** as the long-tail fallback for weird formats.

**Primary speech: Faster-Whisper (MIT) + WhisperX (BSD-4-Clause) + Pyannote (community-1, CC-BY-4.0).** Co-resident on the same GPU as a 7B Ollama model. Use **Distil-Whisper** when batch throughput matters more than the last 1% WER. Jitsi recording → ffmpeg extract → Faster-Whisper → text → Onyx is the pipeline (small n8n / cron glue script).

| Avoid | Why |
|---|---|
| Unstructured | README says "not designed for production"; VLM/fine-tuned OCR gated behind hosted |
| LlamaParse | SaaS only |

### 3.4 Embeddings & re-ranking

**Default: bge-m3 (MIT)** as embedding (multilingual matters for BC's francophone and Indigenous-language members; produces dense + sparse in one pass for hybrid search) + **bge-reranker-v2-m3 (MIT)** for the top-50 → top-10 step. Fall back to **nomic-embed-text (Apache-2.0, ~300MB)** on CPU-only nodes.

**Watch-out:** The reranker has no clean Ollama path — llama.cpp can't convert reranker architectures. Plan a small **Text Embeddings Inference (TEI)** or **Infinity** sidecar from day one.

**Avoid:** **Jina v3 embeddings are CC-BY-NC-4.0** — non-commercial only, disqualifies a registered co-op.

### 3.5 AI observability — Langfuse

**Primary: Langfuse (MIT).** Every prompt and response traced with full context, prompt versioning, evals, datasets. v3 moved storage to ClickHouse (which ClickHouse Inc. now stewards after acquiring Langfuse in Jan 2026; MIT core preserved). Delivers the "every prompt member-readable" requirement directly — wrap a thin Uluntu view that queries Langfuse's API filtered by the requesting member's ID.

| Also considered | Verdict |
|---|---|
| Phoenix (Arize) | Elastic-2.0 mix — source-available, not OSI-open on parts |
| Helicone OSS | Maintenance mode since March 2026 — do not pick |
| Lunary | Light, evaluation features minimal |
| OpenLLMetry | Instrumentation library, not a UI — use *with* Langfuse |

**Set `TELEMETRY_ENABLED=false`** in the Langfuse env.

---

## 4. AI Access Layer (Technical Stack §3.3)

### 4.1 Model gateway — LiteLLM Proxy

**Primary: LiteLLM Proxy (MIT).** Single endpoint for both Chaz and Uluntu (and a future LibreChat web surface). MIT OSS includes virtual keys, per-key/per-team/per-user budgets, RPM/TPM limits, cost tracking, admin UI, Ollama as a first-class provider. Behind LiteLLM, keep **Ollama** for now; add **vLLM** the day a model serves more than one concurrent user well (Ollama serializes, vLLM continuous-batches — see the [LLM Hosting note](./llm-hosting-cost-infrastructure) for the deeper analysis).

**Watch-outs:**
- LiteLLM's *Enterprise* tier gates SSO, JWT auth, and audit logs. For Lightweb, Keycloak sits in front and Langfuse alongside — don't pay for LiteLLM Enterprise.
- Confirm `LITELLM_TELEMETRY=False`.

### 4.2 Web chat surface — LibreChat (NOT Open WebUI)

**Primary: LibreChat (MIT).** True OIDC against Keycloak, LDAP, SAML, multi-provider routing with Ollama first-class, per-user model permissions, agents, MCP support. The non-Matrix chat surface for members who prefer a web UI.

**Open WebUI license trap:** v0.6.6+ ships under a custom "Open WebUI License" that is *not* OSI-approved — any deployment over 50 active users requires either paying or keeping mandatory branding intact, materially violating "replication-ready template." Pre-0.6.5 was BSD-3. LibreChat avoids the trap entirely.

### 4.3 Agent / workflow framework

**Primary: n8n (Sustainable Use License — fair-code, source-available, internal use OK) for orchestration + Flowise (Apache-2.0) for AI-specific visual flows.** This is the dominant 2026 self-host pattern. n8n has native nodes for Matrix, Nextcloud, Discourse, Gitea, and Ollama — enabling semi-technical stewards to wire "summarize last week's Matrix room into a Discourse weekly digest" without writing Python.

**Watch-out:** n8n's Sustainable Use License permits internal co-op use but blocks reselling n8n-powered services to external members-as-customers. For replication-ready bioregions, this constraint must be re-explained. **Activepieces** (MIT) is the cleaner fallback if the constraint bites later.

| Avoid for this stack | Why |
|---|---|
| Dify | Modified Apache-2.0 with additional conditions (no multi-tenant SaaS without commercial license) |
| AutoGen / CrewAI | Code-first, not for semi-technical stewards |

---

## 5. Magnetic Core — Economy, Trust, Governance (Technical Stack §3.4 & §3.5)

This is the strategic centre of the AGM ask. The synthesis answer:

> **The magnetic core is not a single app — it is the combination of `Uluntu Marketplace + Karrot-style coordination + ValueFlows-modelled Postgres ledger + Credit Commons Protocol settlement + double-referral graph evaluated by OPA + Loomio governance`. All AGPL-compatible, ~12 weeks to ship because the only new runtime is OPA.**

Each piece in turn:

### 5.1 The trust layer — double-referral graph in Postgres + Open Policy Agent

**Model the graph natively in Supabase/Postgres** (vouches as rows: `voucher_id, vouchee_id, context, weight, issued_at, expires_at, revoked_at`), and compute reputation server-side using a **personalised EigenTrust / PageRank** variant. Use **Open Policy Agent (Rego, Apache-2.0)** as the gating layer: every gated action ("can this member list in category X / get promoted in Matrix room Y / reach Discourse trust level 2") is a Rego rule that consumes the materialised reputation view.

This avoids tying Lightweb to a specific decentralised-identity stack and keeps the trust graph close to the data it gates.

| Considered and deferred | Why |
|---|---|
| Verifiable Credentials (Credo TS / walt.id) | Forces a wallet UX on members — premature for v1 magnetic core. **Revisit when federating trust signals to a second bioregion** — Credo TS is the right Aries successor (OpenWallet, Apache-2.0, aligned to EU eIDAS 2 from Sept 2026). |
| TrustNet (cblgh) | Best academic articulation of subjective transitive trust — use as **design reference for the propagation algorithm**, not as runtime. |
| Vouch (mitchellh) | Beautifully minimal schema worth copying — not a runtime for community-scale reputation. |
| Secure Scuttlebutt | Beautiful trust model, declining network (~200 active core users by 2021). Not a substrate to bet on. |
| OpenRank | Tightly coupled to Farcaster/crypto — ideologically misaligned. |
| Hyperledger Aries | Archived April 2025; successors live under OpenWallet — see Credo TS. |

### 5.2 The economy vocabulary — ValueFlows schema in Postgres

**Adopt ValueFlows (REA — Resource/Event/Agent) as the shared vocabulary for the "tangible + intangible capital" map.** Pilot the schema directly in Uluntu's Postgres mirroring `vf-graphql`; expose a GraphQL endpoint wire-compatible with hREA / Bonfire so future federation doesn't require a rewrite.

This means every Marketplace post, Karrot-style pickup, or skill offer becomes a ValueFlows Economic Event in the same ledger — the capital map *emerges from real activity* rather than from surveys.

| Considered | Verdict |
|---|---|
| Bonfire ValueFlows extension (AGPLv3) | Cleanest non-Holochain runtime. Pick this if Bonfire becomes a parallel surface (§7). |
| hREA on Holochain | Best ValueFlows code; pulls in full Holochain stack. **Consume the schema, not the runtime, in 2026.** |
| Reflow OS / ZenPub (Dyne) | EU-funded, circular-economy urban material flows; good case study, heavy. |

### 5.3 Coordination primitives — patterns from Karrot

**Karrot (AGPLv3, by Foodsaving Worldwide, active on Codeberg, v17.3.0 March 2026)** has the mutual-aid coordination primitives Uluntu Marketplace lacks: pickups, places, groups-with-roles, activity-history, conflict resolution. Lift these patterns (and where licensing permits, the schemas) into Uluntu.

| Considered | Verdict |
|---|---|
| Open Food Network (AGPL, very active) | Best-in-class for food-producer-to-buyer commerce. **Integrate later as a federated food-hub backend** rather than rebuild it. |
| Sharetribe Go | Now source-available, not OSS — flag and avoid as a starting point. |
| Hylo (Apache-2.0) | Active 2025 redesign — better as a *parallel network surface* than a coordination engine. |

### 5.4 Settlement — Credit Commons Protocol + Cyclos bootstrap

**Credit Commons Protocol (CCP, GPL reference impl at demo.creditcommons.net)** as the ledger primitive: the only protocol designed for *recursively nested* trading blocs — exactly the federated "individual → group → community → regional" framing. **Cyclos 4 Communities** as the member-facing wallet for v1 (free hosted, gets a working LETS/timebank live in days while a CCP-native Uluntu wallet is built).

| Considered and avoided | Why |
|---|---|
| Cyclos 3 (GPLv2) | Last meaningful release ~2012 |
| MCCS / mccs-alpha | Archived Dec 2024 |
| Geyser (Bitcoin Lightning) | Against the anti-speculation stance |
| Trustlines / FairCoin | Low activity, ideological mismatch |
| Holochain mutual-credit hApps | Alpha/PoC — see §7 |

### 5.5 Governance & participatory finance — Loomio + Open Collective + Cobudget

- **Loomio (AGPLv3)** — itself a worker-owned coop in Aotearoa NZ; ideological alignment is exact. SAML to Keycloak works today (OIDC on roadmap). For proposal → discussion → consent → recorded outcome.
- **Open Collective** (now governed by the new Open Finance Consortium / OFiCo nonprofit since late 2024) for transparent custody of the $500K raise.
- **Cobudget (AGPLv3-or-later)** for participatory bucket-style allocation rounds.
- **Decidim (AGPLv3)** — defer to Phase 2 for *bioregional* participatory democracy beyond the co-op. `Platoniq/decidim-module-keycloak` exists.

### 5.6 Skill / time exchange — TimeOverflow

**TimeOverflow (AGPLv3, Coopdevs cooperative, 62 releases)** as the time-bank engine, federated via Murmurations. Same Postgres substrate as Uluntu; built by a worker co-op.

### 5.7 Member CRM — CiviCRM + Monica

- **CiviCRM (AGPLv3, 14,000+ nonprofits)** for formal membership/donations/AGM/partner orgs — federated to Keycloak via SAML/OIDC.
- **Monica (AGPLv3)** as the *private* relational notebook for the community organizer ("who knows whom, who introduced whom"). Explicitly framed as a single-user cheat sheet, not a community feature.

Don't try to model "spiritual depth" as structured CRM fields — keep those as free-form notes against entities.

### 5.8 The 12-week magnetic-core shape

| Weeks | Work |
|---|---|
| 1–2 | Postgres vouch + reputation tables; OPA sidecar; basic vouching UI in Uluntu |
| 3–6 | Karrot-style pickup/place/role coordination in Uluntu Marketplace; emit ValueFlows events |
| 7–9 | Stand up a CCP reference ledger; wire Marketplace listings to optional credit settlement |
| 10–11 | Plug Loomio into Keycloak; use it for one real AGM-prep decision |
| 12 | Trust-gated launch to existing 144 Nextcloud users with a "vouch a friend" CTA |

Why this beats each magnetic-core candidate alone:
- **Co-op-owned local AI alone** is impressive but not weekly-habit-forming for non-technical members.
- **Marketplace alone** is a Facebook replica without a story; the *trust gate* and the *credits* are what make it Lightweb-shaped.
- **Skill/barter alone** loses the goods half of the local economy and bores power-users after onboarding.
- **Currency/wallet alone** is a solution looking for transactions.
- **Connection layer alone** duplicates Matrix and Discourse.

The combo is distinctively Lightweb because entry is *vouched, not signed-up*; every action is a ValueFlows event in the same ledger; settlement happens in *local trust*, not CAD; and governance runs through Loomio under the same Keycloak identity. Members get one weekly habit: *post an offer, fulfill a pickup, give a vouch.* Friends get told: *you can't browse it from outside — get vouched in.* That is the magnetic-core narrative.

---

## 6. Federated Outward Voice (extends Technical Stack §3.6)

The replication framework already named in §3.6 only covers Lightweb-to-Lightweb federation. The fediverse picks up the rest.

### 6.1 The single biggest lever — `discourse-activity-pub`

**Enable the official `discourse-activity-pub` plugin on the existing Discourse.** Bidirectional federation, supports announcement and discussion modes, per-category federation control. *Lowest-churn, highest-leverage move in the entire scope* — the existing forum becomes the co-op's federated voice with one plugin.

Watch-out: design categories so public-federated ones are clearly distinct from members-only ones, or you'll leak.

### 6.2 Microblog presence — GoToSocial

**GoToSocial (AGPL-3.0)** at `social.koots.net` for `@lightweb@social.koots.net`. ~500MB RAM single Go binary (vs. ~2GB Mastodon stack), explicitly designed for small specialist instances. OIDC against Keycloak works today.

Watch-out: still labelled BETA; treat the Mastodon API surface as the stable contract.

### 6.3 VLog — PeerTube + Vidstack player

**PeerTube 8.x (AGPL-3.0)** at `videos.koots.net` for Chris McLeod's training VLog. The official `peertube-plugin-auth-openid-connect` authenticates against Keycloak today — viewers sign in with their Lightweb identity, comments federate to Mastodon/Friendica, and the videos themselves federate to other PeerTube subscribers.

**Pin to ≥8.1.8** — 8.1.6 patched a critical SQL injection actively exploited since May 18 2026.

Embed via **Vidstack Player (MIT)** in the public scrolly site rather than the default PeerTube iframe. Vidstack is the explicit successor to Plyr 3.x and merging with Plyr + Media Chrome into Video.js v10 (Mux, GA mid-2026) — healthy trajectory, React-friendly.

### 6.4 Federated events — Mobilizon

**Mobilizon (AGPL-3.0)** at `events.koots.net` for Lightweb Days, bi-monthly meetups, Ethical AI workshops, Vibecoding sessions. Maintenance transferred from Framasoft to French non-profit Kaihuri in 2024 with NLnet funding; April 2026 update confirms the project is alive. Federates events to Mastodon/Pleroma/Friendica/Gancio. Outputs iCal feeds — Nextcloud Calendar subscribes as a remote iCal URL.

Watch-out: ActivityPub `Update` activities aren't honoured by Mastodon — editing an event after publishing won't reflect downstream. Treat Mobilizon as the source of truth.

### 6.5 Audio / podcast — Castopod

**Castopod (AGPL-3.0)** for podcast/audio. Only podcast host that combines Podcasting 2.0 chapters/transcripts/value4value with native ActivityPub. OIDC is via standard OAuth proxy rather than first-class — plan an oauth2-proxy sidecar.

### 6.6 Cross-bioregion discovery — Murmurations

**Adopt Murmurations as the cross-bioregion discovery substrate.** Publish a Lightweb node profile, then bioregion-level "Organisation" and "Offers/Wants" profiles per working group. The protocol is JSON-Schema + JSON-LD over a public index; the schema library already covers `organizations`, `people`, `offers_wants`, `groups`, `complementary_currencies`, and `permaculture_addon` — the regenerative/cooperative economy is its core audience. The **CoBot AI search** (launched March 2026 over ~7,000 profiles) is proof the network is live.

**Opportunity:** No "bioregion" schema exists yet — propose one. Lightweb is the right co-op to define it.

Watch-out: never put member PII into Murmurations profiles — only organisational data.

### 6.7 Federation policy — FIRES + IFTAS

**Adopt FIRES (Fediverse Intelligence Replication Endpoint Server) as the moderation-advisory feed**, plus **IFTAS DNI** baseline, applied to GoToSocial federation policy and Matrix Draupnir ban-lists. The Oliphant Unified Tier 0 list was retired April 15 2026 in favour of FIRES-centric advisories.

Co-op-shaped framing: advisories the moderation committee *reviews and consents to* — not opaque external blocklists. This maps directly onto the federated-scale frame.

Watch-out: FIRES is pre-1.0; expect schema churn through 2026.

### 6.8 Matrix-side improvements

- **Element Call + LiveKit (AGPL-3.0 / Apache-2.0)** alongside Jitsi — E2EE Matrix-native group video for member-only sessions. Keep Jitsi for "share a link, no account" one-shots.
- **Hookshot (Apache-2.0)** for Gitea/GitLab/GitHub/Jira webhooks into Matrix ops rooms.
- **mautrix-signal / -whatsapp / -telegram / -discord** for member-where-they-are bridges.
- **Continuwuity** (community fork of the abandoned Conduwuit) — Rust single-binary Matrix homeserver worth piloting at the **Kaslo replication instance**. Do **not** migrate Liberty's working Synapse — migration paths are painful and Synapse is fine.

---

## 7. Considered as Magnetic-Core Alternatives — Deferred

### 7.1 Bonfire Networks

**Watch closely, deploy in parallel for federation experiments, do NOT make it the magnetic core in 2026.** Bonfire Social hit a 1.0 release candidate; Community and other flavours remain alpha/beta. The `bonfire_valueflows` extension is the cleanest non-Holochain ValueFlows runtime that exists, AGPLv3. Elixir/Phoenix is fine but separate from Uluntu's React/Supabase. The team is small — bus factor is real. Revisit at 1.0.

### 7.2 Holochain & post-blockchain stacks

**Do not put Holochain on the magnetic-core critical path in 2026.** 140+ repos surveyed; every major hApp self-identifies as alpha/beta. hREA is at `happ-0.3.4-beta` (Dec 2025). For Lightweb's local-resilience-first framing on Liberty, Postgres on the cluster is the right answer for v1. **Pull Holochain in only for the *between-bioregions* mutual-credit story** when at least two live regions exist to federate.

HOT/HoloFuel has a token-listed side that will keep coming up — be explicit with members about why Lightweb is *not* doing crypto.

---

## 8. Resilience Layer (Technical Stack §3.7)

### 8.1 Mesh & off-grid — Meshtastic + Reticulum + MMRelay

**Primary: Meshtastic (GPL-3.0)** as the deployable LoRa mesh for Kootenay geography paired with **Reticulum (RNS, MIT/Reticulum License, v1.3.4 May 2026)** as the higher-trust crypto-routed overlay running on top of LoRa. Bridge to Matrix via **meshtastic-matrix-relay (MMRelay)** — actively maintained, supports BLE/serial/network nodes, runs as a k8s deployment next to Synapse. **Sideband (RNS)** is the Android/desktop client for store-and-forward LXMF messaging that survives full IP outage.

This makes the philosophy demoable: a "Kootenay mesh" Matrix room that echoes LoRa traffic at the AGM.

Sober watch-outs:
- Mesh is hobbyist-scale outside enthusiast pockets — coverage requires physically deploying and maintaining repeater nodes (Heltec V3 / T-Beam / RAK WisMesh) on rooftops or ridgelines. Don't promise coverage you haven't built.
- 915 MHz ISM is line-of-sight-ish in the Kootenays' valleys — plan repeaters now.
- LoRa bandwidth is tiny (~kbps). Plain text only.
- Briar (GPLv3) is Android-only; Berty is semi-dormant; Cwtch needs IP. Meshtastic + Reticulum is the realistic stack.

### 8.2 Local-first sync & CRDT — Yjs + Hocuspocus + ElectricSQL

**Yjs (MIT) + Hocuspocus (MIT, v4 2025, Postgres persistence)** for collaborative editing in Uluntu and brain content. **ElectricSQL (Apache-2.0)** for queued offline writes synced via Postgres logical replication — cleaner license fit than PowerSync (FSL, source-available) and explicitly Postgres-native.

| Avoid | Why |
|---|---|
| Replicache | Source-available + $500/mo over 1k users |
| PowerSync server | FSL — source-available |
| Triplit | Acquired by Supabase 2025, trajectory uncertain |

Don't introduce CRDTs unless there's genuine multi-writer editing — most "offline" Uluntu needs are queued writes (ElectricSQL or even IndexedDB + outbox).

### 8.3 Offline PWA — vite-plugin-pwa

**vite-plugin-pwa (MIT, wraps Workbox)** — single-package add for Uluntu's existing Vite stack. Pair with Workbox runtime strategies (stale-while-revalidate for Supabase reads, network-first for auth, cache-first for static assets). Test on real rural Kootenay 1-bar LTE, not on cluster Wi-Fi.

---

## 9. Cluster Operations (Technical Stack §3.8)

### 9.1 GitOps — ArgoCD

**Primary: ArgoCD (Apache-2.0).** Web UI gives non-platform-engineer co-op tech volunteers a visible sync/diff/log view; that visibility is worth the ~2GB memory overhead on a 4-node cluster. **Coolify, Dokploy, Komodo are all disqualified** for cluster work — Coolify explicitly said no to Kubernetes, Dokploy is Docker Swarm, Komodo is multi-server but not k8s-native. **FluxCD** is the reasonable lighter fallback if memory becomes tight.

Pin ArgoCD to a control-plane node and watch memory.

### 9.2 Secrets — SOPS + age + ESO; OpenBao when needed; Vaultwarden for humans

- **Machine/cluster secrets:** **SOPS + age (MPL-2.0)** committed to Gitea, decrypted by **External Secrets Operator (Apache-2.0)** or Flux/Argo SOPS plugin. No Vault-class service required for a 4-node cluster.
- **Human/member secrets:** **Vaultwarden (GPLv3)** — almost certainly already deployed; if not, obvious add.
- **When API-driven secret broker is needed later:** **OpenBao (MPL-2.0)** — Vault fork under Linux Foundation, IBM contributors, v2.5.0 Feb 2026. **NOT HashiCorp Vault**, which moved to BSL 1.1 in 2023.

Write a clear "if the SOPS key holder's laptop dies, here's how to recover" runbook.

### 9.3 Observability — VictoriaMetrics + Grafana + Loki + Beszel + Gatus

**Lean stack:** VictoriaMetrics (replaces Prometheus storage at a fraction of the RAM), Grafana, Loki. **Beszel (MIT)** for per-host glance, **Gatus (Apache-2.0)** for external uptime — YAML-config fits GitOps. Skip Tempo until distributed tracing is a real ask.

Hard rule: 5 dashboards, 10 alerts, no more, until someone complains. Loki retention aggressive (7-14 days hot, dump to S3-compat for cold).

| Considered | Verdict |
|---|---|
| SigNoz / OpenObserve | Unified, but heavier and trace-centric — not what day-one needs |
| Uptime Kuma | Friendlier UI, stateful, not GitOps-native |

### 9.4 Backups & DR — Velero + Kopia + Garage/SeaweedFS

**Velero (Apache-2.0) + Kopia** (default in Velero 1.12, ~4× faster to S3-compat than Restic) for k8s workload + PV backups. Proxmox Backup Server for VM-level. For the off-cluster encrypted target:

- **Garage (AGPL-3.0, by Deuxfleurs)** — purpose-built for geo-distributed self-hosting across unreliable hardware. Aligned to the bioregional replication story; clustering needs ≥3 nodes to be useful.
- **SeaweedFS (Apache-2.0)** — the production-ready **MinIO replacement** now that MinIO's community repo is archived (Feb 2026, no further security patches).

Off-site target must be verified-restorable. Quarterly restore drill.

---

## 10. Knowledge Capture Surface (feeds the Brain in §3)

The brain needs something to ingest. The co-op needs places to *write*.

### 10.1 Co-op wiki — BookStack

**Primary: BookStack (MIT).** Shelves → Books → Chapters → Pages maps naturally to "co-op → working group → topic → note." SAML/LDAP into Keycloak. Two-container deploy. Maintained primarily by one developer (Dan Brown) — stable for years but single-person bus factor; acceptable for the co-op's scale.

| Considered | Verdict |
|---|---|
| Outline | **BSL 1.1, not OSI-open** |
| Wiki.js | AGPL-3.0; v3 has been long-delayed |
| AppFlowy / AFFiNE | Beautiful Notion-likes; not as battle-tested |
| SiYuan / Trilium / TriliumNext | Single-user-shaped or maturing |
| Joplin Server | Fine; Logseq's graph fits intangible-capital better |

### 10.2 Personal second-brain + public garden — Logseq + Quartz

**Logseq (AGPL-3.0)** as the personal relational-notes tool — block-level backlinks, graph view, queries over markdown files that live on Nextcloud where the brain ingests them. **Quartz v4 (MIT)** to publish curated subsets as a public "digital garden" — the natural form for the "Lightweb intangible-capital map" of relational networks, trust, culture.

One capture flow, two surfaces: private graph for members, curated public garden for storytelling.

Logseq is mid-pivot to the DB version; file-based still works but read release notes before locking in workflows.

| Considered and avoided | Why |
|---|---|
| Anytype | Bespoke "Any Source Available License" — verify before adopting |
| Tana / Capacities / TheBrain | SaaS / proprietary |
| Athens Research | Effectively dead since 2023 |

### 10.3 Zero-knowledge document collaboration — CryptPad

**CryptPad (AGPL-3.0)** as a sibling to Nextcloud Office for the explicit zero-knowledge case (board strategy, sensitive partner negotiations, member personal data). Don't fragment the document surface — default everyone to Nextcloud, add CryptPad only for the explicit case.

### 10.4 Nextcloud-native AI — Assistant + Context Chat

**Use Nextcloud Assistant + Context Chat for the "ask my files" use case only — do NOT make it the Lightweb Brain.** Three documented limits disqualify it as *the* brain: (1) Context Chat does not honour File Access Control at retrieval; (2) ExApps cap at ~1,000 requests/hour per instance; (3) it indexes only Nextcloud files. Treat it as the Nextcloud-files surface; route everything else through the Onyx-based brain.

---

## 11. Public Storytelling Site

### 11.1 The site stack — Astro Starlight + GSAP + Scrollama + Vidstack

The public scrolly-telling lightweb.koots.net **should be a separate codebase from Uluntu and from Docusaurus**:

- **Astro + Starlight (MIT)** — zero JS by default (matters for rural-Kootenay bandwidth), React islands for the scrolly moments, Starlight covers companion docs cleanly.
- **GSAP + ScrollTrigger** — now 100% free for commercial use since April 30 2025 (Webflow acquired GreenSock, removed the paywall, all premium plugins included). The modern scrollytelling animation engine.
- **Scrollama (ISC)** — Russell Goldenberg's React-friendly step-indexing layer (the one The Pudding uses).
- **Vidstack Player (MIT)** — embed PeerTube HLS streams with the co-op's own brand chrome rather than the default iframe.

Heavy scroll animations tank on rural mid-range Android — test on real hardware. Respect `prefers-reduced-motion`.

Keep **Docusaurus** for the internal handbook (already in use at the right version). Do not entangle marketing pace with product pace.

### 11.2 Analytics — Plausible CE (or Umami)

**Plausible Community Edition (MIT — verified, not AGPL as sometimes reported)** for the scrolly site and Uluntu. No cookie banner needed; dashboards co-op members can actually read. Single ClickHouse + Postgres deploy.

There has been community concern through 2025 about Plausible's long-term commitment to CE vs. cloud — keep schemas agnostic so the migration path to **Umami (MIT)** stays short.

| Considered | Verdict |
|---|---|
| PostHog | MIT core + separate EE license — use for Uluntu product work, not the public site |
| Matomo | GPLv3, heaviest, GDPR baggage — overkill |
| GoatCounter | Lovely, smaller community |
| Fathom | SaaS only |

### 11.3 Brand & design tooling — Penpot + Inkscape + GIMP + Excalidraw

**Penpot (MPL-2.0)** as the Figma replacement — production-ready in 2026, self-hostable on Liberty, SVG/CSS/HTML native. Pair with Inkscape (GPLv3) for vector, GIMP/Krita (GPLv3) for raster, Excalidraw (MIT) for whiteboarding/UI sketches in workshops with non-technical members.

**Avoid the tldraw SDK** for production embedding — source-available, paid (~$6k/yr). Excalidraw covers the use case.

---

## 12. Cross-cutting License Flags

| Tool | Status | Use instead |
|---|---|---|
| HashiCorp Vault | BSL 1.1 since Aug 2023 — not OSI-open | **OpenBao** |
| Outline | BSL 1.1 — not OSI-open | **BookStack** |
| MinIO | AGPL-3.0 + community repo archived Feb 2026 | **SeaweedFS** or **Garage** |
| Open WebUI (≥0.6.6) | Custom "Open WebUI License" — not OSI-open | **LibreChat** |
| Sharetribe Go | Source-available since 2025 | **Karrot patterns + Uluntu** |
| Replicache | Source-available + paid >1k users | **ElectricSQL** |
| tldraw SDK (production) | Source-available, paid | **Excalidraw** |
| Anytype | Bespoke "Any Source Available License" | **Logseq** |
| Jina v3 embeddings | CC-BY-NC-4.0 — non-commercial only | **bge-m3** |
| PowerSync server | FSL — source-available | **ElectricSQL** |
| Helicone OSS | Maintenance mode since March 2026 | **Langfuse** |
| Phoenix (Arize) | Elastic-2.0 on parts | **Langfuse** |
| Hyperledger Aries (umbrella) | Archived April 2025 | **Credo TS (OpenWallet)** |
| n8n | Sustainable Use — fair-code, internal use OK | **Activepieces** (MIT) if constraint bites |
| Dify | Modified Apache-2.0 with conditions | **n8n + Flowise** |
| Zitadel | AGPL-3.0 since 2025 (copyleft inherits) | **Keycloak / Authentik (MIT core)** |

---

## 13. Adoption Sequence — mapped to Technical Stack §4

This extends the phasing already in [Technical Stack §4](../technical-stack#4-integration-sequence-proposed).

### Phase 0 — Decide (pre-AGM)

- Confirm: keep Keycloak; Onyx for the brain; LiteLLM + Langfuse for AI access; LibreChat as web chat surface; magnetic-core combo (§5).
- Confirm: governance pieces — Loomio + Open Collective for the raise.
- Avoid: Open WebUI ≥0.6.6, Vault, Outline, MinIO, n8n if you intend to resell-as-service, Holochain on critical path.

### Phase 1 — Lightweb-ify (4–8 weeks post-AGM)

- Identity coverage audit (Keycloak in front of every service).
- LiteLLM proxy in front of Ollama; LibreChat at `chat.koots.net`.
- Langfuse deployed; wire Chaz + LibreChat through.
- Self-host Supabase on Liberty.
- Brand migration on Uluntu.
- **Quick fediverse win**: enable `discourse-activity-pub` on the existing Discourse.

### Phase 2 — Bridge the stack (8–16 weeks)

- Brain v1: Onyx + pgvector + Docling + Faster-Whisper + bge-m3 + bge-reranker (+ TEI sidecar).
- Write the Nextcloud, Matrix, Gitea, Uluntu connectors for Onyx.
- Magnetic-core 12-week shape (§5.8): vouch graph + OPA → Karrot coordination + ValueFlows events → CCP wallet → Loomio at AGM.
- Cluster ops: ArgoCD, SOPS+age+ESO, Velero+Kopia, VictoriaMetrics+Grafana+Loki+Beszel+Gatus.

### Phase 3 — Public face (12–20 weeks)

- New scrolly-telling site at `lightweb.koots.net` on Astro + GSAP + Scrollama + Vidstack with McLeod's VLog embedded.
- PeerTube at `videos.koots.net`, Mobilizon at `events.koots.net`, GoToSocial at `social.koots.net`.
- Murmurations profile published; CoBot index entry.
- Plausible CE deployed.

### Phase 4 — Replicate (Kaslo + beyond)

- Authentik tested at Kaslo (cleaner UX for non-technical admins) — keep Keycloak at Liberty.
- Continuwuity Matrix homeserver pilot at Kaslo.
- Garage cluster across Liberty + Kaslo for off-site encrypted backup.
- Bonfire 1.0 evaluation as a parallel federation surface.
- Credo TS pilot for cross-bioregion verifiable vouching credentials.

### Parallel throughout

- Meshtastic + Reticulum + MMRelay nodes at 2–3 member sites; AGM-demoable mesh-into-Matrix room.
- BookStack + Logseq + Quartz for the knowledge surface that feeds the brain.
- FIRES + IFTAS DNI feeds reviewed by the moderation committee.

---

## 14. Top 12 picks across the whole scope

| # | Tool | Why it earns top-12 | Touchpoint | License |
|---|---|---|---|---|
| 1 | **Onyx (Danswer)** | Off-the-shelf brain matching the Lightweb's exact requirements | Ollama via LiteLLM; native Discourse; custom Nextcloud/Matrix/Gitea | MIT |
| 2 | **LiteLLM Proxy** | One AI endpoint, per-member quotas, audit hooks | Between every client and Ollama / future vLLM | MIT |
| 3 | **Langfuse** | Delivers "every prompt member-readable" | Wraps LiteLLM via OpenTelemetry | MIT |
| 4 | **`discourse-activity-pub`** | Federates the existing forum with one plugin — highest leverage in scope | Existing Discourse | MIT |
| 5 | **Murmurations** | The cross-bioregion discovery substrate that actually exists | JSON profile from website CI | GPL-3.0 |
| 6 | **Loomio** | Worker-coop-built governance with Keycloak SAML today | Co-op proposals; AGM | AGPLv3 |
| 7 | **Karrot + Open Policy Agent + ValueFlows schema** | The trust-coordination-economy spine that makes the magnetic core Lightweb-shaped | Uluntu Marketplace; OPA sidecar | AGPLv3 / Apache-2.0 |
| 8 | **Mobilizon + PeerTube + Vidstack** | The federated public face — events, video, embeddable VLog | Keycloak OIDC; scrolly site | AGPL-3.0 / AGPL-3.0 / MIT |
| 9 | **LibreChat** | Non-Matrix web chat surface, real Keycloak OIDC, no license trap | LiteLLM; Keycloak | MIT |
| 10 | **BookStack + Logseq + Quartz** | The knowledge capture surface that feeds the brain — and the public garden | Nextcloud folders; brain ingest; static publish | MIT / AGPL-3.0 / MIT |
| 11 | **Meshtastic + MMRelay + Reticulum/Sideband** | Real off-grid story bridged to Matrix; AGM-demoable resilience | MMRelay → Synapse | GPL-3.0 / MIT |
| 12 | **Astro + GSAP + Scrollama + Plausible CE + Penpot** | The whole public-storytelling production line off SaaS | Public site at lightweb.koots.net | MIT / GSAP Std (free) / ISC / MIT / MPL-2.0 |

---

## 15. What this note is not

- **Not a procurement decision.** Tools listed are research-grade recommendations; each adoption needs a tech-stewards review, a maintenance owner, and a backup plan.
- **Not a hardware analysis.** See [LLM Hosting](./llm-hosting-cost-infrastructure) for the GPU / EPYC story.
- **Not a complete federation strategy.** Federation policy is a governance decision (who Lightweb federates with, who Lightweb blocks). The FIRES + IFTAS posture in §6.7 is a starting point, not a final answer.
- **Not a security review.** Several tools (PeerTube, Continuwuity) need to be patched against active 2026 CVEs before exposure.
