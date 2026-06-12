# Open Questions — Zen Timer Frontend Assessment

These questions were identified during the frontend architecture assessment and require stakeholder validation before certain implementation paths are finalized.

## Business / Product

**Q1:** Is there a plan to add team/workspace functionality, or is Zen Timer exclusively a single-user application?
> *Affects: data ownership, permissions, sharing architecture*

**Q2:** Is email verification a requirement, or is the current self-service registration acceptable for production?
> *Affects: email infrastructure, auth flows*

**Q3:** Is password reset functionality planned?
> *Affects: auth API endpoints*

**Q4:** Should settings (focus duration, auto-start, sound, theme) be synced across devices via the backend?
> *Affects: settings API scope*

**Q5:** Are there plans for monetization (premium features, subscription tiers)?
> *Affects: role-based access, feature gating*

**Q6:** Is there a target mobile experience (native app or responsive web)?
> *Affects: responsive breakpoints, PWA strategy, touch optimization*

## Backend / Infrastructure

**Q7:** Is there a database migration strategy beyond `Base.metadata.create_all`?
> *Affects: production schema changes*

**Q8:** Are there rate limits on any API endpoints?
> *Affects: session creation burst handling*

**Q9:** Is there a CDN or caching layer planned for static assets?
> *Affects: static asset delivery*

**Q10:** Is there an error monitoring service (Sentry, DataDog, etc.)?
> *Affects: error handling strategy*

## Frontend / UX

**Q11:** What is the browser support target? (Modern only? IE11? Safari 14+?)
> *Affects: API choice (crypto.randomUUID, Notification, AudioContext)*

**Q12:** Is accessibility compliance a requirement (WCAG 2.1 AA)?
> *Affects: scope of accessibility work*

**Q13:** Should the guest-to-auth task migration be automated?
> *Affects: task merge strategy*

**Q14:** Should the app support multiple languages (i18n)?
> *Affects: UI text architecture*

**Q15:** Are analytics / event tracking required?
> *Affects: analytics integration*

**Q16:** Is there a design mockup or Figma file to align with?
> *Affects: visual design decisions*

## Data / Compliance

**Q17:** Are there data retention or GDPR/privacy requirements?
> *Affects: session data storage and deletion*

**Q18:** Are user sessions considered sensitive/health data?
> *Affects: hosting, encryption, compliance*
