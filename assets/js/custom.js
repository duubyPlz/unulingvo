// Globals:
// Global hash representation of current file
var fileHash = new Object();
// Current file's top badge (short-form to full name) hash
var badgeHash = new Object();
// Reference language names
var languageToFilePrefix = {
    "eo": "duo",
    "ko": "kor",
    "ja": "jpn",
    "cn": "chn",
    "gr": "gre",
    "ttmik": "ttmik",
    "flu": "flu",
};
var language = "eo";

// Functions:
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
function reparse(selectedLessons) {
    function checkIsModuleValid(selectedModule) {
        // if (!$.isNumeric(selectedModule)) {
        //     $.error("Selected module isn't a valid one: " + selectedModule);
        // }

        if (!selectedModule.match(/[0-9a-zA-Z]/)) {
            $.error("Selected module isn't a valid one: " + selectedModule);
        }
    }

    // reparse/redisplay
    selectedLessons.forEach((module) => {
        checkIsModuleValid(module);
    });
    
    displayLoader();
    parse(selectedLessons);
    currentCorrectOriginal = "";

    // Reset textarea
    $('.textarea#answer').html('');
    $('.textarea#answer').removeClass('correct');
    $('.textarea#answer').removeClass('incorrect');

    setTimeout(function () {
        display();
    }, 1000);
}
function populateTopPanel() {
//     <div class="panel top-panel">
//     <span class="lesson-tag">
//       <img class="lesson-tag-img" src='assets/img/duo.ico' />
//       <svg class='flag-img' viewBox="0 1518 82 66"><image href="/assets/img/flags.svg" ></image></svg>
//     </span>
//     TTMIK 4.29 -게 되다
//   </div>
}

function saveMenu() {
    var selectedLessons = defineSelectedLessons();
    reparse(selectedLessons);
    hideMenu();
}
function defineSelectedLessons() {
    selectedLessons = []
    $('.selected').each(function() {
        if ($(this).parent().hasClass('active')) {
            selectedLessons.push(
                $(this).parent().attr('language') 
                    + "." 
                    + $(this).attr('id')
            );
        }
    });

    return selectedLessons;
}
function parse(selectedLessons) {
    fileHash = new Object();
    badgeHash = new Object();

    function generateEmptyEntry() {
        var newEmptyEntry = {
            original: "",
            english: "",
            formatted: ""
        };

        return newEmptyEntry;
    }

    function addToFileHash(fileHash, currentEntry) {
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

    selectedLessons.forEach(lesson => {
        var [ currentLanguage, module ] = lesson.split('.');
        language = currentLanguage.split('-')[1];
        var fileName = 'lernu1.txt'; // random default file
        if (languageToFilePrefix && languageToFilePrefix[language]) {
            fileName = 'assets/txt/' + languageToFilePrefix[language] + module + '.txt';
        } else {
            console.warn("Language isn't valid: " + language);
        }

        try {
            $.get(fileName, function(data) {
                console.log(fileName);
                console.log(data);
    
                // Break result into line by line
                var lines = data.split("\n");
                
                // console.log(lines);
                // console.log(lines.length);
                
                const originalTag = "O:"
                const englishTag = "E:"
                const formattedTag = "F:"
                
                var badgeDictEntryRegex =  new RegExp('^\\* ([a-zA-Z0-9]+) -> ([a-zA-Z0-9,]+)');
                var originalRegexMatch = new RegExp("^\ {4}" + originalTag + ".*");
                var originalRegexReplace = new RegExp("\ {4}" + originalTag + "\ ");
                var englishRegexMatch = new RegExp("^\ {4}" + englishTag + ".*");
                var englishRegexReplace = new RegExp("\ {4}" + englishTag + "\ ");
                var formattedRegexMatch = new RegExp("^\ {4}" + formattedTag + ".*");
                var formattedRegexReplace = new RegExp("\ {4}" + formattedTag + "\ ");
                
                var separatorRegex = new RegExp("^[\r\n]*$");
    
                // For all the lines in the file,
                // sift through which are matching [O:], [E:], [F:] & entry separators
                var currentEntry = generateEmptyEntry();
                var line = "";
                for (var i=0; i<lines.length; i++) {
                    line = lines[i];
    
                    var matchesTarget = line.match(badgeDictEntryRegex);
                    if (matchesTarget && !badgeHash[matchesTarget[1]]) {
                        badgeHash[matchesTarget[1]] = matchesTarget[2];
                    } else if (matchesTarget = line.match(originalRegexMatch)) {
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
                    } else if (line.match(separatorRegex)) {
                        addToFileHash(fileHash, currentEntry);
                        currentEntry = generateEmptyEntry();
                    }
                }
                // End of loop.
                // Just in case, if the last line is not a separator
                if (!line.match(separatorRegex)) {
                    addToFileHash(fileHash, currentEntry);
                    currentEntry = generateEmptyEntry();
                }
                // console.log(fileHash);
                // console.log( Object.keys(fileHash).length);
            }, 'text');
        } catch (e) {
            console.warn(e);
        }
    });
}

function displayLoader() {
    var loader = '<br><br><div class="circle"></div><div class="circle1"></div>';
    $('.display-text').html(loader);
}

function display() {
    var length = Object.keys(fileHash).length;
    // https://stackoverflow.com/questions/4959975/generate-random-number-between-two-numbers-in-javascript
    // 0 -> 10: Math.floor(Math.random() * 11);
    var index = Math.floor(Math.random() * length);
    var keys = Object.keys(fileHash);
    var english = keys[index]; // key to retrieve
    var currentEntry = fileHash[english]; // Get
    currentCorrectOriginal = currentEntry.original

    var fancyTagsHtml;
    if (currentEntry.formatted != "") {
        fancyTagsHtml = generateFancyTagsInHtml(
            generateFormattedHtml(currentEntry.formatted, english)
        );
    } else {
        fancyTagsHtml = generateFancyTagsInHtml(english);
    }

    var fancyTagsBadgelessHtml = "";
    var badgedWords = fancyTagsHtml.split(/([a-zA-Z0-9]+{[^}]+})/);
    if (badgedWords.length >= 3) {
        var badgeRegex = new RegExp("([a-zA-Z0-9]+){([^}]+)}");
        var matchesTarget = "";
        for (var word of badgedWords) {
            var matchesTarget = word.match(badgeRegex)
            if (matchesTarget) {
                fancyTagsBadgelessHtml += `<span class='badged-word'>${matchesTarget[1]}`;
                fancyTagsBadgelessHtml += `<div class='badge-tag'>${badgeHash[matchesTarget[2]] ?? matchesTarget[2]}</div>`;
                fancyTagsBadgelessHtml += '</span>';
            } else {
                fancyTagsBadgelessHtml += word;
            }
        }
    } else {
        fancyTagsBadgelessHtml = fancyTagsHtml;
    }

    // Display
    $('.display-text').html(fancyTagsBadgelessHtml);
}

