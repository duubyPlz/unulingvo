// TODO:
// * compare every word:
//     * split both answer & user input by /\s+/, compare every element
//     * if different, "bold" the word by div
// * alternative answers
//     * implement parsing of custom regex [|]
//     * collect alternate translations
// * populate older topics w/ more data
// * refactor flu (e.g. global bool flag)
//     * have a keypress for randomisation
// * toggling modules doesn't rerender

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
$('select#contents-ko').parent().hide();
$('select#contents-ja').parent().hide();
$('select#contents-gr').parent().hide();

// TODO can't get semantic ui <select>.dropdown('set selected', random) to work
var sizeHash = {
                    'eo': 30,
                    'ko': 10,
                    'ja': 2,
                    'gr': 11,
                    'flu': 2
               };

// 1. Parse & display text of selected module
var selectedModule = $('select#contents-' + language).val();
checkIsModuleValid(selectedModule);

// a) Parse
parse(selectedModule, language);

var correctEO = "";
var greekFirst = false;

// b) Display
setTimeout(function () {
    display(false);
}, 1000);

// 2. Module swaps triggered
$('#duoButton').on('click', function() {
    var duo = $('#duo-module');
    var flu = $('#flu-module');
    if (duo.is(':visible')) {
       // do nothing 
    } else if (flu.is(':visible')) {
        flu.fadeIn();

        // init duo
        selectedModule = $('select#contents-' + language).val();
        display_loader(false);
        parse(selectedModule, language);
        setTimeout(function () {
            display(false);
        }, 1000);

        flu.fadeOut();
        setTimeout(function() {
            duo.fadeIn();
        }, 760);
    }
});

$('#fluButton').on('click', function() {
    var duo = $('#duo-module');
    var flu = $('#flu-module');
    if (flu.is(':visible')) {
       // do nothing 
    } else if (duo.is(':visible')) {
        duo.fadeOut();

        // init flu
        $('#flu').parent().show();
        selectedModule = $('#flu').val();

        display_loader(true);
        parse(selectedModule, 'flu');
        setTimeout(function () {
            display(true);
        }, 1000);

        duo.fadeOut();
        setTimeout(function() {
            flu.fadeIn();
        }, 760);
    }
});

// 3. Pills are toggled (language changed)
// a) Button clicks
$('.nav-pills li').on('click', function() {
    var currentPill = $(this);
    goToPill(currentPill);
});

// b) Keyboard shortcuts
$('body').keydown(function (e) {
    if (e.shiftKey && e.keyCode == 50)  { // '@' Esperanto
        e.preventDefault();
        var currentPill = $('.nav-pills li#eo');
        goToPill(currentPill);
    } else if (e.shiftKey && e.keyCode == 51) { // '#' Korean
        e.preventDefault();
        var currentPill = $('.nav-pills li#ko');
        goToPill(currentPill);
    } else if (e.shiftKey && e.keyCode == 52) { // '$' Japanese
        e.preventDefault();
        var currentPill = $('.nav-pills li#ja');
        goToPill(currentPill);
    } else if (e.shiftKey && e.keyCode == 53) { // '%' Greek
        e.preventDefault();
        var currentPill = $('.nav-pills li#gr');
        goToPill(currentPill);
    }
});

// c) Greek toggle
$('.nav-pills li#gr').on('click', function() {
    $('#toggle-label-gr').toggle();
});

$('.main-panel').on('click', function() {
    $('#toggle-label-gr').hide();
});

$('#toggle-gr').change(function() {
    var selectedModule = $('select#contents-' + language).val();
    greekFirst = $('#toggle-gr').is(":checked");
    reparse(selectedModule);
});


function reparse(selectedModule) {
    // reparse/redisplay
    // o_O" .. code reuse from 1.
    if (greekFirst) {
        selectedModule = englishToGreekModule(selectedModule);
    }

    checkIsModuleValid(selectedModule);

    display_loader(false);
    parse(selectedModule, language);
    var correctEO = "";
    setTimeout(function () {
        display(false);
    }, 1000);
}

function englishToGreekModule(number) {
    var charCode = eval(96) + eval(number);
    return String.fromCharCode(charCode);
}

