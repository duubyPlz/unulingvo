var oldWidth = $(window).width();
$(".media").html(oldWidth);
$(window).resize(function() {
    if ($(window).width() != oldWidth) {
        console.log('change ' + oldWidth + ' ' + $(window).width());
        $(".media").html($(window).width());
    }
});