// Logic to parse our formatted syntax into HTML
function generateFormattedHtml(formatted, english) {
    function dimString(string) {
        // return "<span style='font-weight:300'>" + string + "</span>";
        return "<span style='color: rgba(255, 255, 255, 0.7);'>" + string + "</span>";
    }
    
    function brightenString(string) {
        return string;
    }

    // Note: Can add more syntax symbols in the future, split on regex
    var parts = formatted.split('_');

    var zeroth = parts.shift();
    var result = brightenString(zeroth);

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
            var even = dimString(parts[i]);
            result += even;
        } else if ((i % 2) == 1) {
            var odd = brightenString(parts[i]);
            result += odd;
        }
    }

    return result;
}

/**
  Function to transform speech level tags
  E.g.: 
    @formal becomes
      <span class='formal-tag speech-level-tag'>formal</span>
  
    @doesNotExist becomes
      <span class='speech-level-tag'>doesNotExist</span>
*/
function generateFancyTagsInHtml(formattedHtml) {
    var prefix = "@";
    var regex = new RegExp(`${prefix}\\S+\\b`, "gi");
    var allTagsFound = formattedHtml.match(regex); // Could've also done a .replace
    if (!allTagsFound || allTagsFound.length === 0) {
        return formattedHtml;
    }

    // Generate map: tag x span
    // > Exact strings the .replace needs
    function generateMap(tagNames, prefix) {
        var map = {};
        for (var i=0; i<tagNames.length; i++) {
            var tagName = tagNames[i];
            var tag = prefix + tagName;
            var className = tagName + "-tag speech-level-tag";
    
            map[tag] = `<span class='${className}'>${tagName}</span>`;
        }
        return map;
    }

    var tagNames = [ 
        "formal",
        "polite",
        "impolite",
        "honorific",
        "plain",
        "i",
        "neutral",
        "n"
    ];

    var stringReplaceMap = generateMap(tagNames, prefix);

    // Replace
    var fancyTagsHtml = formattedHtml;
    for (var i=0; i<allTagsFound.length; i++) {
        var currentTag = allTagsFound[i];

        if (!stringReplaceMap[currentTag]) {
            continue;
        }

        fancyTagsHtml = fancyTagsHtml.replace(currentTag, stringReplaceMap[currentTag]);
    }

    return fancyTagsHtml;
}

