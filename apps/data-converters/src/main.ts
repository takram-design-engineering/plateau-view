import { readdir } from 'fs/promises'
import minimist from 'minimist'
import path from 'path'
import invariant from 'tiny-invariant'

async function main(): Promise<void> {
  const argv = minimist(process.argv.slice(2))
  const targetDir = path.resolve(__dirname, 'targets')
  if (argv.target == null) {
    console.log('Available targets:')
    ;(await readdir(targetDir))
      .filter(name => name.endsWith('.js'))
      .forEach(name => {
        console.log(`  - ${path.parse(name).name}`)
      })
    process.exit(0)
  }

  const importPath = path.join(targetDir, argv.target)
  invariant(importPath.startsWith(targetDir))
  const target = await import(`${importPath}.js`)
  await target.main(argv)
}

main().catch(error => {
  console.error(error)
  process.exit(1)
})
