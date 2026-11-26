import { readFileSync } from 'node:fs';
import templateParser from '@angular-eslint/template-parser';

import matButtonCamelCaseRule from './lib/rules/mat-button-camel-case.js';

const pkg = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf8'));

const plugin = {
	meta: {
		name: pkg.name,
		version: pkg.version,
		namespace: 'ng-material',
	},
	rules: {
		'mat-button-camel-case': matButtonCamelCaseRule,
	},
	configs: {},
};

// Flat config: parses Angular HTML templates and turns on every rule of this plugin.
plugin.configs.recommended = {
	name: 'ng-material/recommended',
	files: ['**/*.html'],
	languageOptions: {
		parser: templateParser,
	},
	plugins: {
		'ng-material': plugin,
	},
	rules: {
		'ng-material/mat-button-camel-case': 'error',
	},
};

export default plugin;
export const meta = plugin.meta;
export const rules = plugin.rules;
export const configs = plugin.configs;
