import fs from 'fs'
import path from 'path'

const gamedataDirPath = '../../shared/gamedata'
if (!fs.existsSync(gamedataDirPath)) {
  fs.mkdirSync(gamedataDirPath)
}
fs.copyFileSync('dist/items.js', `${gamedataDirPath}/items.gen.js`)

const imgAssetsDirPath = '../../assets/img/items'
if (fs.existsSync(imgAssetsDirPath)) {
  fs.rmSync(imgAssetsDirPath, { recursive: true, force: true })
}
fs.mkdirSync(imgAssetsDirPath)
fs.readdirSync('dist/img', { withFileTypes: true }).forEach(({ name }) => {
  const srcPath = path.join('dist/img', name)
  const destPath = path.join(imgAssetsDirPath, name)
  fs.copyFileSync(srcPath, destPath)
})

console.log(
  'NODE: The results were copied to the "src/assets/img/items" and "src/shared/gamedata" folders.'
)
