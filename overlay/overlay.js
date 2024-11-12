///@ts-expect-error
const { config, selected } = window.abdominalRuntimeParams

const experimentsListHTML = config.experiments
  .map(
    (entry) =>
      `<li><a class="${entry.file === selected ? "abdominal-selected" : ""}" href="/?exp=${
        entry.file
      }">${entry.file}</a></li>`
  )
  .join("")

const body = document.querySelector("body")
const wrapper = document.createElement("div")

wrapper.classList.add("abdominal-wrapper")
wrapper.innerHTML = `<ul>${experimentsListHTML}</ul>`

body?.appendChild(wrapper)
