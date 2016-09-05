// TODO:
// * alternative answers
//     * implement parsing of custom regex [|]
//     * collect alternate translations
// * dropdown to bootstrap
// * populate older topics w/ more data
// * refactor flu (e.g. global bool flag)
//     * have a keypress for randomisation

// 0. Init
// toggle all tooltips
$(function () {
  $('[data-toggle="tooltip"]').tooltip();
});
// toggle all dropdowns
$('.ui.dropdown').dropdown();
// default language
var language = 'eo';
// hide unwanted dropdowns
$('select#contents-ja').parent().hide();

// TODO can't get semantic ui <select>.dropdown('set selected', random) to work
var sizeHash = {
                    'eo': 25,
                    'ja': 4,
                    'flu': 2
               };

// 1. Parse & display text of selected module
var selectedModule = $('select#contents-' + language).val();
if (!$.isNumeric(selectedModule)) {
    $.error("Selected module isn't a valid one: " + selectedModule);
}
// a) Parse
parse(selectedModule, language);

var correctEO = "";
// b) Display
setTimeout(function () {
    display(false);
}, 1000);

// Load flu
selectedModule = $('#flu').val();

parse(selectedModule, 'flu');
setTimeout(function () {
    display(true);
}, 1000);

// 2. Module swaps triggered
$('#duoButton').on('click', function() {
    var duo = $('#duo-module');
    var flu = $('#flu-module');
    if (duo.is(':visible')) {
       // do nothing 
    } else if (flu.is(':visible')) {
        flu.addClass('animated bounceOutUp');

        // init duo
        selectedModule = $('select#contents-' + language).val();

        setTimeout(function() {
            duo.show();
            // show the next module
            flu.hide();
            if (duo.is(':visible')) {
                duo.addClass('animated bounceInDown');
                flu.removeClass('animated bounceOutUp');
            } else if (flu.is(':visible')) {
                flu.addClass('animated bounceInDown');
                duo.removeClass('animated bounceOutUp');
            }
        }, 760);
    }
});

$('#fluButton').on('click', function() {
    var duo = $('#duo-module');
    var flu = $('#flu-module');
    if (flu.is(':visible')) {
       // do nothing 
    } else if (duo.is(':visible')) {
        duo.addClass('animated bounceOutUp');

        // init flu
        $('#flu').parent().show();
        selectedModule = $('#flu').val();

        setTimeout(function() {
            flu.show();
            // show the next module
            duo.hide();
            if (duo.is(':visible')) {
                duo.addClass('animated bounceInDown');
                flu.removeClass('animated bounceOutUp');
            } else if (flu.is(':visible')) {
                flu.addClass('animated bounceInDown');
                duo.removeClass('animated bounceOutUp');
            }
        }, 760);
    }
});

// if we need a one button toggle:
// $('#test').on('click', function() {
//     var duo = $('#duo-module');
//     var flu = $('#flu-module');
//     if (duo.is(':visible')) {
//         duo.addClass('animated bounceOutUp');
//     } else if (flu.is(':visible')) {
//         flu.addClass('animated bounceOutUp');
//     }
//     setTimeout(function() {
//         duo.toggle();
//         // show the next module
//         flu.toggle();
//         if (duo.is(':visible')) {
//             duo.addClass('animated bounceInDown');
//             flu.removeClass('animated bounceOutUp');
//         } else if (flu.is(':visible')) {
//             flu.addClass('animated bounceInDown');
//             duo.removeClass('animated bounceOutUp');
//         }
//     }, 760);
// });

