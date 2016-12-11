import { findImage, toArray, colorToString, stringToColor, imageName, blendModeNumberToString, blendModeToNumber, imageId, isNull, booleanOperationToNumber } from '../util'
import { exportShadow, exportBlur } from './layerMixin'
import { parseStyle, setBlur, setShadow } from '../importUtils'
import * as types from './types'
import GeneralLayer from './general'

const objcMap = {
  [types.OVAL]: MSOvalShape,
  [types.RECTANGLE]: MSRectangleShape,
  [types.COMBINED_SHAPE]: MSShapePathLayer,
  [types.SHAPE_PATH]: MSShapePathLayer
}

function getGradientObject (gradient) {
  var from = gradient.from()
  var to = gradient.to()

  return {
    from: {
      x: parseFloat(from.x).toFixed(3),
      y: parseFloat(from.y).toFixed(3)
    },
    to: {
      x: parseFloat(to.x).toFixed(3),
      y: parseFloat(to.y).toFixed(3)
    },
    stops: toArray(gradient.stops()).map((s) => {
      return {
        color: colorToString(s.color()),
        position: s.position()
      }
    })
  }
}

export default class ShapeGroupLayer extends GeneralLayer {
  constructor (...args) {
    super(...args)

    this.shadow = exportShadow.bind(this)
    this.blur = exportBlur.bind(this)
  }

