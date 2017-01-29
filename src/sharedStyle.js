import { exportFills, importFills } from './NS/fill'
import { exportBorders, importBorders } from './NS/border'
import { exportBlur, importBlur } from './NS/blur'
import { exportShadows, importShadows } from './NS/shadows'
import { exportBlendMode, importBlendMode } from './NS/blendMode'

export function exportStyle (style, savedImages) {
  let re = {}
  if (style.fills() && style.fills().length) {
    re.backgrounds = exportFills(style.fills(), savedImages)
  }
  if (style.borders() && style.borders().length) {
    re.borders = exportBorders(style.borders())
  }
  if (style.shadows() && style.shadows().length) {
    re.shadows = exportShadows(style.shadows())
  }
  if (style.innerShadows() && style.innerShadows().length) {
    if (!re.shadows) { re.shadows = [] }
    re.shadows = re.shadows.concat(exportShadows(style.innerShadows(), true))
  }
  if (style.blur() && style.blur().isEnabled()) {
    re.blur = exportBlur(style.blur())
  }
  if (style.contextSettings().opacity() && style.contextSettings().opacity() != 1) {
    re.opacity = style.contextSettings().opacity()
  }
  const mode = style.contextSettings().blendMode()
  if (mode > 0) {
    re.blendMode = exportBlendMode(mode)
  }
  return re
}

export function importStyle (layer, s) {
  if (s.backgrounds) {
    const fills = importFills(s.backgrounds, '')
    fills.forEach(f => layer.style().addStyleFill(f))
  }
  if (s.borders) {
    const borders = importBorders(s.borders)
    borders.forEach(b => layer.style().addStyleBorder(b))
  }
  if (s.blur) {
    const blur = importBlur(s.blur)
    layer.style().blur = blur
  }
  if (s.shadows) {
    const {innerShadows, outerShadows} = importShadows(s.shadows)
    layer.style().innerShadows = innerShadows
    layer.style().shadows = outerShadows
  }
  if (s.blendMode) {
    layer.style().contextSettings().blendMode = importBlendMode(s.blendMode)
  }
  if (s.opacity) {
    layer.style().contextSettings().opacity = parseFloat(s.opacity)
  }
}
