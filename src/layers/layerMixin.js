import { blurTypeToString, colorToString } from '../util'

export function exportBlur () {
  if (!this._layer.styleGeneric) {
    return {}
  }

  var blur = this._layer.styleGeneric().blur()
  if (!blur.isEnabled()) { return {} }

  var re = {}
  var rad = parseFloat(blur.radius()).toFixed(3)
  var angle = parseFloat(blur.motionAngle()).toFixed(3)
  var type = blurTypeToString(blur.type())
  re.filter = type
  re.radius = rad

  if (['gaussian', 'background'].indexOf(type) !== -1) {
    re.angle = angle
  } else {
    re.angle = angle
  }

  return {blur: re}
}

export function exportShadow () {
  var re = []

  this._layer.style().shadows().forEach(shadow => {
    re.push({
      offsetX: parseFloat(shadow.offsetX()).toFixed(3),
      offsetY: parseFloat(shadow.offsetY()).toFixed(3),
      blurRadius: parseFloat(shadow.blurRadius()).toFixed(3),
      spread: parseFloat(shadow.spread()).toFixed(3),
      color: colorToString(shadow.color()),
      enabled: !!shadow.isEnabled()
    })
  })

  this._layer.style().innerShadows().forEach(shadow => {
    re.push({
      inner: true,
      offsetX: parseFloat(shadow.offsetX()).toFixed(3),
      offsetY: parseFloat(shadow.offsetY()).toFixed(3),
      blurRadius: parseFloat(shadow.blurRadius()).toFixed(3),
      spread: parseFloat(shadow.spread()).toFixed(3),
      color: colorToString(shadow.color()),
      enabled: !!shadow.isEnabled()
    })
  })

  if (!re.length) { return {} }

  return {shadow: re}
}