function goToPill(currentPill) {
    language = currentPill.attr('id');
    if (!currentPill.hasClass('active')) {
        // i) Make all pills inactive
        $('.nav-pills li').each(function() {
            $(this).removeClass();
        });

        // ii) Make this pill active
        currentPill.addClass('active');

        // iii) top previously active dropdown
        $('select').parent().hide();
        // $('select').parent().show();

        // iv) Show only current language's dropdown
        $('select#contents-'+language).parent().show();

        // v) Change textarea#answer's placeholder
        // refactor if more languages
        if (language == 'eo') {
            $('textarea#answer').attr('placeholder', 'Esperanto');
        } else if (language == 'ko') {
            $('textarea#answer').attr('placeholder', '한국어');
        } else if (language == 'ja') {
            $('textarea#answer').attr('placeholder', '日本語');
        } else if (language == 'gr') {
            $('textarea#answer').attr('placeholder', 'Ελληνικά');
        }

        // vi) reparse/redisplay
        // o_O" .. more code reuse from 1. ......
        var selectedModule = $('select#contents-' + language).val();
        // checkIsModuleValid(selectedModule);

        // display_loader(false);
        // parse(selectedModule, language);
        // var correctEO = "";
        // setTimeout(function () {
        //     display(false);
        // }, 1000);
        reparse(selectedModule);
    } else {
        // Already active pill
    }
}

// 4. If module is changed, reparse & display
$('select#contents-eo, select#contents-ko, select#contents-ja, select#contents-gr').change(function() {
    selectedModule = $(this).val();
    // checkIsModuleValid(selectedModule);
    
    // display_loader(false);
    // parse(selectedModule, language);
    // setTimeout(function () {
    //     display(false);
    // }, 1000);
    reparse(selectedModule);
});

// TODO if UI changed
$('select#flu').change(function() {
    selectedModule = $(this).val();
    // checkIsModuleValid(selectedModule);
    
    // display_loader(true);
    // parse(selectedModule, 'flu');
    // setTimeout(function () {
    //     display(true);
    // }, 1000);
    reparse(selectedModule);
});

// 5. Randomise modules
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
    } else if (language == 'ko') {
        $('#contents-ko').dropdown('set selected', random);
    } else if (language == 'ja') {
        $('#contents-ja').dropdown('set selected', random);
    } else if (language == 'gr') {
        $('#contents-gr').dropdown('set selected', random);
    }
    // $('#contents-' + language).dropdown('set selected', random);

    selectedModule = random;

    display_loader(false);
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

    display_loader(true);
    parse(selectedModule, 'flu');
    setTimeout(function () {
        display(true);
    }, 1000);
});

// 6. Logic - check results, see if input field is correct
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

// 7. Skipping current
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

// b) Press '`' backtick key
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
    } else if (language == 'ko') {
        fileName = 'assets/txt/kor' + module + '.txt';
    } else if (language == 'ja') {
        fileName = 'assets/txt/jpn' + module + '.txt';
    } else if (language == 'gr') {
        fileName = 'assets/txt/gre' + module + '.txt';
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

            // console.log(lines);
            // console.log(lines.length);

            for (var i=0; i<lines.length; i++) {
                var current = lines[i];
                if (matchesEO = current.match(/^\ {4}O:.*/)) { // EO
                    currentEsperanto = matchesEO[0].replace(/\ {4}O:\ /, "");
                } else if (matchesEN = current.match(/^\ {4}E:.*/)) { // EN
                    var english = matchesEN[0].replace(/\ {4}E:\ /, "");
                    hash[english] = currentEsperanto;
                }
            }
            // console.log(hash);
        }, 'text');
    } catch (e) {
        console.warn(e);
    }
}

function display_loader(isFlu) {
    var loader = '<br><br><div class="circle"></div><div class="circle1"></div>';
    if(isFlu) {
        $('.flu-display-text').html(loader);
    } else {
        $('.display-text').html(loader);
    }
}

