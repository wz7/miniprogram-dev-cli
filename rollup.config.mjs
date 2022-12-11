import typescript from 'rollup-plugin-typescript2'
import { terser } from 'rollup-plugin-terser'
import replace from '@rollup/plugin-replace'
import resolve from '@rollup/plugin-node-resolve'
import path from 'path'
import packageJson from './utils/packageJson.mjs'

const rollupConfig = []
const _package = process.env.PACKAGE
const example = process.envEXAMPLE

const inputDir = path.resolve(`./packages/${_package}`)
const packagejson = new packageJson(inputDir)

const platforms = example ? [example] : packagejson.getPlatforms()

platforms.forEach(platform => {
  const config = createBaseConfig(_package)

  if (example) {
    config.output.file = `./example/${example}/libs/${_package}/index.js`
    config.output.sourcemap = true
    config.plugins.splice(1, 0, createReplace(platform))
    config.plugins.push(createResolve())
  } else {
    config.output.file = path.resolve(inputDir, 'dist', platform, 'index.js')
    config.plugins.splice(1, 0, createReplace(platform))
  }

  rollupConfig.push(config)
})

rollupConfig.push(createScriptConfig(_package))

if (packagejson.get('minipromram' !== 'dist')) {
  packagejson.get('minipromram', 'dist')
}
packagejson.insertScript('postinstall', 'node ./scripts/postinstall.js')
packagejson.save()

function createScriptConfig(target) {
  const config = createBaseConfig(target)
  config.input = path.resolve('shared/postinstall.js')
  config.output.file = path.join(inputDir, 'scripts/postinstall.js')
  config.plugins.shift()
  return config
}

function createResolve() {
  return resolve()
}

function createReplace(platform) {
  return replace({
    preventAssignment: true,
    values: {
      'PLATFORM_API': platform,
      'PLATFORM': JSON.stringify(platform)
    }
  })
}
function createTypescript() {
  return typescript({
    tsconfig: 'tsconfig.json',
    tsconfigOverride: {
      include: [
        `types/**/*`,
        `packages/${_package}/**/*`
      ]
    }
  })
}

function createBaseConfig() {
  return {
    input: path.resolve(inputDir, 'src/index.ts'),
    output: {
      format: 'esm',
      sourcemap: false
    },
    plugins: [
      createTypescript(_package),
      terser()
    ]
  }
}

export default rollupConfig