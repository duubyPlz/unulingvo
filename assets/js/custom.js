// TODO:
// * alternative answers
// * dropdown to bootstrap

// 0. Init
// toggle all tooltips
$(function () {
  $('[data-toggle="tooltip"]').tooltip()
})

// 1. Parse & display text of selected module
var selectedModule = $('select#contents').val();
if (!$.isNumeric(selectedModule)) {
    $.error("Selected module isn't a valid one: " + selectedModule);
}
// a) Parse
parse(selectedModule);

var correctEO = "";
// b) Display
setTimeout(function () {
    display();
}, 1000);


// 2. If module is changed, reparse & display
$('select#contents').change(function() {
    selectedModule = $('select#contents').val();
    if (!$.isNumeric(selectedModule)) {
        $.error("Selected module isn't a valid one: " + selectedModule);
    }
    parse(selectedModule);
    setTimeout(function () {
        display();
    }, 1000);
});

// 3. Logic - check results, see if input field is correct
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

// 4. Skipping current
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

// > If we're displaying mobile css, change '>' to 'v'


// Subroutines
function parse(module) {
    hash = new Object();
    var fileName = 'assets/txt/duo' + module + '.txt';
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
    var sanitisedString = inputString.replace(/[^a-zA-Z0-9_.,?!'" ĉĝĥĵŝŭĈĜĤĴŜŬ]/g, ""); // whitelist
    var intermediateEO = correctEO.replace(/\-/g, " ");
    var simplifiedEO = intermediateEO.replace(/[.?!,:";]/g, "").toLowerCase().trim(); // blacklist
    var simplifiedString = sanitisedString.replace(/[.?!,:"]/g, "").toLowerCase().trim(); // blacklist
    if (simplifiedEO === simplifiedString) {
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
