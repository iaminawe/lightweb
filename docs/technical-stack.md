---
sidebar_position: 2
title: Technical Stack
---

# Kootenay Lightweb — Technical Stack & Ecosystem Integration

*Companion to [Background](./background) and [Uluntu and the Roadmap](./uluntu-roadmap-fit). Captures the production stack as it exists today on Liberty, the application layer in flight (Uluntu), and the integration points required to turn a set of well-run services into one coherent **Lightweb ecosystem**.*

The brief is shaped by the philosophical frame in [Background](./background) — sovereignty on co-op hardware, opt-in Good AI, offline-first connection, replication-ready architecture. Where a more conventional integration choice would violate that frame, the document calls it out rather than smoothing it over.

---

## 1. Stack at a Glance

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         Public surface                                      │
│  lightweb.koots.net  ·  Uluntu (planned magnetic core)  ·  Substack/social  │
└──────────────────────────────┬──────────────────────────────────────────────┘
                               │
┌──────────────────────────────┴──────────────────────────────────────────────┐
│                      Application & collaboration                            │
│  Nextcloud (144+ users) · Matrix/Synapse · Jitsi · Gitea · Discourse · Mail │
└──────────────────────────────┬──────────────────────────────────────────────┘
                               │
┌──────────────────────────────┴──────────────────────────────────────────────┐
│                      Identity & AI                                          │
│  Keycloak (SSO)  ·  Ollama (local LLMs)  ·  Chaz (Matrix-facing AI agent)   │
└──────────────────────────────┬──────────────────────────────────────────────┘
                               │
┌──────────────────────────────┴──────────────────────────────────────────────┐
│                      Liberty cluster                                        │
│  Proxmox virtualisation  ·  Ceph storage  ·  Kubernetes orchestration       │
│  Nodes: alberdi · garrison · mill · spencer                                 │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Current Infrastructure

### 2.1 Liberty cluster — the substrate

| Layer | Technology | Notes |
|---|---|---|
| Hardware | 4 physical nodes — `alberdi`, `garrison`, `mill`, `spencer` | Co-op owned. Kaslo expansion funded by the closed Visionary Fund crowdfund ($8,785 CAD, 80 contributors, 103% of goal). |
| Virtualisation | Proxmox VE | Hypervisor layer across the four nodes. |
| Storage | Ceph | Distributed block / object / file storage, co-located on the same nodes. |
| Orchestration | Kubernetes | Hosts the service stack listed below. |
| Network egress | koots.net domain | Public services published under `*.koots.net` and `lightweb.koots.net`. |

This is the sovereignty boundary. Everything in §2.2–§2.4 runs on it; everything in §3 has to integrate *into* it rather than around it.

### 2.2 Collaboration & community services

| Service | Role | User-facing reality |
|---|---|---|
| **Nextcloud** | Files, calendars, contacts, collaborative editing | 144+ active members — the largest installed user base on the cluster and the de facto member identity surface today. |
| **Matrix / Synapse** | Real-time chat, federated messaging | Primary conversational substrate. Also the interface surface for the AI layer (Chaz). |
| **Jitsi** | Video meetings | Self-hosted alternative to Zoom / Meet. |
| **Gitea** | Git hosting, code review, issues | Holds source for cooperative tooling. |
| **Discourse** | Long-form discussion, structured community forum | Complements Matrix (sync) with persistent threaded conversation. |
| **Mail (koots.net)** | Co-op-owned email | Member identity at the SMTP layer. |

### 2.3 Identity & access

| Component | Role | Current state |
|---|---|---|
| **Keycloak** | OIDC / SAML SSO provider | Already deployed. Intended as the single identity authority across the stack. Per `uluntu-roadmap-fit.md`, integration coverage is incomplete — Uluntu in particular ships with Supabase Auth and would need to federate to Keycloak. |

### 2.4 AI layer

| Component | Role | Current state |
|---|---|---|
| **Ollama** | Local LLM runtime on co-op hardware | The substrate of "Good AI" — community-owned, opt-in, no third-party inference calls. |
| **Chaz** | Matrix-resident AI agent / interface | The conversational front door to Ollama for members. Sits inside Matrix so a member can talk to the Lightweb in the same place they talk to each other. |

### 2.5 Public-facing surface

- **`lightweb.koots.net`** — the current public site (to be reshaped into the scrolly-telling experience described in agenda §5).
- **Substack, Bluesky, Instagram, YouTube, X, Telegram, Facebook** — outbound presence; not part of the sovereign stack, treated as broadcast channels only.

