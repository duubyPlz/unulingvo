// 0. Init
// Global hash representation of current file
var fileHash = new Object();
// Current file's top badge (short-form to full name) hash
var badgeHash = new Object();

// 1. Rich menu listeners
function showMenu() {
    $('.rich-menu').show();
    $('#app').hide();
}
function hideMenu() {
    $('.rich-menu').hide();
    $('#app').show();
}
$('.top-panel').on('click', function() {
    showMenu();
});
$('button#close-menu').on('click', function() {
    hideMenu();
});
$('body').keydown(function(e) {
    if ($('.rich-menu').is(':visible')) {
        if (e.keyCode == 27 || e.keyCode == 13)  { // esc or enter
            e.preventDefault();
            hideMenu();
        }
    }
});
$('.search-bar').on('click', function() {
    $('.search-bar').val('');
});

// 2. Parse & display text of selected file(s)
// a) Establish selected files
var selectedModule = null;

// b) Parse
// parse(selectedModule, language);

