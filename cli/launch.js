import { args } from "./args.js"
import { launch } from "../bin/launch.js"

async function run() {
  const { experiment, script } = args()

  await launch(experiment, script)
}

run().then(() => console.log("Running"))
