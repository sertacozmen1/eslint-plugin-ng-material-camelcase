# eslint-plugin-ng-material

[![npm version](https://img.shields.io/npm/v/eslint-plugin-ng-material.svg)](https://www.npmjs.com/package/eslint-plugin-ng-material)
[![license: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

An ESLint plugin for Angular templates. It finds the old kebab-case Angular Material button attributes (`mat-button`, `mat-raised-button`, …) and auto-fixes them to the camelCase `matButton` / `matIconButton` syntax.

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

| Rule | Description | Type | Auto-fix |
|---|---|---|---|
| `ng-material/mat-button-camel-case` | Enforce camelCase Angular Material button attributes | problem | ✅ |

`mat-button-camel-case` reports these attributes, both plain and as `[attr]` bindings:

| Reported | Fixed to |
|---|---|
| `mat-button` | `matButton` |
| `mat-icon-button` | `matIconButton` |
| `mat-raised-button` | `matButton="elevated"` |
| `mat-flat-button` | `matButton="filled"` |
| `mat-stroked-button` | `matButton="outlined"` |

## Installation

The plugin lints Angular HTML templates, so it needs the Angular template parser:

```bash
npm install --save-dev eslint eslint-plugin-ng-material @angular-eslint/template-parser
```

Requirements: ESLint `^8.57.0 || ^9.0.0`, Node.js 18 or later. The package is published as an ES module.

## Configuration

### Flat config (`eslint.config.js`, ESLint 9)

```js
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

### Legacy config (`.eslintrc.json`, ESLint 8)

```json
{
  "overrides": [
    {
      "files": ["*.html"],
      "parser": "@angular-eslint/template-parser",
      "plugins": ["ng-material"],
      "rules": {
        "ng-material/mat-button-camel-case": "error"
      }
    }
  ]
}
```

ESLint 8 loads legacy plugins with `require()`. Because this package is ESM-only, the legacy setup needs a Node.js version that can `require()` ES modules (20.19+ or 22.12+). It was checked with ESLint 8.57.1 on Node.js 24.

## Usage

```bash
npx eslint "src/**/*.html"        # report
npx eslint "src/**/*.html" --fix  # rewrite the attributes
```

## Development

```bash
npm install
npm test            # node:test + ESLint RuleTester (5 valid and 5 invalid cases)
```

## License

[MIT](LICENSE)
