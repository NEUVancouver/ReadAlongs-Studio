"use strict";

// Create an instance
var wavesurfer;

// Init & load audio file
document.addEventListener("DOMContentLoaded", function () {
  wavesurfer = WaveSurfer.create({
    container: document.querySelector("#waveform"),
    waveColor: "#A8DBA8",
    progressColor: "#3B8686",
    backend: "MediaElement",
    plugins: [
      WaveSurfer.markers.create({
        markers: [
          {
            id: "pointer",
            time: 0,
            label: "",
            position: "top",
            color: "#ffaa11",
            draggable: true,
          },
        ],
      }),
      WaveSurfer.regions.create({
        regions: [],
        dragSelection: {
          slop: 5,
        },
      }),
    ],
  });

  wavesurfer.on("region-created", function (region) {
    let list = wavesurfer.regions.list;
    if (Object.entries(list).length >= 1) {
      region.remove();
    }
  });

  wavesurfer.on("marker-drop", function (marker) {
    if (marker.position === "top") {
      window.readAlong.goToTime(marker.time);
    }
  });

  let audio = document
    .getElementsByTagName("read-along")[0]
    .getAttribute("audio");

  wavesurfer.load(audio);
});

/**
 * API Endpoint that available to be trigger by external modules
 */

/**
 * Add Anchor to waveform
 */
function addAnchor(id, text, time, color) {
  let anchor = wavesurfer.markers.add({
    time: time,
    label: "",
    color: color,
    draggable: true,
  });
  // Enrich the anchor information
  anchor.id = id;
  anchor.text = text;

  return anchor;
}

/**
 * Delete Anchor from waveform
 */
function delAnchor(anchor){
  let index = wavesurfer.markers.markers.indexOf(anchor);
  wavesurfer.markers.remove(index);
}