import type { OutputChunk } from "rollup"

export interface VariantConfig {
  file: string
  note: string
}

export interface VariantOutput {
  [key: string]: OutputChunk
}
