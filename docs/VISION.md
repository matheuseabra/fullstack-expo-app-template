# Vision

`fullstack-expo-app-template` exists so that a developer can start a consumer mobile app from a working full-stack foundation.
It serves developers building their own product, and it turns shared infrastructure and replaceable examples into a mobile starting point.
It owns exactly one thing: the mobile starter and the web and server support needed to adapt it into a product.

## The starter outlives its example

Daymark demonstrates the foundation without defining the identity of every app built from it.
Neutral branding and selectable examples are welcome when they preserve reusable offline storage and authentication modules.
No single branded product is required to demonstrate every supported flow.
An addition has a concrete use in the starter or its examples rather than an imagined future consumer.
Package boundaries keep a change to one concern from spreading across runtimes.
Compatibility layers without a remaining consumer are removed.

## Local use does not require an account

The first task does not require sign-in or an initial network connection.
Creating, completing, and deleting a task take effect in local persistent storage before synchronization.
The visible task list follows the local write rather than waiting for a server response.
Pending operations survive through a durable queue and reconcile with the server when connectivity returns.
Foreground recovery remains a reliable path when the operating system defers background work.
Task views use the same records rather than maintaining independent copies of application state.
Offline operation belongs to the full-stack starter; a separately supported backend-free edition is outside its scope.

## The mobile experience stays quiet and direct

Content and a small number of controls define the primary surface.
Navigation gives the user a clear path between views, and creation controls lead to a working action.
Shared visual tokens carry the same hierarchy across screens and operating-system appearances.
New controls have readable labels and appropriate loading, disabled, and recovery states.
The task example does not add a streak, celebration, and reminder package to drive engagement.
Household invitations and shared task lists are outside the starter's supported examples.
Hosted AI generation of task plans is outside the starter's supported examples.

## Supporting surfaces have bounded roles

The web surface presents the mobile product and previews its visual language rather than providing web task editing.
It shares the product's brand system, including when the starter is rebranded.
API contracts live in the shared API package, while server persistence and authentication stay behind their own boundaries.
On-device storage does not give clients direct access to the server database.
The starter maintains one backend path rather than offering a libSQL or PostgreSQL choice at setup.
Dependencies and abstractions enter for a concrete use within these boundaries.

## Monetization preserves access to existing work

A dismissible onboarding paywall is compatible with a future subscription limit on new task creation.
The current example records RevenueCat entitlement state and exposes it to signed-in clients, but it does not enforce a task limit or gate another premium feature.
If a creation limit is introduced, it must apply locally during offline use and reconcile entitlement changes later.
A paywall screen alone is not evidence that purchases or entitlement enforcement work.
A visible flow is described as working only when its actions reach the state or persistence they claim to change.
Verification distinguishes observed behavior from presentational controls and platform limitations.
Type checks and builds accompany changes, with runtime evidence for the behavior under discussion.

## Scope

This is a consumer mobile starter, not a collaboration platform, an AI planner, or a second task application for the web.
It is not a deployment service or a guarantee of production readiness.
The development task example may keep public procedures when the limitation is explicit and a documented, tested ownership recipe accompanies it.
Downstream apps opt into private ownership and authenticated access before deploying private user tasks.
That recipe is an acceptance requirement, not a claim that the current public example already isolates users.
Runtime configuration keeps server secrets out of public client values.
Real environment files, credentials, and local databases stay outside the repository.

A change aligns when it makes the mobile starter easier to adapt while preserving offline use, bounded supporting surfaces, and claims supported by working behavior.
A change should be resisted when it locks the starter to Daymark, requires sign-in for the first local task, adds a rejected product or backend surface, or presents an unverified flow as complete.
