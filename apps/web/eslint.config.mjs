const { FlatCompat } = require('@eslint/eslintrc')
const { fixupConfigRules } = require('@eslint/compat')
const prettier = require('eslint-config-prettier')

const flatCompat = new FlatCompat()

/**
 * @type {import("eslint").Linter.Config}
 */
module.exports = [
  ...fixupConfigRules(
    flatCompat.extends('next/core-web-vitals'),
    flatCompat.extends('next/typescript')
  ),
  prettier,
]
