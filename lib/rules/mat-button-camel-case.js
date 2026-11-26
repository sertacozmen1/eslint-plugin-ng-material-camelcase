/**
 * Enforce the camelCase Angular Material button selectors (`matButton`, `matIconButton`, `matFab`, `matMiniFab`)
 * instead of the older kebab-case attributes (`mat-button`, `mat-raised-button`, ...), with auto-fix.
 */

/**
 * Kebab-case attribute -> camelCase replacement.
 *
 * `appearance: true` marks attributes whose replacement carries a value (`matButton="elevated"`).
 * Those are only auto-fixed when the original attribute is a plain attribute without a value;
 * otherwise the fix would produce invalid markup such as `matButton="elevated"="foo"`.
 */
const MAPPINGS = new Map([
  ['mat-button', { messageId: 'useMatButton', replacement: 'matButton' }],
  ['mat-icon-button', { messageId: 'useMatIconButton', replacement: 'matIconButton' }],
  ['mat-raised-button', { messageId: 'useMatButtonElevated', replacement: 'matButton="elevated"', appearance: true }],
  ['mat-flat-button', { messageId: 'useMatButtonFilled', replacement: 'matButton="filled"', appearance: true }],
  ['mat-stroked-button', { messageId: 'useMatButtonOutlined', replacement: 'matButton="outlined"', appearance: true }],
  ['mat-fab', { messageId: 'useMatFab', replacement: 'matFab' }],
  ['mat-mini-fab', { messageId: 'useMatMiniFab', replacement: 'matMiniFab' }],
]);

const messages = Object.fromEntries(
  [...MAPPINGS].map(([attribute, { messageId, replacement }]) => [
    messageId,
    `Use "${replacement.replaceAll('"', '\\"')}" instead of "${attribute}". Angular Material uses camelCase attribute syntax.`,
  ]),
);

/** @type {import('eslint').Rule.RuleModule} */
const matButtonCamelCaseRule = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Enforce camelCase usage for Angular Material button directives (matButton, matIconButton, matFab, matMiniFab)',
      recommended: true,
      url: 'https://github.com/sertacozmen1/eslint-plugin-ng-material-camelcase#rules',
    },
    fixable: 'code',
    messages,
    schema: [],
  },

  create(context) {
    const { sourceCode } = context;

    return {
      // Plain attributes on elements, e.g. <button mat-button>
      Element(node) {
        if (!node.attributes) return;

        for (const attr of node.attributes) {
          check(attr, { bound: false }, context, sourceCode);
        }
      },

      // Property bindings, e.g. <button [mat-button]="x">
      BoundAttribute(node) {
        check(node, { bound: true }, context, sourceCode);
      },
    };
  },
};

function check(node, { bound }, context, sourceCode) {
  const attribute = node.name;
  const mapping = MAPPINGS.get(attribute);
  if (!mapping) return;

  // A value-carrying replacement can only be applied to a bare attribute (`mat-raised-button`
  // or `mat-raised-button=""`). Report the rest without a fix instead of producing broken markup.
  const canFix = !mapping.appearance || (!bound && node.value === '');

  context.report({
    node,
    messageId: mapping.messageId,
    loc: toLoc(node.sourceSpan),
    fix: canFix ? (fixer) => createFix(fixer, node, sourceCode, attribute, mapping) : null,
  });
}

function toLoc(span) {
  if (!span) return undefined;

  return {
    start: { line: span.start.line + 1, column: span.start.col },
    end: { line: span.end.line + 1, column: span.end.col },
  };
}

function createFix(fixer, node, sourceCode, attribute, { replacement, appearance }) {
  if (!node.sourceSpan) return null;

  const start = node.sourceSpan.start.offset;
  const end = node.sourceSpan.end.offset;

  if (appearance) {
    // Bare attribute (optionally with an empty value): replace the whole attribute.
    return fixer.replaceTextRange([start, end], replacement);
  }

  // Rename the attribute while preserving brackets and any value.
  const text = sourceCode.text.slice(start, end);
  return fixer.replaceTextRange([start, end], text.replace(attribute, replacement));
}

export { MAPPINGS };
export default matButtonCamelCaseRule;
