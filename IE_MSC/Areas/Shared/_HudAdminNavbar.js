$(document).ready(function () {
    var pathName = location.pathname;
    var sidebar = $('#sidebar');

    var menuItems = sidebar.find('.menu-item');

    $(menuItems).each(function (index, item) {
        var link = $(item).find('a').attr('href');
        if (link === pathName) {
            var submenu = $(item).closest('.menu-submenu');

            if (submenu.length) {
                var parentMenuItem = $(submenu).closest('.menu-item');
                $(parentMenuItem).addClass('active');
            }
            $(item).addClass('active');
        }
    })

});