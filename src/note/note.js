function Editor(input, preview) {
  this.update = function () {
    preview.html(markdown.toHTML(input.val()));
  };
  this.getData = function(){
    var noteUUID = window.location.search.split('=')[1];
    var data = {uuid: noteUUID, note: input.val()};
    return data;
  };
  this.saveData = function(){
    // pass the data upstream
    var data = this.getData();
    data.action = 'save-note';
    top.window.postMessage(data, '*');
  };

  that = this;
  this.update();

  $('html').mouseleave(function(){that.update()});
  input.on('change', function(){
    that.saveData();
    console.log('Autosaving note', that.getData());
  });

}


$(document).ready(function(){
    new Editor($("#note"), $("#preview"));
});
