import { readFile } from "node:fs/promises"

export async function loadConfig({ experiment }: { experiment: string }) {
  try {
    return await readFile(`./experiments/${experiment}/config.json`).then((res) =>
      JSON.parse(res.toString())
    )
  } catch (e) {
    console.log(e)
    process.exit(1)
  }
}
