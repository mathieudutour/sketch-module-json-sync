import { colorToString } from '../util'
import { parseStyle } from '../importUtils'
import GeneralLayer from './general'

export default class SymbolMasterLayer extends GeneralLayer {
  symbolId () {
    return ('' + this._layer.symbolID())
  }

  styles () {
    return {
      ...super.styles(),
      ...this.background()
    }
  }

  background () {
    var re = {}

    if (this._layer.hasBackgroundColor()) {
      var bgColor = this._layer.backgroundColor()
      re.hasBackgroundColor = true
      re.backgroundColor = colorToString(bgColor)
    }

    return re
  }

  static importJSON (doc, json, parent, current) {
    var s = parseStyle(json.styles)
    var symbol = MSSymbolMaster.alloc().initWithFrame(s.rect)
    symbol.objectID = json.objectId
    symbol.setName(json.name)
    symbol.symbolID = json.symbolId
    if (s.hasBackgroundColor) {
      symbol.hasBackgroundColor = true
      symbol.backgroundColor = s.backgroundColor
    }
    if (parent) {
      parent.object.addLayer(symbol)
    }
    current.object = symbol
  }
}
