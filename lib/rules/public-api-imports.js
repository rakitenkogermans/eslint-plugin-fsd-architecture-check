const path = require('path');
const {isPathRelative} = require("../helpers");
const micromatch = require("micromatch");

module.exports = {
  meta: {
    type: null,
    docs: {
      description: "Description",
      recommended: false,
      url: null,
    },
    fixable: null,
    schema: [
      {
        type: 'object',
        properties: {
          alias: {
            type: 'string'
          },
          testFiles: {
            type: 'array'
          }
        }
      }
    ],
  },

  create(context) {
    const layers = {
      'entities': 'entities',
      'features': 'features',
      'pages': 'pages',
      'widgets': 'widgets',
    }

    const { alias = '', testFiles = [] } = context.options[0] ?? {};
    return {
      ImportDeclaration(node) {
        const value = node.source.value;
        const importTo = alias ? value.replace(`${alias}/`, '') : value;

        if (isPathRelative(importTo)) {
          return
        }

        const segments = importTo.split('/');

        const layer = segments[0];

        if (!layers[layer]) {
          return;
        }

        const isImportNotFromPublicApi = segments.length > 2;
        const isTestingPublicApi = segments[2] === 'testing' && segments.length < 4

        if (isImportNotFromPublicApi && !isTestingPublicApi) {
          context.report(node, 'Absolute import is allowed only from Public API (index.ts)')
        }

        if (isTestingPublicApi) {
          const currentFilePath = context.getFilename();
          const normalizedPath = path
              .toNamespacedPath(currentFilePath)
              .replace(/\\/g, '/')

          const isCurrentFileTesting = testFiles.some(
              pattern => micromatch.isMatch(normalizedPath, pattern)
          );

          if (!isCurrentFileTesting) {
            context.report(node, 'Test data import should be from publicApi/testing.ts')
          }
        }
      }
    };
  },
};
