/**
 * Root ESLint configuration for the Turborepo workspace.
 *
 * This is a minimal config for the root level. App/package lint rules
 * are defined in each workspace's own eslint.config.js file.
 *
 * @type {import("eslint").Linter.Config}
 */
export default [
  {
    ignores: [
      "**/node_modules/**",
      "**/.next/**",
      "**/dist/**",
      "**/.turbo/**",
      "**/coverage/**",
    ],
  },
]
