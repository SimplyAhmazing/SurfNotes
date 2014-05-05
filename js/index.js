var DB = {
    saveNote: function(data){
        var note = JSON.stringify(data.note);
        window.localStorage.setItem(data.uuid, note);
    },
    // this.loadNote = function (noteUUID){
    //     return window.localStorage.getItem(noteUUID);
    // };
    // this.removeNote = function (noteUUID){
    //     return window.localStorage.removeItem(noteUUID);
    // };

    // this.listNotes = function (){
    //     //iterate through local storage
    // };
};



chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
    // Save Messages
    // Load saved messages
    //
    switch(request.type){
        case "save-note":
            debugger;
            DB.saveNote(request.body);
            //alert('saving a note..');
            break;

        case "remove-note":
            resp = DB.removeNote(request.body);
            alert('saving a note..');
            break;

        case "load-note":
            resp = DB.loadNote(request.body);
            sendResponse(resp);
            alert('saving a note..');
            break;

        case "list-notes":
            resp = DB.loadNote(request.body);
            sendResponse(resp);
            alert('saving a note..');
            break;
    }
});

