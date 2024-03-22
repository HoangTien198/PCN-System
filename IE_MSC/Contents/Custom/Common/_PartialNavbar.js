/* Active nav item */
$(document).ready(function () {
    var pathName = window.location.pathname;
    var navbar = $('.sidebar-nav');

    $.each(navbar.find('.nav-item'), function (k, navitem) {
        var navlink = $(navitem).find('.nav-link');
        var navcontent = $(navitem).find('.nav-content');
   
        if ((navlink.attr('href').includes(pathName)) || (navcontent.find(`a[href="${pathName}"]`).length > 0)) {
            navcontent.find(`a[href="${pathName}"]`).addClass('active');
            navcontent.addClass('show');

            navlink.removeClass('collapsed');
            navlink.attr('aria-expanded', true);
        }
        else {
            navcontent.addClass('collapse');
            navcontent.removeClass('show');

            navlink.addClass('collapsed');
            navlink.attr('aria-expanded', false);
        }
    });
});

//$('a[iframe_tag]').click(function () {
//    var frameWidth = $('#main').width();
//    var frameHeight = $('#sidebar').height();

//    var iframe = $('<iframe>', {
//        src: $(this).data('link'),
//        width: frameWidth + 50,
//        height: frameHeight + 20,
//    });
//    $('#main').html(iframe);
//    $('#main').css('padding', 0);
//});

//$(document).ready(function () {
//    if ($('#Username').text() == "Username") {

//    }
    
//})