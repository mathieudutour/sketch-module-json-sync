import { jsonFilePaths, jsonTree } from './jsonPath'
import { Layer } from './layer'
import { getCurrentDirectory, getCurrentFileName } from './util'
import { importSharedTextStyle } from './sharedTextStyle'

export default function importer (context, options = {}) {
  const doc = context.document

  for (let i = 0; i < doc.pages().length; i++) {
    doc.removePage(doc.pages()[i])
  }

  const lastPageToRemove = doc.pages()[0]

  // import shared text styles
  doc.documentData().layerTextStyles().removeAllSharedObjects()
  const sharedTextStylesPath = getCurrentDirectory(context) + '/' + (options.exportSharedFolder || 'shared') + '/text-styles'
  iterateOverJSONs(doc, sharedTextStylesPath, function (json, parent, current) {
    importSharedTextStyle(doc, json, parent, current)
  })
  doc.reloadInspector()

  // import pages
  const pagesPath = getCurrentDirectory(context) + '/' + (options.exportFolder || getCurrentFileName(context))
  iterateOverJSONs(doc, pagesPath, function (json, parent, current) {
    Layer(json.type) && Layer(json.type).importJSON(doc, json, parent, current)
  })

  doc.removePage(lastPageToRemove)
}

function iterateOverJSONs (doc, path, func) {
  var jsons = jsonFilePaths(path)
  var tree = jsonTree(jsons, path)

  jsons.sort(compareJsonFilePath(tree))

  for (var i = 0; i < jsons.length; i++) {
    var parent = parentPos(jsons[i], tree)
    var current = currentPos(jsons[i], tree)
    var json = current.json
    current.path = path + '/' + currentPath(jsons[i])

    func(json, parent, current)
  }
}

function parentPos (path, tree) {
  var p = tree
  var components = path.pathComponents()
  for (var i = 0; i < (components.length - 2); i++) {
    var n = components[i]
    p = p[n]
  }
  if (p.jsonFileName) {
    return p
  } else {
    return null
  }
}

function currentPath (path) {
  var components = path.pathComponents()
  components.pop()
  return components.join('/')
}

function currentPos (path, tree) {
  var p = tree
  var components = path.pathComponents()
  for (var i = 0; i < components.length - 1; i++) {
    var n = components[i]
    p = p[n]
  }

  return p
}

function compareJsonFilePath (tree) {
  return function (a, b) {
    var as = a.pathComponents()
    var bs = b.pathComponents()
    var aLen = as.length
    var bLen = bs.length

    if (aLen == bLen && as.slice(0, -2).join('/') == bs.slice(0, -2).join('/')) {
      return currentPos(b, tree).json.index - currentPos(a, tree).json.index
    } else {
      return aLen - bLen
    }
  }
}
