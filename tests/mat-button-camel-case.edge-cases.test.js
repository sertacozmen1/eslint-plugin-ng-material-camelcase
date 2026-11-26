import test from 'node:test';
import { RuleTester } from 'eslint';
import templateParser from '@angular-eslint/template-parser';

import rule from '../lib/rules/mat-button-camel-case.js';

const ruleTester = new RuleTester({
  languageOptions: {
    parser: templateParser,
  },
});

test('mat-button-camel-case: FAB selectors', () => {
  ruleTester.run('mat-button-camel-case', rule, {
    valid: [
      { code: '<button matFab aria-label="Add">+</button>' },
      { code: '<button matMiniFab aria-label="Add">+</button>' },
      { code: '<button matFab extended>Add</button>' },
    ],
    invalid: [
      {
        code: '<button mat-fab aria-label="Add">+</button>',
        output: '<button matFab aria-label="Add">+</button>',
        errors: [{ messageId: 'useMatFab' }],
      },
      {
        code: '<a mat-mini-fab href="/new">+</a>',
        output: '<a matMiniFab href="/new">+</a>',
        errors: [{ messageId: 'useMatMiniFab' }],
      },
      {
        code: '<button mat-fab extended>Add</button>',
        output: '<button matFab extended>Add</button>',
        errors: [{ messageId: 'useMatFab' }],
      },
    ],
  });
});

test('mat-button-camel-case: [attr] bindings', () => {
  ruleTester.run('mat-button-camel-case', rule, {
    valid: [{ code: '<button [matButton]="appearance">Save</button>' }],
    invalid: [
      {
        code: '<button [mat-button]="isPrimary">Save</button>',
        output: '<button [matButton]="isPrimary">Save</button>',
        errors: [{ messageId: 'useMatButton', line: 1, column: 9, endLine: 1, endColumn: 33 }],
      },
      {
        code: '<button [mat-icon-button]="flag">Save</button>',
        output: '<button [matIconButton]="flag">Save</button>',
        errors: [{ messageId: 'useMatIconButton' }],
      },
      {
        // The appearance cannot be merged into a binding, so this is reported without a fix.
        code: '<button [mat-raised-button]="flag">Save</button>',
        output: null,
        errors: [{ messageId: 'useMatButtonElevated' }],
      },
    ],
  });
});

test('mat-button-camel-case: attributes with values', () => {
  ruleTester.run('mat-button-camel-case', rule, {
    valid: [],
    invalid: [
      {
        code: '<button mat-button="">Save</button>',
        output: '<button matButton="">Save</button>',
        errors: [{ messageId: 'useMatButton' }],
      },
      {
        code: '<button mat-icon-button="settings">Save</button>',
        output: '<button matIconButton="settings">Save</button>',
        errors: [{ messageId: 'useMatIconButton' }],
      },
      {
        code: '<button mat-flat-button="">Save</button>',
        output: '<button matButton="filled">Save</button>',
        errors: [{ messageId: 'useMatButtonFilled' }],
      },
      {
        // Replacing would drop "legacy" or produce matButton="outlined"="legacy"; report only.
        code: '<button mat-stroked-button="legacy">Save</button>',
        output: null,
        errors: [{ messageId: 'useMatButtonOutlined' }],
      },
    ],
  });
});

test('mat-button-camel-case: multiple attributes on one element', () => {
  ruleTester.run('mat-button-camel-case', rule, {
    valid: [{ code: '<button matButton="filled" color="primary" type="submit" disabled>Save</button>' }],
    invalid: [
      {
        code: '<button color="primary" mat-flat-button type="submit" disabled>Save</button>',
        output: '<button color="primary" matButton="filled" type="submit" disabled>Save</button>',
        errors: [{ messageId: 'useMatButtonFilled', line: 1, column: 25, endLine: 1, endColumn: 40 }],
      },
      {
        code: '<a mat-stroked-button mat-icon-button href="#">Go</a>',
        output: '<a matButton="outlined" matIconButton href="#">Go</a>',
        errors: [{ messageId: 'useMatButtonOutlined' }, { messageId: 'useMatIconButton' }],
      },
      {
        code: '<button\n  mat-raised-button\n  type="submit"\n>\n  Save\n</button>',
        output: '<button\n  matButton="elevated"\n  type="submit"\n>\n  Save\n</button>',
        errors: [{ messageId: 'useMatButtonElevated', line: 2, column: 3, endLine: 2, endColumn: 20 }],
      },
      {
        code: '<div><button mat-button>A</button><button mat-raised-button>B</button></div>',
        output: '<div><button matButton>A</button><button matButton="elevated">B</button></div>',
        errors: [{ messageId: 'useMatButton' }, { messageId: 'useMatButtonElevated' }],
      },
    ],
  });
});
