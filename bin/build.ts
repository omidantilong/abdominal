import { rollup } from "rollup"
import { nodeResolve } from "@rollup/plugin-node-resolve"
import terser from "@rollup/plugin-terser"
import pc from "picocolors"
import { log } from "./log"
import { loadConfig } from "./load-config"

import type { Plugin, RollupOutput, InputOptions, OutputOptions, OutputChunk } from "rollup"
import type { VariantConfig, VariantOutput } from "../types"

export async function build({
  experiment,
  variant = null,
  write = false,
  minify = false,
}: {
  experiment: string
  variant?: string | null
  write?: boolean
  minify?: boolean
}): Promise<VariantOutput> {
  const config = await loadConfig({ experiment })

  const entries: Array<VariantConfig> = []
  const outputs: VariantOutput = {}

  if (!variant) {
    entries.push(...config.variants)
  } else {
    const entry = config.variants.find((entry: VariantConfig) => entry.file === variant)
    if (entry) {
      entries.push(entry)
    }
  }

  if (!entries.length) {
    process.exit(1)
  }

  const plugins: Array<Plugin> = [
    // alias({
    //   entries: {
    //     "@": "./src",
    //   },
    // }),
    nodeResolve(),
    //swc(),
  ]

  if (minify) {
    plugins.push(terser())
  }

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
}): Promise<OutputChunk | undefined> {
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
