

(function() {
  "use strict"

  const SUBKEY = "e34418ceb37849dbaa5768c409ae2f40";
  let testURl = "https://westcentralus.api.cognitive.microsoft.com/vision/v2.0/analyze?visualFeatures=Tags&language=en HTTP/1.1";
  const URL = "https://westcentralus.api.cognitive.microsoft.com/vision/v2.0/analyze";
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
    id("submit").addEventListener("click", submit);
  }

  function selectImg(e) {
    qs("img.selected").classList.remove("selected")
    e.target.classList.add("selected");
    let imgUrl = qs("img.selected").src;
    id("image-preview").firstElementChild.src = imgUrl;
  }

  function submit() {
    //disable btn
    let imgUrl = qs("img.selected").src;

    let request = new Request(URL + "?" + $.param(PARAMS), {
    	method: "POST",
    	headers: new Headers({
    		"Content-Type": "application/json",
        "Ocp-Apim-Subscription-Key": SUBKEY
    	}),
      body: '{"url": ' + '"' + imgUrl + '"}'
    });

    fetch(request)
    .then(checkStatus)
    .then(JSON.parse)
    .then(display)
    .catch(errorMessage);
  }

  function display(response) {
    let outputText = id("output-text");
    while(outputText.firstChild) {
      outputText.removeChild(outputText.firstChild);
    }

    output.appendChild(resultList(response));

    }

  function errorMessage(err) {

  };

  function resultList(response) {
    let result = document.createElement("dl");
    let term = document.createElement("dt");
    term.innerText = "image description"
    result.appendChild(term);
    let description = document.createElement("dt");
    description.innerText = respond.description.captions[0].text;
    result.appendChild(description);
    return result;
  }

  function id(idName) {
    return document.getElementById(idName);
  }

  function qs(selector) {
    return document.querySelector(selector);
  }

  /**
   * Helper function to return the response's result text if successful, otherwise
   * returns the rejected Promise result with an error status and corresponding text
   * @param {object} response - response to check for success/error
   * @returns {object} - valid result text if response was successful, otherwise rejected
   *                     Promise result
   */
   function checkStatus(response) {
     if (response.status >= 200 && response.status < 300 || response.status == 0) {
       return response.text();
     } else {
       return Promise.reject(new Error(response.status + ": " + response.statusText));
     }
   }
}) ();
