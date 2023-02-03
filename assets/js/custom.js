
// Functions
function focusSearch() {
    $('.search-bar').val('');
    $('.search-bar').focus();
}
function showMenu() {
    $('.rich-menu').show();
    $('#app').hide();
    $('.logo').hide();
    focusSearch();
}
function hideMenu() {
    $('.rich-menu').hide();
    $('#app').show();
    $('.logo').show();
}
function saveMenu() {
    defineSelectedLessons();
    hideMenu();
}
function defineSelectedLessons() {
    selectedLessons = []
    $('.selected-lesson').each(function() {
        selectedLessons.push($(this).attr('id'));
    });
    console.log('SELECTED LESSONS');
    console.log(selectedLessons);
}
function parse(selectedLessons, language) {
    console.log('PARSE');
    console.log(selectedLessons);
    console.log(language);
}

// 0. Init
// Global hash representation of current file
var fileHash = new Object();
// Current file's top badge (short-form to full name) hash
var badgeHash = new Object();

showMenu(); // ! @cku DELETEME DEBUG

// 1. Rich menu listeners
$('.top-panel').on('click', function() {
    showMenu();
});
$('button#menu-back-btn').on('click', function() {
    hideMenu();
});
$('body').keydown(function(e) {
    if ($('.rich-menu').is(':visible')) {
        if (e.keyCode == 27)  { // esc
            e.preventDefault();
            hideMenu();
        } else if (e.keyCode == 13) { // enter
            e.preventDefault();
            saveMenu();
        }
    }
});
$('.search-bar').on('click', function() {
    focusSearch();
});
$('.lesson').on('click', function(e) {
    if (e.metaKey || e.ctrlKey) {
        $(this).toggleClass('selected-lesson');
    } else {
        $('.lesson').each(function() {
            $(this).removeClass('selected-lesson');
        });
        $(this).addClass('selected-lesson');
    }
})

// 2. Parse & display text of selected file(s)
// a) Establish selected files/lessons
var selectedLessons = [];
defineSelectedLessons();
// On menu save, update selectedLessons
$('#save-menu').on('click', function() {
    saveMenu();
});

// b) Parse
parse(selectedLessons, 'KO');

