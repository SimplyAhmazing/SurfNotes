$(document).ready(function(){
    for (var i in window.localStorage){
        var noteStr = window.localStorage.getItem(i);
        var noteObj = JSON.parse(noteStr);
        if (noteObj){
            $('#notes').append(createNoteHTML(noteObj));
        }
    }
});


function createNoteHTML(noteObj){
    var $container = $('<div>').attr('id', 'note');
    var $title = $('<h3>').html(noteObj.title);
    var $url = $('<p>')
        .html(noteObj.url)
        .addClass('note-url');
    var $createdAt = $('<div>').html(
            "Created at: " + Date(noteObj.created_at) +"."
        )
        .addClass('created-at');
    var $modifiedAt = $('<div>').html(
            "Last updated: " + Date(noteObj.modified_at) + "."
        )
        .addClass('modified-at');
    var $noteContent = $('<div>')
        .attr('id', 'note-content')
        .html(noteObj.note)
        .addClass('note-content');
    $container.append(
        $title,
        $createdAt,
        $modifiedAt,
        $url,
        $noteContent
    );
    var $panel = $('<li>').addClass('panel panel-default');
    var $panelBody = $('<div>').addClass('panel-body');
    var $panelInfo = $('<div>').addClass('panel-info');
    $panel.append($panelBody.append($panelInfo.append($container)))
    $panel.attr('id', noteObj.uuid);
    return  $panel;
}
