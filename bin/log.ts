import pc from "picocolors"

export function log(message: string) {
  const time = new Date()
  const h = String(time.getHours()).padStart(2, "0")
  const m = String(time.getMinutes()).padStart(2, "0")
  const s = String(time.getSeconds()).padStart(2, "0")

  console.log(pc.white(`${pc.dim(`[${h}:${m}:${s}]`)} `) + "" + message)
}
