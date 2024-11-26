import { test as it, expect, vi, afterEach } from "vitest"
import * as build from "../build"
import * as rollup from "rollup"
import * as log from "../log"

const experiment = "__test__"

vi.mock("rollup", async () => {
  return {
    rollup: vi.fn().mockImplementation((rollupOptions) => {
      return {
        generate: vi.fn().mockImplementation(async () => {
          return {
            output: [{ fileName: rollupOptions.input.split("/").at(-1), __method: "generate" }],
          }
        }),
        write: vi.fn().mockImplementation(async () => {
          return {
            output: [{ fileName: rollupOptions.input.split("/").at(-1), __method: "write" }],
          }
        }),
        close: vi.fn(),
      }
    }),
  }
})

vi.spyOn(log, "log").mockImplementation(() => {})

global.process = {
  ...process,
  // @ts-expect-error
  exit: vi.fn(),
}

afterEach(() => {
  vi.clearAllMocks()
})

it("exits if no valid inputs are provided", async () => {
  await build.build({ experiment, variant: "variant-nope.js", write: false })
  expect(global.process.exit).toHaveBeenCalledTimes(1)
})

it("compiles a single variant in memory when specified", async () => {
  const output = await build.build({ experiment, variant: "variant-a.js", write: false })

  expect(rollup.rollup).toHaveBeenCalledTimes(1)
  expect(rollup.rollup).toHaveBeenCalledWith(
    expect.objectContaining({ input: "./experiments/__test__/variant-a.js" })
  )
  expect(rollup.rollup).not.toHaveBeenCalledWith(
    expect.objectContaining({ input: "./experiments/__test__/variant-b.js" })
  )

  expect(output).toStrictEqual({
    "variant-a.js": { fileName: "variant-a.js", __method: "generate" },
  })
})

it("compiles multiple variants in memory when variant is not specified", async () => {
  const output = await build.build({ experiment, write: false })
  expect(rollup.rollup).toHaveBeenCalledTimes(2)
  expect(rollup.rollup).toHaveBeenCalledWith(
    expect.objectContaining({ input: "./experiments/__test__/variant-a.js" })
  )
  expect(rollup.rollup).toHaveBeenCalledWith(
    expect.objectContaining({ input: "./experiments/__test__/variant-b.js" })
  )

  expect(output).toStrictEqual({
    "variant-a.js": { fileName: "variant-a.js", __method: "generate" },
    "variant-b.js": { fileName: "variant-b.js", __method: "generate" },
  })
})

it("compiles a single variant to disk when specified", async () => {
  const output = await build.build({ experiment, variant: "variant-a.js", write: true })

  expect(rollup.rollup).toHaveBeenCalledTimes(1)
  expect(rollup.rollup).toHaveBeenCalledWith(
    expect.objectContaining({ input: "./experiments/__test__/variant-a.js" })
  )
  expect(rollup.rollup).not.toHaveBeenCalledWith(
    expect.objectContaining({ input: "./experiments/__test__/variant-b.js" })
  )

  expect(output).toStrictEqual({
    "variant-a.js": { fileName: "variant-a.js", __method: "write" },
  })
})

it("compiles multiple variants to disk when variant is not specified", async () => {
  const output = await build.build({ experiment, write: true })
  expect(rollup.rollup).toHaveBeenCalledTimes(2)
  expect(rollup.rollup).toHaveBeenCalledWith(
    expect.objectContaining({ input: "./experiments/__test__/variant-a.js" })
  )
  expect(rollup.rollup).toHaveBeenCalledWith(
    expect.objectContaining({ input: "./experiments/__test__/variant-b.js" })
  )

  expect(output).toStrictEqual({
    "variant-a.js": { fileName: "variant-a.js", __method: "write" },
    "variant-b.js": { fileName: "variant-b.js", __method: "write" },
  })
})

it("adds terser to plugin chain when minify is true", async () => {
  await build.build({ experiment, variant: "variant-a.js", write: true, minify: true })
  expect(rollup.rollup).toHaveBeenCalledTimes(1)
  expect(rollup.rollup).toHaveBeenCalledWith(
    expect.objectContaining({
      input: "./experiments/__test__/variant-a.js",
      plugins: expect.arrayContaining([expect.objectContaining({ name: "terser" })]),
    })
  )
})
