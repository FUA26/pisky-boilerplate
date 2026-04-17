/**
 * Prettier configuration for the repository.
 *
 * This config is used by all packages and apps in the monorepo.
 * @type {import("prettier").Config}
 */
export default {
  // Use single quotes instead of double quotes
  singleQuote: true,

  // No trailing commas (keep it clean)
  trailingComma: 'es5',

  // Use 2 spaces for indentation
  tabWidth: 2,

  // Use spaces instead of tabs
  useTabs: false,

  // Print semicolons
  semi: true,

  // Use single quotes in JSX
  jsxSingleQuote: false,

  // Bracket spacing
  bracketSpacing: true,

  // Arrow function parentheses
  arrowParens: 'always',

  // End of line
  endOfLine: 'lf',

  // Plugin for Tailwind CSS class sorting
  plugins: ['prettier-plugin-tailwindcss'],
}
