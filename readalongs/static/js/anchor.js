document.addEventListener("DOMContentLoaded", function () {
  (
    function () {
    "use strict";
  
    // Hashtable for storing Anchors
    let anchors = [];
  
    //////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////
    //
    // H E L P E R    F U N C T I O N S
    //
    //////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////
  
    /**
     * Function to check if we clicked inside an element with a particular class
     * name.
     *
     * @param {Object} e The event
     * @param {String} className The class name to check against
     * @return {Boolean}
     */
    function clickInsideElement(e, className) {
      var el = e.srcElement || e.target;
  
      if (el.classList.contains(className)) {
        return el;
      } else {
        while ((el = el.parentNode)) {
          if (el.classList && el.classList.contains(className)) {
            return el;
          }
        }
      }
  
      return false;
    }
  
    /**
     * Get's exact position of event.
     *
     * @param {Object} e The event passed in
     * @return {Object} Returns the x and y position
     */
    function getPosition(e) {
      var posx = 0;
      var posy = 0;
  
      if (!e) var e = window.event;
  
      if (e.pageX || e.pageY) {
        posx = e.pageX;
        posy = e.pageY;
      } else if (e.clientX || e.clientY) {
        posx =
          e.clientX +
          document.body.scrollLeft +
          document.documentElement.scrollLeft;
        posy =
          e.clientY +
          document.body.scrollTop +
          document.documentElement.scrollTop;
      }
  
      return {
        x: posx,
        y: posy,
      };
    }
  
    function getElementByXpath(document, path) {
      return document.evaluate(path, document, null, XPathResult.ANY_TYPE, null);
    }
  
    //////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////
    //
    // C O R E    F U N C T I O N S
    //
    //////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////
  
    /**
     * Variables.
     */
    var contextMenuClassName = "context-menu";
    var contextMenuLinkClassName = "context-menu__link";
    var contextMenuActive = "context-menu--active";
    var menu = document.querySelector("#context-menu");
    let readalong = document.querySelector("read-along");
  
    /**
     * Initialise our application's code.
     */
    function init() {
      contextListener();
      clickListener();
      keyupListener();
      resizeListener();
      buttonListener();
    }
  
    /**
     * Listens for contextmenu events.
     */
    function contextListener() {
      document.addEventListener("contextmenu", function (e) {
        let taskItemInContext = lookupElement(e);
        // taskItemInContext = clickInsideElement( e, taskItemClassName );
  
        if (taskItemInContext) {
          e.preventDefault();
          toggleMenuOn(taskItemInContext);
          positionMenu(e);
        } else {
          taskItemInContext = null;
          toggleMenuOff();
        }
      });
    }
  
    function lookupElement(e) {
      let container = readalong.shadowRoot.querySelector("[data-cy=text-container]");
  
      if (isPointerEventInsideElement(e, container)) {
        let pages = container.querySelectorAll(".page");
        for (let i = 0; i < pages.length; i++) {
          if (isPointerEventInsideElement(e, pages[i])) {
            let paragraphs = pages[i].querySelectorAll(".page__col__text");
            for (let j = 0; j < paragraphs.length; j++) {
              if (isPointerEventInsideElement(e, paragraphs[j])) {
                let sentences = paragraphs[j].querySelectorAll(".sentence");
                for (let k = 0; k < sentences.length; k++) {
                  if (isPointerEventInsideElement(e, sentences[k])) {
                    let words = sentences[k].querySelectorAll(".sentence__word");
                    for (let l = 0; l < words.length; l++) {
                      let word = words[l];
                      if (isPointerEventInsideElement(e, word)) {
                        return word;
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  
    function isPointerEventInsideElement(event, element) {
      var pos = {
        x:
          (event.targetTouches ? event.targetTouches[0].pageX : event.pageX) -
          scrollX,
        y:
          (event.targetTouches ? event.targetTouches[0].pageY : event.pageY) -
          scrollY,
      };
      var rect = element.getBoundingClientRect();
      return (
        pos.x < rect.right &&
        pos.x > rect.left &&
        pos.y < rect.bottom &&
        pos.y > rect.top
      );
    }
  
    /**
     * Listens for click events.
     */
    function clickListener() {
      document.addEventListener("click", function (e) {
        var clickeElIsLink = clickInsideElement(e, contextMenuLinkClassName);
  
        if (clickeElIsLink) {
          e.preventDefault();
          menuItemListener(clickeElIsLink);
        } else {
          if (!clickInsideElement(e, contextMenuClassName)) {
            var button = e.which || e.button;
            if (button === 1) {
              toggleMenuOff();
            }
          }
        }
      });
    }
  
    /**
     * Listens for keyup events.
     */
    function keyupListener() {
      window.onkeyup = function (e) {
        if (e.keyCode === 27) {
          toggleMenuOff();
        }
      };
    }
  
    /**
     * Window resize event listener
     */
    function resizeListener() {
      window.onresize = function (e) {
        toggleMenuOff();
      };
    }
  
    function buttonListener() {
      document
        .querySelector('[data-action="play"]')
        .addEventListener("click", function () {
          window.wavesurfer.playPause();
        });
  
      document
        .querySelector('[data-action="play-region"]')
        .addEventListener("click", function () {
          let region = Object.values(wavesurfer.regions.list)[0];
          if (region) {
            region.play();
          }
          else{
            alert("There is no region selected");
          }
        });
  
      document
        .querySelector('[data-action="preview"]')
        .addEventListener("click", function () {
          if (isValidAnchorSetup()) {
            generateXML((xmlDoc) => {
              let xmlString = processMerging(xmlDoc);
              updateAnchor(xmlString);
              document.querySelector('[data-action="export-anchor"]').disabled = false;
            });
          }
        });
  
      document
        .querySelector('[data-action="export-anchor"]')
        .addEventListener("click", function () {
          if (isValidAnchorSetup()) {
            window.location = "/download/aligned_preview";
          }
        });

      document
      .querySelector('[data-action="export-original"]')
      .addEventListener("click", function () {
        let base = readalong.getAttribute("base");
        window.location = `/download/${base}`;
      });
    }
  
    /**
     * Turns the custom context menu on.
     */
    function toggleMenuOn(element) {
      menu.classList.add(contextMenuActive);
  
      let isAdding = !element.classList.contains("anchor");
      let addAnchor = document.querySelector('[data-action="add-anchor"]');
      let delAnchor = document.querySelector('[data-action="del-anchor"]');
      if (isAdding) {
        addAnchor.classList.remove("hidden");
        delAnchor.classList.add("hidden");
      } else {
        addAnchor.classList.add("hidden");
        delAnchor.classList.remove("hidden");
      }
  
      let id = element.getAttribute("id");
      menu.setAttribute("data-id", id);
    }
  
    /**
     * Turns the custom context menu off.
     */
    function toggleMenuOff() {
      menu.classList.remove(contextMenuActive);
    }
  
    /**
     * Positions the menu properly.
     *
     * @param {Object} e The event
     */
    function positionMenu(e) {
      let clickCoords = getPosition(e);
      let clickCoordsX = clickCoords.x;
      let clickCoordsY = clickCoords.y;
  
      let menuWidth = menu.offsetWidth + 4;
      let menuHeight = menu.offsetHeight + 4;
  
      let windowWidth = window.innerWidth;
      let windowHeight = window.innerHeight;
  
      if (windowWidth - clickCoordsX < menuWidth) {
        menu.style.left = windowWidth - menuWidth + "px";
      } else {
        menu.style.left = clickCoordsX + "px";
      }
  
      if (windowHeight - clickCoordsY < menuHeight) {
        menu.style.top = windowHeight - menuHeight + "px";
      } else {
        menu.style.top = clickCoordsY + "px";
      }
    }
  
    /**
     * Dummy action function that logs an action when a menu item link is clicked
     *
     * @param {HTMLElement} link The link that was clicked
     */
    function menuItemListener(link) {
      let taskId = menu.getAttribute("data-id");
      let action = link.getAttribute("data-action");
  
      console.log("Task ID - " + taskId + ", Task action - " + action);
  
      let element = readalong.shadowRoot.querySelector(`#${taskId}`);
      switch (action) {
        case "add-anchor":
          let text = element.innerHTML;
          let time = readAlong.getTime(taskId);
          var anchor = addMarker(text, time);
          anchor.id = taskId;
          anchors.push(anchor);
          element.classList.add("anchor");
          break;
        case "del-anchor":
          var anchor = anchors.filter((x) => x.id == taskId)[0];
          let index = wavesurfer.markers.markers.indexOf(anchor);
          wavesurfer.markers.remove(index);
          anchors = anchors.filter((x) => x.id != taskId);
          element.classList.remove("anchor");
          break;
      }
  
      toggleMenuOff();
    }
  
    function isValidAnchorSetup() {
  
      if (anchors.length == 0) {
        alert("There is no anchor setup currently.")
        return false;
      }
  
      // Sort using the id, then copmare the timestamp
      anchors.sort(function (a, b) {
        let idA = a.id.match(/(\d+)/).join("");
        let idB = b.id.match(/(\d+)/).join("");
        return idA - idB;
      });
  
      let previous = { time: -1 };
      for (let i = 0; i < anchors.length; i++) {
        if (previous.time > anchors[i].time) {
          alert(
            `The text "${anchors[i].label}" is earlier than the previous text "${previous.label}"`
          );
          return false;
        }
        previous = anchors[i];
      }
      return true;
    }
  
    /**
     * Generate the XML by download the fresh copy of the file
     * @param {*} anchors
     */
    function generateXML(cb) {
      var xmlhttp = new XMLHttpRequest();
      xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
          cb(this.responseXML);
        }
      };
  
      let url = document
        .getElementsByTagName("read-along")[0]
        .getAttribute("text");
      xmlhttp.open("GET", url, true);
      xmlhttp.send();
    }
  
    /**
     * Process the XML to merge with the Anchors
     */
    function processMerging(xmlDoc) {
      for (let anchor of anchors) {
        let nodes = getElementByXpath(xmlDoc, `//w[@id='${anchor.id}']`);
        let node = nodes.iterateNext();
        let anchorNode = xmlDoc.createElement("anchor");
        anchorNode.setAttribute("time", `${anchor.time.toFixed(2)}s`);
        node.insertBefore(anchorNode, node.firstChild);
      }
  
      var anXMLSerializer = new XMLSerializer();
      let xmlString = anXMLSerializer.serializeToString(xmlDoc);

      // Replace the <w id="xxxxx"> and </w> since the make_dict.py will not accept this tag
      xmlString = xmlString.replace(/<w id="[a-z|0-9]*">/g, "")
      xmlString = xmlString.replace(/<\/w>/g, "")

      console.log(xmlString);
      return xmlString
    }
  
    /**
     * Run the app.
     */
    init();
  })();
});