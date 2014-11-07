function Editor(input, preview) {
  this.update = function () {
    // preview.innerHTML = markdown.toHTML(input.value);
  };
  // input.editor = this;
  this.update();
}


$(document).ready(function(){
    debugger;
    //$('html').mouseover(function(){showNotePreview(true)});
    $('html').mouseleave(function(){showNotePreview(false)});
    new Editor($("#note"), $("#preview"));
});
