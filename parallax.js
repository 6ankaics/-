(function () {
    var themeButtons = Array.prototype.slice.call(document.querySelectorAll('[data-theme-choice]'));
    var savedTheme = window.localStorage.getItem('site-theme');
    var initialTheme = savedTheme === 'dark' ? 'dark' : 'light';

    function setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        themeButtons.forEach(function (button) {
            button.setAttribute('aria-pressed', String(button.getAttribute('data-theme-choice') === theme));
        });
        window.localStorage.setItem('site-theme', theme);
    }

    setTheme(initialTheme);

    themeButtons.forEach(function (button) {
        button.addEventListener('click', function () {
            setTheme(button.getAttribute('data-theme-choice'));
        });
    });

    var searchInput = document.getElementById('searchInput');
    var searchStatus = document.getElementById('searchStatus');

    function normalizeSearchText(text) {
        return text.toLocaleLowerCase('ru').replace(/ё/g, 'е').trim();
    }

    function searchCards() {
        var query = normalizeSearchText(searchInput.value);
        var cards = Array.prototype.slice.call(document.querySelectorAll('main .card'));
        var matches = 0;

        cards.forEach(function (card) {
            var content = card.querySelector('.card-content') || card;
            var matchesQuery = normalizeSearchText(content.textContent).indexOf(query) !== -1;

            card.hidden = !matchesQuery;
            if (matchesQuery) {
                matches += 1;
            }
        });

        searchStatus.hidden = query.length === 0 || matches > 0;
        searchStatus.textContent = matches === 0 ? 'Ничего не найдено' : '';
    }

    if (searchInput && searchStatus) {
        window.searchCards = searchCards;
        searchInput.addEventListener('input', searchCards);
        searchInput.addEventListener('keydown', function (event) {
            if (event.key === 'Enter') {
                searchCards();
            }
        });
    }

    var background = document.getElementById('parallax-background');
    var images = background ? Array.prototype.slice.call(background.querySelectorAll('img')) : [];
    var header = document.querySelector('header');
    var footer = document.querySelector('footer');

    if (!background || !images.length || !header || !footer) {
        return;
    }

    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var frameRequested = false;

    function updateBackgroundBounds() {
        var top = header.offsetTop + header.offsetHeight;
        background.style.top = top + 'px';
        background.style.height = Math.max(0, footer.offsetTop - top) + 'px';

        updateParallax();
    }

    function updateParallax() {
        images.forEach(function (image) {
            var speed = Number(image.getAttribute('data-speed'));
            var offset = reduceMotion ? 0 : window.scrollY * (1 - speed);
            image.style.translate = '0 ' + offset + 'px';
        });

        frameRequested = false;
    }

    function requestUpdate() {
        if (!frameRequested) {
            frameRequested = true;
            window.requestAnimationFrame(updateParallax);
        }
    }

    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', updateBackgroundBounds);
    window.addEventListener('load', updateBackgroundBounds);

    if (window.ResizeObserver) {
        var layoutObserver = new ResizeObserver(updateBackgroundBounds);
        layoutObserver.observe(header);
        layoutObserver.observe(footer);

        var main = document.querySelector('main');
        if (main) {
            layoutObserver.observe(main);
        }
    }

    updateBackgroundBounds();
}());
