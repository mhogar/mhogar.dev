const linkNames = ['projects', 'games', 'animations'];

$(document).ready(function () {
    // setup the menu links
    linkNames.forEach(linkName => {
        setupMenuLink(linkName);
    });

    // get tab name from search params
    let selectedTab = new URL(window.location.href).searchParams.get('tab')
    if (!linkNames.includes(selectedTab)) {
        selectedTab = linkNames[0];
    }

    // select the first active tab
    clickMenuItem(selectedTab);
});

function setupMenuLink(name) {
    const item = $(`#${name}-menu-item`);

    // setup click event
    item.click(function() {
        if (item.hasClass('disabled') || item.hasClass('active')) {
            return;
        }
        clickMenuItem(name);

        // construct new url
        const url = new URL(window.location.href);
        url.searchParams.set('tab', name);
        
        // change the url, but don't reload
        window.history.replaceState(null, "", url.href);
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
    $("#content-cards").children().addClass('hidden');
    $(`a[data-category='${name}'`).removeClass('hidden');
}
