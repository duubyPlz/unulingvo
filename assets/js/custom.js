// TODO:
// * alternative answers
//     * implement parsing of custom regex [|]
//     * collect alternate translations
// * dropdown to bootstrap
// * populate older topics w/ more data

// 0. Init
// toggle all tooltips
$(function () {
  $('[data-toggle="tooltip"]').tooltip()
});
// default language
var language = 'eo';

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
    display();
}, 1000);

// 2. Pills are toggled (language changed)
$('.nav-pills li').on('click', function() {
    var currentPill = $(this);
    language = currentPill.attr('id');
    if (!currentPill.hasClass('active')) {
        // a) Make all pills inactive
        $('.nav-pills li').each(function() {
            $(this).removeClass();
        });

        // b) Make this pill active
        currentPill.addClass('active');

        // c) Hide previously active dropdown
        $('select').css('display', 'none');

        // d) Show only current language's dropdown
        $('select#contents-'+language).css('display', 'inline');

        // e) Change textarea#answer's placeholder
        // refactor if more languages
        if (language == 'eo') {
            $('textarea#answer').attr('placeholder', 'Esperanto');
        } else if (language == 'ja') {
            $('textarea#answer').attr('placeholder', '日本語 (not yet implemented!)');
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
            display();
        }, 1000);
    } else {
        // Already active pill
    }
});

// 3. If module is changed, reparse & display
$('select#contents-eo').change(function() {
    selectedModule = $('select#contents-eo').val();
    if (!$.isNumeric(selectedModule)) {
        $.error("Selected module isn't a valid one: " + selectedModule);
    }
    parse(selectedModule, language);
    setTimeout(function () {
        display();
    }, 1000);
});

// 4. Logic - check results, see if input field is correct
// a) Click 'check' button
$('button#checking').on('click', function() {
    if (!$('textarea#answer').hasClass('incorrect') && !$('textarea#answer').hasClass('correct')) {
        logic();
    }
});
// b) Press 'enter' key
$('textarea#answer').keydown(function (e) {
    if (e.keyCode == 13)  {
        e.preventDefault();
        if (!$('textarea#answer').hasClass('incorrect') && !$('textarea#answer').hasClass('correct')) {
            logic();
        }
    }
})

// 5. Skipping current
// > a) Click 'skip' button
$('button#skip').on('click', function() {
    // clear input field & makes it normal again
    $('textarea#answer').val('');
    $('textarea#answer').removeClass('correct');
    $('textarea#answer').removeClass('incorrect');

    // then display next text
    display();
});

// b) Press '`' key
$('textarea#answer').keydown(function (e) {
    if (e.keyCode == 192)  {
        e.preventDefault();
        $('textarea#answer').val('');
        $('textarea#answer').removeClass('correct');
        $('textarea#answer').removeClass('incorrect');
        display();
    }
})

// Subroutines
function parse(module, language) {
    hash = new Object();
    var fileName = 'lernu1.txt'; // random default file

    // refactor if lots of languages
    if (language == 'eo') {
        fileName = 'assets/txt/duo' + module + '.txt';
    } else if (language == 'ja') {
        fileName = 'assets/txt/jpn' + module + '.txt';
    } else {
        $.error("Language isn't valid: " + language);
    }
    // console.log(fileName);
    try {
        $.get(fileName, function(data) {
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

function display() {
    var length = Object.keys(hash).length;
    var index = Math.floor((Math.random() * (length - 1)) + 0);
    var keys = Object.keys(hash);
    var wantedEng = keys[index];
    correctEO = hash[wantedEng];
    $('.display-text').html(wantedEng);
}

function logic() {
    var inputString = $('textarea#answer').val();
    var sanitisedString = inputString.replace(/[^a-zA-Z0-9_.,?!'" ĉĝĥĵŝŭĈĜĤĴŜŬ\-]/g, ""); // whitelist
    var simplifiedString = sanitisedString.replace(/[.,?!:"]/g, "").toLowerCase().trim(); // blacklist

    var simplifiedEO = correctEO.replace(/[.,?!:";]/g, "").toLowerCase().trim(); // blacklist
    var simplifiedEONoHyphens = simplifiedEO.replace(/\-/g, " ");

    if ((simplifiedEO === simplifiedString) || (simplifiedEONoHyphens === simplifiedString)) {
        // console.log("correct " + simplifiedString + " " + simplifiedEO);
        $('textarea#answer').addClass('correct');
        // display new one
        setTimeout(function () {
            display();
            $('textarea#answer').val('');
            $('textarea#answer').removeClass('correct');
        }, 700);
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
