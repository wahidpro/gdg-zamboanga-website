'use strict';

$(function() {
    try {
        requestcontent().done(function(data) {
        $('#content')
            .attr('data-content', 'default')
            .html(data);
        });

        $('.collapsible').collapsible();
        $('.datepicker').datepicker();
        $('select').formSelect();
    } catch(err) {
        console.log(err.getMessage());
    }
})

.on('click', '.dashboard-menu, .sub-menu', function(e) {
    try {
        var menu = $(this).attr('data-content');
        if (menu.replace('.html', '') != $('#content').attr('data-content'))
        {
            requestcontent(menu).done(function(data) {
                $('#content')
                .attr('data-content', menu.replace('.html', ''))
                .html(data);
            });
        }
    } catch(err) {
        console.log(err.getMessage());
    }

})


.on('change',  '[name="is-blog"]', function() {

    if ($(this).val() == 'false') {
        $('#event').removeClass('hide');
        $('#category').addClass('hide');
    }
    else{
        $('#event').addClass('hide');
        $('#category').removeClass('hide');
    }

})

.ajaxComplete(function() {
    $('.datepicker').datepicker();
    $('select').formSelect();
})

;

var requestcontent = function(content = 'default.html') {
    try {
        return $.ajax({
                url: './admin/contents/' + content,
                type: 'GET',
                data: {},
                dataType: 'html'
            });
    } catch(err) {
        console.log(err.getMessage());
    }

}
