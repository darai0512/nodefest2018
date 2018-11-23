const {stat} = require('fs')
const {createSecureServer} = require('http2')
const path = require('path')
const {ephemeral} = require('tls-keygen')

(async () => {
  const options = await ephemeral({
    commonName: 'localhost',
    entrust: false
  })
  createSecureServer(await ephemeral()).on('stream', (stream, headers) => {
    let p = headers[':path']
    if (p === '/' || p === '/index') {
      p = '/index.html'
    }
    const localPath = path.resolve(__dirname, `.${p}`)
    stat(localPath, (err, stat) => {
      if (err) {
        stream.respond({ ':status': 404 })
        stream.end('Not Found')
        return
      }
      stream.respondWithFile(localPath)
    })
  }).listen(3000);
})();
