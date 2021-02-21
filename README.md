TODO: klp-json teaser

:horse:`klp-json` is a JSON plugin for `klp` (Kelpie), the small, fast, and magical command-line data processor.

See the [`klp` github repository][klp] for more details!

[![node version][shield-node]][node]
[![npm version][shield-npm]][npm-package]
[![license][shield-license]][license]
[![PRs Welcome][shield-prs]][contribute]
[![linux unit tests status][shield-unit-tests-linux]][actions]
[![macos unit tests status][shield-unit-tests-macos]][actions]
[![windows unit tests status][shield-unit-tests-windows]][actions]

## Installation

> :ok_hand: `klp-json` comes preinstalled in `klp`.
> No installation necessary.
> If you still want to install it, proceed as described below.

`klp-json` is installed in `~/.klp/` as follows:

```bash
npm install klp-json
```

The plugin is included in `~/.klp/index.js` as follows:

```js
const json = require('klp-json')

module.exports = {
  plugins:  [json],
  context:  {},
  defaults: {}
}
```

For a much more detailed description, see the [`.klp` module documentation][klp-module].

## Extensions

This plugin comes with the following `klp` extensions:

|                     | Description                                                                                                                                                                                                                  |
|---------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `jsonObj` chunker   | Searches the data for JSON objects and returns each object as a chunk. All data between objects is dropped. This is useful in a streaming context, or when deserializing files containing one big JSON list of JSON objects. |
| `json` deserializer | Deserializes data into JSON. Uses JSON.parse internally.                                                                                                                                                                     |
| `json` serializer   | Serializes transformed JSON into JSON using JSON.stringify.                                                                                                                                                                  |

## Limitations

This plugin has the following limitations:

1.  **No BigInt Support:**
    Since JSON [does not support BigInt][json-bigint], `klp-json` does not support it either.
    If you need to pass BigInts, encode them as strings and not as numbers.
2.  **No JSON-Stream Chunker for Non-Objects:**
    Currently, `klp-json` only ships with a JSON object chunker for data streams.
    This may change in the future.
3.  **Integer Key Ordering:**
    The json serializer may order JSON object keys in surprising ways.
    Keys that are integers are always moved to the beginning and sorted in ascending order.
    All other keys come after these integer keys.
    This is [how JavaScript generally handles object keys][json-keys-ordering] and `klp-json` makes no exception.

## Reporting Issues

Please report issues [in the tracker][issues]!

## License

`klp-json` is [MIT licensed][license].

[actions]: https://github.com/Yord/klp-json/actions
[contribute]: https://github.com/Yord/klp
[issues]: https://github.com/Yord/klp/issues
[json-bigint]: https://stackoverflow.com/questions/18755125/node-js-is-there-any-proper-way-to-parse-json-with-large-numbers-long-bigint
[json-keys-ordering]: https://stackoverflow.com/questions/30076219/does-es6-introduce-a-well-defined-order-of-enumeration-for-object-properties#answer-30919039
[klp]: https://github.com/Yord/klp
[klp-module]: https://github.com/Yord/klp#klp-module
[license]: https://github.com/Yord/klp-json/blob/master/LICENSE
[node]: https://nodejs.org/
[npm-package]: https://www.npmjs.com/package/klp-json
[shield-license]: https://img.shields.io/npm/l/klp-json?color=yellow&labelColor=313A42
[shield-node]: https://img.shields.io/node/v/klp-json?color=red&labelColor=313A42
[shield-npm]: https://img.shields.io/npm/v/klp-json.svg?color=orange&labelColor=313A42
[shield-prs]: https://img.shields.io/badge/PRs-welcome-green.svg?labelColor=313A42
[shield-unit-tests-linux]: https://github.com/Yord/klp-json/workflows/linux/badge.svg?branch=master
[shield-unit-tests-macos]: https://github.com/Yord/klp-json/workflows/macos/badge.svg?branch=master
[shield-unit-tests-windows]: https://github.com/Yord/klp-json/workflows/windows/badge.svg?branch=master