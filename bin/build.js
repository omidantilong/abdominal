import { rollup } from "rollup"
import { nodeResolve } from "@rollup/plugin-node-resolve"

export async function build(experiment, script) {
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

  const { fileName, code } = await createRollupBundle(inputOptions, outputOptions)

  return { fileName, code }
}

async function createRollupBundle(inputOptions, outputOptions) {
  try {
    const bundle = await rollup(inputOptions)
    const generated = await bundle.write(outputOptions)
    const chunk = generated.output[0]

    await bundle.close()

    return chunk
  } catch (error) {
    console.error(error)
  }
}
