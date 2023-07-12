/**
 * @fileoverview Eslint plugin for FSD architecture
 * @author germans
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------
const pathCheck = require('./rules/path-check');
const layerImports = require('./rules/layer-imports');
const publicApiImports = require('./rules/public-api-imports');

//------------------------------------------------------------------------------
// Plugin Definition
//------------------------------------------------------------------------------

// import all rules in lib/rules
module.exports = {
    rules: {
        'path-check': pathCheck,
        'layer-imports': layerImports,
        'public-api-imports': publicApiImports
    }
}



