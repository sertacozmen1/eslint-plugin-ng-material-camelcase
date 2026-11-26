# eslint-plugin-ng-material

[![npm version](https://img.shields.io/npm/v/eslint-plugin-ng-material.svg)](https://www.npmjs.com/package/eslint-plugin-ng-material)
[![CI](https://github.com/sertacozmen1/eslint-plugin-ng-material-camelcase/actions/workflows/ci.yml/badge.svg)](https://github.com/sertacozmen1/eslint-plugin-ng-material-camelcase/actions/workflows/ci.yml)
[![license: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

An ESLint plugin for Angular templates. It finds the old kebab-case Angular Material button attributes (`mat-button`, `mat-raised-button`, `mat-fab`, …) and auto-fixes them to the camelCase `matButton` / `matIconButton` / `matFab` / `matMiniFab` syntax.

```html
<!-- before -->
<button mat-raised-button>Save</button>
<a mat-icon-button href="/settings">⚙</a>

<!-- after `eslint --fix` -->
<button matButton="elevated">Save</button>
<a matIconButton href="/settings">⚙</a>
```

> The npm package is **`eslint-plugin-ng-material`**. This GitHub repository is named `eslint-plugin-ng-material-camelcase`.

## Rules

| Rule | Description | Type | Auto-fix | In `recommended` |
|---|---|---|---|---|
| `ng-material/mat-button-camel-case` | Enforce camelCase Angular Material button attributes | problem | ✅ | ✅ |

`mat-button-camel-case` reports these attributes, both plain and as `[attr]` bindings:

| Reported | Fixed to |
|---|---|
| `mat-button` | `matButton` |
| `mat-icon-button` | `matIconButton` |
| `mat-raised-button` | `matButton="elevated"` |
| `mat-flat-button` | `matButton="filled"` |
| `mat-stroked-button` | `matButton="outlined"` |
| `mat-fab` | `matFab` |
| `mat-mini-fab` | `matMiniFab` |

The camelCase selectors exist in Angular Material 20 and later; the mapping was checked against the `MatButton`, `MatIconButton`, `MatFabButton` and `MatMiniFabButton` selectors in `@angular/material` 22.3.0.

`mat-raised-button`, `mat-flat-button` and `mat-stroked-button` are reported but **not auto-fixed** when they are written as a binding (`[mat-raised-button]="x"`) or carry a non-empty value (`mat-raised-button="x"`), because merging the appearance into them would produce invalid markup. Fix those by hand.

## Installation

The plugin lints Angular HTML templates, so it needs the Angular template parser:

```bash
npm install --save-dev eslint eslint-plugin-ng-material @angular-eslint/template-parser
```

Requirements:

- ESLint `^10.0.0` (flat config only)
- `@angular-eslint/template-parser` `^21.3.0 || ^22.0.0` (the first versions that support ESLint 10)
- Node.js `^20.19.0 || ^22.13.0 || >=24` (the same range as ESLint 10)

The package is published as an ES module.

## Configuration

### Recommended config

`configs.recommended` is a complete flat config: it applies to `**/*.html`, sets the Angular template parser and enables the rule.

```js
// eslint.config.js
import ngMaterial from 'eslint-plugin-ng-material';

export default [ngMaterial.configs.recommended];
```

With `defineConfig`:

```js
// eslint.config.js
import { defineConfig } from 'eslint/config';
import ngMaterial from 'eslint-plugin-ng-material';

export default defineConfig([
  {
    files: ['**/*.html'],
    extends: [ngMaterial.configs.recommended],
  },
]);
```

### Manual config

```js
// eslint.config.js
import templateParser from '@angular-eslint/template-parser';
import ngMaterial from 'eslint-plugin-ng-material';

export default [
  {
    files: ['**/*.html'],
    languageOptions: { parser: templateParser },
    plugins: { 'ng-material': ngMaterial },
    rules: {
      'ng-material/mat-button-camel-case': 'error',
    },
  },
];
```

If your project already uses `angular-eslint`, add the `plugins` and `rules` entries to your existing block for `*.html` files.

### Legacy `.eslintrc`

Not supported. ESLint 10 only reads `eslint.config.*` files (setting `ESLINT_USE_FLAT_CONFIG=false` has no effect), and this plugin no longer supports ESLint 8 or 9. If you are stuck on eslintrc, stay on `eslint-plugin-ng-material@1` (peer range `eslint ^8.57.0 || ^9.0.0`).

## Usage

```bash
npx eslint "src/**/*.html"        # report
npx eslint "src/**/*.html" --fix  # rewrite the attributes
```

## Migrating from 1.x

- ESLint 8 and 9 are no longer supported (ESLint 9 reached end of life on 2026-08-06). Upgrade to ESLint 10.
- `@angular-eslint/template-parser` is now a peer dependency (`^21.3.0 || ^22.0.0`).
- Node.js 18 is no longer supported.
- `configs.recommended` is now a complete flat config (previously it only contained `rules`).
- New: `mat-fab` → `matFab` and `mat-mini-fab` → `matMiniFab` are reported and fixed.
- Fixed: bound or valued `mat-raised-button` / `mat-flat-button` / `mat-stroked-button` no longer get an auto-fix that produced invalid markup.

## Development

```bash
npm install
npm test            # node:test + ESLint RuleTester
```

CI runs the tests on Node.js 20, 22, 24 and 26, plus against the oldest supported ESLint and template-parser versions.

## License

[MIT](LICENSE)