// 3. Pills are toggled (language changed)
$('.nav-pills li').on('click', function() {
    var currentPill = $(this);
    language = currentPill.attr('id');
    if (!currentPill.hasClass('active')) {
        // a) Make all pills inactive
        $('.nav-pills li').each(function() {
            $(this).removeClass();
        });
        $('textarea#answer').removeClass('ja');

        // b) Make this pill active
        currentPill.addClass('active');

        // c) top previously active dropdown
        $('select').parent().hide();
        // $('select').parent().show();

        // d) Show only current language's dropdown
        $('select#contents-'+language).parent().show();

        // e) Change textarea#answer's placeholder
        // refactor if more languages
        if (language == 'eo') {
            $('textarea#answer').attr('placeholder', 'Esperanto');
        } else if (language == 'ja') {
            $('textarea#answer').attr('placeholder', '日本語');
        }

        // f) reparse/redisplay
        // o_O" .. code reuse from 1. ......
        var selectedModule = $('select#contents-' + language).val();
        if (!$.isNumeric(selectedModule)) {
            $.error("Selected module isn't a valid one: " + selectedModule);
        }
        parse(selectedModule, language);

        var correctEO = "";
        setTimeout(function () {
            display(false);
        }, 1000);

        // g) if japanese, thin fonts
        if (currentPill.attr('id') == 'ja') {
            $('textarea#answer').addClass('ja');
        }
    } else {
        // Already active pill
    }
});

// 3. If module is changed, reparse & display
$('select#contents-eo, select#contents-ja').change(function() {
    selectedModule = $(this).val();
    if (!$.isNumeric(selectedModule)) {
        $.error("Selected module isn't a valid one: " + selectedModule);
    }
    parse(selectedModule, language);
    setTimeout(function () {
        display(false);
    }, 1000);
});

// TODO if UI changed
$('select#flu').change(function() {
    selectedModule = $(this).val();
    if (!$.isNumeric(selectedModule)) {
        $.error("Selected module isn't a valid one: " + selectedModule);
    }
    parse(selectedModule, 'flu');
    setTimeout(function () {
        display(true);
    }, 1000);
});

// 4. Randomise modules
$('button#randomise').click(function() {
    // var size = 0;
    // if (language == 'eo') {
    //     size = $('#contents-eo').siblings().find('.item').size();
    // } else if (language == 'ja')  {
    //     size = $('#contents-ja').siblings().find('.item').size();
    // }

    var size = sizeHash[language];
    var random = Math.floor(Math.random() * size) + 1;

    // http://semantic-ui.com/modules/dropdown.html#behavior
    if (language == 'eo') {
        $('#contents-eo').dropdown('set selected', random);
    } else if (language == 'ja') {
        $('#contents-ja').dropdown('set selected', random);
    }
    selectedModule = random;

    parse(selectedModule, language);
    setTimeout(function () {
        display(false);
    }, 1000);
});

$('button#flu-randomise').click(function() {
    var size = sizeHash['flu'];
    var random = Math.floor(Math.random() * size) + 1;

    // http://semantic-ui.com/modules/dropdown.html#behavior
    $('#flu').dropdown('set selected', random);
    selectedModule = random;

    parse(selectedModule, 'flu');
    setTimeout(function () {
        display(true);
    }, 1000);
});

// 5. Logic - check results, see if input field is correct
// a) Click 'check' button
$('button#checking').on('click', function() {
    if (!$('textarea#answer').hasClass('incorrect') && !$('textarea#answer').hasClass('correct')) {
        logic(language);
    }
});

$('button#flu-checking').on('click', function() {
    if (!$('textarea#flu-answer').hasClass('incorrect') && !$('textarea#flu-answer').hasClass('correct')) {
        logic('flu');
    }
});

// b) Press 'enter' key
$('textarea#answer').keydown(function (e) {
    if (e.keyCode == 13)  {
        e.preventDefault();
        if (!$('textarea#answer').hasClass('incorrect') && !$('textarea#answer').hasClass('correct')) {
            logic(language);
        }
    }
});

$('textarea#flu-answer').keydown(function (e) {
    if (e.keyCode == 13)  {
        e.preventDefault();
        if (!$('textarea#flu-answer').hasClass('incorrect') && !$('textarea#flu-answer').hasClass('correct')) {
            logic('flu');
        }
    }
});

// 6. Skipping current
// > a) Click 'skip' button
$('button#skip').on('click', function() {
    // clear input field & makes it normal again
    $('textarea#answer').val('');
    $('textarea#answer').removeClass('correct');
    $('textarea#answer').removeClass('incorrect');

    // then display next text
    display(false);
});

