import { args } from "./args"
import { build } from "../bin/build.js"

async function run() {
  const { experiment, variant } = args()

  await build({ experiment, variant, write: true, minify: true })
}

run()
