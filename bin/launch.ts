import puppeteer from "puppeteer"
import chokidar from "chokidar"
import pc from "picocolors"
import { build } from "./build"
import { log } from "./log"
import { loadConfig } from "./load-config"
import type { ExperimentBuildOutput } from "../types"

export async function launch({ experiment, script }: { experiment: string; script?: string }) {
  const config = await loadConfig({ experiment })

  const watcher = chokidar.watch(`./experiments/${experiment}`, {
    ignored: (path) => path.includes(".test") || path.includes(".json"),
  })

  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    devtools: true,
  })

  const enableOverlay = "overlay" in config ? config.overlay : true

  const [page] = await browser.pages()

  log(pc.cyan(`Launched ${pc.bold(`${experiment}`)}`))

  let cachedBuildResult: ExperimentBuildOutput = await build({ experiment })
  let selectedExperiment: string = script || config.experiments[0].file

  await page.goto(`${config.url}?exp=${selectedExperiment}`)

  page.on("framenavigated", async () => {
    const url = new URL(page.url())
    const params = new URLSearchParams(url.search)
    const injectableCode: Array<string> = []

    if (params.has("exp") && cachedBuildResult) {
      selectedExperiment = params.get("exp")!

      if (cachedBuildResult[selectedExperiment]) {
        injectableCode.push(cachedBuildResult[selectedExperiment].code)
      }
    }

    await page.waitForSelector("body")

    if (enableOverlay) {
      await page.addScriptTag({
        content: `
        window.abdominalRuntimeParams = ${JSON.stringify({
          selected: selectedExperiment,
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
    if (path.endsWith(selectedExperiment)) {
      page.reload()
    }
  })
}
