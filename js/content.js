function buildNote(top, right, bottom, left){
    var noteURL = chrome.extension.getURL('html/iframes/note.html');

    var noteUUID = guid();
    var tabUrl = window.location.href;
    $noteFrame = $(
        '<iframe />',
        {
            id:'note-'+ noteUUID,
            src:noteURL + '?noteUUID=' + noteUUID,
            scrolling:false,
            width: 200,
            height: 400
        }
    );

    var $noteDiv = $noteFrame;
    $noteDiv.css('position', 'fixed');
    $noteDiv.css('right', '5px');
    $noteDiv.css('top', '100px');
    $noteDiv.css('z-index', 9999999);
    $noteDiv.css('padding', '2em 0');
    $noteDiv.css('background-color', 'black');
    return $noteDiv;
}

function addToPage(note){
    $('body').prepend(note);
}

function createNewNote(){
    // make note
    var note = buildNote(200, 200, 0, 0);
    addToPage(note);
}

function toggleNoteVisibility(){
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    switch(request.action) {
        case "new-note":
            createNewNote();
            break;
        case "toggle-visibility": // TODO remove this..
            toggleNoteVisibility();
            break;
    }
});

var DB = new function(){
    this.save = function(noteObj){
        this._send({type: 'save-note', body: noteObj});
    };
    this.remove = function(noteUUID){
        this._send({type: 'remove-note', body: noteUUID});
    };
    this.load = function(noteUUID){
        this._send({type: 'load-note', body: noteUUID});
    };
    this.loadAll = function(query){
        this._send({type: 'load-notes', body: query});
    };
    this._send = function(msg, respCallBack){
        chrome.runtime.sendMessage(msg);
    };
};

function guid() {
    /* Returns a random uuid */
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
}

$.fn.serializeObject = function()
{
    // Src:http://stackoverflow.com/questions/1184624/
    // convert-form-data-to-js-object-with-jquery
    var o = {};
    var a = this.serializeArray();
    $.each(a, function() {
        if (o[this.name] !== undefined) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};

window.addEventListener("message",function(event){
    if (event.data.action == 'save-note'){
        console.log('Received autosave msg', event.data);
        DB.save(event.data);
    }
    if (event.data.action == 'remove-note'){
        console.log('Received remove msg', event.data);
        DB.remove(event.data);
    }
    if (event.data.action == 'load-note'){
        console.log('Received load msg', event.data);
        DB.load(event.data);
    }
});
