import { colorToString } from '../util'
import { parseStyle } from '../importUtils'
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
      var bgColor = this._layer.backgroundColor()
      re.hasBackgroundColor = true
      re.backgroundColor = colorToString(bgColor)
    }

    return re
  }

  static importJSON (doc, json, parent, current) {
    var artboard = MSArtboardGroup.alloc().init()
    artboard.objectID = json.objectId
    artboard.setName(json.name)
    var s = parseStyle(json.styles)
    artboard.setRect(s.rect)
    if (s.hasBackgroundColor) {
      artboard.hasBackgroundColor = s.hasBackgroundColor
      artboard.backgroundColor = s.backgroundColor
    }
    parent.object.addLayer(artboard)
    current.object = artboard
  }
}
