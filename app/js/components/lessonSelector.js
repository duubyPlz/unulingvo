import '../jquery-global';
import 'jquery-ui';

TODO think of dependencies of this module
https://stackoverflow.com/questions/51737267/dependency-injection-with-es6-modules

// XXX @kuc can't get semantic ui <select>.dropdown('set selected', random) to work
const fileSizes = {
    'eo': 30,
    'ko': 19,
    'ja': 2,
    'cn': 10,
    'gr': 11,
    'flu': 2
};

function init() {
    console.debug("Initialising lessonSelector...");
    initDropdowns();
    hideUnwantedDropdowns();
}

function initDropdowns() {
    console.debug("LessonSelector: initialising dropdowns");
    $('.ui.dropdown').dropdown();
}

function hideUnwantedDropdowns() {
    console.debug("LessonSelector: hiding unwanted dropdowns");
    // hide unwanted dropdowns
    $('select#contents-ko').parent().hide();
    $('select#contents-ja').parent().hide();
    $('select#contents-cn').parent().hide();
    $('select#contents-gr').parent().hide();
}

export {
    init,
}