function logic(language) {
    function makeWhitelistRegex(string) {
        return new RegExp("[^" + string + "]", "g");
    }
    
    function makeBlacklistRegex(string) {
        return new RegExp("[" + string + "]", "g");
    }

    // Bolds incorrect words if possible
    function formatCorrect(correct, userAnswer) {    
        function styleInsert(string) {
            // 1: bold
            return "<span style='font-weight:600'>" + string + "</span>";
        }
        
        function styleDelete(string) {
            // -1: strikethrough
            var formatted = "";
            if (language === 'ko' || language === 'ja' || language === 'cn' || language === 'ttmik') { // CJK
                formatted = "<span class='strikethrough-diagonal' style='font-weight:400'>" + string + "</span>";
            } else {
                formatted = "<span style='text-decoration: line-through'>" + string + "</span>";
            }
            return formatted;
        }
        
        // TODO @kuc case insensitiveness!
        if (userAnswer == "") {
            return correct;
        }

        var formatted = "";

        // call fast-diff, returns e.g. [[-1, "Goo"], [1, "Ba"], [0, "d dog"]]
        var diffResult = diff(userAnswer, correct);

        for (var i=0; i<diffResult.length; i++) {
            var currentElement = diffResult[i];

            var status = currentElement[0];
            var value = currentElement[1];
            
            switch (status) {
                case diff.INSERT:
                    formatted += styleInsert(value);
                    break;
                case diff.DELETE:
                    formatted += styleDelete(value);
                    break;
                case diff.EQUAL:
                    formatted += value;
                    break;
                default:
                    console.warn("fast-diff returned an unexpected status: " + status + ", value: " + value);
                    formatted += value;
                    break;
            }
        }

        return formatted;
    }

    var correct = false;
    var inputString = $('.textarea#answer').text().replace("&nbsp;", " ").trim();

    var hyphenRegex = new RegExp("\-", "g");
    var eoWhitelistString = "a-zA-Z0-9_.,?!'\" ĉĝĥĵŝŭĈĜĤĴŜŬ\-";
    var eoWhitelistRegex = makeWhitelistRegex(eoWhitelistString);
    var eoBlacklistString = ".,?!:\";";
    var eoBlacklistRegex = makeBlacklistRegex(eoBlacklistString);
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
    // \u3000-\u303F is cjk punctuation, no need to whitelist
    var cjkWhitelistString = "\u3400-\u4DB5\u4E00-\u9FCB\uF900-\uFA6A\u3130-\u318F\u1100-\u11FF\uA960-\uA97F\uD7B0-\uD7FF\uAC00-\uD7AF\u3040-\u309F\u30A0-\u30FF\u2E80-\u2FD5";
    var cjkWhitelistRegex = makeWhitelistRegex(cjkWhitelistString);
    var grWhitelistString = "a-zA-Z0-9_.,?!'\" \-\u1F00-\u1FFF\u0370-\u03FF";
    var grWhitelistRegex = makeWhitelistRegex(grWhitelistString);
    var grBlacklistString = ".,?!:\";";
    var grBlacklistRegex = makeBlacklistRegex(grBlacklistString);

    var sanitisedInput = ""; // Need to use this in another 'if' statement
    if (language === 'eo') {    
        sanitisedInput = inputString.replace(eoWhitelistRegex, "");
        var simplifiedString = sanitisedInput.replace(eoBlacklistRegex, "").toLowerCase().trim();

        var simplifiedEO = currentCorrectOriginal.replace(eoBlacklistRegex, "").toLowerCase().trim();
        var simplifiedEONoHyphens = simplifiedEO.replace(hyphenRegex, " ");

        if ((simplifiedEO === simplifiedString) || (simplifiedEONoHyphens === simplifiedString)) {
            correct = true;
        }
    }
    else if ((language === 'flu') || (language === "ttmik")) { // [TODO] refactor
        var eoAndCjkWhitelistString = eoWhitelistString + cjkWhitelistString;
        var eoAndCjkWhitelistRegex = makeWhitelistRegex(eoAndCjkWhitelistString);
        sanitisedInput = inputString.replace(eoAndCjkWhitelistRegex, "");

        var simplifiedString = sanitisedInput.replace(eoBlacklistRegex, "").toLowerCase().trim();

        var simplifiedAnswer = currentCorrectOriginal.replace(eoBlacklistRegex, "").toLowerCase().trim();
        var simplifiedAnswerNoHyphens = simplifiedAnswer.replace(hyphenRegex, " ");

        if ((simplifiedAnswer === simplifiedString) || (simplifiedAnswerNoHyphens === simplifiedString)) {
            correct = true;
        }
    }
    else if ((language === 'ja')
            || (language === 'ko')
            || (language === 'cn')) {
        sanitisedInput = inputString
        .replace(cjkWhitelistRegex, "");

        var sanitisedCJK = currentCorrectOriginal
        .replace(cjkWhitelistRegex, "");
        
        if (sanitisedCJK === sanitisedInput) {
            correct = true;
        }
    } else if (language === 'gr') {
        sanitisedInput = inputString.replace(grWhitelistRegex, "");
        var simplifiedString = sanitisedInput.replace(grBlacklistRegex, "").toLowerCase().trim();

        var simplifiedGr = currentCorrectOriginal.replace(grBlacklistRegex, "").toLowerCase().trim();
        var simplifiedGrNoHyphens = simplifiedGr.replace(hyphenRegex, " ");

        if ((simplifiedGr === simplifiedString) || (simplifiedGrNoHyphens === simplifiedString)) {
            correct = true;
        }
    } else {
        console.warn("No such language: + " + language);
    }

    if (correct) {      
            $('.textarea#answer').addClass('correct');
            // display new one
            setTimeout(function () {
                display(false);
                $('.textarea#answer').html('');
                $('.textarea#answer').removeClass('correct');
            }, 700);
    } else {
        // pseudocode
        // * split simplifiedEO & simplfiedString on whitespace (to get each word)
        // * for each word in simplifiedString that doesn't exist in simplifiedEO, bold them.
        //      * html += word or html += <b>word</b>
        //      * but it's .val().. check
     
        // Change to correct answer
        $('.textarea#answer').addClass('incorrect');

        var correctFormatted = formatCorrect(currentCorrectOriginal, sanitisedInput);

        $('.textarea#answer').html(correctFormatted);

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

// Listeners:
$('.top-panel').on('click', function() {
    showMenu();
});
$('button#menu-back-btn').on('click', function() {
    hideMenu();
});
$('#menu-save-btn').on('click', function() {
    saveMenu();
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
    var lessonWanted = $(this).attr('language');
    $('.lesson-children').each(function() {
        $(this).removeClass('active');
    });
    $('div[language=' + lessonWanted + ']').addClass('active');
});
$('button#checking').on('click', function() {
    if (!$('.textarea#answer').hasClass('incorrect') && !$('.textarea#answer').hasClass('correct')) {
        logic(language);
    }
});
$('.textarea#answer').keydown(function (e) {
    if (e.keyCode == 13)  {
        e.preventDefault();
        if (!$('.textarea#answer').hasClass('incorrect') && !$('.textarea#answer').hasClass('correct')) {
            logic(language);
        }
    }
});
$('button#skip').on('click', function() {
    // clear input field & makes it normal again
    $('.textarea#answer').html('');
    $('.textarea#answer').removeClass('correct');
    $('.textarea#answer').removeClass('incorrect');

    // then display next text
    display();
});
$('.textarea#answer').keydown(function (e) {
    if (e.keyCode == 192)  {
        e.preventDefault();
        $('.textarea#answer').html('');
        $('.textarea#answer').removeClass('correct');
        $('.textarea#answer').removeClass('incorrect');
        display();
    }
});

// Main:
// 1. Init

// // 2. Parse & display text of selected file(s)
// // a) Establish selected files/lessons
// var selectedLessons = defineSelectedLessons();

// // a) Parse
// parse(selectedLessons);

// // b) Display
// setTimeout(function () {
//     display();
// }, 1000);
saveMenu();
