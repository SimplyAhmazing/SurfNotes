$(document).ready(function(){
    $('#note-visibility').on('click', function(){
        if (this.textContent === 'Hide Notes'){
            this.textContent = 'Show Notes';
        }else{
            this.textContent = 'Hide Notes';
        }
    });

    // Parse for Handlebars templates...
    var templates = {};
    $('.templates .template').each(function(i, el){
        templates[el.id] = el.outerHTML;
    });

    $('button').each(function(index, el){
        $(el).on('click',function(){
            console.log($(this).attr('id'), ' was clicked');
            var button_clicked_id = $(this).attr('id');
            chrome.tabs.query(
                {active: true, currentWindow: true},
                function(tabs) {
                    chrome.tabs.sendMessage(
                        tabs[0].id,
                        {
                            action: button_clicked_id,
                            templates: templates
                        },
                        function(response) {
                            console.log('we sent the msg..');
                        }
                    );
                }
            );
        });
    });
});
