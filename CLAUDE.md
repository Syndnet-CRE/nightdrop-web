# CLAUDE.md — nightdrop-web

Inherits all rules from ~/.claude/CLAUDE.md. This file adds project context only.

## REPO
Path: ~/nightdrop-web
Deploy: Netlify — auto-deploy on push to main
Start: cd ~/nightdrop-web && claude --dangerously-skip-permissions

## PURPOSE
Night Drop deal-feed dashboard. Subscribers log in, configure buy boxes (asset class + geography
+ filters), and view curated deal cards delivered from the nightdrop-api backend. The frontend
handles the full subscriber experience: onboarding, buy box wizard, deal feed, deal detail,
contact logging, owner portfolio, and an admin view.

The API backend is at https://nightdrop-api.onrender.com (set via NEXT_PUBLIC_API_BASE_URL in
Netlify build environment).

## STACK
| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) — JS only, no TypeScript |
| Styling | Tailwind CSS |
| Components | Radix UI primitives, custom components |
| Animation | Framer Motion |
| Maps | Mapbox GL + react-map-gl |
| Icons | Lucide React |
| Deploy | Netlify + @netlify/plugin-nextjs |
| Auth | JWT stored in localStorage — set by nightdrop-api on login |

## KEY FILES
| File | Lines | Warning |
|---|---|---|
| components/dashboard/deal-detail.jsx | ~692 | Full deal detail panel — property data, owner info, distress signals, contact log, narrative |
| components/dashboard/configuration-overlay.jsx | ~603 | Buy box wizard — all 8 asset classes, sub-types, geo, filters |
| components/dashboard/buy-box-edit-modal.jsx | ~527 | Buy box edit/create modal — validates against API taxonomy |
| components/providers/deals-provider.jsx | ~302 | Global deals state — fetches deals, manages filters, deal selection |
| lib/buy-box-taxonomy.js | ~250 | Asset class definitions for the UI — MUST stay in sync with nightdrop-api taxonomy |

## ASSET CLASS TAXONOMY — CRITICAL
`lib/buy-box-taxonomy.js` defines the 8 asset classes and all sub-types shown in the UI.
It must stay in sync with nightdrop-api's `services/assetUseCodes.js`.

This file was rebuilt 2026-05-20 from the ground truth DB audit. The canonical reference is:
- ~/parcyl/notes/buy-box-taxonomy-spec.md — authoritative asset class → sub-type → use code map
- ~/parcyl/notes/full-property-taxonomy.md — every ATTOM use code in the Parcyl DB

Do not edit `lib/buy-box-taxonomy.js` without reading those two documents first.

Asset class IDs in this file must exactly match the `asset_class` values stored in df_buy_boxes:
`industrial`, `multifamily`, `retail`, `office`, `land`, `special_purpose`, `residential_sfr`, `mixed_use`

## APP ROUTES
| Route | Purpose |
|---|---|
| / | Landing / waitlist page |
| /login | Subscriber login |
| /signup | Subscriber signup (invite-gated) |
| /forgot-password | Password reset |
| /invite/[token] | Invite token redemption |
| /onboarding | Post-signup onboarding flow |
| /app | Main deal feed dashboard |
| /app/deal/[id] | Individual deal detail |

## DASHBOARD VIEWS
All views live under `components/dashboard/views/`:
| View | Purpose |
|---|---|
| dashboard-view.jsx | Default feed — deal cards, filters |
| buy-boxes-view.jsx | Buy box management |
| map-view.jsx | Map-based deal view (Mapbox) |
| pipeline-timeline.jsx | Deal pipeline/timeline |
| admin-view.jsx | Admin — subscriber management |
| accounts-view.jsx | Account settings |
| invite-view.jsx | Invite management |
| settings-view.jsx | Subscriber settings |

## COMMANDS
```bash
npm run dev      # dev server (port 3000)
npm run build    # production build
npm run lint     # ESLint
```

## SESSION RULES
- Next.js App Router only — no Pages Router patterns
- JS only — no TypeScript files (.jsx/.js)
- ESM imports (import/export) — this is Next.js, not CommonJS
- NEXT_PUBLIC_API_BASE_URL is set in Netlify build environment — do not hardcode API URLs
- Netlify auto-deploys on push to main
- lib/buy-box-taxonomy.js changes must be coordinated with nightdrop-api taxonomy changes

## SPEC DOCUMENTS
| Document | Location | Purpose |
|---|---|---|
| Buy Box Taxonomy Spec | ~/parcyl/notes/buy-box-taxonomy-spec.md | Read before editing lib/buy-box-taxonomy.js |
| Full Property Taxonomy | ~/parcyl/notes/full-property-taxonomy.md | Every use code, count, and label in the Parcyl DB |

## KNOWN LANDMINES
| Issue | Location | Risk |
|---|---|---|
| Taxonomy drift | lib/buy-box-taxonomy.js | UI asset class IDs and use codes must match nightdrop-api exactly. Drift causes silent validation failures — buy boxes created in UI won't match in the engine. |
| JWT in localStorage | lib/api.js | Token stored and read from localStorage — SSR pages cannot access it. All authenticated requests are client-side only. |
| NEXT_PUBLIC_API_BASE_URL | netlify.toml | Hardcoded to https://nightdrop-api.onrender.com in Netlify build env. Update if API moves. |
