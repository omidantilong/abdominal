import { createFilter } from "@rollup/pluginutils"
import { transform as transformCSS } from "lightningcss"

export function stringImport({
  include,
  exclude,
}: {
  include: Array<string> | string
  exclude?: Array<string> | string
}) {
  const filter = createFilter(include, exclude)

  return {
    name: "string",

    transform(code: string, id: string) {
      if (filter(id)) {
        let output = ""
        if (id.endsWith(".css")) {
          const { code: css } = transformCSS({
            filename: "",
            code: Buffer.from(code),
            minify: true,
          })

          output = css.toString()
        } else {
          // TODO: Could minify HTML here if needed
          output = code
        }

        return {
          code: `export default ${JSON.stringify(output)};`,
        }
      }
    },
  }
}
