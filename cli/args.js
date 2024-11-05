import { parseArgs } from "node:util"

export function args() {
  const { positionals } = parseArgs({
    allowPositionals: true,
  })
  const experiment = positionals[0]
  const script = positionals[1]

  return { experiment, script }
}