### 2.6 Candidate magnetic-core application — Uluntu

Per `uluntu-roadmap-fit.md`, Uluntu is the working candidate for the flagship application that members touch every week. It is **not yet integrated into Liberty** — it currently assumes managed Supabase and OpenAI. The integration work is captured in §3.

| Layer | Technology |
|---|---|
| Frontend | React 18, TypeScript 5.5, Vite 5, Tailwind |
| State | React Query (server) + Redux Toolkit (UI) + Context (settings/theme) |
| Backend | Supabase (Postgres + Auth + Storage + Realtime), Row-Level Security |
| Editor | BlockNote (TipTap) with AI hooks |
| Email | Resend |
| Tests | Jest, RTL, Playwright |
| Deploy targets | Netlify / Vercel / Docker / Railway / Cloudflare / Coolify |

Feature surface already in place: Member Directory, Companies, Events, Groups (public/private/secret), News, Galleries, Marketplace, Opportunities, Resources, Newsletter, Realtime Messaging, AI-enhanced editor, three-level permissions, multi-tenant architecture.

---

## 3. Ecosystem Integration Points

This is the work that turns "a cluster running good services" into **the Lightweb** — a coherent fabric where identity, knowledge, AI, and trust flow across the parts. Each integration point below is a real piece of engineering with a real owner; the order is opinionated but not fixed.

### 3.1 Unified Identity — Keycloak as the single front door

**Goal:** one Lightweb membership unlocks every service. A member onboarding through Uluntu has the same identity in Nextcloud, Matrix, Discourse, Gitea, and Jitsi.

**Integration work:**
- Confirm Keycloak realms, roles, and group claims model the co-op governance structure (members, working-group stewards, board, external partners).
- Configure OIDC clients for every service: Nextcloud (`user_oidc` app), Matrix (`oidc_providers` in Synapse config), Discourse (OIDC plugin), Gitea (OAuth2), Jitsi (JWT auth via Keycloak), mail (Dovecot/Postfix via OIDC bridge or LDAP-fronted Keycloak).
- For Uluntu: front Supabase Auth with Keycloak as the OIDC IdP (lighter lift) **or** replace Supabase Auth with a Keycloak-native flow (more sovereign).
- Define account lifecycle: who provisions, who deprovisions, what happens to a member's Nextcloud/Matrix data on offboarding.

**Why first:** every other integration depends on knowing who the user is across services. The Lightweb Brain in §3.2 is unusable without it.

### 3.2 The Lightweb Brain — knowledge ingest & retrieval

**Goal:** the system described in agenda §4. Members ask plain-language questions ("who knows about greywater?", "what did we decide about the Kaslo build?", "where's the AGM deck draft?") and the Lightweb answers from its own substrate, not Google.

**Architecture (proposed):**

```
   Sources                Ingest                Index                Query
   ─────────              ───────               ──────               ──────
   Nextcloud files  ──┐                                              ┌── Chaz on Matrix
   Matrix rooms     ──┤                  ┌─ Vector store ─┐          │
   Gitea repos      ──┼── Connectors ──► │  + Postgres    │ ──► RAG ─┼── Uluntu inline AI
   Discourse posts  ──┤                  │   metadata     │          │
   Uluntu entities  ──┤                  └────────────────┘          └── Web search UI
   Meeting notes    ──┘
```

**Integration work:**
- **Connectors** for each source. Nextcloud (WebDAV + Activities API), Matrix (Synapse admin API + appservice for room history), Gitea (REST), Discourse (REST + webhook), Uluntu (Supabase Realtime + Postgres replication).
- **Vector store** on Liberty — pgvector inside the existing Postgres footprint is the lowest-friction option; Qdrant or Weaviate if scale demands.
- **Embedding model** running on Ollama (e.g. `nomic-embed-text`) so embeddings never leave the cluster. Uluntu's existing `AI_STRATEGY_PLAN.md` and vector-embedding spec are a starting frame.
- **Retrieval-augmented generation pipeline** that respects per-source ACLs — a member must not retrieve fragments from a Matrix room or Nextcloud folder they cannot access. This is the hardest correctness problem in the brain and it must be solved before any general member access.
- **Provenance**: every answer cites the source document/room/post so trust is verifiable, not implied.
- **Opt-out at the source level**: members and groups can mark Matrix rooms, Nextcloud folders, or Uluntu groups as "not for the brain." This is non-negotiable per the Good AI stance.

