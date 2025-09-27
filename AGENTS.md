# E-commerce Platform - AI Agent Instructions

This is a TypeScript monorepo for an e-commerce platform built with hexagonal architecture.

## Project overview

**Architecture**: Hexagonal Architecture (Ports & Adapters Pattern)  
**Tech Stack**: Next.js 15, React 19, TypeScript 5, Turbo, pnpm  
**Structure**: Monorepo with `apps/`, `packages/`, and `tools/`

### Key packages
- `packages/core`: Domain logic and business rules (hexagonal architecture core)
- `packages/ui`: React component library
- `apps/web`: Next.js frontend application
- `tools/`: Shared TypeScript configurations

## Dev environment tips

- Use **pnpm** for package management (required)
- Node.js version managed by `.nvmrc` if present
- VSCode recommended with TypeScript extension

### Getting started
```bash
pnpm install
pnpm build
pnpm dev
```

### Working with monorepo
```bash
# Build specific package
pnpm --filter @ecommerce/core build

# Run dev for specific app
pnpm --filter @ecommerce/web dev

# Install dependency in specific package
pnpm --filter @ecommerce/core add some-package
```

## Testing instructions

```bash
# Run all tests
pnpm test

# Type checking
pnpm typecheck

# Lint checking
pnpm lint

# Lint fix
pnpm lint:fix
```

**Testing standards:**
- Domain logic must be unit testable
- No tests should depend on external services
- Mock external dependencies at port boundaries

## Code style guidelines

### Architecture rules
- **Hexagonal architecture**: Domain core has no external dependencies
- **Dependency direction**: Always flows inward (`apps` → `packages/core`)
- **Port/Adapter pattern**: Use interfaces for external dependencies
- **Domain services**: Pure business logic, no side effects

### TypeScript standards
- **No `any` types** - use strict typing
- Use Zod schemas for data validation at boundaries
- Prefer `readonly` for immutable data
- Export types with `type` keyword: `export type { Product }`

### File organization
```
packages/core/src/
├── domain/
│   ├── entities/     # Core business entities
│   └── services/     # Domain business logic
├── application/
│   └── service/      # Use case orchestration
└── port/
    ├── in/          # Primary ports (use cases)
    └── out/         # Secondary ports (external deps)
```

### Naming conventions
- Use descriptive, business-oriented names
- Domain services: `ProductDomainService`
- Application services: `GetRankedProductsApplicationService`
- Ports: `GetProductsPort`, `GetRankedProductsUseCase`

## Security considerations

- Validate all external input with Zod schemas
- Never expose internal domain objects directly to external layers
- Use dependency injection for all external dependencies
- Sanitize user inputs in adapter layer

## PR guidelines

### Before submitting
1. Run `pnpm build` and `pnpm typecheck` - must pass
2. Ensure no TypeScript errors
3. Follow existing code patterns
4. Update exports in index.ts files

### Commit format
```
feat: add product ranking feature
fix: resolve type error in ProductDomainService
refactor: simplify ProductsEntity to use domain service
```

### Architecture review checklist
- [ ] Does this maintain hexagonal architecture?
- [ ] Are dependencies flowing inward?
- [ ] Is business logic in domain layer?
- [ ] Are external concerns abstracted behind ports?
- [ ] Is the code type-safe throughout?

## Common patterns

### Adding new business logic
1. Define in `domain/entities` or `domain/services`
2. Create ports in `port/in` and `port/out` as needed
3. Implement application service in `application/service`
4. Add adapters in `apps/web` layer

### Working with products
- Use `Product` type for single products
- Use `Products` type (Product[]) for collections
- Business operations go in `ProductDomainService`
- Use case orchestration in application services