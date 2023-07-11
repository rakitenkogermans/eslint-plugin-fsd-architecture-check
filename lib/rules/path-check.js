"use strict";

const path = require('path')

module.exports = {
  meta: {
    type: null,
    docs: {
      description: "FSD path checker",
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
          }
        }
      }
    ],
  },

  create(context) {
    const alias = context.options[0]?.alias || '';
    return {
      ImportDeclaration(node) {
        const value = node.source.value;
        const importTo = alias ? value.replace(`${alias}/`, '') : value;

        const fromFilename = context.getFilename();

        if (shouldBeRelative(fromFilename, importTo)) {
          context.report(node, 'In context of one slice path should be relative')
        }
      }
    };
  },
};

function isPathRelative(path) {
  return path === '.' || path.startsWith('./') || path.startsWith('../');
}

const layers = {
  'entities': 'entities',
  'features': 'features',
  'shared': 'shared',
  'pages': 'pages',
  'widgets': 'widgets',
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

  const fromNormalizedPath = path.toNamespacedPath(from);
  const fromPath = fromNormalizedPath.split('src')[1];
  const fromArray = fromPath.split(path.sep)
  const fromLayer = fromArray[1]; // entities
  const fromSlice = fromArray[2]; // Article

  if (!fromLayer || !fromSlice || !layers[fromLayer]) {
    return false;
  }

  return fromSlice === toSlice && toLayer === fromLayer;

}
