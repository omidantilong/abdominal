import puppeteer from "puppeteer"
import { parseArgs } from "node:util"
import { readFile } from "node:fs/promises"

async function launch() {
    const { positionals } = parseArgs({
        allowPositionals: true,
    })

    const experiment = positionals[0]
    const script = positionals[1]

    try {
        const config = await readFile(`experiments/${experiment}/config.json`).then((res) =>
            JSON.parse(res.toString())
        )

        const scriptFile = await readFile(`experiments/${experiment}/${script}`).then((res) =>
            res.toString()
        )

        const browser = await puppeteer.launch({
            headless: false,
            defaultViewport: null,
            devtools: true,
        })
        const page = await browser.newPage()

        //await page.setViewport({ width: 1080, height: 1024 })
        await page.goto(config.url)
        //await page.addScriptTag({ path: "./experiments/ab-1/variant.js" })
        //await page.evaluateOnNewDocument(scriptFile)

        await page.waitForNetworkIdle()
        await page.waitForSelector("body")

        await page.addScriptTag({ content: scriptFile })

        // await page.waitForNavigation()

        // await page.addScriptTag({ content: scriptFile })

        page.on("domcontentloaded", async () => {
            const scriptFile = await readFile(`experiments/${experiment}/${script}`).then((res) =>
                res.toString()
            )

            return await page.addScriptTag({ content: scriptFile })
        })
    } catch (e) {
        console.log(e)
    }
}

launch().then(() => console.log("Running"))
