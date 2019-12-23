import '../jquery-global';
import 'jquery-ui';

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
