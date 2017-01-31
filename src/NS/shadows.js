import { toArray, round } from '../util'
import { exportColor, importColor } from './color'

export function exportShadows (shadows, inner) {
  return toArray(shadows).map(shadow => {
    return {
      offsetX: round(shadow.offsetX()),
      offsetY: round(shadow.offsetY()),
      radius: round(shadow.blurRadius()),
      spread: round(shadow.spread()),
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
