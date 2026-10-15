# Portfolio Deployment Architecture Documentation

**Purpose:** A recruiter-friendly and maintenance-oriented guide to the deployed portfolio architecture.

## Files

- `portfolio-deployment-architecture.pdf` — nine-page, landscape technical overview.
- `deployment-architecture.md` — editable, detailed reference.
- `evidence-and-open-checks.md` — what is verified, inferred, and still needs a dashboard/source review.
- `diagrams/01-production-architecture.mmd` — production components and communication paths.
- `diagrams/02-public-request-sequence.mmd` — public API request sequence.
- `diagrams/03-admin-sequence.mmd` — administrator login and protected operation sequence.
- `diagrams/04-logical-data-model.mmd` — conceptual domain model; not a substitute for the actual SQL schema.
- `diagrams/05-deployment-lifecycle.mmd` — change-to-production workflow.

## Important scope note

The complete source tree and hosting dashboards were not accessible from the documentation runtime. This documentation uses confirmed deployment details from the project history, the supplied `SecurityConfig.java`, the successful build/test and request outputs reported during the session, and official provider documentation. Details that require reading repository files or dashboards are marked **Confirm** instead of guessed.

No production code, deployment, environment variable, or database was changed to create these documents. No secret values are included.

## Add to the repository

Extract the ZIP archive at the root of the repository. It contains the `docs/deployment-architecture/` folder. Then review the open checks, commit, and push the documentation as a separate change.