  styles () {
    if (this.className() != 'MSShapeGroup') {
      return {
        ...super.styles(),
        ...this.booleanOperation()
      }
    }

    return {
      ...super.styles(),
      ...this.cssAttributes(),
      ...this.blur(),
      ...this.shadow(),
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

  cssBackgrounds () {
    var re = {}

    if (this.className() != 'MSShapeGroup') {
      return re
    }

    var fills = this._layer.styleGeneric().fills()
    var type = {
      backgrounds: [],
      backgroundImages: [],
      linearGradients: []
    }
    for (var i = 0; i < fills.length; i++) {
      let s

      if (fills[i].fillType() == 0) { // color fill
        s = {
          color: colorToString(fills[i].color())
        }
      } else if (fills[i].fillType() == 1) { // linear-gradient
        s = getGradientObject(fills[i].gradient())
      } else if (fills[i].fillType() == 4) { // image
        var image = findImage(this.savedImages, fills[i].image())
        s = {
          image: imageName(image)
        }
      }

      if (s) {
        var fillStyle = fills[i].contextSettings()
        var blendMode = fillStyle.blendMode()
        var opacity = fillStyle.opacity()

        if (blendMode > 0) {
          s.blendMode = blendModeNumberToString(blendMode)
        }

        if (opacity != 1) {
          s.opacity = opacity
        }

        if (!fills[i].isEnabled()) {
          s.enabled = false
        }

        if (fills[i].fillType() == 0) {
          type.backgrounds.push(s)
        } else if (fills[i].fillType() == 1) {
          type.linearGradients.push(s)
        } else if (fills[i].fillType() == 4) {
          type.backgroundImages.push(s)
        }
      }
    }

    return {
      ...(type.backgrounds.length && {background: type.backgrounds}),
      ...(type.backgroundImages.length && {backgroundImage: type.backgroundImages}),
      ...(type.linearGradients.length && {linearGradients: type.linearGradients})
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
    if (json.type === types.COMBINED_SHAPE ||
        json.type === types.SHAPE_PATH ||
        parent.json.type !== types.COMBINED_SHAPE) {
      return importShape(objcMap[json.type], json, parent, current)
    }

    if (!isNull(parent) && !parent.object) {
      return
    }

    var s = parseStyle(json.styles)
    var layer = objcMap[json.type].alloc().init()
    layer.objectID = json.objectId
    layer.frame = MSRect.rectWithRect(s.rect)

    if (s.rotation) {
      layer.rotation = s.rotation
    }

    if (s.booleanOperation) {
      layer.booleanOperation = booleanOperationToNumber(s.booleanOperation)
    }

    if (s.blur) {
      setBlur(layer, s.blur)
    }

    layer.setName(json.name)
    parent.object.addLayer(layer)
  }
}

function importShape (type, json, parent, current) {
  if (!isNull(parent) && !parent.object) {
    return
  }

  var s = parseStyle(json.styles)

  var group
  if (type !== MSShapePathLayer) {
    var shape = type.alloc().init()
    shape.frame = MSRect.rectWithRect(s.rect)

    if (s.borderRadius) {
      shape.cornerRadiusFloat = s.borderRadius
    }

    group = MSShapeGroup.shapeWithPath(shape)
  } else {
    group = MSShapeGroup.alloc().init()
    group.frame = MSRect.rectWithRect(s.rect)
  }
  group.objectID = json.objectId

  if (s.borders) {
    for (let i = 0; i < s.borders.length; i++) {
      var bs = s.borders[i]
      var border = MSStyleBorder.alloc().init()
      border.thickness = bs.thickness
      border.color = stringToColor(bs.color)
      if (bs.none) {
        border.isEnabled = false
      }
      group.style().addStyleBorder(border)
    }
  }

  if (s.backgroundImage) {
    for (let i = 0; i < s.backgroundImage.length; i++) {
      var bgImage = s.backgroundImage[i]
      var imagePath = current.path + '/' + bgImage.image
      var image = NSImage.alloc().initWithContentsOfFile(imagePath)
      var imageData = MSImageData.alloc().initWithImage_convertColorSpace(image, false)

      const fill = MSStyleFill.alloc().init()
      fill.fillType = 4
      fill.image = imageData
      if (bgImage.enabled === false) {
        fill.isEnabled = false
      }
      if (bgImage.blendMode) {
        fill.contextSettings().blendMode = blendModeToNumber(bgImage.blendMode)
      }
      if (bgImage.opacity) {
        fill.contextSettings().opacity = bgImage.opacity
      }
      group.style().addStyleFill(fill)
    }
  }

  if (s.background) {
    for (let i = 0; i < s.background.length; i++) {
      var bg = s.background[i]
      const fill = MSStyleFill.alloc().init()
      fill.color = stringToColor(bg.color)
      if (bg.enabled === false) {
        fill.isEnabled = false
      }
      if (bg.blendMode) {
        fill.contextSettings().blendMode = blendModeToNumber(bg.blendMode)
      }
      group.style().addStyleFill(fill)
    }
  }

  if (s.linearGradient) {
    for (let i = 0; i < s.linearGradient.length; i++) {
      var linearGradient = s.linearGradient[i]
      const fill = MSStyleFill.alloc().init()
      fill.fillType = 1
      var stops = linearGradient.stops.map(stop => {
        return MSGradientStop.alloc().initWithPosition_color(stop.position, stringToColor(stop.color))
      })
      var gradient = MSGradient.alloc().initBlankGradient()
      gradient.gradientType = 0
      gradient.from = CGPointMake(linearGradient.from.x, linearGradient.from.y)
      gradient.to = CGPointMake(linearGradient.to.x, linearGradient.to.y)
      gradient.stops = stops
      fill.gradient = gradient
      group.style().addStyleFill(fill)
    }
  }

  if (s.rotation) {
    group.rotation = s.rotation
  }

  if (s.blur) {
    setBlur(group, s.blur)
  }

  if (s.shadow) {
    setShadow(group, s.shadow)
  }

  if (s.opacity) {
    group.style().contextSettings().setOpacity(s.opacity)
  }

  if (s.blendMode) {
    group.style().contextSettings().blendMode = s.blendMode
  }

  if (s.hidden) {
    group.isVisible = false
  }

  if (s.locked) {
    group.isLocked = true
  }

  if (s.mask) {
    group.prepareAsMask()
  }

  group.setName(json.name)
  parent.object.addLayer(group)
  current.object = group
}
