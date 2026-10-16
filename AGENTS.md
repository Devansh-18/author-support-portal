# Workspace Coding & Engineering Rules

These rules govern all code design, modifications, testing, and configuration management within this workspace.

---

## 1. Pragmatic Architecture: Functional Code vs. Extensible OOP
- **Functional Programming by Default**: Use simple, clean functional-based programming for standard API endpoints, route handlers, controllers, services, and middleware. Do NOT apply class patterns for simple code or standard features.
- **Classes Only When Extensible**: Use classes and OOP design patterns (Strategy, Adapter, Factory, etc.) strictly where polymorphism, shared state encapsulation, or future extensions are required:
  - **Third-Party Integrations**: AI providers, payment gateways, mailers, and external SDK adapters.
  - **Error Hierarchy**: Dedicated domain errors using class inheritance (e.g., `AppError`, `NotFoundError`, `ValidationError`, `ConfigurationError`) sharing common status codes, error payloads, and diagnostic metadata.
  - **Stateful/Pluggable Services**: Modules where multiple alternative implementations or pluggable behaviors will be introduced.
- **Module-Based File Architecture**: Structure application features into self-contained modules under `modules/<feature>/` (e.g., `modules/health/`). Each module houses its own controller, service, routes, model, and module-specific helpers. Avoid flat global directories like `src/controllers/` or `src/models/`.
- **Consistency Over Fallbacks**: Always design for structural consistency and architectural coherence across the codebase. Do not introduce ad-hoc fallback pathways or patchy workarounds in place of sound design.

---

## 2. Shared Contracts & Frontend-Backend Synchronization
- **Strict Shared Contracts**: Maintain a centralized `contracts/` directory defining exact request/response payload schemas, shapes, and validation rules between frontend and backend. Extra or missing payload fields must never be sent or accepted.
- **Mandatory Contract Updates on Change**: Whenever modifying any feature in the frontend or backend that impacts fetching or posting payloads, the shared contract MUST be updated first or concurrently. Never alter API payload shapes in isolation.

---

## 3. Impact Analysis & Safe Code Evolution
- **Holistic Impact Assessment**: Before modifying any function, class, type, or entity, thoroughly trace and analyze all dependent files, usages, and consumer logic across the workspace.
- **Regression Prevention**: Ensure changes do not break legacy call sites, existing contracts, or peripheral behavior.

---

## 4. Test-First Methodology & Hermetic Testing
- **Test-Driven Workflow**: Write or update tests prior to implementing or modifying application code, ensuring they can be executed immediately after implementation to verify correctness.
- **Comprehensive Coverage**: Include both positive test cases (happy paths, expected results) and negative test cases (boundary values, failure states, invalid inputs, error handling).
- **Hermetic & Isolated**: Tests must never call real external APIs, databases, or network services. Mock, stub, or fake all external dependencies and I/O.
- **Zero Production Intrusion**: Do not contaminate production/application source code with test-only bypasses, flags, or test hooks. Production files must remain completely clean and agnostic to test harnesses.

---

## 5. Configuration & Environment Determinism (No Silent Fallbacks)
- **Strictly No Fallbacks**: Never use default or fallback values for environment variables or configuration values. Identify the exact, authoritative source of config data and consume it directly.
- **Fail-Fast Pre-Runtime Validation**: Validate configurations and required environment variables upfront (e.g., at initialization/startup via explicit schema validation). If any configuration is absent or malformed, fail early with clear diagnostic errors rather than falling back or degrading silently.
- **Intentional Variable Usage**: Variables defined for a specific task or purpose must be used explicitly and consistently. Avoid synthetic defaults or fallback branches.
