/**
 * Commitlint configuration for conventional commits.
 *
 * Enforces commit message format: type(scope?): subject
 *
 * Types: feat, fix, docs, style, refactor, perf, test, build, ci, chore, revert
 * @see https://www.conventionalcommits.org/
 */
export default {
  extends: ["@commitlint/config-conventional"],
  rules: {
    // Type enum
    "type-enum": [
      2,
      "always",
      [
        "feat", // New feature
        "fix", // Bug fix
        "docs", // Documentation changes
        "style", // Code style changes (formatting, etc.)
        "refactor", // Code refactoring
        "perf", // Performance improvements
        "test", // Adding or updating tests
        "build", // Build system changes
        "ci", // CI/CD changes
        "chore", // Other changes
        "revert", // Revert a previous commit
      ],
    ],
    // Subject case: don't enforce case
    "subject-case": [0],
    // Subject empty: not allowed
    "subject-empty": [2, "never"],
    // Type empty: not allowed
    "type-empty": [2, "never"],
    // Scope empty: allow
    "scope-empty": [0],
    // Body max line length
    "body-max-line-length": [2, "always", 100],
    // Footer max line length
    "footer-max-line-length": [2, "always", 100],
    // Header max length
    "header-max-length": [2, "always", 100],
  },
}
