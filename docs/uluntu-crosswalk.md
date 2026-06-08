---
sidebar_position: 6
title: Uluntu × Lightweb Crosswalk
---

# Uluntu × Lightweb — Feature Crosswalk

*A per-feature gap analysis between the [Uluntu](https://github.com/iaminawe/uluntu) codebase and the Lightweb's magnetic-core requirements. Companion to [Uluntu and the Roadmap](./uluntu-roadmap-fit), which provides the deeper review.*

> **Shorthand:** Uluntu already ships most of the platform the Lightweb agenda is asking for. The work to make it *the* magnetic core is **integration + sovereignty hardening + the trust layer**, not greenfield product.

## What the Lightweb wants vs. what Uluntu ships

| Lightweb agenda item | Uluntu module already shipped? | Integration / gap |
|---|---|---|
| Member directory with privacy-first onboarding | ✅ Member Directory; 5-step draft-by-default onboarding | Federate auth to Keycloak |
| Companies / business directory | ✅ Companies (employee associations, galleries) | Brand re-frame (co-op members + friends, not "tech professionals") |
| Events with RSVP / calendar / media | ✅ Events module | Federate via Mobilizon in a later phase |
| Ad-hoc groups (public / private / secret) | ✅ Groups + roles + invitations + audit log | Add the double-referral trust gate to the "secret" tier |
| News / community blog | ✅ News (SEO, slug gen) | None for v1 |
| Photo galleries | ✅ Batch upload + compression | None for v1 |
| Hyper-local marketplace | ✅ Marketplace (buy / sell / trade) | **+ Karrot patterns** (pickups, places, roles); add the trust gate; emit ValueFlows events |
| Skills / barter exchange | ✅ Opportunities + skill fields on profiles | Wire to TimeOverflow (federated) for time-bank settlement |
| Resources library | ✅ Resources module | None for v1 |
| Newsletter system | ✅ Campaigns, templates, analytics | Repoint email to a Lightweb-domain transactional relay |
| Real-time messaging | ✅ Conversation isolation, typing indicators, threads | **Bridge to Matrix** so members talk in one place |
| AI-enhanced editor (BlockNote) | ✅ AI hooks | **Repoint from OpenAI to Ollama via LiteLLM** |
| Three-level permissions | ✅ system / custom / entity roles | Map directly onto co-op governance roles |
| Theme system / 5 presets | ✅ Live preview, dark mode | Re-skin "Nelson Tech" → "Lightweb / Sovereign tech for the awakening mind" |
| Multi-tenant architecture | ✅ Designed for SaaS conversion | Confirm tenant isolation extends to the vector index when the brain lands |
| Topics — cross-reference index | ✅ | None for v1 |
| Vouching / double-referral trust | ❌ Invitation tokens only | **Net-new code**: referral graph + reputation + Open Policy Agent gating |
| Local currency / wallet | ❌ | Phase 2: Credit Commons Protocol ledger + Cyclos 4 Communities bootstrap |
| Local LLM access in-app | ❌ Points to OpenAI today | Repoint to **Ollama** via LiteLLM (no app code changes beyond the env switch) |
| Brain / RAG over Nextcloud + Matrix | ❌ Uluntu is self-contained today | **Net-new**: Onyx connectors for Nextcloud, Matrix, Gitea, Discourse, Uluntu Postgres |
| Mesh / LoRa fallback | ❌ Assumes IP connectivity | Parallel track: Meshtastic + Reticulum + MMRelay |

## Where Uluntu was already going (per its repo)

Uluntu ships **strategic documents** that fast-track the AGM trio (deck + narrative + business case):

- `docs/business/SAAS_BUSINESS_PLAN.md`
- `docs/business/MULTI_TENANT_ARCHITECTURE_PLAN.md`
- `docs/business/AI_STRATEGY_PLAN.md` plus implementation guide, executive summary, cost-benefit analysis, vector embedding spec
- `docs/business/PITCH_DECK_OUTLINE.md`
- `docs/business/LEAN_CANVAS.md`
- `docs/business/AI_UI_UX_DESIGN_SPECIFICATION.md`

These need rebranding from *Nelson Tech Community Platform* → *Kootenay Lightweb*, but they are load-bearing material for the AGM deck.

## Sovereignty hardening — Phase 1 (post-AGM)

- [ ] Rebrand: *Nelson Tech Community Platform* → *Kootenay Lightweb*.
- [ ] Stand up self-hosted Supabase on Liberty Kubernetes *(or replace its auth + storage with Keycloak + Nextcloud-backed)*.
- [ ] Repoint AI hooks from `VITE_OPENAI_API_KEY` to Ollama via a **LiteLLM proxy** at `llm.koots.net`.
- [ ] Federate Supabase Auth to **Keycloak** OIDC.
- [ ] Deploy the Lightweb-branded instance for the existing membership.
- [ ] Enable `discourse-activity-pub` (the single-plugin federation win).
- [ ] Wire **Langfuse** to capture every prompt for member-readable transparency.
- [ ] Wire **LibreChat** at `chat.koots.net` for the non-Matrix web-chat surface.
- [ ] Migrate email: drop Listmonk → use Uluntu Newsletter + a Resend-class relay.

## Sovereignty hardening — Phase 2 (8 – 16 weeks)

- [ ] **Brain v1**: Onyx + pgvector + Docling + Faster-Whisper + bge-m3 + bge-reranker (+ TEI sidecar for the reranker).
- [ ] Custom Onyx connectors: Nextcloud, Matrix, Gitea, Uluntu Postgres (Discourse has native upstream).
- [ ] **Trust layer**: Postgres vouching graph + Open Policy Agent + materialised reputation view.
- [ ] **Karrot-style coordination** added to Marketplace.
- [ ] **ValueFlows events** emitted from every Marketplace / Opportunity action.
- [ ] **Credit Commons Protocol** ledger spike; Cyclos 4 Communities as the v1 wallet.
- [ ] **Loomio** wired to Keycloak; used for at least one real AGM-prep decision.
- [ ] Cluster ops standardised: ArgoCD, SOPS + age + ESO, Velero + Kopia, VictoriaMetrics + Grafana + Loki + Beszel + Gatus.

## Sovereignty hardening — Phase 3 (replicate to Kaslo)

- [ ] Spin a Kaslo instance from the same Uluntu codebase via the multi-tenant layer.
- [ ] Per-region Keycloak realm; cross-realm federation for multi-region members.
- [ ] Matrix + Nextcloud federation policy in production.
- [ ] Documented bioregion playbook (Helm / Ansible / Terraform).

## The honest list — where Uluntu does not yet fit
*(From [Uluntu and the Roadmap §"Where Uluntu Does Not Yet Fit"](./uluntu-roadmap-fit#where-uluntu-does-not-yet-fit--and-what-would-need-to-change).)*

- A. Managed Supabase → self-host or replace.
- B. OpenAI → Ollama.
- C. Supabase Auth → Keycloak federation.
- D. Invitation tokens → double-referral graph.
- E. Brand and audience framing — *Nelson Tech* → *Lightweb / Sovereign tech for the awakening mind*.
- F. No Matrix / Nextcloud bridge → Brain connectors.
- G. No wallet → Phase 2 add-on, deliberately deferred.
- H. No mesh / Reticulum → parallel track, does not block.

## Why this matters at the AGM

> "We will build it" → **"we already have it — the work is integration, sovereignty hardening, and trust architecture, not greenfield product development."**

That changes the budget conversation, the team-roles conversation, and the AGM timeline. It is, on balance, a very large piece of good news to walk into the room with.
