import puppeteer from "puppeteer"
import chokidar from "chokidar"
import pc from "picocolors"
import { build } from "./build"
import { log } from "./log"
import { loadConfig } from "./load-config"
import type { VariantOutput } from "../types"

export async function launch({ experiment, variant }: { experiment: string; variant?: string }) {
  const config = await loadConfig({ experiment })

  const watcher = chokidar.watch(`./experiments/${experiment}`, {
    ignored: (path) => path.includes(".test") || path.includes(".json"),
  })

  const enableOverlay = "overlay" in config ? config.overlay : true
  const enableDevtools = "devtools" in config ? config.devtools : true

  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    devtools: enableDevtools,
  })

  const [page] = await browser.pages()

  log(pc.cyan(`Launched ${pc.bold(`${experiment}`)}`))

  let cachedBuildResult: VariantOutput = await build({ experiment })
  let selectedVariant: string = variant || config.variants[0].file

  await page.goto(`${config.url}?ab=${selectedVariant}`)

  page.on("framenavigated", async () => {
    const url = new URL(page.url())
    const params = new URLSearchParams(url.search)
    const injectableCode: Array<string> = []

    if (params.has("ab") && cachedBuildResult) {
      selectedVariant = params.get("ab")!

      if (cachedBuildResult[selectedVariant]) {
        injectableCode.push(cachedBuildResult[selectedVariant].code)
      }
    }

    await page.waitForSelector("body")

    if (enableOverlay) {
      await page.addScriptTag({
        content: `
        window.abdominalRuntimeParams = ${JSON.stringify({
          selected: selectedVariant,
          config,
        })}; 
      `,
      })

      await page.addStyleTag({ path: "./overlay/overlay.css" })
      await page.addScriptTag({ path: "./overlay/overlay.js" })
    }
    for (const content of injectableCode) {
      await page.addScriptTag({ content })
    }
  })

  watcher.on("change", async (path) => {
    cachedBuildResult = await build({ experiment })
    if (path.endsWith(selectedVariant)) {
      page.reload()
    }
  })
}
