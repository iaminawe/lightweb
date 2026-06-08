---
sidebar_position: 5
title: Five-Year Roadmap (Draft)
---

# Kootenay Lightweb — Five-Year Roadmap (Draft)

*A working draft aligned to the federated scale model: **individual → group → community → regional → global**, with local control held at every layer. Companion to [Background](./background) and [Technical Stack](./technical-stack). Refined in working sessions, ratified at the AGM.*

## Framing

> If the Lightweb is wildly successful in five years, what would everyday people in the Kootenays and beyond actually be using every week — and why would they love it?

A pragmatic answer to build the next five years around:

- A **vouched-in community marketplace + skill exchange + local credit**, with a Matrix-resident AI agent ("Chaz") answering plain-language questions over your own files and conversations, running on **co-op-owned AI hardware in your bioregion**.
- A weekly habit: *post an offer, fulfill a pickup, give a vouch.*
- A friend-to-friend invitation: *you can't browse it from outside — get vouched in.*

## Phase-aligned timeline

### 2026 H2 — "Lightweb-ify"  ·  individual + group scale
**Theme:** rebrand the candidate magnetic-core platform, sovereignty-harden, AGM-launch.

- AGM landed with the strategic ask; **Good AI demo box on stage** (low-power Strix Halo class; see [LLM Hosting](./research/llm-hosting-cost-infrastructure#5-three-reference-builds-for-the-lightweb)).
- A Lightweb-branded Uluntu instance live for the existing membership.
- Identity coverage: **Keycloak in front of every service**, including the new platform via OIDC.
- AI access: **LiteLLM proxy** in front of **Ollama**; **LibreChat** as the non-Matrix web surface; **Langfuse** tracing every prompt for member-readable transparency.
- Self-hosted Supabase on Liberty *(subject to AGM decision on auth/storage architecture)*.
- **Federation quick win:** enable `discourse-activity-pub` on the existing forum.
- New coordinator / dev role onboarded.
- **Weekly Lightweb podcast** begins on a self-hosted PeerTube instance.

### 2027 — "Bridge the Stack"  ·  community scale
**Theme:** the Lightweb Brain. The trust architecture. The first bioregional replication.

- **Brain v1**: Onyx + pgvector + Docling + Faster-Whisper + bge-m3 + bge-reranker. Native Discourse connector + custom Nextcloud / Matrix / Gitea / Uluntu connectors. **ACL-respecting at retrieval** (non-negotiable per the Good AI stance).
- **Trust layer**: Postgres vouching graph + Open Policy Agent gating; Karrot-style coordination patterns inside the marketplace; ValueFlows events emitted from every action.
- **Settlement**: a Credit Commons Protocol reference ledger; Cyclos 4 Communities as the v1 member-facing wallet.
- **Governance**: Loomio wired to Keycloak; Cobudget for participatory allocation rounds.
- **Public face**: new scrolly-telling site at `lightweb.koots.net` (Astro + GSAP + Scrollama + Vidstack), with Chris McLeod's training VLog embedded from PeerTube.
- **Kaslo expansion** launches: a second instance spun from the same codebase, a second Liberty-class cluster, Authentik tested as a cleaner-UX IdP at the new site.
- **Mesh pilot**: Meshtastic + Reticulum + MMRelay at member sites; a "mesh ↔ Matrix" room as a demoable resilience proof.

### 2028 — "Replicate"  ·  regional scale
**Theme:** bioregion-in-a-box.

- Documented bioregion-onboarding playbook (Helm / Ansible / Terraform).
- Per-region Keycloak realm; cross-realm federation for members in multiple bioregions.
- **Matrix federation** policy in production; **Nextcloud federation** for selective file / calendar sharing.
- **Murmurations** profile + proposal for a new "bioregion" schema; CoBot index entry.
- **Credo TS** (OpenWallet) pilot for cross-bioregion verifiable vouching credentials, in line with eIDAS 2 alignment.
- **Garage** off-cluster encrypted backup mesh across the original cluster + the Kaslo cluster + a third bioregion site.
- Additional bioregions launched via partners already in orbit.

### 2029 — "Voice"  ·  regional → global hinge
**Theme:** the public face of the federation.

- **Voice-native interface** behind the Matrix-resident AI agent (Qwen3.5-Omni-class) as the default UX for non-technical members.
- **Bonfire 1.0** evaluation as a parallel federation surface (deliberately deferred from 2026).
- **Cross-bioregion mutual credit** via the Credit Commons Protocol; ValueFlows-modelled inter-bioregion accounting.
- **Mobilizon** events federated across bioregions; a Lightweb podcast network via **Castopod**.
- **Decidim** stood up for participatory democracy questions that cross bioregion boundaries.

### 2030 — "Pattern Language"  ·  global scale
**Theme:** other places adopting the pattern.

- Lightweb-as-a-pattern documented for additional bioregions to clone.
- Onyx connectors + double-referral trust + ValueFlows ledger packaged as the **Lightweb Reference Stack** under MIT/Apache-2.0 with a co-op-protective trademark.
- AI hardware Reference Node v2 documented.
- Replication-ready architecture as a *funded service* — paid bioregion-onboarding becomes a revenue line.

## Cross-cutting tracks (all five years)

- **Resilience** — mesh + Reticulum + offline-PWA in the platform; quarterly DR restore drills.
- **Knowledge surface** — BookStack + Logseq + Quartz; the public "digital garden" as the Lightweb's *intangible capital map*.
- **License hygiene** — the avoid-list in [OSS Tools §12](./research/oss-ecosystem-enhancements#12-cross-cutting-license-flags) is enforced at every adoption decision.
- **Moderation policy** — FIRES + IFTAS DNI as *advisories the moderation committee reviews and consents to*, not opaque external blocklists.
- **Activation rituals** — monthly Lightweb Days; bi-monthly meetups; Ethical AI workshops; Vibecoding sessions.
- **Replication-ready by construction** — every component picked is one another bioregion can stand up without bespoke engineering.

## Decision gates
*(See [Technical Stack §5](./technical-stack#5-decisions-to-surface-before-building) and the [AGM Planning meeting](./meetings/2026-05-29-agm-planning#open-questions-the-agm-resolves) for the full list.)*

- Self-host Supabase vs. replace its auth/storage layer.
- Federate to Keycloak in front of Supabase Auth, or replace Supabase Auth.
- Brain ingest defaults — opt-in or opt-out per source.
- Trust graph visibility — own subgraph only, or steward-visible globally.
- Federation policy on Matrix and Nextcloud — open by default, or curated.
- Off-bioregion backup target.

Each gates a phase; none blocks the prior one.

## What this roadmap is not
- Not a budget — that lives in private board documents and the AGM materials.
- Not a feature spec — see [Uluntu × Lightweb Crosswalk](./uluntu-crosswalk) for what code exists vs. what's net-new.
- Not a procurement plan — see [LLM Hosting](./research/llm-hosting-cost-infrastructure) and [OSS Tools](./research/oss-ecosystem-enhancements) for the deeper tool and hardware analyses.
