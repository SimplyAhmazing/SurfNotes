var HTML_TEMPLATES = null;

function buildNote(top, right, bottom, left){
    // var note_top = top || '0px';
    // var note_right = right || '0px';
    // var note_bottom = bottom || '0px';
    // var note_left = left || '0px';

    var noteUUID = guid();
    var tabUrl = window.location.href;
    var newTemplateContext = {
        created_at: new Date(),
        site: tabUrl,
        uuid: noteUUID
    };
    var templateObj = Handlebars.compile(HTML_TEMPLATES.note);
    var template = templateObj(newTemplateContext);
    $noteDiv = $(template);
    $noteDiv.resizable();
    $noteDiv.draggable();
    $noteDiv.css('position', 'fixed');
    $noteDiv.addClass(noteUUID);
    $noteDiv.data('uuid', noteUUID);

    attachSaveListener($noteDiv, '#save-note-' + noteUUID);
    attachAutoSaveListener($noteDiv, '#notearea-' + noteUUID);
    attachDeleteListener($noteDiv, '#delete-note-' + noteUUID);

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
    this.filter = function(query){
        this._send({type: 'load-notes', body: query});
    };
    this._send = function(msg, respCallBack){
        chrome.runtime.sendMessage(msg);
    };
};

function attachAutoSaveListener($el, buttonQuerySelecter){
    $(buttonQuerySelecter, $el).on('change', function(e){
        e.preventDefault();
        var $form = $(this).parent();
        var noteObj = $form.serializeObject();
        var noteUUID = $form.data('uuid');
        var saveMsg = {uuid: noteUUID, note: noteObj};
        console.log('Auto-saving note: ', noteObj);
        DB.save(saveMsg);
        return false;
    });
}

function attachSaveListener($el, buttonQuerySelecter){
    $(buttonQuerySelecter, $el).on('click', function(e){
        e.preventDefault();
        var $form = $(this).parent();
        var noteObj = $form.serializeObject();
        var noteUUID = $form.data('uuid');
        var saveMsg = {uuid: noteUUID, note: noteObj};
        console.log('Save note: ', saveMsg);
        DB.save(saveMsg);
        $form.remove();
        return false;
    });
}

function attachDeleteListener($el, buttonQuerySelecter){
    $(buttonQuerySelecter, $el).on('click', function(e){
        e.preventDefault();
        var noteUUID = $(this).parent().data('uuid');
        console.log('Deleted this note: ', noteUUID);
        DB.remove(noteUUID);
        $(this).parent().remove();
        return false;
    });
}

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
