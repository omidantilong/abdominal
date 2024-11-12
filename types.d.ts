import type { OutputChunk } from "rollup"

export interface ExperimentConfig {
  file: string
  note: string
}

export interface ExperimentBuildOutput {
  [key: string]: OutputChunk
}
