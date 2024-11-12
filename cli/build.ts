import { args } from "./args"
import { build } from "../bin/build.js"

async function run() {
  const { experiment, script } = args()

  await build({ experiment, script, write: true, minify: true })
}

run()
