import { readdir, readFile, writeFile } from 'fs'
import minimist from 'minimist'
import { join, resolve } from 'path'
import { promisify } from 'util'

const args = minimist(process.argv.slice(2))
const target = args._[0]

async function transformTargetDts(target) {
  const targetDir = resolve('packages', target, 'dist')
  const taskList = []
  const targetFiles = await promisify(readdir)(targetDir)
  const replace = targetFiles.filter(item => item !== 'js')

  replace.forEach(item => taskList.push([join(targetDir, item), item]))
  return Promise.all(taskList.map(item => replaceCoreType(...item)))
}

function replaceCoreType(path, platform) {
  const dtsPath = join(path, 'index.d.ts')
  let content = await promisify(readFile)(dtsPath)
  const _list = ['PLATFORM_API', 'PLATFORM']
  _list.forEach(item => {
    content = content.replaceAll(new RegExp(item, 'g'), platform)
  })
  await promisify(writeFile)(content)
}

target && transformTargetDts(target)