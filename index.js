const https = require('https')
const path = require('path')

const signCertificate = require('ssl-self-signed-certificate')
const fs = require('fs-extra')

const certRoot = path.join(__dirname, '.certificates')

const certPaths = {
  key: 'localhost.key',
  crt: 'localhost.crt',
  passphrase: 'passphrase',
}

const getCertificate = async rootDir => {
  const allPaths = Object.values(certPaths)
  const allChecked = await Promise.all(
    allPaths.map(name => fs.exists(path.join(certRoot, name))),
  )
  await fs.ensureDir(certRoot)

  if (!allChecked.every(Boolean)) {
    console.log(`Missing certs, generating new.`)
    await generateCertificate()
    await Promise.all(
      allPaths.map(name =>
        fs.move(path.join(rootDir, name), path.join(certRoot, name)),
      ),
    )
    console.log(`Done generating certs.`)
  }

  return Promise.all(
    allPaths.map(name =>
      fs
        .readFile(path.join(certRoot, name), { encoding: 'utf8' })
        .then(data => ({ name, data })),
    ),
  ).then(contents => {
    const getFileContents = fileName =>
      contents.find(({ name }) => name === fileName).data

    return {
      key: getFileContents(certPaths.key),
      cert: getFileContents(certPaths.crt),
      passphrase: getFileContents(certPaths.passphrase),
    }
  })
}

const generateCertificate = (passphrase = 'palm-tree-koala') =>
  new Promise((resolve, reject) => {
    signCertificate(passphrase, function(error) {
      if (error) return reject(error)
      return resolve()
    })
  })

module.exports = async (app, rootDir) => {
  if (!rootDir) throw new Error('rootDir missing, needs to be __dirname') // Since ssl-self-signed-certificate puts the files there...
  const cert = await getCertificate(rootDir)
  const options = {
    key: cert.key,
    cert: cert.cert,
    passphrase: cert.passphrase,
  }

  return https.createServer(options, app)
}
