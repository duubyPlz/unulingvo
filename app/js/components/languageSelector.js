import '../jquery-global';
import 'jquery-ui';

function init() {
    console.debug("Initialising languageSelector...");
    initTooltips();
    initDropdowns();
    hideUnwantedDropdowns();
}

function initTooltips() {
    console.debug("LanguageSelector: initialising tooltips");
    $(function () {
        $('[data-toggle="tooltip"]').tooltip();
    });
}

function initDropdowns() {
    console.debug("LanguageSelector: initialising dropdowns");
    $('.ui.dropdown').dropdown();
}

function hideUnwantedDropdowns() {
    console.debug("LanguageSelector: hiding unwanted dropdowns");
    // hide unwanted dropdowns
    $('select#contents-ko').parent().hide();
    $('select#contents-ja').parent().hide();
    $('select#contents-cn').parent().hide();
    $('select#contents-gr').parent().hide();
}

export {
    init,
}
