export function isNull (obj) {
  return obj == null || Object.prototype.toString.call(obj) == '[object Null]'
}

export function toArray (t) {
  for (var n = t.count(), r = [], e = 0; n > e; e++) {
    r.push(t.objectAtIndex(e))
  }
  return r
}

export function imageName (image) {
  return image.sha1.substr(0, 7) + '.png'
}

export function imageId (image) {
  return '' + image.sha1().sha1AsString()
}

function system (path, args) {
  if (!args) {
    args = []
  }
  var task = NSTask.alloc().init()
  task.launchPath = path
  task.arguments = args
  var stdout = NSPipe.pipe()
  task.standardOutput = stdout
  task.launch()
  task.waitUntilExit()
  var data = stdout.fileHandleForReading().readDataToEndOfFile()

  return NSString.alloc().initWithData_encoding(data, NSUTF8StringEncoding)
}

export function round (number, significant = 3) {
  return +parseFloat(number).toFixed(significant)
}

export function shasum (path) {
  const out = '' + system('/usr/bin/shasum', [path])
  return out.substr(0, 40)
}

export function findImage (savedImages, image) {
  for (var i = 0; i < savedImages.length; i++) {
    if (savedImages[i].name == imageId(image)) {
      return savedImages[i]
    }
  }
  return null
}

export function getCurrentDirectory (context) {
  return context.document.fileURL().URLByDeletingLastPathComponent().path()
}

export function getCurrentFileName (context) {
  return context.document.fileURL().lastPathComponent().replace('.sketch', '')
}
