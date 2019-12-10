import '../jquery-global';
import 'jquery-ui';

function init() {
    toggleTooltips();
    hideUnwantedDropdowns();
}

// toggle all tooltips
function toggleTooltips() {
    console.trace("LanguageSelector: toggling tooltips");
    $(function () {
        $('[data-toggle="tooltip"]').tooltip();
    });
}

function hideUnwantedDropdowns() {
    // hide unwanted dropdowns
    $('select#contents-ko').parent().hide();
    $('select#contents-ja').parent().hide();
    $('select#contents-cn').parent().hide();
    $('select#contents-gr').parent().hide();
}

export {
    init,
}