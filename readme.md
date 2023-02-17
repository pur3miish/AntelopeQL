![smartql logo](/static/smartql.svg)

# SmartQL

[![NPM Package](https://img.shields.io/npm/v/smartql.svg)](https://www.npmjs.org/package/smartql) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://github.com/pur3miish/smartql/blob/main/LICENSE)

A [GraphQL](https://graphql.org/) implementation for interacting with **[Antelope](https://antelope.io/)** based blockchains.

## Live example

For a SmartQL GUI [smartql.relocke.io](https://smartql.relocke.io).

![smartql screenshot](/static/smartql-screen.png)

## Installation

For [Node.js](https://nodejs.org), to install [`smartql`](https://npm.im/eos-ecc) and the peer dependency [`graphql`](https://npm.im/graphql) run:

```sh
npm install smartql graphql
```

## Examples

See the examples folder on how to run SmartQL as a [Node.js](https://nodejs.org) endpoint.

```js
import SmartQL from "smartql";
```

## Requirements

Supported runtime environments:

- [Node.js](https://nodejs.org) versions `>=16.0.0`.
- Browsers matching the [Browserslist](https://browsersl.ist) query [`> 0.5%, not OperaMini all, not dead`](https://browsersl.ist/?q=%3E+0.5%25%2C+not+OperaMini+all%2C+not+dead).
