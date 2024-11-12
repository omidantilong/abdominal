console.log("this is from the second test")

document.querySelector("body").setAttribute("style", "border:10px solid blue")

const container = document.createElement("div")
container.textContent = "I'm a second test apparently"
container.setAttribute(
  "style",
  "background:black;color:white;padding:20px;position:absolute;top:80px;left:20px;width:100%;z-index:9999"
)

document.body.appendChild(container)

document.querySelector(".coop-co-uk-hero__title").textContent = "TAKE A LOOK AT THIS AMAZING THING"

//})
