import '../jquery-global';
import 'jquery-ui';

function init() {
    toggleTooltips();
}

// toggle all tooltips
function toggleTooltips() {
    console.trace("LanguageSelector: toggling tooltips");
    $(function () {
        $('[data-toggle="tooltip"]').tooltip();
    });
}

export {
    init,
}