import { imageId, isNull } from '../util'
import { exportStyle, importStyle } from '../sharedStyle'
import * as types from './types'
import GeneralLayer from './general'

const objcMap = {
  [types.OVAL]: MSOvalShape,
  [types.RECTANGLE]: MSRectangleShape,
  [types.COMBINED_SHAPE]: MSShapePathLayer,
  [types.SHAPE_PATH]: MSShapePathLayer
}

export default class ShapeGroupLayer extends GeneralLayer {
  styles () {
    if (this.className() != 'MSShapeGroup') {
      return {
        ...super.styles(),
        ...this.booleanOperation()
      }
    }

    return {
      ...super.styles(),
      ...exportStyle(this._layer.styleGeneric(), this.savedImages),
      ...(this._layer.hasClippingMask() == 1 && {mask: 'initial'})
    }
  }

  booleanOperation () {
    var operationStr = ''
    var operation = this._layer.booleanOperation()
    if (operation < 0) {
      return {}
    }

    if (operation === 0) {
      operationStr = 'union'
    } else if (operation === 1) {
      operationStr = 'subtract'
    } else if (operation === 2) {
      operationStr = 'intersect'
    } else if (operation === 3) {
      operationStr = 'difference'
    }

    return {
      booleanOperation: operationStr
    }
  }

  images () {
    var re = []

    if (this.className() != 'MSShapeGroup') {
      return re
    }

    var fills = this._layer.styleGeneric().fills()
    for (var i = 0; i < fills.length; i++) {
      if (fills[i].fillType() == 4) {
        var image = fills[i].image()
        re.push({
          name: imageId(image),
          image: image.image()
        })
      }
    }

    return re
  }

  static importJSON (doc, json, parent, current) {
    if (!isNull(parent) && !parent.object) {
      return
    }

    const type = objcMap[json.type]

    var group
    if (type !== MSShapePathLayer) {
      var shape = type.alloc().init()
      shape.frame = MSRect.rectWithRect(GeneralLayer.importBound(json))

      if (json.styles.borderRadius) {
        shape.cornerRadiusFloat = parseFloat(json.styles.borderRadius)
      }

      group = MSShapeGroup.shapeWithPath(shape)
      importStyle(group, json.styles)
      GeneralLayer.importLayerProps(group, json)
    } else {
      group = MSShapeGroup.alloc().init()
      importStyle(group, json.styles)
      group.frame = GeneralLayer.importLayerProps(group, json)
    }

    if (json.styles.mask) {
      group.prepareAsMask()
    }

    parent.object.addLayer(group)
    current.object = group
  }
}
