

(function() {
  "use strict"

  const SUBKEY = "e34418ceb37849dbaa5768c409ae2f40";
  let testURl = "https://westcentralus.api.cognitive.microsoft.com/vision/v2.0/analyze?visualFeatures=Tags&language=en HTTP/1.1";
  const URL = "https://westcentralus.api.cognitive.microsoft.com/vision/v2.0";
  const PARAMS =  {
    "visualFeatures": "Categories,Description,Color,Tags",
    "details": "",
    "language": "en",
  };
  window.addEventListener("load", init);

  function init() {
    id("img1").classList.add("selected");
    id("img1").addEventListener("click", selectImg);
    id("img2").addEventListener("click", selectImg);
    id("img3").addEventListener("click", selectImg);
    id("img4").addEventListener("click", selectImg);
    id("browse").addEventListener("click", browse);
    id("submit").addEventListener("click", submit);
  }

  function selectImg(e) {
    qs("img.selected").classList.remove("selected")
    e.target.classList.add("selected");
    let imgUrl = qs("img.selected").src;
    id("image-preview").firstElementChild.src = imgUrl;
  }

  function submit() {
    let imgUrl = qs("img.selected").src;
    let url = new FormData();
    url.append("body", '{"url": ' + '"' + imgUrl + '"}');

    let request = new Request(URL + "?" + $.param(PARAMS), {
    	method: "POST",
      body: url,
    	headers: new Headers({
    		"Content-Type": "application/json",
        "Ocp-Apim-Subscription-Key": SUBKEY
    	})
    });



    fetch(request)
    .then(display);
  }

  function display(response) {
    console.log(response.json());
  }

  function id(idName) {
    return document.getElementById(idName);
  }

  function qs(selector) {
    return document.querySelector(selector);
  }
}) ();
