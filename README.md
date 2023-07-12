# eslint-plugin-fsd-architecture-check

Eslint plugin for FSD architecture

## Installation

You'll first need to install [ESLint](https://eslint.org/):

```sh
npm i eslint --save-dev
```

Next, install `eslint-plugin-fsd-architecture-check`:

```sh
npm install eslint-plugin-fsd-architecture-check --save-dev
```

## Usage

Add `fsd-architecture-check` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```json
{
    "plugins": [
        "fsd-architecture-check"
    ]
}
```


Then configure the rules you want to use under the rules section.

```json
{
    "rules": {
        "fsd-architecture-check/rule-name": 2
    }
}
```

## Rules

<!-- begin auto-generated rules list -->

| Name                                                   | Description      |
| :----------------------------------------------------- | :--------------- |
| [layer-imports](docs/rules/layer-imports.md)           | Description      |
| [path-check](docs/rules/path-check.md)                 | FSD path checker |
| [public-api-imports](docs/rules/public-api-imports.md) | Description      |

<!-- end auto-generated rules list -->


