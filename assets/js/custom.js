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
// * unit testing

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
var fileSizes = {
                    'eo': 30,
                    'ko': 9,
                    'ja': 2,
                    'gr': 11,
                    'flu': 2
                };

// Global hash representation of current file
var fileHash = new Object();

// 1. Parse & display text of selected module
var selectedModule = $('select#contents-' + language).val();
checkIsModuleValid(selectedModule);

// a) Parse
parse(selectedModule, language);

var greekFirst = false;
var currentCorrectOriginal = ""; // need this variable inter-function

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
    currentCorrectOriginal = "";

    // Reset textarea
    $('.textarea#answer').html('');
    $('.textarea#answer').removeClass('correct');
    $('.textarea#answer').removeClass('incorrect');

    setTimeout(function () {
        display(false);
    }, 1000);
}

function englishToGreekModule(number) {
    if (language != 'gr') {
        return number;
    }
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

        // v) Change .textarea#answer's data-placeholder
        // refactor if more languages
        if (language == 'eo') {
            $('.textarea#answer').attr('data-placeholder', 'Esperanto');
        } else if (language == 'ko') {
            $('.textarea#answer').attr('data-placeholder', '한국어');
        } else if (language == 'ja') {
            $('.textarea#answer').attr('data-placeholder', '日本語');
        } else if (language == 'gr') {
            $('.textarea#answer').attr('data-placeholder', 'Ελληνικά');
        }

        // vi) reparse/redisplay
        // o_O" .. more code reuse from 1. ......
        var selectedModule = $('select#contents-' + language).val();
        // checkIsModuleValid(selectedModule);

        // display_loader(false);
        // parse(selectedModule, language);
        // currentCorrectOriginal = "";  
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

    var size = fileSizes[language];
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

    reparse(selectedModule.toString());
    // display_loader(false);
    // parse(selectedModule, language);
    // setTimeout(function () {
    //     display(false);
    // }, 1000);
});

$('button#flu-randomise').click(function() {
    var size = fileSizes['flu'];
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
    if (!$('.textarea#answer').hasClass('incorrect') && !$('.textarea#answer').hasClass('correct')) {
        logic(language);
    }
});

$('button#flu-checking').on('click', function() {
    if (!$('.textarea#flu-answer').hasClass('incorrect') && !$('.textarea#flu-answer').hasClass('correct')) {
        logic('flu');
    }
});

// b) Press 'enter' key
$('.textarea#answer').keydown(function (e) {
    if (e.keyCode == 13)  {
        e.preventDefault();
        if (!$('.textarea#answer').hasClass('incorrect') && !$('.textarea#answer').hasClass('correct')) {
            logic(language);
        }
    }
});

$('.textarea#flu-answer').keydown(function (e) {
    if (e.keyCode == 13)  {
        e.preventDefault();
        if (!$('.textarea#flu-answer').hasClass('incorrect') && !$('.textarea#flu-answer').hasClass('correct')) {
            logic('flu');
        }
    }
});

// 7. Skipping current
// > a) Click 'skip' button
$('button#skip').on('click', function() {
    // clear input field & makes it normal again
    $('.textarea#answer').html('');
    $('.textarea#answer').removeClass('correct');
    $('.textarea#answer').removeClass('incorrect');

    // then display next text
    display(false);
});

$('button#flu-skip').on('click', function() {
    // clear input field & makes it normal again
    $('.textarea#flu-answer').html('');
    $('.textarea#flu-answer').removeClass('correct');
    $('.textarea#flu-answer').removeClass('incorrect');

    // then display next text
    display(true);
});

// b) Press '`' backtick key
$('.textarea#answer').keydown(function (e) {
    if (e.keyCode == 192)  {
        e.preventDefault();
        $('.textarea#answer').html('');
        $('.textarea#answer').removeClass('correct');
        $('.textarea#answer').removeClass('incorrect');
        display(false);
    }
});

$('.textarea#flu-answer').keydown(function (e) {
    if (e.keyCode == 192)  {
        e.preventDefault();
        $('.textarea#flu-answer').html('');
        $('.textarea#flu-answer').removeClass('correct');
        $('.textarea#flu-answer').removeClass('incorrect');
        display(true);
    }
});

