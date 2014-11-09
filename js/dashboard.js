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

function notesController($scope, $filter){
    function init(){
        $scope.notes = [];
        $scope.noteSites = [];
        for (var i in window.localStorage){
            try{
                var note = JSON.parse(window.localStorage.getItem(i));
                note.hostname = $filter('getHostname')(note.url);
                $scope.notes.push(note);
            }catch (e){
                console.log("Error reading note", window.localStorage.getItem(i));
                console.log("Error is", err);
            }
        }

        var sitesList = [];
        $scope.noteSites = $scope.notes.filter(function(note){
            var parser = document.createElement('a');
            parser.href = note.url;
            if (sitesList.indexOf(parser.hostname) === -1){
                sitesList.push(parser.hostname);
                return true;
            }
            return false;
        });

        $scope.delete = function(uuid){
            console.log('Deleting note:', uuid);
            window.localStorage.removeItem(uuid);
            $scope.notes.filter(function(note){
                return note.uuid != uuid;
            });
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
    .directive("listSites", function(){
        return {
            restrict: "EA",
            replace: true,
            templateUrl: chrome.extension.getURL("html/templates/list-sites.html")
        }
    })

angular.module('surfNotes.filters', [])
    .filter("asDate", function () {
        return function (input) {
            return new Date(input);
        }
    })
    .filter("getHostname", function () {
        return function (url) {
            var parser = document.createElement('a');
            parser.href = url;
            return parser.hostname;
        }
    });

surfNotes.config(function($logProvider){
    $logProvider.debugEnabled(true);
});

