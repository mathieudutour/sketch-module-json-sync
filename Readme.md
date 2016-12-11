# sketch-module-json-sync

`sketch-module-json-sync` is sketch module to export and import a sketch file to json.

:baby_chick: experimental project

## Installation

```sh
npm i -S sketch-module-json-sync
```

## Usage

```js
import { importFromJSON, exportToJSON } from 'sketch-module-json-sync'

export default function (context) {
  exportToJSON(context)
  importFromJSON(context)
}
```

## TODO

- [ ] allow to choose directory when no sketch file opened

## License
MIT
