import '../jquery-global';
import 'jquery-ui';

function init() {
    console.debug("Initialising languageSelector...");
    toggleTooltips();
    hideUnwantedDropdowns();
}

// toggle all tooltips
function toggleTooltips() {
    console.debug("LanguageSelector: toggling tooltips");
    $(function () {
        $('[data-toggle="tooltip"]').tooltip();
    });
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