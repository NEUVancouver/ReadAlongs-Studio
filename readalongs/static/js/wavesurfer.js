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
            position : "top",
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
    if (marker.position === "top"){
      readAlong.goToTime(marker.time);
    }
  });

  let audio = document
    .getElementsByTagName("read-along")[0]
    .getAttribute("audio");

  wavesurfer.load(audio);
});

function addMarker(text, time) {
  return wavesurfer.markers.add({
    time: time,
    label: text,
    color: "#ffaa11",
    draggable: true,
  });
}
