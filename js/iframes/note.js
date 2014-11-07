function Editor(input, preview) {
  this.update = function () {
    preview.html(markdown.toHTML(input.val()));
  };
  // input.editor = this;
  this.update();

  that = this;
  $('html').mouseleave(function(){that.update()});
}


$(document).ready(function(){
    new Editor($("#note"), $("#preview"));
});
