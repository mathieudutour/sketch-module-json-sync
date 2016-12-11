import { toArray } from '../util'

export const PAGE = 'page'
export const ARTBOARD = 'artboard'
export const SLICE = 'slice'
export const SYMBOL_MASTER = 'symbolMaster'
export const SYMBOL = 'symbol'
export const TEXT = 'text'
export const IMAGE = 'image'
export const OVAL = 'oval'
export const RECTANGLE = 'rectangle'
export const SHAPE_PATH = 'shapePath'
export const COMBINED_SHAPE = 'combinedShape'
export const PATH = 'path'
export const GROUP = 'group'

export function getType (layer) {
  switch ('' + layer.className()) {
    case 'MSPage':
      return PAGE
    case 'MSArtboardGroup':
      return ARTBOARD
    case 'MSLayerGroup':
      return GROUP
    case 'MSTextLayer':
      return TEXT
    case 'MSSliceLayer':
      return SLICE
    case 'MSBitmapLayer':
      return IMAGE
    case 'MSShapeGroup':
      let layers = []
      if (layer.layers) {
        layers = toArray(layer.layers())
      }
      if (layers.length === 1) {
        return getType(layers[0])
      } else {
        return COMBINED_SHAPE
      }
    case 'MSOvalShape':
      return OVAL
    case 'MSRectangleShape':
      return RECTANGLE
    case 'MSShapePathLayer':
      return PATH
    case 'MSSymbolInstance':
      return 'symbol'
    case 'MSSymbolMaster':
      return 'symbolMaster'
    default:
      return 'layer'
  }
}
