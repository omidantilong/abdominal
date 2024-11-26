import { test as it, expect, vi, afterEach, describe } from "vitest"
import * as builder from "../build"
import * as rollup from "rollup"
import * as log from "../log"

const experiment = "__test__"

vi.mock("rollup", async () => {
  return {
    rollup: vi.fn().mockImplementation(() => {
      return {
        generate: vi.fn().mockImplementation(async () => {
          return { output: [{ fileName: "rollupOutput" }] }
        }),
        write: vi.fn().mockImplementation(async () => {
          return { output: [{ fileName: "rollupOutput" }] }
        }),
        close: vi.fn(),
      }
    }),
  }
})

vi.spyOn(log, "log").mockImplementation(() => {})

afterEach(() => {
  vi.clearAllMocks()
})

it("compiles a single variant when specified", async () => {
  await builder.build({ experiment, variant: "variant-a.js", write: false })
  expect(rollup.rollup).toHaveBeenCalledTimes(1)
  expect(rollup.rollup).toHaveBeenCalledWith(
    expect.objectContaining({ input: "./experiments/__test__/variant-a.js" })
  )
  expect(rollup.rollup).not.toHaveBeenCalledWith(
    expect.objectContaining({ input: "./experiments/__test__/variant-b.js" })
  )
})

it("compiles multiple variants when variant is not specified", async () => {
  await builder.build({ experiment, write: false })
  expect(rollup.rollup).toHaveBeenCalledTimes(2)
  expect(rollup.rollup).toHaveBeenCalledWith(
    expect.objectContaining({ input: "./experiments/__test__/variant-a.js" })
  )
  expect(rollup.rollup).toHaveBeenCalledWith(
    expect.objectContaining({ input: "./experiments/__test__/variant-b.js" })
  )
})
