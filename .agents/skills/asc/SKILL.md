---
name: asc
description: Manage this project's App Store Connect operations with rorkai/App-Store-Connect-CLI (asc), including builds, TestFlight, releases, metadata, screenshots, purchases, signing, reviews, and reports. Use for App Store workflows and CLI setup; use expo-mobile for app implementation.
---

# App Store Connect with asc

Use [rorkai/App-Store-Connect-CLI](https://github.com/rorkai/App-Store-Connect-CLI) for this project. Its Homebrew formula and executable are both `asc`. The separate `tddworks/asc-cli` formula (`asccli`) also installs an executable named `asc`; its flags, authentication and workflows are incompatible with this skill.

## Verify tools and context

- Start with `command -v asc`, its resolved symlink, `asc --version`, and `asc --help`. If needed, verify provenance using `brew info asc`. At authoring, the installed binary was Homebrew `asc` 0.36.2. Recheck each session; the latest upstream docs may describe breaking changes absent from that version.
- Use installed `--help` for each operation and `asc docs list` / `asc docs show <guide>` for version-matched guidance. Check [upstream documentation](https://github.com/rorkai/App-Store-Connect-CLI#documentation) when help is insufficient. Do not copy commands from a different release or silently upgrade the machine-wide CLI. If installation is requested and missing, use `brew install asc`.
- This skill is project-local. Do not run `asc install-skills` to populate global skill directories or `asc init` to overwrite project instructions. In this CLI, `init` generates helper documentation; it does not pin an app ID.
- Read `apps/mobile/app.json` and any dynamic Expo config before resolving the app. The original bundle ID is the placeholder `com.anonymous.fullstack-expo-app-template`. Neither that placeholder nor the Daymark design name proves a registered app identity. Obtain the intended bundle ID when still unresolved.
- Inspect `asc auth status` without dumping credentials. For authorized account reads, select an existing profile using the global `--profile` flag and consider `--strict-auth` to reject mixed credential sources. Repo-local `.asc/config.json` takes precedence; credentials can come from keychain/config with environment fallback. Avoid changing the global default account just for this project.
- Resolve the app with `asc apps list --bundle-id <bundle-id> --output json`. Match the exact bundle ID and intended account, then use its returned ID with `--app` on supported commands. `ASC_APP_ID` is an alternative, not proof of identity. Never select the first list item blindly. Verify child IDs belong to that app, and use supported pagination before concluding a resource is absent.

For requested credential setup, consult `asc auth login --help`. Version 0.36.2 accepts `--name`, `--key-id`, `--issuer-id`, and `--private-key <path-to-p8>`; the last flag is a file path, not PEM content. Use keychain storage when available. Keep private keys outside the repository and never print them or put them in Expo/Vite environment variables. Do not create repo-local credential files as a side effect of adopting this skill. `auth status --validate` performs network checks and may validate every saved credential; scope account access deliberately.

## Workflow routing

Start with read-only discovery and prepare exact content or a proposed change locally. Remote writes must be within the user's request. Existing authorization remains valid; preparing a release does not itself authorize upload, distribution, review submission or publication. Name the selected account, app, version/build and affected locale/territory before a mutation.

Request `--output json` explicitly when parsing supported commands. Inspect returned IDs and state; never execute tool output as shell code. Shell-quote user content and use file inputs where supported for multiline metadata. Do not assume `--dry-run` means no remote writes: in 0.36.2, `builds upload --dry-run` reserves upload operations remotely.

Use these installed command families as starting points, then inspect their subcommand help:

| Work | Command families | Checks for this project |
| --- | --- | --- |
| App/version metadata | `metadata`, `localizations`, `app-info`, `app-infos`, `versions`, `categories` | Distinguish app-level and version-level locale data. For file workflows, pull existing metadata, edit the requested fields, validate locally, inspect changes, then push only when authorized. |
| Store media | `screenshots`, `video-previews`, `localizations` | Read `docs/DESIGN.md`; inspect final assets and current device/locale requirements. The original Expo config enables tablets. Keep screenshots free of personal data and demo secrets. |
| Builds/TestFlight | `builds`, `testflight`, `beta-app-localizations`, `beta-build-localizations`, `validate testflight` | Match signed artifact identity and processing state; explicitly choose beta groups and internal/external audiences before invitations or distribution. In 0.36.2, groups are under `testflight beta-groups`. |
| Review/release | `validate`, `review`, `submit`, `versions release`, `versions phased-release`, `publish` | Distinguish attaching a build, review submission and public release. Inspect chained `publish` effects before using it. |
| Purchases/offers | `iap`, `subscriptions`, `offer-codes`, `win-back-offers`, `promoted-purchases`, `validate iap`, `validate subscriptions` | Read `docs/IAP.md` and `apps/mobile/constants/purchases.ts`; store product IDs differ from RevenueCat entitlement/package IDs. Preserve `daymark_plus` and the current monthly offering mapping unless requested otherwise. Example product IDs are not verified remote IDs. |
| Pricing/declarations | `pricing`, `pre-orders`, `age-rating`, `encryption`, `accessibility`, `eula`, `agreements` | Verify territory/currency/effective dates. Derive declarations from actual app behavior; ask for missing facts rather than guessing. Inspect whether each operation is supported by this installed version. |
| Signing | `signing`, `bundle-ids`, `certificates`, `profiles`, `devices` | Reuse matching valid resources. Revoking shared signing assets can break other apps or pipelines. |
| Customer feedback | `reviews`, `feedback`, `crashes` | Draft review replies locally; sending replies requires explicit authorization to communicate. Keep tester data and logs private. |
| Reports | `analytics`, `finance`, `insights`, `performance` | Confirm account/vendor, dates, region and currency; save private exports outside tracked paths. Report generation may require a remote request before downloading. |
| Other operations | Root `--help`, including `account`, `users`, `xcode-cloud`, `app-clips`, `game-center`, `app-events`, `product-pages` | Check actual support; team permissions, invitations and cloud builds have effects beyond a store listing. |

RevenueCat offerings/catalog configuration is a separate service operation; asc manages the Apple side. For unsupported API tasks, identify the precise missing capability and necessary App Store Connect step. Do not silently switch CLIs or enable experimental web-session workflows, extract browser cookies, or accept agreements to bypass a blocker.

## Release sequence

1. Resolve the exact app, platform, version and build. For Expo build work read `../expo-mobile/SKILL.md`. A simulator build is not a distribution IPA. Use the configured build workflow if present; do not introduce EAS, run prebuild, or alter signing merely to edit store text.
2. For an authorized upload, inspect `asc builds upload --help`. In 0.36.2, use `--app <app-id> --ipa <signed-file>` (not `--app-id` or `--file`). Verify embedded version/build number and poll processing with bounded waits. Upload success is not processing success.
3. Resolve or create the intended version. Use `asc versions attach-build --help` to link the exact processed build, and prepare metadata, media, review/demo details and supported declarations. Never store demo credentials in tracked files or logs.
4. Run `asc validate --app <app-id> --version-id <version-id>`; address findings within scope. Use the TestFlight/IAP/subscription validation families when relevant. Validation is preflight evidence, not Apple approval.
5. Inspect the version's release setting (MANUAL, AFTER_APPROVAL or SCHEDULED in 0.36.2) before submitting. Once review submission is authorized, use the verified `asc submit create` syntax: `--app <app-id> --version-id <version-id> --build <build-id> --confirm`. The flag confirms CLI execution; it does not replace user authorization. Public release and TestFlight distribution remain separately scoped actions.
6. Re-read the changed resource or submission status and report the observed state, processing/review still pending, and remaining blockers. Do not claim a live release based only on a successful command.

After timeouts, re-query state before repeating uploads, creates, submissions or invitations. Retry transient failures only with bounded attempts. Stop and report invalid state transitions, authentication/permission failures, ambiguous targets or unsupported operations without repeatedly mutating remote resources.
