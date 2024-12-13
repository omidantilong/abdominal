import { test as it, expect, vi, afterEach } from "vitest"
import * as build from "../build"
import * as log from "../log"

const experiment = "__test__"

vi.spyOn(log, "log").mockImplementation(() => {})

afterEach(() => {
  vi.clearAllMocks()
})

it("turns static imports into es modules", async () => {
  const output = await build.build({
    experiment,
    variant: "variant-string-import.js",
    write: false,
  })

  const { moduleIds, modules } = output["variant-string-import.js"]

  expect(moduleIds[0]).toContain("variant-style.css")
  expect(modules[moduleIds[0]].code).toContain(`body{background:green}`)
})
