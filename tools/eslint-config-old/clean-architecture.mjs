export default [
  // === DOMAIN LAYER CONSTRAINTS ===
  // Domain is the innermost layer - cannot depend on any other business layers
  {
    files: ["**/src/domain/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            // Cannot import from outer layers
            {
              group: ["**/application/**"],
              message:
                "❌ Domain layer cannot import from Application layer (Hexagonal Architecture violation)",
            },
            {
              group: ["**/port/**"],
              message:
                "❌ Domain layer cannot import from Port layer (Hexagonal Architecture violation)",
            },
            // Cannot import from adapters (should be in apps layer anyway)
            {
              group: ["**/adapters/**", "**/adapter/**"],
              message:
                "❌ Domain layer cannot import from Adapters (Hexagonal Architecture violation)",
            },
            // Cannot import from infrastructure
            {
              group: ["**/infrastructure/**", "**/infra/**"],
              message:
                "❌ Domain layer cannot import from Infrastructure (Hexagonal Architecture violation)",
            },
          ],
        },
      ],
    },
  },

  // === PORT LAYER CONSTRAINTS ===
  // Ports define interfaces but cannot depend on application logic or adapters
  {
    files: ["**/src/port/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            // Cannot import from application layer
            {
              group: ["**/application/**"],
              message:
                "❌ Port layer cannot import from Application layer (Hexagonal Architecture violation)",
            },
            // Cannot import from adapters
            {
              group: ["**/adapters/**", "**/adapter/**"],
              message:
                "❌ Port layer cannot import from Adapters (Hexagonal Architecture violation)",
            },
            // Cannot import from infrastructure
            {
              group: ["**/infrastructure/**", "**/infra/**"],
              message:
                "❌ Port layer cannot import from Infrastructure (Hexagonal Architecture violation)",
            },
          ],
        },
      ],
    },
  },

  // === APPLICATION LAYER CONSTRAINTS ===
  // Application can use domain and ports, but not adapters/infrastructure
  {
    files: ["**/src/application/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            // Cannot import from adapters (violates dependency inversion)
            {
              group: ["**/adapters/**", "**/adapter/**"],
              message:
                "❌ Application layer cannot import from Adapters (Hexagonal Architecture violation - use dependency injection)",
            },
            // Cannot import from infrastructure
            {
              group: ["**/infrastructure/**", "**/infra/**"],
              message:
                "❌ Application layer cannot import from Infrastructure (Hexagonal Architecture violation - use ports)",
            },
          ],
        },
      ],
    },
  },

  // === INFRASTRUCTURE/ADAPTER CONSTRAINTS ===
  // Adapters can import from any layer (they're the outermost layer)
  // But they should primarily interact through ports
  {
    files: [
      "**/src/infrastructure/**/*.{ts,tsx}",
      "**/src/adapters/**/*.{ts,tsx}",
      "**/src/adapter/**/*.{ts,tsx}",
    ],
    rules: {
      "no-restricted-imports": [
        "warn", // Warning instead of error for flexibility
        {
          patterns: [
            // Discourage direct domain imports (should go through application/ports)
            {
              group: ["**/domain/**"],
              message:
                "⚠️ Adapters should interact with domain through Application layer and Ports (Hexagonal Architecture best practice)",
            },
          ],
        },
      ],
    },
  },
];
