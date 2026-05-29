# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Status

This directory does not yet contain code. It currently holds planning material (`background.md`) for the **Kootenay Lightweb Community Services Cooperative** — a registered co-op running production infrastructure on the "Liberty" 4-node Proxmox/Ceph/Kubernetes cluster (nodes: alberdi, garrison, mill, spencer).

When code does land here, update this file with build/test/run commands and architecture notes. Until then, the sections below are project context only.

## Project context (from background.md)

**What exists in production** (hosted on Liberty, not in this directory):
- Nextcloud (144+ active users), Matrix/Synapse, Jitsi, Keycloak SSO, Gitea, Discourse
- Mail on koots.net
- Local AI via Ollama, with "Chaz" as a Matrix-based interface layer
- Public site at lightweb.koots.net

**Strategic frame to preserve in any work here:**
- Federated scale model: individual → group → community → regional → global, with local control at every layer
- "Good AI" stance: community-owned, opt-in, transparent, renewable-powered, running on co-op hardware — distinct from surveillance AI. Opting out of AI entirely is a fully supported choice.
- Every product decision loops back to: *does this strengthen offline trust and local resilience, or pull people deeper into screens?*
- Replication-ready: what's built should be a template other bioregions can adopt.

**Near-term deliverables being shaped** (per background.md):
- 5-year roadmap aligned with the federated scale framing
- Pitch deck for a $500K raise from the AGM
- Scrolly-telling website embedding Chris McLeod's training VLog
- "Lightweb brain": knowledge-capture system over the existing Nextcloud/Matrix/Gitea/Discourse substrate, with an AI layer (Chaz + Ollama) queryable in plain language
- A flagship "magnetic core" application (candidates: co-op-owned local AI subscription, hyper-local trust-based marketplace, skills/barter exchange, local currency/wallet)

**People in orbit referenced in background.md:** Gregg (Avatar Computer Tech), Chris Taylor (full-stack, DWeb Camp, Salt Spring), Stephan (mesh networking, AI agents), John Craig (SOS City, Japan), Chris McLeod (VLog/training).

## Guidance for future work in this directory

- Read `background.md` before proposing scope — the philosophical frame ("sovereign tech for the awakening mind", Good AI, offline-first connection) is load-bearing and easy to violate inadvertently.
- The existing service stack (Nextcloud, Matrix, Keycloak, Gitea, Ollama) is the substrate — prefer integrating with it over standing up parallel systems.
- Accessibility for non-technical co-op members is a stated design constraint, not a nice-to-have.
