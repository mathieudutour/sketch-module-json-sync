import { toArray } from '../util'
import { exportColor, importColor } from './color'

export function exportShadows (shadows, inner) {
  return toArray(shadows).map(shadow => {
    return {
      offsetX: parseFloat(shadow.offsetX()).toFixed(3),
      offsetY: parseFloat(shadow.offsetY()).toFixed(3),
      radius: parseFloat(shadow.blurRadius()).toFixed(3),
      spread: parseFloat(shadow.spread()).toFixed(3),
      color: exportColor(shadow.color()),
      ...!shadow.isEnabled() && {enabled: false},
      ...inner && {inner: true}
    }
  })
}

export function importShadows (shadows) {
  const innerShadows = []
  const outerShadows = []
  function createShadow (s, inner) {
    const shadow = inner
    ? MSStyleInnerShadow.alloc().init()
    : MSStyleShadow.alloc().init()
    shadow.offsetX = s.offsetX
    shadow.offsetY = s.offsetY
    shadow.blurRadius = s.radius
    shadow.spread = s.spread
    if (typeof s.enable !== 'undefined' && !s.enable) {
      shadow.isEnabled = false
    } else {
      shadow.isEnabled = true
    }
    shadow.color = importColor(s.color)
    return shadow
  }

  shadows.forEach(shadow => {
    if (shadow.inner) {
      innerShadows.push(createShadow(shadow, true))
    } else {
      outerShadows.push(createShadow(shadow))
    }
  })

  return {innerShadows, outerShadows}
}
