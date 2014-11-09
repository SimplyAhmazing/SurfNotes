// $(document).ready(function(){
//     for (var i in window.localStorage){
//         var noteStr = window.localStorage.getItem(i);
//         var noteObj = JSON.parse(noteStr);
//         if (noteObj){
//             $('#notes').append(createNoteHTML(noteObj));
//         }
//     }
// });
// 
// 
// function createNoteHTML(noteObj){
//     var $container = $('<div>').attr('id', 'note');
//     var $title = $('<h3>').html(noteObj.title);
//     var $url = $('<p>')
//         .html(noteObj.url)
//         .addClass('note-url');
//     var $createdAt = $('<div>').html(
//             "Created at: " + Date(noteObj.created_at) +"."
//         )
//         .addClass('created-at');
//     var $modifiedAt = $('<div>').html(
//             "Last updated: " + Date(noteObj.modified_at) + "."
//         )
//         .addClass('modified-at');
//     var $noteContent = $('<div>')
//         .attr('id', 'note-content')
//         .html(noteObj.note)
//         .addClass('note-content');
//     $container.append(
//         $title,
//         $createdAt,
//         $modifiedAt,
//         $url,
//         $noteContent
//     );
//     var $panel = $('<li>').addClass('panel panel-default');
//     var $panelBody = $('<div>').addClass('panel-body');
//     var $panelInfo = $('<div>').addClass('panel-info');
//     $panel.append($panelBody.append($panelInfo.append($container)))
//     $panel.attr('id', noteObj.uuid);
//     return  $panel;
// }
//
var surfNotes = angular.module('surfNotes', [
    'surfNotes.filters',
    'surfNotes.directives',
]);

angular.module('surfNotes.controllers', [])
    .controller('notesController', notesController);

function notesController($scope){
    function init(){
        $scope.notes = [];
        for (var i in window.localStorage){
            try{
                $scope.notes.push(
                    JSON.parse(window.localStorage.getItem(i))
                );
            }catch (e){
                console.log("Error reading note", window.localStorage.getItem(i));
                console.log("Error is", err);
            }
        }
        $scope.delete = function(uuid){
            console.log('Deleting note:', uuid);
            window.localStorage.removeItem(uuid);
            $scope.$apply();
        };
    };
    init();
}
angular.module('surfNotes.directives', []).
    directive("listNotes", function(){
        return {
            restrict: "EA",
            replace: true,
            templateUrl: chrome.extension.getURL("html/templates/list-notes.html")
        }
    })

angular.module('surfNotes.filters', [])
    .filter("asDate", function () {
        return function (input) {
            return new Date(input);
        }
    });

surfNotes.config(function($logProvider){
    $logProvider.debugEnabled(true);
});

