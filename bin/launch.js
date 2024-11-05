import puppeteer from "puppeteer"
import { readFile } from "node:fs/promises"
import { build } from "./build.js"

export async function launch(experiment, script) {
  try {
    const config = await readFile(`experiments/${experiment}/config.json`).then((res) =>
      JSON.parse(res.toString())
    )

    const { code } = await build(experiment, script)

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
      const { code } = await build(experiment, script)
      return await page.addScriptTag({ content: code })
    })
  } catch (e) {
    console.log(e)
  }
}
