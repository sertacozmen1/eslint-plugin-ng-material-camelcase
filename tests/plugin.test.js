import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { Linter } from 'eslint';
import templateParser from '@angular-eslint/template-parser';

import plugin, { configs, rules } from '../index.js';

const pkg = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));

test('plugin meta comes from package.json', () => {
  assert.equal(plugin.meta.name, pkg.name);
  assert.equal(plugin.meta.version, pkg.version);
  assert.equal(plugin.meta.namespace, 'ng-material');
});

test('named exports match the default export', () => {
  assert.equal(rules, plugin.rules);
  assert.equal(configs, plugin.configs);
  assert.deepEqual(Object.keys(plugin.rules), ['mat-button-camel-case']);
});

test('recommended config is a complete flat config for HTML templates', () => {
  const { recommended } = plugin.configs;

  assert.deepEqual(recommended.files, ['**/*.html']);
  assert.equal(recommended.languageOptions.parser, templateParser);
  assert.equal(recommended.plugins['ng-material'], plugin);
  assert.deepEqual(recommended.rules, { 'ng-material/mat-button-camel-case': 'error' });
});

test('recommended config lints and fixes an HTML template on its own', () => {
  const linter = new Linter();
  const code = '<button mat-raised-button>Save</button>\n<a mat-icon-button href="/settings">S</a>\n';

  const messages = linter.verify(code, [plugin.configs.recommended], { filename: 'app.component.html' });
  assert.deepEqual(
    messages.map((m) => [m.ruleId, m.messageId, m.line]),
    [
      ['ng-material/mat-button-camel-case', 'useMatButtonElevated', 1],
      ['ng-material/mat-button-camel-case', 'useMatIconButton', 2],
    ],
  );

  const { fixed, output } = linter.verifyAndFix(code, [plugin.configs.recommended], {
    filename: 'app.component.html',
  });
  assert.equal(fixed, true);
  assert.equal(output, '<button matButton="elevated">Save</button>\n<a matIconButton href="/settings">S</a>\n');
});

test('recommended config does not apply to non-HTML files', () => {
  const linter = new Linter();
  const messages = linter.verify('const x = 1;\n', [plugin.configs.recommended], { filename: 'app.component.ts' });

  // Linter reports a single "no matching configuration" warning for files outside `files`.
  assert.ok(messages.every((m) => m.ruleId !== 'ng-material/mat-button-camel-case'));
});
