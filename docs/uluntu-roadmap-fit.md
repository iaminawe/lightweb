---
sidebar_position: 3
title: Uluntu and the Roadmap
---

# Uluntu and the Lightweb Roadmap

*A review of the [iaminawe/uluntu](https://github.com/iaminawe/uluntu) repository and an honest read on where it fits, what it covers, and what would need to change to make it the Lightweb's magnetic core.*

---

## TL;DR

Uluntu is **already most of the platform the agenda is asking for**. It's an open-source, MIT-licensed, TypeScript/React + Supabase community platform built explicitly for the Nelson/Kootenay region, complete with member directory, hyper-local marketplace, groups, events, opportunities, real-time messaging, and an AI-augmented content editor. It ships with its own SaaS business plan, multi-tenant architecture plan, AI strategy, lean canvas, and pitch deck outline.

It maps cleanly onto at least five of the six "things we want to walk out with" in the working session, and the multi-tenant architecture directly satisfies the **replication-ready** cross-cutting theme.

The work to make uluntu *the* Lightweb flagship is therefore not "build a platform" — it's **rebrand, re-host onto Liberty, re-point AI at Ollama, integrate Keycloak, and add the double-referral trust layer.** Those are weeks-to-months of integration work, not years of greenfield development.

---

## What Uluntu Actually Is

**Repository:** `iaminawe/uluntu` (default branch `main`)
**Description:** "This is an open source community platform"
**Internal name:** *Nelson Tech Community Platform* — tagline *"Connecting innovation in the Kootenays"*
**License:** MIT
**Created:** 2025-05-20 · **Last push:** 2026-04-01 (active)
**Primary language:** TypeScript · **Size:** ~149 MB · **Topics:** community, directory, marketplace

### Tech stack

- **Frontend:** React 18, TypeScript 5.5, Vite 5, Tailwind CSS
- **State:** Hybrid — React Query for server state, Redux Toolkit for UI state, Context for settings/theme
- **Backend:** Supabase (PostgreSQL + Auth + Storage + Realtime), Row Level Security throughout
- **Editor:** BlockNote (TipTap-based) with AI-assist hooks
- **Email:** Resend transactional templates
- **Testing:** Jest, React Testing Library, Playwright E2E
- **Deploy targets:** Netlify, Vercel, Docker/docker-compose, Railway, Cloudflare Pages, Coolify

### Feature surface (as shipped)

- **Member Directory** with privacy-first 5-step onboarding (profiles draft-by-default, user chooses when to publish)
- **Companies** with employee associations and galleries
- **Events** with RSVP, calendar, media galleries
- **Groups** — public, private, or secret; roles (admin/moderator/member); invitation system with token-based workflow; activity feed and audit log
- **News** — community blog with SEO, slug generation
- **Photo Galleries** with batch upload + compression
- **Marketplace** — buy/sell/trade with image galleries
- **Opportunities** — job postings and volunteer work
- **Resources** — educational content library
- **Newsletter** — campaigns, templates, analytics
- **Real-time Messaging** — conversation isolation, typing indicators, thread management
- **AI-enhanced content editor** (BlockNote with AI assist)
- **Three-level permission system:** system roles → custom roles → entity-specific permissions
- **Theme system** with 5 presets, live preview, dark mode
- **Dynamic settings** with live preview
- **Admin dashboard** with batch operations and analytics
- **Multi-tenant architecture** explicitly designed for SaaS conversion

### Documentation already in the repo

Notably, `docs/business/` contains pre-existing strategic documents that map directly to the AGM deliverables:

- `SAAS_BUSINESS_PLAN.md` (48 KB)
- `MULTI_TENANT_ARCHITECTURE_PLAN.md` (16 KB)
- `AI_STRATEGY_PLAN.md` (109 KB) plus implementation guide, executive summary, cost-benefit analysis, vector embedding spec
- `PITCH_DECK_OUTLINE.md` (17 KB)
- `LEAN_CANVAS.md` (8 KB)
- `AI_UI_UX_DESIGN_SPECIFICATION.md`

These are not Lightweb-branded yet, but they are a serious head start on the AGM trio (deck, narrative, business case).

---

## How It Maps onto the Roadmap

Cross-referencing against the session agenda in `background.md`:

### 1. The Magnetic Core — "the sexy app" (Agenda §3)

Uluntu **collapses three of the candidate apps into one already-built product:**

| Candidate from agenda | Uluntu feature already shipped |
|---|---|
| Hyper-local trust-based marketplace replacing Facebook Marketplace | **Marketplace** module |
| Skills and barter exchange mapping the Kootenays' real economy | **Opportunities** + skills on Member profiles |
| Community connection layer on Matrix/Nextcloud | **Groups + Events + Messaging** (in-app, not Matrix-bridged yet) |
| Co-op-owned local AI flagship | **AI-enhanced editor** + documented AI strategy; needs Ollama re-pointing |
| Local currency or wallet on the marketplace | Not present — would be an addition |
| Double-referral trust architecture | Not present — invitation tokens exist, but referral chain logic would need to be added |

The first three are arguably the core of the magnetic offer, and they are *running code today*.

### 2. The Lightweb Brain — knowledge capture (Agenda §4)

Agenda asks for a system that captures *"people, skills, volunteers, partner orgs, land and physical resources, knowledge holders, meeting notes, media, and the intangible capital — trust, culture, spiritual depth, relational networks."*

Uluntu already captures, in structured form: people (Directory), skills (profile fields), organizations (Companies), media (Galleries), educational content (Resources), and discussion (Groups + Messaging). Add the **Vector Embedding Spec** that already exists in the repo and you have the indexing layer for a queryable AI brain.

The integration with the rest of the Liberty stack (Nextcloud documents, Matrix conversations) is the missing piece — uluntu does not currently ingest from Nextcloud or Matrix. That bridge is the design work for Agenda §4.

### 3. Story, Website, Pitch Deck (Agenda §5)

- **Member portal & onboarding** — uluntu's 5-step privacy-first onboarding is exactly the model. Currently uses Supabase Auth; would need to swap to Keycloak SSO to match the rest of the Liberty stack.
- **News + Pages + BlockNote editor** can host the scrolly-telling site, or at minimum the content layer behind it.
- **`PITCH_DECK_OUTLINE.md`** in the repo is a starting frame for the AGM deck.

### 4. Revenue & the $500K Raise (Agenda §6)

The `SAAS_BUSINESS_PLAN.md` and `MULTI_TENANT_ARCHITECTURE_PLAN.md` already model the economics of running this as a multi-instance platform. The Lightweb framing reshapes "SaaS revenue" into "**cooperative membership + bioregional licensing**," but the unit economics, retention model, and tiering work largely carries over.

### 5. Replication-ready architecture (cross-cutting theme)

Multi-tenancy is explicit in uluntu. Other bioregions adopting the Lightweb pattern would spin up an instance, not fork code. This is exactly the "template other bioregions can adopt" line from the agenda's cross-cutting themes.

### 6. Team & community architecture (Agenda §7)

The three-level permission model (system roles → custom roles → entity permissions) maps to a co-op governance model with elected board, working-group moderators, and entity admins (e.g., a group steward managing their group, a market admin managing the marketplace). No code change needed to fit co-op governance — just naming and policy.

---

## Where Uluntu Does *Not* Yet Fit — and What Would Need to Change

These are the honest gaps. They are tractable, but they are real work and they touch the philosophical core of the Lightweb, not just the cosmetics.

### A. It runs against managed Supabase by default

The Lightweb principle is sovereignty on Liberty. Supabase is open-source and self-hostable, but uluntu's deployment guides assume the managed product. Path forward: **self-host Supabase on Liberty's Kubernetes**, or replace the auth/storage layer with the Liberty-native equivalents (Keycloak + Nextcloud-backed storage). The first option is faster; the second is more philosophically pure.

### B. AI is pointed at OpenAI, not Ollama

`VITE_OPENAI_API_KEY` and `VITE_ENABLE_AI` are the documented config knobs. To meet the **Good AI** standard the agenda lays out, the AI editor and any future RAG/embedding work must be redirected at the Liberty Ollama instance (and ideally Chaz on Matrix as the conversational surface). The vector embedding spec in the repo is provider-agnostic enough to support this, but the wiring is OpenAI-shaped today.

### C. Auth is Supabase, not Keycloak

The rest of Liberty uses Keycloak SSO. Uluthu uses Supabase Auth. Either (i) deploy Keycloak as an OIDC identity provider in front of Supabase Auth, or (ii) replace Supabase Auth with a Keycloak-backed flow. Option (i) is the lighter lift.

### D. Trust architecture is invitation-based, not double-referral

Uluntu has invitation tokens and private/secret groups, but does not yet model the **double-referral trust chain** the agenda calls out as a structural feature of the marketplace. This is net-new code — a referral graph, vouching, reputation derived from chain depth and breadth, and a moderation surface. It's a real feature, not a polish item.

### E. Brand and audience framing

It is currently named **Nelson Tech Community Platform** and positioned for "tech professionals." The Lightweb audience is broader: bioregion residents, many non-technical, oriented around community sovereignty rather than tech networking. The rename, the copy rewrite, and the visual identity all need to migrate from "Nelson Tech" to "Sovereign tech for the awakening mind." This is mostly content and theming work — the theme system supports it — but the *positioning* shift is editorial, not technical.

### F. No Matrix / Nextcloud bridge

The Lightweb brain depends on indexing across the existing stack. Uluntu's messaging is internal; the agenda imagines Chaz on Matrix as the interface layer. A bridge — at minimum a one-way ingest from Nextcloud documents and Matrix rooms into the uluntu/RAG index — is needed for uluntu to *become* the Lightweb brain rather than just live next to it.

### G. No local currency / wallet

Listed as a candidate on the agenda; not present in uluntu. Out of scope for a v1 magnetic-core launch, but worth naming as a deliberate phase-2 add-on.

### H. No LoRa / Reticulum resilience layer

The agenda names Reticulum + LoRa mesh as a resilience layer. Uluntu is a conventional web app; it assumes IP connectivity. The resilience story is a parallel track that uluntu does not displace or block.

---

## A Phased Path

A pragmatic sequence that respects what already exists and what the AGM needs:

### Phase 0 — Decide (before AGM)
- Confirm uluntu as the technical basis of the Lightweb magnetic core.
- Reach out to the existing maintainer(s) — given the username matches (`iaminawe`), this is presumably already a Gregg / Avatar project, which simplifies governance. Confirm relicensing or sub-licensing terms under the co-op.
- Rebrand for the AGM deck only — full product rebrand can wait.

### Phase 1 — Lightweb-ify (post-AGM, 4–8 weeks)
- Rename, recopy, retheme for the Lightweb identity.
- Stand up a self-hosted Supabase on Liberty (or scope the Keycloak-in-front approach).
- Repoint AI to local Ollama; remove OpenAI as default.
- Deploy a Lightweb-branded instance for existing 144+ Nextcloud members; SSO via Keycloak.

### Phase 2 — Bridge the stack (8–16 weeks)
- Build the Nextcloud document ingest and Matrix room ingest into the RAG/vector layer.
- Wire Chaz (Matrix bot, Ollama backend) to query the uluntu knowledge index.
- Begin the double-referral trust architecture on the marketplace.

### Phase 3 — Replicate (Kaslo and beyond)
- Use the multi-tenant architecture to spin up the Kaslo instance from the same codebase.
- Document the bioregion-onboarding playbook so the next region (and the next, and the next) can stand up an instance against their own Liberty-equivalent.

---

## What This Means for the Working Session

If the session opens with **"build vs. buy vs. borrow"** for the magnetic core, the answer changes from "we will build it" to **"we already have it — the work is integration, sovereignty hardening, and trust architecture, not greenfield product development."**

That changes the budget conversation, the team-roles conversation, and the AGM timeline. It is, on balance, a very large piece of good news to walk into the room with.

Open questions worth raising explicitly with the group:

1. Is uluntu's governance / IP clean enough to declare it a Lightweb asset at the AGM?
2. Do we lead the AGM narrative with the platform (concrete, demoable) or with the philosophy (sovereign tech, Good AI)? The platform makes the philosophy *land*; the philosophy makes the platform *matter*.
3. What is the minimum credible demo for the AGM — a Lightweb-branded instance pointed at Liberty Ollama, even if Keycloak and the trust layer aren't wired yet?
4. Who owns the bridge work between uluntu and the rest of the Liberty stack (Nextcloud ingest, Matrix bridge, Chaz)? This is the connective tissue that turns "a community platform" into "the Lightweb brain."
