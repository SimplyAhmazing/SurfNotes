var DB = {
    saveNote: function(data){
        if (!(data.uuid in window.localStorage)){
            data.created_at = new Date();
        }
        chrome.tabs.getSelected(function(tab){
            data.url = tab.url; data.title = tab.title;
            data.modified_at = new Date();
            window.localStorage.setItem(data.uuid, JSON.stringify(data));
        });
    },
    loadNote: function (noteUUID){
        return JSON.parse(window.localStorage.getItem(noteUUID));
    },
    removeNote: function (noteUUID){
        return window.localStorage.removeItem(noteUUID);
    },
    // this.listNotes = function (){
    //     //iterate through local storage
    // };
};



chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
    switch(request.type){
        case "save-note":
            DB.saveNote(request.body);
            break;

        case "remove-note":
            resp = DB.removeNote(request.body);
            alert('saving a note..');
            break;

        case "load-note":
            resp = DB.loadNote(request.body);
            // sendResponse(resp);
            alert('saving a note..');
            break;

        case "list-notes":
            resp = DB.loadNote(request.body);
            sendResponse(resp);
            alert('saving a note..');
            break;
    }
});
