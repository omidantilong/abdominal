import { rollup } from "rollup"
import type { Plugin, RollupOutput, InputOptions, OutputOptions } from "rollup"

import { nodeResolve } from "@rollup/plugin-node-resolve"
import pc from "picocolors"
import { log } from "./log"

export async function build({
  experiment,
  script,
  write = false,
}: {
  experiment: string
  script: string
  write: boolean
}) {
  const startTime = performance.now()

  const plugins: Array<Plugin> = [
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
  const inputOptions: InputOptions = { input, plugins }

  const outputOptions: OutputOptions = {
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

async function createRollupBundle({
  inputOptions,
  outputOptions,
  write,
}: {
  inputOptions: InputOptions
  outputOptions: OutputOptions
  write: boolean
}) {
  try {
    const bundle = await rollup(inputOptions)
    const generated: RollupOutput = write
      ? await bundle.write(outputOptions)
      : await bundle.generate(outputOptions)
    const chunk = generated.output[0]

    await bundle.close()

    return chunk
  } catch (error) {
    console.error(error)
  }
}
