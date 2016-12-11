import fs from 'sketch-module-fs'
import { getLayers } from './layer'
import { imageName, shasum, getCurrentDirectory, getCurrentFileName } from './util'

export default function (context, options = {}) {
  const doc = context.document
  const pages = getLayers(doc.pages())
  const path = getCurrentDirectory(context) + '/' + (options.exportFolder || getCurrentFileName(context))

  fs.rmdir(path)

  // export pages
  for (var i = 0; i < pages.length; i++) {
    exportLayer(path, pages[i], pages.length - i, {})
  }
}

function exportLayer (parentPath, layer, index, parent) {
  if (parent.type === 'shapePath' && layer.path() === '') {
    return
  }

  if (parent.type === 'oval' && layer.path() === '') {
    return
  }

  if (parent.type === 'rectangle' && layer.path() === '') {
    return
  }

  const path = parentPath + '/' + layer.dirName()
  fs.mkdir(path)

  saveImages(layer, path)

  const json = {
    objectId: layer.id(),
    type: layer.type(),
    className: layer.className(),
    name: layer.name(),
    index,
    styles: layer.styles()
  }

  const shapePath = layer.path()
  if (shapePath !== '') {
    json.path = shapePath
  }
  if (layer.symbolId()) {
    json.symbolId = layer.symbolId()
  }

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
