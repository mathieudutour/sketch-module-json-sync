import GeneralLayer from './general'
import { isNull } from '../util'

export default class PathLayer extends GeneralLayer {
  exportJSON () {
    return {
      ...super.exportJSON(),
      path: '' + this._layer.bezierPath().svgPathAttribute()
    }
  }

  static importJSON (doc, json, parent, current) {
    if (!isNull(parent) && !parent.object) {
      return
    }

    if (!json.path) {
      return
    }

    var layer = MSShapePathLayer.alloc().init()
    GeneralLayer.importLayerProps(layer, json)

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

    parent.object.addLayer(layer)
  }
}
