import { rollup } from "rollup"
import { nodeResolve } from "@rollup/plugin-node-resolve"
import pc from "picocolors"
import { log } from "./log.js"

export async function build({ experiment, script, write = false }) {
  const startTime = performance.now()

  const plugins = [
    // alias({
    //   entries: {
    //     "@": "./src",
    //   },
    // }),
    nodeResolve(),
    //swc(),
    //terser(),
  ]

  const input = `./experiments/${experiment}/${script}`
  const inputOptions = { input, plugins }

  const outputOptions = {
    format: "iife",
    dir: `./experiments/${experiment}/dist`,
    entryFileNames: `[name].js`,
  }

  const output = await createRollupBundle({ inputOptions, outputOptions, write })

  const endTime = performance.now()

  log(
    pc.green(`Built ${pc.bold(`${experiment}/${script}`)} in ${(endTime - startTime).toFixed(1)}ms`)
  )

  return output
}

async function createRollupBundle({ inputOptions, outputOptions, write }) {
  try {
    const bundle = await rollup(inputOptions)
    const generated = write
      ? await bundle.write(outputOptions)
      : await bundle.generate(outputOptions)
    const chunk = generated.output[0]

    await bundle.close()

    return chunk
  } catch (error) {
    console.error(error)
  }
}