$('button#flu-skip').on('click', function() {
    // clear input field & makes it normal again
    $('textarea#flu-answer').val('');
    $('textarea#flu-answer').removeClass('correct');
    $('textarea#flu-answer').removeClass('incorrect');

    // then display next text
    display(true);
});

// b) Press '`' key
$('textarea#answer').keydown(function (e) {
    if (e.keyCode == 192)  {
        e.preventDefault();
        $('textarea#answer').val('');
        $('textarea#answer').removeClass('correct');
        $('textarea#answer').removeClass('incorrect');
        display(false);
    }
});

$('textarea#flu-answer').keydown(function (e) {
    if (e.keyCode == 192)  {
        e.preventDefault();
        $('textarea#flu-answer').val('');
        $('textarea#flu-answer').removeClass('correct');
        $('textarea#flu-answer').removeClass('incorrect');
        display(true);
    }
});

// Subroutines
function parse(module, language) {
    hash = new Object();
    var fileName = 'lernu1.txt'; // random default file

    // refactor if lots of languages
    if (language == 'eo') {
        fileName = 'assets/txt/duo' + module + '.txt';
    } else if (language == 'ja') {
        fileName = 'assets/txt/jpn' + module + '.txt';
    } else if (language == 'flu') {
        fileName = 'assets/txt/flu' + module + '.txt';
    } else {
        console.warn("Language isn't valid: " + language);
    }
    // console.log(fileName);
    try {
        $.get(fileName, function(data) {
            // console.log(fileName);
            // console.log(data);
            // Break result into line by line
            var lines = data.split("\n");
            var currentEsperanto = "";
            for (var i=0; i<lines.length; i++) {
                var current = lines[i];
                if (matchesEO = current.match(/\ {4}O:.*$/)) { // EO
                    currentEsperanto = matchesEO[0].replace(/\ {4}O:\ /, "");
                } else if (matchesEN = current.match(/\ {4}E:.*$/)) { // EN
                    var english = matchesEN[0].replace(/\ {4}E:\ /, "");
                    hash[english] = currentEsperanto;
                }
            }
        }, 'text');
    } catch (e) {
        console.warn(e);
    }
}

function display(isFlu) {
    var length = Object.keys(hash).length;
    var index = Math.floor((Math.random() * (length - 1)) + 0);
    var keys = Object.keys(hash);
    var wantedEng = keys[index];
    correctEO = hash[wantedEng];
    if (isFlu) {
        $('.flu-display-text').html(wantedEng);
    } else {
        $('.display-text').html(wantedEng);
    }
}

