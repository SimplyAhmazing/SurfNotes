var surfNotes = angular.module('surfNotes', [
    'surfNotes.filters',
    'surfNotes.directives',
]);

angular.module('surfNotes.controllers', [])
    .controller('notesController', notesController);

function notesController($scope, $filter, $sce){
    function init(){
        $scope.notes = [];
        $scope.noteSites = [];
        for (var i in window.localStorage){
            try{
                var note = JSON.parse(window.localStorage.getItem(i));
                note.hostname = $filter('getHostname')(note.url);
                note.created_at = $filter('date')($filter('asDate')(note.created_at), 'medium');
                note.modified_at = $filter('date')($filter('asDate')(note.modified_at), 'medium');
                note.notePreview = $sce.trustAsHtml($filter('parseMarkdown')(note.note));
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
    };
    init();
    $scope.delete = function(uuid){
        console.log('Deleting note:', uuid);
        window.localStorage.removeItem(uuid);
        $scope.notes = $scope.notes.filter(function(note){
            return note.uuid != uuid;
        });
    };
}
angular.module('surfNotes.directives', []).
    directive("listNotes", function(){
        return {
            restrict: "EA",
            replace: true,
            templateUrl: chrome.extension.getURL("src/dashboard/list-notes.html")
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
    })
    .filter("parseMarkdown", function () {
        return function (text) {
            return markdown.toHTML(text);
        }
    });

surfNotes.config(function($logProvider){
    $logProvider.debugEnabled(true);
});

