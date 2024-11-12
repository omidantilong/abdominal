///@ts-expect-error
const { config, selected } = window.abdominalRuntimeParams

const variantsListHTML = config.variants
  .map(
    (entry) =>
      `<li><a class="${entry.file === selected ? "abdominal-selected" : ""}" href="/?ab=${
        entry.file
      }">${entry.file}</a></li>`
  )
  .join("")

const body = document.querySelector("body")
const wrapper = document.createElement("div")

wrapper.classList.add("abdominal-wrapper")
wrapper.innerHTML = `<ul>${variantsListHTML}</ul>`

body?.appendChild(wrapper)
