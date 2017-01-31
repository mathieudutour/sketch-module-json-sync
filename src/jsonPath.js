import fs from 'sketch-module-fs'

export function jsonFilePaths (path) {
  const ds = NSFileManager.defaultManager().enumeratorAtPath(path)
  let filename = ds && ds.nextObject && ds.nextObject()
  const paths = []
  while (filename) {
    if (filename.pathExtension() == 'json') {
      paths.push(filename)
    }
    filename = ds.nextObject && ds.nextObject()
  }
  return paths
}

export function jsonTree (jsonPaths, path) {
  const tree = {}
  for (var i = 0; i < jsonPaths.length; i++) {
    const dirs = jsonPaths[i].pathComponents()
    let p = tree
    for (var j = 0; j < dirs.length; j++) {
      let n = dirs[j]
      if (n.pathExtension() == 'json') {
        n = 'jsonFileName'
        p[n] = dirs[j]

        const filePath = path + '/' + jsonPaths[i]
        const jsonString = fs.readFile(filePath)
        const json = JSON.parse(jsonString)
        p['json'] = json
      } else {
        p[n] = p[n] || {}
      }
      p = p[n]
    }
  }
  return tree
}