### 3.3 AI access layer — Chaz everywhere, Ollama under it

**Goal:** one inference backend (Ollama on Liberty), one conversational front door (Chaz on Matrix), and inline AI surfaces inside each application — all pointed at the same models with the same policies.

**Integration work:**
- **Chaz on Matrix**: a Matrix appservice or bot account, scoped per-room, talks to Ollama via its HTTP API. RAG hops go through the brain in §3.2.
- **Uluntu AI re-pointing**: replace `VITE_OPENAI_API_KEY` paths with an Ollama-compatible client. The BlockNote AI editor, content suggestions, and any RAG calls should resolve to Liberty.
- **Model registry**: which models are deployed (chat, embedding, code, vision), how they version, who decides upgrades. Co-op governance decision, not a developer-only one.
- **Inference policy**: rate limiting per member, per group, per use case. Co-op-owned doesn't mean infinite compute.
- **Audit log**: every prompt/response pair stored (encrypted, member-readable) so the "transparent" half of "transparent, opt-in" is real.

### 3.4 Application integration — Uluntu ↔ Liberty

Per `uluntu-roadmap-fit.md`, Uluntu is most of the magnetic-core platform already. The gap is integration with Liberty, not greenfield product.

| Gap | Work |
|---|---|
| Hosted Supabase | Self-host Supabase on Liberty Kubernetes (Postgres + GoTrue + Storage + Realtime + Studio) **or** replace its auth/storage with Keycloak + Nextcloud-backed storage. Faster: self-host. More sovereign: replace. |
| Supabase Auth | Federate to Keycloak (§3.1). |
| OpenAI AI editor | Re-point to Ollama (§3.3). |
| Brand & copy | Migrate from "Nelson Tech Community Platform" to Lightweb brand. Editorial work, supported by the existing theme system. |
| No Nextcloud / Matrix bridge | Build ingest connectors (§3.2). |
| Invitation-only trust | Build the double-referral trust layer (§3.5). |
| No wallet/local currency | Out of scope for v1 magnetic-core launch; phase-2 add-on. |

### 3.5 Trust architecture — the double-referral layer

**Goal:** structural trust as a feature of the marketplace and the directory. Replaces surveillance identity (government ID, biometric KYC, social-graph harvesting) with **human verification through community vouching**.

**Integration work (net-new code, not polish):**
- **Referral graph** as a first-class data model: each member has 0..n inbound referrers; each referrer asserts a vouching relationship with metadata (when, in what context).
- **Chain-depth & breadth reputation**: a member's standing derives from the *shape* of their referral graph, not a single trusted authority.
- **Vouching surface in Uluntu**: explicit UI for "vouch for this person," with revocation, decay, and visibility rules.
- **Moderation surface**: stewards see the referral graph context when triaging reports. Sock-puppet networks become visible structurally.
- **Cross-service propagation**: the trust signal is meaningful in Matrix rooms, Discourse categories, and Uluntu Marketplace listings. Likely surfaced via Keycloak group/role membership computed from the referral graph.

This is the part of the stack that does not exist anywhere else and is most distinctive to the Lightweb.

### 3.6 Replication framework — bioregion-in-a-box

**Goal:** Kaslo (already funded) and every bioregion after it stands up its own instance from the same codebase, federates with the others, and keeps local control.

**Integration work:**
- **Multi-tenant on Uluntu** is already architected per `MULTI_TENANT_ARCHITECTURE_PLAN.md`. Confirm tenant isolation extends to vector embeddings and brain queries.
- **Per-region Keycloak realm** with cross-realm federation for members who hold standing in multiple bioregions.
- **Matrix federation** is native; verify Synapse server-server configs and federation policies (who federates with whom, who is blocked).
- **Nextcloud federation** for selective file/calendar sharing across bioregions.
- **Bioregion onboarding playbook**: documented installable artifact — Helm charts / Ansible / Terraform — that boots a Liberty-equivalent stack on a new cluster. Replication-ready in code, not just in slogan.

### 3.7 Resilience layer — Reticulum & LoRa mesh

**Goal:** the "your communication works even when everything else doesn't" line from `background.md` cross-cutting themes.

