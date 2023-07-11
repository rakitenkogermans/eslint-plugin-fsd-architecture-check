/**
 * @fileoverview FSD path checker
 * @author germans
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/path-check"),
  RuleTester = require("eslint").RuleTester;


//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({parserOptions: {ecmaVersion: 6, sourceType: 'module'}});
ruleTester.run("fsd-architecture-check", rule, {
  valid: [
    {
      filename: '\\home\\germans\\react\\react-production-app\\src\\pages\\ArticleDetailsPage\\ui\\ArticleDetailsPage',
      code: "import { NotificationItem } from '../NotificationItem/NotificationItem';",
      errors: [],
    },
    {
      filename: '\\home\\germans\\react\\react-production-app\\src\\pages\\ArticleDetailsPage\\ui\\ArticleDetailsPage',
      code: "import { NotificationItem } from '@/entities/Notification';",
      errors: [],
    },
  ],

  invalid: [
    {
      filename: '\\home\\germans\\react\\react-production-app\\src\\entities\\Notification',
      code: "import { NotificationItem } from 'entities/Notification';",
      errors: [{ message: "In context of one slice path should be relative" }],
    },
    {
      filename: '\\home\\germans\\react\\react-production-app\\src\\entities\\Notification',
      code: "import { NotificationItem } from '@/entities/Notification';",
      errors: [{ message: "In context of one slice path should be relative" }],
      options: [
        {
          alias: '@'
        }
      ]
    },
  ],
});
