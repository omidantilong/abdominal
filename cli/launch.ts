import { args } from "./args"
import { launch } from "../bin/launch.js"

async function run() {
  const { experiment, variant } = args()

  await launch({ experiment, variant })
}

run()
