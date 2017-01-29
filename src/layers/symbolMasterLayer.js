import { importColor, exportColor } from '../NS/color'
import GeneralLayer from './general'

export default class SymbolMasterLayer extends GeneralLayer {
  exportJSON () {
    return {
      ...super.exportJSON(),
      symbolId: '' + this._layer.symbolID()
    }
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
      re.hasBackgroundColor = true
      re.backgroundColor = exportColor(this._layer.backgroundColor())
    }

    return re
  }

  static importJSON (doc, json, parent, current) {
    var symbol = MSSymbolMaster.alloc().initWithFrame(GeneralLayer.importBound(json))
    symbol.objectID = json.objectId
    symbol.setName(json.name)
    symbol.symbolID = json.symbolId
    if (json.styles.hasBackgroundColor) {
      symbol.hasBackgroundColor = true
      symbol.backgroundColor = importColor(json.styles.backgroundColor)
    }
    if (parent) {
      parent.object.addLayer(symbol)
    }
    current.object = symbol
  }
}