// Subroutines
function parse(module, language) {
    fileHash = new Object();
    var fileName = 'lernu1.txt'; // random default file
    var languageToFilePrefix = {
        "eo": "duo",
        "ko": "kor",
        "ja": "jpn",
        "gr": "gre",
        "flu": "flu"
    };

    if (languageToFilePrefix && languageToFilePrefix[language]) {
        fileName = 'assets/txt/' + languageToFilePrefix[language] + module + '.txt';
    } else {
        console.warn("Language isn't valid: " + language);
    }

    try {
        $.get(fileName, function(data) {
            // console.log(fileName);
            // console.log(data);

            // Break result into line by line
            var lines = data.split("\n");
            
            // console.log(lines);
            // console.log(lines.length);
            
            const originalTag = "O:"
            const englishTag = "E:"
            const formattedTag = "F:"
            
            var originalRegexMatch = new RegExp("^\ {4}" + originalTag + ".*");
            var originalRegexReplace = new RegExp("\ {4}" + originalTag + "\ ");
            var englishRegexMatch = new RegExp("^\ {4}" + englishTag + ".*");
            var englishRegexReplace = new RegExp("\ {4}" + englishTag + "\ ");
            var formattedRegexMatch = new RegExp("^\ {4}" + formattedTag + ".*");
            var formattedRegexReplace = new RegExp("\ {4}" + formattedTag + "\ ");
            
            var separatorRegex = new RegExp("^[\r\n]*$");

            // For all the lines in the file,
            // sift through which are matching [O:], [E:], [F:] & entry separators
            var currentEntry = {
                original: "",
                english: "",
                formatted: ""
            };
            for (var i=0; i<lines.length; i++) {
                var line = lines[i];

                if (matchesTarget = line.match(originalRegexMatch)) {
                    // > Original [O:]
                    var original = matchesTarget[0].replace(originalRegexReplace, "");
                    currentEntry.original = original;
                } else if (matchesEnglish = line.match(englishRegexMatch)) {
                    // > English [E:]
                    var english = matchesEnglish[0].replace(englishRegexReplace, "");
                    currentEntry.english = english;
                } else if (matchesFormatted = line.match(formattedRegexMatch)) {
                    // > Formatted [F:]
                    var formatted = matchesFormatted[0].replace(formattedRegexReplace, "");
                    currentEntry.formatted = formatted;
                } else if (matchesSeparator = line.match(separatorRegex)) {
                    // > Separator
                    // 1. Store previous entry
                    if (currentEntry.english != "") {
                        fileHash[currentEntry.english] = currentEntry; // Set
                    }

                    // 2. Reset current entry, we're going to be looking at a new entry
                    currentEntry = {
                        original: "",
                        english: "",
                        formatted: ""
                    };
                }
            }
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
    var length = Object.keys(fileHash).length;
    // https://stackoverflow.com/questions/4959975/generate-random-number-between-two-numbers-in-javascript
    // 0 -> 10: Math.floor(Math.random() * 11);
    var index = Math.floor(Math.random() * length);
    var keys = Object.keys(fileHash);
    var english = keys[index]; // key to retrieve
    var currentEntry = fileHash[english]; // Get
    currentCorrectOriginal = currentEntry.original
    var formatted = currentEntry.formatted
    if (formatted != "") {
        formattedHtml = generateFormattedHtml(formatted, english);
        if (isFlu) {
            $('.flu-display-text').html(formattedHtml);
        } else {
            $('.display-text').html(formattedHtml);
        }
    } else {
        if (isFlu) {
            $('.flu-display-text').html(english);
        } else {
            $('.display-text').html(english);
        }
    }
}

// Logic to parse our formatted syntax into HTML
function generateFormattedHtml(formatted, english) {
    // Note: Can add more syntax symbols in the future, split on regex
    var parts = formatted.split('_');

    var zeroth = parts.shift();
    var result = boldString(zeroth);

    for (i=0; i<parts.length; i++) {
        // Now that zeroth element is removed, if UNSHIFTED LENGTH 1 -> then wouldn't enter loop.
        // unshifted first (shifted even) element -> BOLD
        // unshifted second (shifted odd) element -> UNBOLD
        if (parts.length < 2) {
            // UNSHIFTED LENGTH 2 for some reason, exiting function.
            console.warn("Format not correct, reverting to unformatted. Incorrect: " + formatted);
            return english;
        }

        if ((i % 2) == 0) {
            var even = unboldString(parts[i]);
            result += even;
        } else if ((i % 2) == 1) {
            var odd = boldString(parts[i]);
            result += odd;
        }
    }

    return result;
}

// Unbold style definition
function unboldString(string) {
    // return "<span style='font-weight:300'>" + string + "</span>";
    return "<span style='color: rgba(255, 255, 255, 0.7);'>" + string + "</span>";
}

// Bold style definition
function boldString(string) {
    return string;
}

function logic(language) {
    var correct = false;
    var inputString = $('.textarea#answer').html();

    var hyphenRegex = new RegExp("\-", "g");
    var eoWhitelistRegex = new RegExp("[^a-zA-Z0-9_.,?!'\" ĉĝĥĵŝŭĈĜĤĴŜŬ\-]", "g")
    var eoBlacklistRegex = new RegExp("[.,?!:\";]", "g")
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
    var cjkWhitelistRegex = new RegExp("[^\u3400-\u4DB5\u4E00-\u9FCB\uF900-\uFA6A\u3130-\u318F\u1100-\u11FF\uA960-\uA97F\uD7B0-\uD7FF\uAC00-\uD7AF\u3040-\u309F\u30A0-\u30FF\u2E80-\u2FD5\u3000-\u303F]", "g");
    var grWhitelistRegex = new RegExp("[^a-zA-Z0-9_.,?!'\" \-\u1F00-\u1FFF\u0370-\u03FF ]" , "g");
    var grBlacklistRegex = new RegExp("[.,?!:\";]" , "g");

    if (language == 'eo') {    
        var sanitisedString = inputString.replace(eoWhitelistRegex, "");
        var simplifiedString = sanitisedString.replace(eoBlacklistRegex, "").toLowerCase().trim();

        var simplifiedEO = currentCorrectOriginal.replace(eoBlacklistRegex, "").toLowerCase().trim();
        var simplifiedEONoHyphens = simplifiedEO.replace(hyphenRegex, " ");

        if ((simplifiedEO === simplifiedString) || (simplifiedEONoHyphens === simplifiedString)) {
            correct = true;
        }
    } else if (language == 'flu') { // [TODO] refactor
        inputString = $('.textarea#flu-answer').html();
        var sanitisedString = inputString.replace(eoWhitelistRegex, "");
        var simplifiedString = sanitisedString.replace(eoBlacklistRegex, "").toLowerCase().trim();

        var simplifiedEO = currentCorrectOriginal.replace(eoBlacklistRegex, "").toLowerCase().trim();
        var simplifiedEONoHyphens = simplifiedEO.replace(hyphenRegex, " ");

        if ((simplifiedEO === simplifiedString) || (simplifiedEONoHyphens === simplifiedString)) {
            correct = true;
        }
    } else if ((language == 'ja')
            || (language == 'ko')) {
        var sanitisedString = inputString
        .replace(cjkWhitelistRegex, "");

        var sanitisedCJK = currentCorrectOriginal
        .replace(cjkWhitelistRegex, "");
        
        if (sanitisedCJK === sanitisedString) {
            correct = true;
        }
    } else if (language == 'gr') {
        var sanitisedString = inputString.replace(grWhitelistRegex, "");
        var simplifiedString = sanitisedString.replace(grBlacklistRegex, "").toLowerCase().trim();

        var simplifiedGr = currentCorrectOriginal.replace(grBlacklistRegex, "").toLowerCase().trim();
        var simplifiedGrNoHyphens = simplifiedGr.replace(hyphenRegex, " ");

        if ((simplifiedGr === simplifiedString) || (simplifiedGrNoHyphens === simplifiedString)) {
            correct = true;
        }
    } else {
        console.warn("No such language: + " + language);
    }

    if (correct) {
        if (language == 'flu') {
            $('.textarea#flu-answer').addClass('correct');
            // display new one
            setTimeout(function () {
                display(true);
                $('.textarea#flu-answer').html('');
                $('.textarea#flu-answer').removeClass('correct');
            }, 700);
        } else {        
            $('.textarea#answer').addClass('correct');
            // display new one
            setTimeout(function () {
                display(false);
                $('.textarea#answer').html('');
                $('.textarea#answer').removeClass('correct');
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
            $('.textarea#flu-answer').addClass('incorrect');
            $('.textarea#flu-answer').html(currentCorrectOriginal);

            // if keypress, then clear straight away
            $('.textarea#flu-answer').keydown(function(e) {
                if ($('.textarea#flu-answer').hasClass('incorrect') && (e.keyCode != 13)) {
                    $('.textarea#flu-answer').removeClass('incorrect');
                    $('.textarea#flu-answer').html('');
                }
            });

            // else wait for timer
            setTimeout(function() {
                if ($('.textarea#flu-answer').hasClass('incorrect')) {
                    $('.textarea#flu-answer').removeClass('incorrect');
                    $('.textarea#flu-answer').html('');
                }
            }, 3000);
        } else {      
            // Change to correct answer
            $('.textarea#answer').addClass('incorrect');
            $('.textarea#answer').html(currentCorrectOriginal);

            // if keypress, then clear straight away
            $('.textarea#answer').keydown(function(e) {
                if ($('.textarea#answer').hasClass('incorrect') && (e.keyCode != 13)) {
                    $('.textarea#answer').removeClass('incorrect');
                    $('.textarea#answer').html('');
                }
            });

            // else wait for timer
            setTimeout(function() {
                if ($('.textarea#answer').hasClass('incorrect')) {
                    $('.textarea#answer').removeClass('incorrect');
                    $('.textarea#answer').html('');
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