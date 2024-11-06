import { args } from "./args.js"
import { build } from "../bin/build.js"

async function run() {
  const { experiment, script } = args()

  await build({ experiment, script, write: true })
}

run()