function logic(language) {
    var ok = false;
    if (language == 'eo') {    
        var inputString = $('textarea#answer').val();
        var sanitisedString = inputString.replace(/[^a-zA-Z0-9_.,?!'" ĉĝĥĵŝŭĈĜĤĴŜŬ\-]/g, ""); // whitelist
        var simplifiedString = sanitisedString.replace(/[.,?!:"]/g, "").toLowerCase().trim(); // blacklist

        var simplifiedEO = correctEO.replace(/[.,?!:";]/g, "").toLowerCase().trim(); // blacklist
        var simplifiedEONoHyphens = simplifiedEO.replace(/\-/g, " ");

        if ((simplifiedEO === simplifiedString) || (simplifiedEONoHyphens === simplifiedString)) {
            ok = true;
        }
    } else if (language == 'ja') {
        var inputString = $('textarea#answer').val();
        // unicode: \p{Han}\p{Kata}\p{Hira}
        // > no punctuation yet...
        // whitelist
        // http://stackoverflow.com/questions/30069846/how-to-find-out-chinese-or-japanese-character-in-a-string-in-python
        // http://stackoverflow.com/questions/280712/javascript-unicode-regexes
        var sanitisedString = inputString
        .replace(/[^\u2E80-\u2E99\u2E9B-\u2EF3\u2F00-\u2FD5\u3005\u3007\u3021-\u3029\u3038-\u303B\u3400-\u4DB5\u4E00-\u9FD5\uF900-\uFA6D\uFA70-\uFAD9\U00020000-\U0002A6D6\U0002A700-\U0002B734\U0002B740-\U0002B81D\U0002B820-\U0002CEA1\U0002F800-\U0002FA1D\u30A1-\u30FA\u30FD-\u30FF\u31F0-\u31FF\u32D0-\u32FE\u3300-\u3357\uFF66-\uFF6F\uFF71-\uFF9D\U0001B000\u3041-\u3096\u309D-\u309F\U0001B001\U0001F200]/g
        , "");

        var sanitisedJA = correctEO
        .replace(/[^\u2E80-\u2E99\u2E9B-\u2EF3\u2F00-\u2FD5\u3005\u3007\u3021-\u3029\u3038-\u303B\u3400-\u4DB5\u4E00-\u9FD5\uF900-\uFA6D\uFA70-\uFAD9\U00020000-\U0002A6D6\U0002A700-\U0002B734\U0002B740-\U0002B81D\U0002B820-\U0002CEA1\U0002F800-\U0002FA1D\u30A1-\u30FA\u30FD-\u30FF\u31F0-\u31FF\u32D0-\u32FE\u3300-\u3357\uFF66-\uFF6F\uFF71-\uFF9D\U0001B000\u3041-\u3096\u309D-\u309F\U0001B001\U0001F200]/g
        , "");

        if (sanitisedJA == sanitisedString) {
            ok = true;
        }
    } else if (language == 'flu') {
        var inputString = $('textarea#flu-answer').val();
        var sanitisedString = inputString.replace(/[^a-zA-Z0-9_.,?!'" ĉĝĥĵŝŭĈĜĤĴŜŬ\-]/g, ""); // whitelist
        var simplifiedString = sanitisedString.replace(/[.,?!:"]/g, "").toLowerCase().trim(); // blacklist

        var simplifiedEO = correctEO.replace(/[.,?!:";]/g, "").toLowerCase().trim(); // blacklist
        var simplifiedEONoHyphens = simplifiedEO.replace(/\-/g, " ");

        if ((simplifiedEO === simplifiedString) || (simplifiedEONoHyphens === simplifiedString)) {
            ok = true;
        }
    } else {
        console.warn("No such language: + " + language);
    }

    if (ok) {
        if (language == 'flu') {
            $('textarea#flu-answer').addClass('correct');
            // display new one
            setTimeout(function () {
                display(true);
                $('textarea#flu-answer').val('');
                $('textarea#flu-answer').removeClass('correct');
            }, 700);
        } else {        
            // console.log("correct " + simplifiedString + " " + simplifiedEO);
            $('textarea#answer').addClass('correct');
            // display new one
            setTimeout(function () {
                display(false);
                $('textarea#answer').val('');
                $('textarea#answer').removeClass('correct');
            }, 700);
        }
    } else {
        if (language == 'flu') {
            // Change to correct answer
            $('textarea#flu-answer').addClass('incorrect');
            $('textarea#flu-answer').val(correctEO);

            // if keypress, then clear straight away
            $('textarea#flu-answer').keydown(function(e) {
                if ($('textarea#flu-answer').hasClass('incorrect') && (e.keyCode != 13)) {
                    $('textarea#flu-answer').removeClass('incorrect');
                    $('textarea#flu-answer').val('');
                }
            });

            // else wait for timer
            setTimeout(function() {
                if ($('textarea#flu-answer').hasClass('incorrect')) {
                    $('textarea#flu-answer').removeClass('incorrect');
                    $('textarea#flu-answer').val('');
                }
            }, 3000);
        } else {        
            // console.log("incorrect " + simplifiedString + " " + simplifiedEO);
            // Change to correct answer
            $('textarea#answer').addClass('incorrect');
            $('textarea#answer').val(correctEO);

            // if keypress, then clear straight away
            $('textarea#answer').keydown(function(e) {
                if ($('textarea#answer').hasClass('incorrect') && (e.keyCode != 13)) {
                    $('textarea#answer').removeClass('incorrect');
                    $('textarea#answer').val('');
                }
            });

            // else wait for timer
            setTimeout(function() {
                if ($('textarea#answer').hasClass('incorrect')) {
                    $('textarea#answer').removeClass('incorrect');
                    $('textarea#answer').val('');
                }
            }, 3000);
        }
    }
}
