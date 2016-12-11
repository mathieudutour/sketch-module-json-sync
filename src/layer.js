import * as types from './layers/types'

import GeneralLayer from './layers/general'
import PageLayer from './layers/pageLayer'
import ArtboardLayer from './layers/artboardLayer'
import TextLayer from './layers/textLayer'
import ImageLayer from './layers/imageLayer'
import ShapeGroupLayer from './layers/shapeGroupLayer'
import PathLayer from './layers/pathLayer'
import SymbolMasterLayer from './layers/symbolMasterLayer'
import SymbolLayer from './layers/symbolLayer'
import GroupLayer from './layers/groupLayer'

export function getLayers (layers) {
  const re = []
  for (let i = 0; i < layers.length; i++) {
    const type = types.getType(layers[i])
    re.push(new (Layer(type))(layers[i]))
  }
  return re
}

export function Layer (type) {
  if (type === types.PAGE) {
    return PageLayer
  } else if (type === types.ARTBOARD) {
    return ArtboardLayer
  } else if (type === types.SYMBOL_MASTER) {
    return SymbolMasterLayer
  } else if (type === types.SYMBOL) {
    return SymbolLayer
  } else if (type === types.TEXT) {
    return TextLayer
  } else if (type === types.IMAGE) {
    return ImageLayer
  } else if ([types.OVAL, types.RECTANGLE, types.SHAPE_PATH, types.COMBINED_SHAPE].indexOf(type) !== -1) {
    return ShapeGroupLayer
  } else if (type === types.PATH) {
    return PathLayer
  } else if (type === types.GROUP) {
    return GroupLayer
  } else {
    return GeneralLayer
  }
}
