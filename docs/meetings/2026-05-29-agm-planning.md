---
sidebar_position: 1
title: 2026-05-29 — AGM Planning Working Session
---

# 2026-05-29 — AGM Planning Working Session

*Friday May 29, late afternoon at Avatar Computer Tech. Board chair, vice president, and a community-platform contributor (Gregg, who maintains the Uluntu codebase). Synthesised from the live session — see [Background](../background) for the agenda framing.*

## Why this session
Sequence the work that becomes the AGM-facing asset set: roadmap, deck, scrolly-telling site, the magnetic-core decision, the brain, and a credible plan for staffing the next phase. Load the AI tooling with the foundational context so it can generate strategic drafts in parallel with the human work.

## Big strategic moves landed in the room

### Adopt Uluntu as the candidate magnetic core
The session worked through what an everyday member would actually open every week. The conversation kept returning to the same observation: an open-source community platform already exists with most of the modules the Lightweb has been describing — Member Directory, Companies, Events, Groups (public / private / secret), News, Galleries, Marketplace, Opportunities, Resources, Newsletter, Real-time Messaging, AI-enhanced editor, three-level permissions, multi-tenant architecture. That platform — [Uluntu](https://github.com/iaminawe/uluntu) — is MIT-licensed and built for the Nelson / Kootenay region. The work to make it *the* Lightweb is integration and sovereignty hardening, not greenfield. See [Uluntu × Lightweb Crosswalk](../uluntu-crosswalk) for the per-feature gap analysis.

### "Public branded surface" + "personal workspace" co-exist
Uluntu becomes the public, branded community front. Nextcloud stays as the personal workspace — files, AI button, agentic tooling. They are not in competition with each other; they are different lenses on the same identity.

### Standardise hosting orchestration in two layers
- **Cluster GitOps** for Liberty stays Kubernetes-native (ArgoCD recommended in the [OSS Tools note](../research/oss-ecosystem-enhancements)).
- **App orchestration** for lab work, member-side deployments, and non-cluster hosts uses [Coolify](https://coolify.io) — one-line install, ~200 self-hosted services preloaded (Nextcloud, Matrix/Synapse, Mattermost, PeerTube, Vaultwarden, Listmonk, Forgejo/Gitea, Jitsi, Immich, Mobilizon, and many more), with an API that AI agents can drive. Promote a service to Liberty + ArgoCD when it earns the trust.

> Coolify is the lab. ArgoCD is the production line. Sequence them.

### Drop bespoke email sender tooling, lean on Uluntu's newsletter + a transactional relay
Listmonk has done its job. Uluntu ships newsletter, drip campaigns, and analytics out of the box. Pair with a privacy-respecting transactional sender (Resend or equivalent self-hostable Postfix-fronted stack).

### Start a weekly Lightweb podcast/video series
Self-hosted on PeerTube (Coolify spin-up). Each episode is a feature walkthrough or a conversation like this one. Categorised inside the Lightweb's Uluntu instance. Cheap, repeatable, builds the public voice while the magnetic core ships.

### Open the brain as an MCP for local builders
Expose the eventual Lightweb Brain as a Model Context Protocol server. The repeated pattern at local tech meetups is *"skilled people want to do good locally but never have a concrete thing to work on."* A queryable community brain is exactly that thing — civic-tech hackathons, City pilot integrations, third-party member tools.

## Roles and accountability

- A co-op-student / junior dev role to coordinate the roadmap into shipped work, with eng-degree sign-off available locally for government wage-subsidy programs.
- The head hardware tech transitions from a part-time arrangement to dedicated Lightweb time as the funded phase opens.
- New volunteers write their own commitment when they come in (what they are agreeing to deliver). The Brain holds them to it via reminders and follows up. Public acknowledgement at meetings closes the loop.

## Local-LLM hardware path
The session converged on a Mac Studio class single-box deployment as the cheapest credible "Good AI in a box" for the community-scale horizon — Apple Silicon's unified memory is the inflection. Stage box (Strix Halo / Framework Desktop, 128 GB unified) before any new server hardware. Production node on Liberty stays the workhorse. Full picture in the [LLM Hosting research note](../research/llm-hosting-cost-infrastructure).

Production serving moves from Ollama (right for dev + demos) to a continuous-batching engine like vLLM once two or more concurrent member sessions are realistic.

## Partnership signals worth following up

- **Aligned sovereign-Canadian hosting** (Cantrust et al.) — complementary geography for off-region resilience; warm relationships already exist.
- **Sovereign-AI data-centre projects** with a token-grant track — a Canadian flagship sovereign DC has shown willingness to donate inference tokens to community-aligned use cases.
- **Local Chamber of Commerce** — they currently have a website with member links and not much else; a directory + skills surface + AI assistant is a genuine value-add at a regional level.
- **Columbia Basin Trust / municipality** — both sit on extensive historical-document corpora that no resident can search. A Lightweb-Brain-style ingestion pipeline is a credible civic-tech offering.

## Cross-cutting tactical notes

- **One shot to launch.** Hold the public launch until the platform is polished — outside advice from a peer who has run this loop before. Soft-launch to existing members; public launch when the rough edges are sanded.
- **Re-engagement matters.** A meaningful share of paying members never sign in. The Brain plus a drip pattern in Uluntu can address that.
- **License hygiene first**, every time. Stack picks adhere to the avoid-list in the [OSS Tools note](../research/oss-ecosystem-enhancements#12-cross-cutting-license-flags).
- **Decentralised fallback is a value prop, not a footnote.** If upstream internet hiccups, the co-op-owned fibre + local DNS + Liberty + the Matrix-resident AI agent all still work. That is the reason for being.

## Open questions the AGM resolves
*(Mirrors and extends the decision list in [Technical Stack §5](../technical-stack#5-decisions-to-surface-before-building) and the [OSS Tools note §13](../research/oss-ecosystem-enhancements#13-adoption-sequence--mapped-to-technical-stack-4).)*

1. Self-host Supabase on Liberty or replace its auth/storage layer with Keycloak + Nextcloud-backed storage?
2. Federate to Keycloak in front of Supabase Auth, or replace Supabase Auth outright?
3. Brain ingest — opt-in or opt-out per source?
4. Trust graph visibility — only members of their own subgraph, or stewards globally?
5. Federation policy — open-by-default vs. curated, on both Matrix and Nextcloud?
6. Off-bioregion backup target — another Lightweb bioregion when they exist, or a trusted aligned partner today?
7. Minimum credible AGM demo — a Lightweb-branded Uluntu instance pointed at Liberty Ollama, even if the Keycloak federation and the trust layer are not yet wired?

## Outputs expected from this session into the AGM

- A drafted [Five-Year Roadmap](../roadmap) aligned to the federated scale framing.
- The first version of the [Uluntu × Lightweb Crosswalk](../uluntu-crosswalk) — what already exists, what's net-new.
- A first cut of the [Membership Model](../membership-model) — the tiered offer the AGM materialises.
- The [Technical Stack](../technical-stack) tightened with the Uluntu integration sequence.
- A short pitch-narrative library (per audience) — built outside the public docs.

## What this page is not
- Not a verbatim transcript. The full conversation surfaced specifics about people, money, and partnership pipelines that belong in private board documents, not the public handbook.
- Not a commitment. Decisions enumerated above are *room consensus into the AGM*, not co-op resolutions. The AGM resolves them formally.
