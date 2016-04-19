// 1. Parse & display text of selected module
var selectedModule = $('select#contents').val();
if (!$.isNumeric(selectedModule)) {
    $.error("Selected module isn't a valid one: " + selectedModule);
}
// a) Parse
parse(selectedModule);

// b) Display
setTimeout(function () {
    console.log("now: " + Object.keys(hash).length);
    display();
}, 1000);


// 2. If module is changed, reparse & display
$('select#contents').change(function() {
    selectedModule = $('select#contents').val();
    console.log("change " + selectedModule);
    if (!$.isNumeric(selectedModule)) {
        $.error("Selected module isn't a valid one: " + selectedModule);
    }
    parse(selectedModule);
    setTimeout(function () {
        console.log("now: " + Object.keys(hash).length);
        display();
    }, 1000);
});

// 3. Check results, see if input field is correct



// Subroutines
function parse(module) {
    hash = new Object();
    var fileName = 'assets/txt/duo' + module + '.txt';
    try {
        $.get(fileName, function(data) {
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
    console.log(length);
    var index = Math.floor((Math.random() * (length - 1)) + 0);
    console.log("random: " + index);

    var keys = Object.keys(hash);
    var wantedEng = keys[index];
    var wantedEsp = hash[wantedEng];
    console.log(wantedEng + ' ' + wantedEsp);
    $('.display-text').html(wantedEng);
}
