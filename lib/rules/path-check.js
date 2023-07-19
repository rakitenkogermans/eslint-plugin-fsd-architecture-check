"use strict";

const path = require('path');
const {isPathRelative} = require("../helpers");

module.exports = {
  meta: {
    type: null,
    docs: {
      description: "FSD path checker",
      recommended: false,
      url: null,
    },
    fixable: 'code',
    schema: [
      {
        type: 'object',
        properties: {
          alias: {
            type: 'string'
          }
        }
      }
    ],
  },

  create(context) {
    const { alias = '' } = context.options[0] ?? {};
    return {
      ImportDeclaration(node) {
        const value = node.source.value;
        const importTo = alias ? value.replace(`${alias}/`, '') : value;

        const fromFilename = context.getFilename();

        if (shouldBeRelative(fromFilename, importTo)) {
          context.report({
            node,
            message: 'In context of one slice path should be relative',
            fix: (fixer) => {
              const normalizedPath = getNormalizedCurrentFilePath(fromFilename).split(path.sep).slice(0, -1).join('/');
              let relativePath = path.relative(normalizedPath, `/${importTo}`).split(path.sep).join('/');

              if (!relativePath.startsWith('.')) {
                relativePath = './' + relativePath;
              }

              return fixer.replaceText(node.source, `'${relativePath}'`)
            }})
        }
      }
    };
  },
};

const layers = {
  'entities': 'entities',
  'features': 'features',
  'shared': 'shared',
  'pages': 'pages',
  'widgets': 'widgets',
}

function getNormalizedCurrentFilePath(currentFilePath) {
  const fromNormalizedPath = path.toNamespacedPath(currentFilePath).replace(/\\/g, '/');
  return fromNormalizedPath.split('src')[1];
}

function shouldBeRelative(from, to) {
  if (isPathRelative(to)) {
    return false;
  }

  const toArray = to.split('/');
  const toLayer = toArray[0];
  const toSlice = toArray[1];

  if (!toLayer || !toSlice || !layers[toLayer]) {
    return false;
  }

  const projectFrom = getNormalizedCurrentFilePath(from);
  const fromArray = projectFrom.split(path.sep)

  const fromLayer = fromArray[1]; // entities
  const fromSlice = fromArray[2]; // Article

  if (!fromLayer || !fromSlice || !layers[fromLayer]) {
    return false;
  }

  return fromSlice === toSlice && toLayer === fromLayer;
}
