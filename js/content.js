var HTML_TEMPLATES = null;

function buildNote(top, right, bottom, left){
    var note_top = top || '0px';
    var note_right = right || '0px';
    var note_bottom = bottom || '0px';
    var note_left = left || '0px';

    var z_index = 1000;

    // var $noteDiv = $('<div>');
    // $noteDiv.addClass('note');
    //
    var templateObj = Handlebars.compile(HTML_TEMPLATES.note);
    var template = templateObj({});

    $noteDiv = $(template);

    $noteDiv.resizable();
    $noteDiv.draggable();


    // Position the note
    // $noteDiv.css('top', note_top);
    // $noteDiv.css('right', note_right);
    $noteDiv.css('position', 'fixed');
    // Add uuid
    $noteDiv.data('uuid', guid());

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
    HTML_TEMPLATES = request.templates;

    switch(request.action) {
        case "new-note":
            createNewNote();
            break;
        case "toggle-visibility":
            toggleNoteVisibility();
            break;
    }
});

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
