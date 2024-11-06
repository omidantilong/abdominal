import { rollup } from "rollup"
import { nodeResolve } from "@rollup/plugin-node-resolve"

export async function build({ experiment, script, write = false }) {
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

  return await createRollupBundle({ inputOptions, outputOptions, write })
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
