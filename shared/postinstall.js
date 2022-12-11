const { readdirSync, readFileSync, writeFileSync, existsSync, unlinkSync, rmdirSync } = require('fs')
const { resolve, join } = require('path')

const projectDir = __dirname.split('node_modules')[0]
const projectPkg = require(join(projectDir, 'package.json'))
const packageJson = require(resolve('package.json'))

const disDir = resolve('dist')
const platform = getPlatform()
const buildConfig = packageJson.buildConfig || {}
const platforms = buildConfig.platforms || []

if (platforms.length <= 1) process.exit(1)
if (!platform) throw new Error('无法自动识别平台，请在package.json中通过platform属性指定')

const packageDir = join(projectDir, platform)
const packageFiles = readdirSync(packageDir)
packageFiles.map(file => {
  const filePath = join(packageDir, file)
  const fileContent = readFileSync(filePath, 'utf-8')
  writeFileSync(join(disDir, file), fileContent, 'utf-8')
})
platforms.forEach(target => {
  clear(target)
})

function getPlatform() {
  const css = ['wxss', 'ttss', 'acss', 'css']
  const cssPlatform = ['wx', 'tt', 'my', 'xhs']

  const cssIndex = css.findIndex(item => existsSync(join(projectDir, `app.${item}`)))
  return cssPlatform[cssIndex] || projectPkg.platform
}

function clear(target) {
  const targetDir = resolve(`dist/${target}`)
  const files = readdirSync(targetDir)
  files.forEach(file => {
    unlinkSync(join(dir, file))
  })
  rmdirSync(dir)
}