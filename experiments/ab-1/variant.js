import { plop } from "./module"
import { helper } from "../common/helper"
console.log("hello")
helper()
//window.addEventListener("DOMContentLoaded", () => {
document.querySelector("body").setAttribute("style", "border:10px solid pink")

const container = document.createElement("div")
container.textContent = "I'M A TEST LOL"
container.setAttribute(
  "style",
  "background:red;padding:20px;position:absolute;top:20px;left:20px;width:100%;z-index:9999"
)
console.log(plop)
document.body.appendChild(container)

document.querySelector(".coop-co-uk-hero__title").textContent = "TAKE A LOOK AT THIS AMAZING THING"

//})
