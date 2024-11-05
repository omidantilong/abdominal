console.log("hello")
//window.addEventListener("DOMContentLoaded", () => {
document.querySelector("body").setAttribute("style", "border:10px solid pink")

const container = document.createElement("div")
container.textContent = "I'M A TEST LOL"
container.setAttribute(
    "style",
    "background:pink;padding:20px;position:absolute;top:20px;left:20px;width:100%;z-index:9999"
)

document.body.appendChild(container)
//})
