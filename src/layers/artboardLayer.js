import { importColor, exportColor } from '../NS/color'
import GeneralLayer from './general'

export default class ArtboardLayer extends GeneralLayer {
  styles () {
    return {
      ...super.styles(),
      ...this.artboardCssBackground()
    }
  }

  artboardCssBackground () {
    var re = {}

    if (this._layer.hasBackgroundColor()) {
      re.hasBackgroundColor = true
      re.backgroundColor = exportColor(this._layer.backgroundColor())
    }

    return re
  }

  static importJSON (doc, json, parent, current) {
    var artboard = MSArtboardGroup.alloc().init()
    artboard.objectID = json.objectId
    artboard.setName(json.name)
    artboard.setRect(GeneralLayer.importBound(json))
    if (json.styles.hasBackgroundColor) {
      artboard.hasBackgroundColor = true
      artboard.backgroundColor = importColor(json.styles.backgroundColor)
    }
    parent.object.addLayer(artboard)
    current.object = artboard
  }
}
