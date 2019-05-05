/*
 * Name: Jinghua Wang
 * Date April 30, 2019
 * Section: AC
 *
 * main.js handle the user interactions of the image classifier webpage.
 * Users can select one of the four test images on the left side or type in the
 * image url that they want to get image classification.
 * Users can preview the image in the middle and see the classification request
 * on the right including a description of the image and some tags.
 */

(function() {
  "use strict";

  // Number of tags displays on the result section.
  const MAX_TAGS = 3;
  // Micro$oft API constants.
  // I know it isn't safe to put the key in here but I don't know how to sucure it ¯\_(ツ)_/¯.
  const SUB_KEY = "9b74a8ec38b64be19647dba29793d430";
  const URL = "https://westus2.api.cognitive.microsoft.com/vision/v1.0/analyze";
  const PARAMS =  {
    "visualFeatures": "Categories,Description,Color,Tags",
    "details": "",
    "language": "en",
  };

  window.addEventListener("load", init);

  /**
   * The initialize function of the whole page: add onclick listener to all test
   * images and button.
   */
  function init() {
    id("img1").classList.add("selected");
    id("img1").addEventListener("click", selectImg);
    id("img2").addEventListener("click", selectImg);
    id("img3").addEventListener("click", selectImg);
    id("img4").addEventListener("click", selectImg);
    id("submit").addEventListener("click", submit);
  }

  /**
   * The handler method of clicking a test image.
   * It will select the clicked image.
   */
  function selectImg() {
    qs("img.selected").classList.remove("selected");
    this.classList.add("selected");
    let imgUrl = qs("img.selected").src;
    id("image-preview").firstElementChild.src = imgUrl;
  }

  /**
   * The submit handler method that will use the computer vision API to classify
   * the image url and display the return result.
   */
  function submit() {
    id("submit").disabled = true;
    let imgUrl = qs("img.selected").src;
    // If user has typed in an url, then use the input url.
    if(id("url-input").value !== "") {
      imgUrl = id("url-input").value;
      id("url-input").value = "";
    }
    id("image-preview").firstElementChild.src = imgUrl;

    // I use jQuery here.
    let request = new Request(URL + "?" + $.param(PARAMS), {
      method: "POST",
      headers: new Headers({
        "Content-Type": "application/json",
        "Ocp-Apim-Subscription-Key": SUB_KEY
      }),
      body: '{"url": ' + '"' + imgUrl + '"}'
    });

    fetch(request)
    .then(checkStatus)
    .then(JSON.parse)
    .then(display)
    .catch(errorMessage);

    id("submit").disabled = false;
  }

  /**
   * This method will process the JSON file and display the description and tags
   * of the image on the output-text div.
   * @param {object} response - The JSON object returned by the CV API.
   */
  function display(response) {
    // Clear all the HTML objects in the output-text div
    let outputText = id("output-text");
    while(outputText.firstChild) {
      outputText.removeChild(outputText.firstChild);
    }
    outputText.appendChild(resultList(response));
  }

  /**
   * The fetch error handling method that will display the error message on the
   * output-text div
   * @param {object} error - The error object threw by other method.
   */
  function errorMessage(error) {
    let outputText = id("output-text");
    while(outputText.firstChild) {
      outputText.removeChild(outputText.firstChild);
    }
    let errorMessage = document.createElement("p");
    errorMessage.innerText = error;
    outputText.appendChild(errorMessage);
  }

  /**
   * This method uses the response JSON object to create a description list that
   * contains the response inforamtion
   * @param {object} response - The JSON object returned by the CV API.
   * @return {object} A HTML description list that contains a description of the
   * image and some tags.
   */
  function resultList(response) {
    let list = document.createElement("dl");

    let term = document.createElement("dt");
    term.innerText = "Image description: ";
    list.appendChild(term);
    let description = document.createElement("dd");
    description.innerText = JSON.stringify(response.description.captions[0]);
    list.appendChild(description);

    let tags = response.tags;
    let numTags = MAX_TAGS;
    if(tags.length < MAX_TAGS) {
      numTags = tags.length;
    }
    for(let i = 0; i < numTags; i++) {
      addTag(list, i, tags[i]);
    }
    return list;
  }

  /**
   * This method will add a tag to the list in
   * <dt>Tag #:</dt>
   * <dd>name (confidence: value)</dd> format
   * @param {object} list - A HTML description list object.
   * @param {number} tagNum - The current tag number (starting from 1)
   * @param {object} tag - The JSON object of a tag
   */
  function addTag(list, tagNum, tag) {
    let term = document.createElement("dt");
    term.innerText = "Tag " + (tagNum + 1) + ": ";
    list.appendChild(term);
    let name = document.createElement("dd");
    let confidence = "(confidence: " + tag.confidence + ")";
    name.innerText = tag.name + "   " + confidence;
    list.appendChild(name);
  }

  /**
   * return the HTML element of id
   * @param {object} idName - The id name of the HTML element.
   * @return {object} The HTML element of id
   */
  function id(idName) {
    return document.getElementById(idName);
  }

  /**
   * return the first HTML selector
   * @param {object} selector - HTML selector.
   * @return {object} The first HTML element corresponding to the selector.
   */
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
