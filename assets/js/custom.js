// Main
// 0. Init
// Global hash representation of current file
var fileHash = new Object();
// Current file's top badge (short-form to full name) hash
var badgeHash = new Object();

showMenu(); // TODO @cku DELETE DEBUG

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
    var selectedLessons = defineSelectedLessons();
    parse(selectedLessons);
    hideMenu();
}
function defineSelectedLessons() {
    selectedLessons = []
    $('.selected').each(function() {
        if ($(this).parent().hasClass('active')) {

            var language = $(this).parent().attr('language');

            selectedLessons.push(language + "." + $(this).attr('id'));
        }
    });
    console.log('SELECTED LESSONS');
    console.log(selectedLessons);
    return selectedLessons;
}
function parse(selectedLessons) {
    console.log('PARSE');
    console.log(selectedLessons);
}

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
        $(this).toggleClass('selected');
    } else {
        $('.lesson').each(function() {
            $(this).removeClass('selected');
        });
        $(this).addClass('selected');
    }
});
$('.lesson-parent').on('click', function(e) {
    // Button highlight
    $('.lesson-parent').each(function() {
        $(this).removeClass('selected');
    });
    $(this).addClass('selected');

    // Select class
    var lessonWanted = $(this).val();
    $('.lesson-children').each(function() {
        $(this).removeClass('active');
    });
    $('div[language=' + lessonWanted + ']').addClass('active');
});

// 2. Parse & display text of selected file(s)
// a) Establish selected files/lessons
var selectedLessons = defineSelectedLessons();
// On menu save, update selectedLessons
$('#menu-save-btn').on('click', function() {
    saveMenu();
});

// b) Parse
parse(selectedLessons);
