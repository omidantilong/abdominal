import { rollup } from "rollup"
import type { Plugin, RollupOutput, InputOptions, OutputOptions, OutputChunk } from "rollup"

import { nodeResolve } from "@rollup/plugin-node-resolve"
import pc from "picocolors"
import { log } from "./log"
import { loadConfig } from "./load-config"

export async function build({
  experiment,
  script,
  write = false,
}: {
  experiment: string
  script: string
  write: boolean
}) {
  const config = await loadConfig({ experiment })

  const entries: Array<Record<string, string>> = []
  const outputs: { [key: string]: OutputChunk } = {}

  if (!script) {
    entries.push(...config.experiments)
  } else {
    entries.push({ file: script, note: script })
  }
  console.log(entries)
  //const startTime = performance.now()

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

  //const input = `./experiments/${experiment}/${script}`
  //const inputOptions: InputOptions = { input, plugins }

  const outputOptions: OutputOptions = {
    format: "iife",
    dir: `./experiments/${experiment}/dist`,
    entryFileNames: `[name].js`,
  }

  for (const entry of new Set(entries)) {
    const startTime: number = performance.now()
    const inputOptions: InputOptions = {
      input: `./experiments/${experiment}/${entry.file}`,
      plugins,
    }
    const output = await createRollupBundle({ inputOptions, outputOptions, write })
    const endTime: number = performance.now()
    if (output) {
      log(pc.green(`Built ${pc.bold(entry.file)} in ${(endTime - startTime).toFixed(1)}ms`))
      outputs[entry.file] = output
    }
  }

  //console.log(outputs)

  return outputs
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
