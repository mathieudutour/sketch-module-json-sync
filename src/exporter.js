import fs from 'sketch-module-fs'
import { getLayers } from './layer'
import { imageName, shasum, getCurrentDirectory, getCurrentFileName } from './util'
import { exportSharedTextStyle } from './sharedTextStyle'

export default function (context, options = {}) {
  const doc = context.document
  const pagesPath = getCurrentDirectory(context) + '/' + (options.exportFolder || getCurrentFileName(context))
  const sharedTextStylesPath = getCurrentDirectory(context) + '/' + (options.exportSharedFolder || 'shared') + '/text-styles'

  fs.rmdir(pagesPath)
  fs.rmdir(sharedTextStylesPath)

  // export shared text styles
  fs.mkdir(sharedTextStylesPath)
  const sharedTextStyles = doc.documentData().layerTextStyles().objects()
  for (let i = 0; i < sharedTextStyles.length; i++) {
    exportSharedTextStyle(sharedTextStylesPath, sharedTextStyles[i], sharedTextStyles.length - i)
  }

  // export pages
  const pages = getLayers(doc.pages())
  for (let i = 0; i < pages.length; i++) {
    exportLayer(pagesPath, pages[i], pages.length - i, {})
  }
}

function exportLayer (parentPath, layer, index, parent) {
  if (['shapePath', 'oval', 'rectangle'].indexOf(parent.type) != -1 && (!layer.path || layer.path() === '')) {
    return
  }

  const path = parentPath + '/' + layer.dirName()
  fs.mkdir(path)

  saveImages(layer, path)

  const json = layer.exportJSON()
  json.index = index

  fs.writeFile(path + '/' + json.type + '.json', JSON.stringify(json, null, '  '))

  const layers = getLayers(layer.layers())
  layer.setLayers(layers)

  if (layers.length > 0) {
    for (let i = 0; i < layers.length; i++) {
      exportLayer(path, layers[i], layers.length - i, json)
    }
  }
}

function saveImages (layer, path) {
  const images = layer.images()
  images.forEach(image => {
    const fromPath = path + '/' + image.name
    fs.writeFile(fromPath, image.image)
    image.sha1 = shasum(fromPath)
    const toPath = path + '/' + imageName(image)
    fs.rename(fromPath, toPath)
  })
  layer.setSavedImages(images)
}
