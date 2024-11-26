import { plop } from "./module"
import { helper } from "../common/helper"

import styles from "./style.css"
import html from "./test.html"

console.log("hello")
helper()
//window.addEventListener("DOMContentLoaded", () => {
document.querySelector("body").setAttribute("style", "border:10px solid pink")

const container = document.createElement("div")
container.classList.add("test-container")
container.textContent = "I'M A TEST LOL"
container.setAttribute(
  "style",
  "background:orange;padding:20px;position:absolute;top:20px;left:20px;width:100%;z-index:9999"
)
console.log(plop)
document.body.appendChild(container)

document.querySelector(".coop-co-uk-hero__title").textContent = "TAKE A LOOK AT THIS AMAZING THING"
const styleTag = document.createElement("style")

styleTag.textContent = styles
document.head.appendChild(styleTag)

document.querySelector(".test-container").innerHTML = html

//})
