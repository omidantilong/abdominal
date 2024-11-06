import puppeteer from "puppeteer"
import chokidar from "chokidar"
import { readFile } from "node:fs/promises"
import { build } from "./build.js"

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
  const { code } = await build({ experiment, script, write: false })

  const watcher = chokidar.watch(`./experiments/${experiment}`, {
    //awaitWriteFinish: true,
  })

  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    devtools: true,
  })

  const page = await browser.newPage()

  await page.goto(config.url)
  await page.waitForNetworkIdle()
  await page.waitForSelector("body")
  await page.addScriptTag({ content: code })

  page.on("domcontentloaded", async () => {
    const { code } = await build({ experiment, script, write: false })
    return await page.addScriptTag({ content: code })
  })

  watcher.on("change", (path) => page.reload())
}
