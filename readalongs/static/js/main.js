/**
 * File Management
 */
var file_socket = io.connect(`${window.location.protocol}//${document.domain}:${location.port}/file`);

function uploadFile(type, element) {
    let file = element.files[0]
    let name = file['name'];
    file_socket.emit('upload event', { data: { 'file': file }, name: name, type: type })
}

file_socket.on('upload response', function (msg) {
    toast.show("success", `File '${msg['data']['path'].split('/').pop()}' Uploaded!`)
    updateValidation(msg['data']['type']);
})

/**
 * Readalongs Configuration Socket
 */
var config_socket = io.connect(`${window.location.protocol}//${document.domain}:${location.port}/config`);

function updateConfig(k, v) {
    const data_obj = {}
    data_obj[k] = v
    config_socket.emit('config update event', data_obj )
}

config_socket.on('config update response', function (msg) {
    if (!msg.hasOwnProperty('error')){
        toast.show("success", "Configuration updated!")
        updateValidation("mapping");
    } else {
        toast.show("error", `Hmm. Something went wrong. Please try again. ${msg['error']}`)
    }
})

/**
 * Readalongs Anchor Socket
 */
var anchor_socket = io.connect(`${window.location.protocol}//${document.domain}:${location.port}/anchor`);

function updateAnchor(xmlString) {
    anchor_socket.emit('anchor update event', xmlString )
}

anchor_socket.on('anchor update response', function (msg) {
    if (!msg.hasOwnProperty('error')){
        toast.show("success", `Opening preview window...`);
        window.open("/step/4", 'anchor_preview', '');
    } else {
        toast.show("error", `Hmm. Something went wrong. Please try again. ${msg['error']}`)
    }
})


/**
 * Spinner
 */
function spinner(id) {
    document.getElementById(id).classList.add('is-active')
}

/**
 * Validate Step 1
 */
const validationSet = new Set();

function updateValidation(type){
    validationSet.add(type);
}

function proceedStep2(){

    let errors = [];

    if (!(validationSet.has("text"))) errors.push("text")
    if (!(validationSet.has("audio"))) errors.push("audio")
    if (!(validationSet.has("mapping"))) errors.push("mapping")

    if (errors.length != 0){
        return toast.show("error", `Missing ${errors.join(" / ")} file`);
    }
    window.location.href = "/step/2"
}
