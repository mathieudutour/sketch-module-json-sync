import { stringToColor, blurTypeToNumber, blendModeToNumber } from './util'

export function parseStyle (styles) {
  var re = styles
  if (styles.bounds) {
    re.rect = CGRectMake(
      parseFloat(styles.bounds.origin.x),
      parseFloat(styles.bounds.origin.y),
      parseFloat(styles.bounds.size.width),
      parseFloat(styles.bounds.size.height)
    )
  }

  if (re.borderRadius) {
    re.borderRadius = parseFloat(re.borderRadius)
  }
  if (re.fontSize) {
    re.fontSize = parseFloat(re.fontSize)
  }
  if (re.lineHeight) {
    re.lineHeight = parseFloat(re.lineHeight)
  }
  if (re.opacity) {
    re.opacity = parseFloat(re.opacity)
  }
  if (re.color) {
    re.color = stringToColor(re.color)
  }
  if (re.backgroundColor) {
    re.backgroundColor = stringToColor(re.backgroundColor)
  }

  if (re.blendMode) {
    re.blendMode = blendModeToNumber(re.blendMode)
  }

  return re
}

export function setBlur (layer, attr) {
  var blur = MSStyleBlur.alloc().init()
  blur.type = blurTypeToNumber(attr.type)
  blur.radius = attr.radius
  if (attr.angle) {
    blur.motionAngle = attr.angle
  }
  blur.isEnabled = true
  layer.style().blur = blur
}

export function setShadow (layer, style) {
  var inner = (style.shadow || []).filter(s => s.inner)
  var outer = (style.shadow || []).filter(s => !s.inner)
  function createShadow (s) {
    var shadow = MSStyleShadow.alloc().init()
    shadow.offsetX = s.offsetX
    shadow.offsetY = s.offsetY
    shadow.blurRadius = s.blurRadius
    shadow.spread = s.spreadRadius
    if (s.enable) {
      shadow.isEnabled = true
    } else {
      shadow.isEnabled = false
    }
    shadow.color = stringToColor(s.color)
    return shadow
  }

  if (inner.length > 0) {
    const shadows = []
    for (let i = 0; i < inner.length; i++) {
      shadows.push(createShadow(inner[i]))
    }
    layer.style().innerShadows = shadows
  }

  if (outer.length > 0) {
    const shadows = []
    for (let i = 0; i < outer.length; i++) {
      shadows.push(createShadow(outer[i]))
    }
    layer.style().shadows = shadows
  }
}
