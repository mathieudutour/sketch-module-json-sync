import GeneralLayer from './general'
import { parseStyle } from '../importUtils'

export default class SymbolLayer extends GeneralLayer {
  symbolId () {
    return ('' + this._layer.symbolID())
  }

  static importJSON (doc, json, parent, current) {
    var s = parseStyle(json.styles)
    var symbol = MSSymbolInstance.alloc().init()
    symbol.objectID = json.objectId
    symbol.setName(json.name)
    symbol.symbolID = json.symbolId
    symbol.setRect(s.rect)
    parent.object.addLayer(symbol)
    current.object = symbol
  }
}
