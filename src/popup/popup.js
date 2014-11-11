$(document).ready(function(){
    $('#note-visibility').on('click', function(){
        if (this.textContent === 'Hide Notes'){
            this.textContent = 'Show Notes';
        }else{
            this.textContent = 'Hide Notes';
        }
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
                        },
                        function(response) {
                            console.log('we sent the msg..');
                        }
                    );
                }
            );
        });
    });
    $('#manage-notes').on('click', function(){
        chrome.tabs.create({url: chrome.extension.getURL('src/dashboard/dashboard.html')});
    });
});
