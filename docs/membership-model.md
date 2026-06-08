---
sidebar_position: 7
title: Membership Model (Draft)
---

# Membership Model (Draft)

*A qualitative model of the Lightweb's membership tiers, perks, and accountability rhythms. Tier pricing and concrete revenue targets live in private board material; this page captures the **shape** so the public framing stays consistent across the deck, the scrolly site, and Uluntu onboarding copy.*

## Principles

1. **The free baseline is real.** A Kootenay address gets you a Matrix/Element account at `koots.net`, a small Nextcloud allotment, presence in the directory, and read access to community feeds. This is not a trial; it is the floor.
2. **Sovereignty scales with intent.** Higher tiers add personal agent capabilities, AI usage, hosting for personal sites, and business surfaces. Members move up only when they want more, never because the floor is unusable.
3. **Vouched-in, not signed-up.** Members enter via the double-referral trust graph (see [Technical Stack §3.5](./technical-stack#35-trust-architecture--the-double-referral-layer)). The Lightweb is not a wall; it is a *threshold*, and that threshold is the magnetic-core difference.
4. **Co-op-shaped pricing.** Tiers exist to fund the infrastructure and the people running it. They do not gate community membership in the lived-civic sense; *being part of the Kootenays* is the qualification.
5. **Out-of-region is a soft demotion, not exile.** Members who leave the region keep a presence at a lighter tier so the trust graph survives life changes.

## Tier ladder (shape, not prices)

| Tier | Who | What the tier unlocks |
|---|---|---|
| **Friend of the Web** | Anyone with a Kootenay address | Element/Matrix account at `koots.net`; modest personal Nextcloud storage; directory presence; read access to community feeds |
| **Member** | Vouched-in resident | All of the above + vouching capability + AGM voting + a monthly allowance of Chaz / AI queries + Member-tier storage |
| **Sovereign** | Members who want a personal agent | All Member benefits + a personal sovereign agent hosted on Liberty (Hermes / open-source-Claude class) + Bitwarden vault + scheduled-content tooling + a larger AI allowance |
| **Business** | Local businesses | Business profile in the directory + one Coolify-managed site + Lightweb-hosted email (`@yourbiz.koots.net` or a vanity domain) + onboarding help + a visible "powered by Lightweb" mark |
| **Out-of-Region** | Members no longer in the Kootenays | Directory presence preserved + read access to community feeds + a smaller AI allowance |
| **Patron** | Power supporters | All Sovereign benefits + early-access betas + an invitation to the quarterly board call + listing on the supporters page |
| **Steward** | High-trust contributors | All Patron benefits + a concierge migration from existing SaaS subscriptions + a named seat at Lightweb Days + a steward-tier compute budget |

## Perk catalogue (modular — composes across tiers)

### Privacy, storage, hosting
- Personal Nextcloud storage allotment (scales by tier).
- Personal Matrix/Element identity at `koots.net`.
- Lightweb-managed email.
- Lightweb-hosted personal site (Coolify-deployed).

### AI and the brain
- Chaz query allowance (tiered monthly limit).
- Personal sovereign agent — the flagship perk of the Sovereign tier and above.
- Premium-model fallback allowance if/when a sovereign-AI partner extends a community-token grant.
- Brain over the member's own Nextcloud files (opt-in per folder).
- AI-assisted drafting inside the platform's BlockNote editor.

### Community
- Directory listing (personal + business surfaces).
- Vouching capability — issue, accept, revoke; reputation derived from the *shape* of the graph.
- Marketplace listings (gated by trust score).
- Opportunities posts (volunteer asks and offers).
- Cross-community group membership.
- Ability to create sub-communities (e.g. neighbourhood, craft, civic-action).

### Events and content
- AGM ticket and Lightweb Days early access.
- Ethical AI workshop seat; Vibecoding session seat.
- Weekly podcast guest opportunities.

### Creator support (Patreon-class, inside the co-op)
- Pay-to-follow creator pages inside the platform.
- Drip-content tiers for creators via the Uluntu newsletter + campaign system.
- A tip jar in profiles; settled in local credit when Phase 2 lands.

### Resilience and mesh
- Reticulum / Meshtastic node sponsorship at higher tiers (donor-recognised).
- Off-grid LXMF messaging via Sideband on the member's phone.
- *"Your communication works even when everything else doesn't."*

### Business migration concierge
- One-time SaaS-to-self-host migration concierge (cloud → Coolify).
- Custom email + vanity domain setup.
- Optional integration with the member's existing point-of-sale (Square / Shopify class), Phase 2.

### Identity perks
- Stickers, T-shirts, mugs — *people want to belong to something*.
- A **"founding member" badge** for the original membership cohort.

## Accountability and retention machinery

A recurring observation: a meaningful share of paying members never sign in. The membership model needs structural answers, not just hope.

- **Welcome drip** — Uluntu newsletter + Chaz nudges on the first few logins.
- **Inactivity ping** — the Brain triggers a personalised Element / email nudge after a defined inactivity window, citing concrete new content relevant to that member.
- **Tier-up nudges** — when a Member approaches the upper bound of their AI allowance, the system suggests Sovereign.
- **Lapse handling** — Out-of-Region is the structural soft demotion; explicit re-engage at defined inactivity thresholds.
- **Public acknowledgement** — the Brain surfaces volunteer contributions for thanks at each Lightweb Day.
- **Refer-a-member rewards** — vouching that brings new members in earns the voucher meaningful, non-monetary benefits (extra AI allowance, a free upgrade window).

## Revenue legs the membership ladder supports

1. **Recurring membership** at every tier above the free baseline.
2. **Business hosting + migration concierge** — Avatar Computer Tech's existing client base is the warm pipeline.
3. **Co-op SaaS licensing** to other bioregions: another region runs the Lightweb pattern on its own infrastructure and licenses the platform from the Kootenay co-op.
4. **Workshops and consulting** — Ethical AI, Vibecoding, sovereign-tech migration.
5. **Grants and partnerships** with aligned regional, federal, and sovereign-AI funding sources.

## What this page is not

- Not the price sheet. Concrete tier pricing lives in private board material and on the eventual public sign-up flow.
- Not the fundraising target. The $-denominated raise lives in the AGM deck and the private financials.
- Not a final design. The shape captured here is the working version that the AGM and the first six months of Phase 1 will refine.