function display(isFlu) {
    var length = Object.keys(hash).length;
    // https://stackoverflow.com/questions/4959975/generate-random-number-between-two-numbers-in-javascript
    // 0 -> 10: Math.floor(Math.random() * 11);
    var index = Math.floor(Math.random() * length);
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
    var correct = false;
    var inputString = $('textarea#answer').val();

    if (language == 'eo') {    
        var sanitisedString = inputString.replace(/[^a-zA-Z0-9_.,?!'" ĉĝĥĵŝŭĈĜĤĴŜŬ\-]/g, ""); // whitelist
        var simplifiedString = sanitisedString.replace(/[.,?!:";]/g, "").toLowerCase().trim(); // blacklist

        var simplifiedEO = correctEO.replace(/[.,?!:";]/g, "").toLowerCase().trim(); // blacklist
        var simplifiedEONoHyphens = simplifiedEO.replace(/\-/g, " ");

        if ((simplifiedEO === simplifiedString) || (simplifiedEONoHyphens === simplifiedString)) {
            correct = true;
        }
    } else if (language == 'flu') { // [TODO] refactor
        inputString = $('textarea#flu-answer').val();
        var sanitisedString = inputString.replace(/[^a-zA-Z0-9_.,?!'" ĉĝĥĵŝŭĈĜĤĴŜŬ\-]/g, ""); // whitelist
        var simplifiedString = sanitisedString.replace(/[.,?!:";]/g, "").toLowerCase().trim(); // blacklist

        var simplifiedEO = correctEO.replace(/[.,?!:";]/g, "").toLowerCase().trim(); // blacklist
        var simplifiedEONoHyphens = simplifiedEO.replace(/\-/g, " ");

        if ((simplifiedEO === simplifiedString) || (simplifiedEONoHyphens === simplifiedString)) {
            correct = true;
        }
    } else if ((language == 'ja')
            || (language == 'ko')) {
        /// Whitelisting CJK:
        //     \p{Han} [\x3400-\x4DB5\x4E00-\x9FCB\xF900-\xFA6A]
        //     Hangul Compatibility Jamo [\x3130-\x318F]
        //     Hangul Jamo [\x1100-\x11FF]
        //     Hangul Jamo Extended-A [\xA960-\xA97F]
        //     Hangul Jamo Extended-B [\xD7B0-\xD7FF]
        //     Hangul Syllables [\xAC00-\xD7AF]
        //     \p{Hiragana} [\x3040-\x309F]
        //     \p{Katakana} [\x30A0-\x30FF]
        //     Kanji radicals [\x2E80-\x2FD5]
        //     Half width [\xFF5F-\xFF9F]
        //     Punctuation [\x3000-\x303F]

        // links:
        //     http://jrgraphix.net/research/unicode.php
        //     http://www.alanwood.net/unicode/menu.html
        //     http://www.localizingjapan.com/blog/2012/01/20/regular-expressions-for-japanese-text/
        //     http://stackoverflow.com/questions/30069846/how-to-find-out-chinese-or-japanese-character-in-a-string-in-python
        //     http://stackoverflow.com/questions/280712/javascript-unicode-regexes

        var sanitisedString = inputString
        .replace(/[^\u3400-\u4DB5\u4E00-\u9FCB\uF900-\uFA6A\u3130-\u318F\u1100-\u11FF\uA960-\uA97F\uD7B0-\uD7FF\uAC00-\uD7AF\u3040-\u309F\u30A0-\u30FF\u2E80-\u2FD5\u3000-\u303F]/g
        , ""); // CJK only whitelist, no spaces

        var sanitisedCJK = correctEO
        .replace(/[^\u3400-\u4DB5\u4E00-\u9FCB\uF900-\uFA6A\u3130-\u318F\u1100-\u11FF\uA960-\uA97F\uD7B0-\uD7FF\uAC00-\uD7AF\u3040-\u309F\u30A0-\u30FF\u2E80-\u2FD5\u3000-\u303F]/g
        , ""); // same whitelist as above
        
        if (sanitisedCJK === sanitisedString) {
            correct = true;
        }
        // currently infeasible, doesn't retain spaces from `inputString`
        // correct = true;
        // for (var i=0; i<sanitisedCJK.length; i++) {
        //     var currentChar = sanitisedString[i];
        //     console.log(i + ': ' + sanitisedCJK[i] + ' ' + sanitisedString[i]);
        // }
    } else if (language == 'gr') {
        // TODO uncomment greek whitelist
        var sanitisedString = inputString.replace(/[^a-zA-Z0-9_.,?!'" \-\u1F00-\u1FFF\u0370-\u03FF ]/g, ""); // whitelist
        var simplifiedString = sanitisedString.replace(/[.,?!:";]/g, "").toLowerCase().trim(); // blacklist

        var simplifiedGr = correctEO.replace(/[.,?!:";]/g, "").toLowerCase().trim(); // blacklist
        var simplifiedGrNoHyphens = simplifiedGr.replace(/\-/g, " ");

        if ((simplifiedGr === simplifiedString) || (simplifiedGrNoHyphens === simplifiedString)) {
            correct = true;
        }
    } else {
        console.warn("No such language: + " + language);
    }

    if (correct) {
        if (language == 'flu') {
            $('textarea#flu-answer').addClass('correct');
            // display new one
            setTimeout(function () {
                display(true);
                $('textarea#flu-answer').val('');
                $('textarea#flu-answer').removeClass('correct');
            }, 700);
        } else {        
            $('textarea#answer').addClass('correct');
            // display new one
            setTimeout(function () {
                display(false);
                $('textarea#answer').val('');
                $('textarea#answer').removeClass('correct');
            }, 700);
        }
    } else {
        // pseudocode
        // * split simplifiedEO & simplfiedString on whitespace (to get each word)
        // * for each word in simplifiedString that doesn't exist in simplifiedEO, bold them.
        //      * html += word or html += <b>word</b>
        //      * but it's .val().. check

        if (language == 'flu') { // [TODO] refactor
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

function checkIsModuleValid(selectedModule) {
    // if (!$.isNumeric(selectedModule)) {
    //     $.error("Selected module isn't a valid one: " + selectedModule);
    // }
    if (!selectedModule.match(/[0-9a-zA-Z]/)) {
        $.error("Selected module isn't a valid one: " + selectedModule);
    }
}