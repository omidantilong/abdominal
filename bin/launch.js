import { readFile } from "node:fs/promises"
import puppeteer from "puppeteer"
import chokidar from "chokidar"
import pc from "picocolors"
import { build } from "./build.js"
import { log } from "./log.js"

async function loadConfig({ experiment }) {
  try {
    return await readFile(`./experiments/${experiment}/config.json`).then((res) =>
      JSON.parse(res.toString())
    )
  } catch (e) {
    console.log(e)
    process.exit(1)
  }
}

export async function launch({ experiment, script }) {
  const config = await loadConfig({ experiment })

  const watcher = chokidar.watch(`./experiments/${experiment}`, {
    //awaitWriteFinish: true,
  })

  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    devtools: true,
  })

  const [page] = await browser.pages()

  log(pc.cyan(`Launched ${pc.bold(`${experiment}/${script}`)}`))

  await page.goto(config.url)

  page.on("framenavigated", async () => {
    const { code } = await build({ experiment, script, write: false })

    await page.waitForNetworkIdle()
    await page.waitForSelector("body")

    await page.addScriptTag({ content: code })
  })

  watcher.on("change", () => page.reload())
}
