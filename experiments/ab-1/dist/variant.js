!(function () {
  "use strict"
  console.log("hello"),
    console.log("So helpful"),
    document.querySelector("body").setAttribute("style", "border:10px solid pink")
  const e = document.createElement("div")
  ;(e.textContent = "I'M A TEST LOL"),
    e.setAttribute(
      "style",
      "background:orange;padding:20px;position:absolute;top:20px;left:20px;width:100%;z-index:9999"
    ),
    console.log({ foo: "bar" }),
    document.body.appendChild(e),
    (document.querySelector(".coop-co-uk-hero__title").textContent =
      "TAKE A LOOK AT THIS AMAZING THING")
})()
