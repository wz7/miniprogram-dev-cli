import { readFileSync, writeFileSync } from 'fs'
import { resolve } from 'path'

export default class PackageJSon {
  path = ''
  content = {}

  constructor(target) {
    this.path = resolve('packages', target, 'package.json')
    this.content = JSON.parse(readFileSync(this.path, 'utf-8'))
  }

  getPlatforms() {
    const { buildConfig = {} } = this.content
    const { platforms } = buildConfig
    return (platforms && platforms.length) ? platforms : ['js']
  }

  insertScript(name, script) {
    this.content.scripts[name] = script
  }

  save() {
    writeFileSync(this.path, JSON.stringify(this.content, null, 2), 'utf-8')
  }

  get(key) {
    return this.content[key]
  }

  set(key, value) {
    this.content[key] = value
  }
}