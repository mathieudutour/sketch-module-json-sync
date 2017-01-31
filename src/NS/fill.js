import { findImage, toArray, imageName, round } from '../util'
import { exportColor, importColor } from './color'
import { exportBlendMode, importBlendMode } from './blendMode'

var fillMap = {
  0: 'color',
  1: 'gradient',
  4: 'image',
  5: 'noise'
}

function fillNumberToString (num) {
  if (fillMap[num]) {
    return fillMap[num]
  }
  throw new Error('Unknow fill type. type=' + num)
}

function fillToNumber (str) {
  var keys = Object.keys(fillMap)
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i]
    if (fillMap[key] === str) {
      return parseInt(key)
    }
  }
  throw new Error('Unknow fill type. type=' + str)
}

var gradientMap = {
  0: 'linear',
  1: 'radial',
  2: 'angular'
}

function gradientNumberToString (num) {
  if (gradientMap[num]) {
    return gradientMap[num]
  }
  throw new Error('Unknow gradient type. type=' + num)
}

function gradientToNumber (str) {
  var keys = Object.keys(gradientMap)
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i]
    if (gradientMap[key] === str) {
      return parseInt(key)
    }
  }
  throw new Error('Unknow gradient type. type=' + str)
}

function getGradientObject (gradient) {
  var from = gradient.from()
  var to = gradient.to()

  return {
    gradientType: gradientNumberToString(gradient.gradientType()),
    elipseLength: gradient.elipseLength(),
    from: {
      x: round(from.x),
      y: round(from.y)
    },
    to: {
      x: round(to.x),
      y: round(to.y)
    },
    stops: toArray(gradient.stops()).map((s) => {
      return {
        color: exportColor(s.color()),
        position: s.position()
      }
    })
  }
}

export function exportFills (fills, savedImages) {
  const backgrounds = []
  for (var i = 0; i < fills.length; i++) {
    let s = {
      type: fillNumberToString(fills[i].fillType())
    }

    if (fills[i].fillType() == 0) { // color fill
      s.color = exportColor(fills[i].color())
    } else if (fills[i].fillType() == 1) { // gradient
      s = {
        ...s,
        ...getGradientObject(fills[i].gradient())
      }
    } else if (fills[i].fillType() == 4) { // image
      var image = findImage(savedImages, fills[i].image())
      s.image = imageName(image)
    }

    var fillStyle = fills[i].contextSettings()
    var blendMode = fillStyle.blendMode()
    var opacity = fillStyle.opacity()

    if (blendMode > 0) {
      s.blendMode = exportBlendMode(blendMode)
    }

    if (opacity != 1) {
      s.opacity = opacity
    }

    if (!fills[i].isEnabled()) {
      s.enabled = false
    }

    backgrounds.push(s)
  }
  return backgrounds
}

export function importFills (backgrounds, path, primitive = () => MSStyleFill.alloc().init()) {
  return backgrounds.map(background => {
    const fill = primitive()
    fill.fillType = fillToNumber(background.type)
    switch (background.type) {
      case 'color': {
        fill.color = importColor(background.color)
        break
      }
      case 'image': {
        var imagePath = path + '/' + background.image
        var image = NSImage.alloc().initWithContentsOfFile(imagePath)
        var imageData = MSImageData.alloc().initWithImage_convertColorSpace(image, false)
        fill.image = imageData
        break
      }
      case 'gradient': {
        const stops = background.stops.map(stop => {
          return MSGradientStop.alloc().initWithPosition_color(stop.position, importColor(stop.color))
        })
        const gradient = MSGradient.alloc().initBlankGradient()
        gradient.gradientType = gradientToNumber(background.gradientType)
        gradient.elipseLength = background.elipseLength
        gradient.shouldSmoothenOpacity = background.shouldSmoothenOpacity
        gradient.from = CGPointMake(background.from.x, background.from.y)
        gradient.to = CGPointMake(background.to.x, background.to.y)
        gradient.stops = stops
        fill.gradient = gradient
        break
      }
    }
    if (background.enabled === false) {
      fill.isEnabled = false
    }
    if (background.blendMode) {
      fill.contextSettings().blendMode = importBlendMode(background.blendMode)
    }
    if (background.opacity) {
      fill.contextSettings().opacity = background.opacity
    }

    return fill
  })
}
