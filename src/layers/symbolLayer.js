import GeneralLayer from './general'

export default class SymbolLayer extends GeneralLayer {
  exportJSON () {
    console.dump(this._layer)
    return {
      ...super.exportJSON(),
      symbolId: '' + this._layer.symbolID()
    }
  }

  static importJSON (doc, json, parent, current) {
    var symbol = MSSymbolInstance.alloc().init()
    symbol.objectID = json.objectId
    symbol.setName(json.name)
    symbol.symbolID = json.symbolId
    symbol.setRect(GeneralLayer.importBound((json)))
    parent.object.addLayer(symbol)
    current.object = symbol
  }
}
