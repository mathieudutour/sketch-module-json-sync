import GeneralLayer from './general'
import { isNull } from '../util'
import { parseStyle } from '../importUtils'

export default class PathLayer extends GeneralLayer {
  path () {
    return '' + this._layer.bezierPath().svgPathAttribute()
  }

  static importJSON (doc, json, parent, current) {
    if (!isNull(parent) && !parent.object) {
      return
    }

    if (!json.path) {
      return
    }

    var s = parseStyle(json.styles)
    var layer = MSShapePathLayer.alloc().init()
    layer.objectID = json.objectId

    var isClose = false
    var svgAttr = json.path
    var regex = new RegExp(' [MLC]?([e0-9,.-]+) Z"$')
    if (regex.test(svgAttr)) {
      isClose = true
    }
    var svg = '<svg><path ' + svgAttr + '></path></svg>'
    var path = NSBezierPath.bezierPathFromSVGString(svg)
    layer.bezierPath = path

    if (isClose) {
      layer.closeLastPath(true)
    }

    if (s.rotation) {
      layer.rotation = s.rotation
    }

    layer.setName(json.name)
    parent.object.addLayer(layer)
  }
}
