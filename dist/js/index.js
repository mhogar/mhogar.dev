$(document).ready(function () {
    setupMenuLinks();

    // select the first active tab
    clickMenuItem('projects');
});

function setupMenuLinks() {
    setupMenuLink('projects');
    setupMenuLink('games');
    setupMenuLink('animations');
}

function setupMenuLink(name) {
    const item = $(`#${name}-menu-item`);

    // setup click event
    item.click(function() {
        if (item.hasClass('disabled') || item.hasClass('active')) {
            return;
        }
        clickMenuItem(name);
    });

    // calc card count and append to name
    const numCards = $(`a[data-category='${name}'`).length;
    item.html(item.html() + ` (${numCards})`)

    // disable option if no cards
    if (numCards == 0) {
        item.addClass('disabled');
    }
}

function clickMenuItem(name) {
    // set only this option to active
    $("#content-menu").children().removeClass('active');
    $(`#${name}-menu-item`).addClass('active');

    // show only cards with this category
    $("#content-cards").children().hide();
    $(`a[data-category='${name}'`).show();
}
