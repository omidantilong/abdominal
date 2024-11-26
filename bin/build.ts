import { rollup } from "rollup"
import { nodeResolve } from "@rollup/plugin-node-resolve"
import terser from "@rollup/plugin-terser"
import { createFilter } from "@rollup/pluginutils"
import { transform as transformCSS } from "lightningcss"
import pc from "picocolors"
import { log } from "./log"
import { loadConfig } from "./load-config"
import type { Plugin, RollupOutput, InputOptions, OutputOptions, OutputChunk } from "rollup"
import type { VariantConfig, VariantOutput } from "../types"

function stringImport({
  include,
  exclude,
}: {
  include: Array<string> | string
  exclude?: Array<string> | string
}) {
  const filter = createFilter(include, exclude)

  return {
    name: "string",

    transform(code: string, id: string) {
      if (filter(id)) {
        let output = ""
        if (id.endsWith(".css")) {
          const { code: css } = transformCSS({
            filename: "",
            code: Buffer.from(code),
            minify: true,
          })

          output = css.toString()
        } else {
          // TODO: Could minify HTML here if needed
          output = code
        }

        return {
          code: `export default ${JSON.stringify(output)};`,
        }
      }
    },
  }
}

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
    stringImport({
      include: ["**/*.html", "**/*.css"],
    }),
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