**Integration work (parallel track, does not block §3.1–§3.6):**
- Reticulum nodes deployed at member sites; LoRa long-range radio for backbone hops in the bioregion.
- Bridge between Reticulum addressing and Matrix room identities so a Matrix room degrades gracefully to mesh-only when IP transit is unavailable.
- Offline-first Lightweb client (likely a constrained Matrix client) that operates over mesh when needed.
- Honest scoping: this is a *resilience* layer, not the primary transport. Most members will never see it; it matters most when it matters most.

### 3.8 Observability, backup, operations

**Goal:** a co-op that promises sovereignty has to actually run the cluster like infrastructure, not a hobby. Members trust the stack with files, conversations, identities, and (eventually) economic activity.

- **Metrics & logs**: Prometheus + Grafana + Loki on Liberty. Service-level dashboards for Nextcloud, Matrix, Keycloak, Postgres, Ollama inference latency.
- **Backups**: Ceph snapshots + off-cluster (off-bioregion?) encrypted backups for Postgres, Nextcloud data volumes, Keycloak realm exports, Matrix media store.
- **DR plan**: documented and tested. What happens if a node fails? If the building loses power? If the upstream ISP drops?
- **Patch cadence**: who applies updates to Nextcloud, Synapse, Keycloak, Kubernetes. Co-op role, not implicit.
- **Secrets**: Vault / Sealed Secrets / SOPS — pick one, use it everywhere.

---

## 4. Integration Sequence (proposed)

Aligned with the phasing in `uluntu-roadmap-fit.md` §"A Phased Path":

| Phase | Window | Integration focus |
|---|---|---|
| **0 — Decide** | Pre-AGM | Confirm Uluntu as magnetic core. Confirm Liberty as deployment target. Confirm Keycloak as identity authority. Naming and governance decisions only. |
| **1 — Lightweb-ify** | 4–8 weeks post-AGM | §3.1 Identity (Uluntu ↔ Keycloak, Nextcloud/Matrix coverage audit). §3.3 AI re-pointing (Uluntu → Ollama). §3.4 Self-host Supabase on Liberty. Brand migration. |
| **2 — Bridge the stack** | 8–16 weeks | §3.2 Lightweb Brain — Nextcloud + Matrix ingest, vector store, Chaz wired to RAG. §3.5 Double-referral trust layer v1 on Marketplace. |
| **3 — Replicate** | Kaslo + beyond | §3.6 Multi-tenant Lightweb instance for Kaslo. Federation across bioregions. Onboarding playbook published. |
| **Parallel** | Throughout | §3.7 Reticulum/LoRa mesh pilot at 2–3 member sites. §3.8 Observability, backups, DR — should be in place before phase 2 widens the brain to all members. |

---

## 5. Decisions To Surface Before Building

These are not technical unknowns — they are *governance and philosophy* choices that need to be named by the co-op, not made implicitly by whoever writes the code:

1. **Self-host Supabase vs. replace it with Keycloak + Nextcloud-backed storage.** Faster vs. more sovereign. §3.4.
2. **Federate to Keycloak in front of Supabase Auth vs. replace Supabase Auth.** Same axis, smaller scope. §3.1.
3. **Brain ingest defaults — opt-in or opt-out per source.** The Good AI stance argues opt-in; member friction argues opt-out with clear controls. §3.2.
4. **Inference policy — is there a per-member compute budget?** Co-op-owned does not mean unlimited. §3.3.
5. **Trust graph visibility — who sees the referral graph?** Members of their own subgraph only? Stewards globally? §3.5.
6. **Federation policy — who does Lightweb federate with on Matrix and Nextcloud?** Open by default, or curated? §3.6.
7. **Off-bioregion backups — where does the encrypted off-site copy live?** Another Lightweb bioregion (when they exist)? A trusted partner? §3.8.

Each of these can be resolved at the AGM or shortly after. None of them block Phase 0.

---

## 6. What This Document Is Not

- **Not an architecture diagram of the production cluster.** That artifact lives elsewhere (per `background.md` prep checklist) and should be linked in here once available.
- **Not a budget.** Time/cost estimates are deliberately omitted; they belong in the AGM deck and the $500K raise narrative.
- **Not a commitment to Uluntu.** Uluntu is the current best candidate per `uluntu-roadmap-fit.md`; the integration points in §3 are largely the same regardless of which application sits in the magnetic-core slot.

---

*Cross-references: see `background.md` for philosophy, agenda, and the broader strategic frame; see `uluntu-roadmap-fit.md` for the deep-dive on the candidate magnetic-core application and its phasing.*
