
$(function() {
    // Кнопки в хедере
    function searchToggle() {
        var $headerSearchContainer = $('#masthead-search-inner');
        $headerSearchContainer.toggleClass('unseen');
    }

    function menuToggle() {
        var $headerMenu = $('#masthead-menu');
        $headerMenu.toggleClass('unseen');
    }

    $('#masthead-search-btn').click(function() {
        var $headerMenu = $('#masthead-menu');
        var $headerSearchContainer = $('#masthead-search-inner');

        $(this).toggleClass('active');
        $('#masthead-search-btn').removeClass('active');
        searchToggle();

        if (!$headerSearchContainer.hasClass('unseen')) {
            $('#search-input').focus();
        }
        if (!$headerMenu.hasClass('unseen')) {
            menuToggle();
        }
    });

    $('#masthead-burger').click(function() {
        var $headerSearchContainer = $('#masthead-search-inner');

        $(this).toggleClass('active');
        $('#masthead-burger').removeClass('active');
        menuToggle();

        if (!$headerSearchContainer.hasClass('unseen')) {
            searchToggle();
        }
    });

    // Функции работы с модальными окнами футера
    let modalBackground = document.getElementById('modal-backyard'),
        clientHeight = document.documentElement.clientHeight + 'px',
        clientWidth = document.documentElement.clientWidth + 'px',
        $modalBackground = $('#modal-backyard'),
        $modalWindows = $('.modal-case');

    modalBackground.style.height = clientHeight;
    modalBackground.style.width = clientWidth;

    $('.modal-case__close').click(function(){
        $modalBackground.hide();
        $modalWindows.hide();
    });

    $('.footbar-row__about').click(function(){
        $modalBackground.show();
        $('#about').show();
    });

    $('.footbar-row__contacts').click(function(){
        $modalBackground.show();
        $('#contacts').show();
    });

    // ---------------------------------------- 07122025
    $('.masthead-about-modal').click(function(){
        $modalBackground.show();
        $('#about-masthead').show();
        $('body').addClass('modal-overflow')
    });

    $('.masthead-pol-modal').click(function(){
        $modalBackground.show();
        $('#pol-masthead').show();
        $('body').addClass('modal-overflow')
    });

    $('.modal-case__close').click(function(){
        $('body').removeClass('modal-overflow')
    });
    // ----------------------------------------
    // Popup с тизерами
    let $body = $('body'),
        $popup = $('.tiles-popup');

    $(window).mouseout(function (e) {
        if (e.pageY - $(window).scrollTop() < 1 && $popup.attr('tiles-popup-show') == 0) {
            $popup.attr('tiles-popup-show', 1)
            $body.addClass('lock');
        }
    });

    $(".tiles-popup__cross").click(function (event) {
        $popup.hide()
        $body.removeClass('lock');
    });

    $(".tiles-popup__window").click(function (event) {
        if ($(event.target).closest(".tiles-popup__container").length) return;
        $popup.hide()
        $body.removeClass('lock');
        event.stopPropagation();
    });

    // Эффект затенения вокруг фокусного блока
    var $win = $(window);
    var $focusedEffect = $('#focused-effect');
    var $articleContent = $('#article-card__content');

    $win.on('scroll', function() {
        if ($win.width() >= 1000) {
            return;
        }
        var overlayAppearsAt = 250;
        var overlayDisappearsAt = 70;
        if ($focusedEffect.length) {
            var distance = $focusedEffect.offset().top - $(this).scrollTop();
            if (distance <= overlayDisappearsAt || distance > overlayAppearsAt) {
                $focusedEffect.removeClass('focus-on');
                $articleContent.removeClass('with-focused-block');
            } else if (distance <= overlayAppearsAt && distance > overlayDisappearsAt)  {
                $focusedEffect.addClass('focus-on');
                $articleContent.addClass('with-focused-block');
            }
        }
    });

    // Article gallery
    $(function() {
        $('.custom-slider').each(function() {
            const $container = $(this);
            const $track = $container.find('.slider-track');
            const $slides = $container.find('.slider-slide');
            const $dots = $container.find('.slider-dots');
            const $counter = $container.find('.slider-counter');
            const total = $slides.length;
            let index = 0;

            // 1. Динамическая генерация точек
            $slides.each(function(i) {
                $dots.append(`<button class="slider-dot ${i === 0 ? 'is-active' : ''}"></button>`);
            });

            // 2. Основная функция обновления
            function updateSlider() {
                // Двигаем трек
                $track.css('transform', `translateX(-${index * 100}%)`);

                // Обновляем точки и счетчик
                $container.find('.slider-dot').removeClass('is-active').eq(index).addClass('is-active');
                $counter.text(`${index + 1} / ${total}`);

                // Управление видимостью стрелок
                $container.find('.is-prev').toggle(index > 0);
                $container.find('.is-next').toggle(index < total - 1);

                // Lazy Load текущего изображения
                const $currentImg = $slides.eq(index).find('img');
                if ($currentImg.attr('data-src')) {
                    const realSrc = $currentImg.attr('data-src');
                    $currentImg.attr('src', realSrc).removeAttr('data-src');
                    $currentImg.on('load', function() {
                        $(this).css('opacity', '1');
                    });
                    // Если картинка уже в кэше
                    if ($currentImg[0].complete) $currentImg.css('opacity', '1');
                }
            }

            // 3. Обработка кликов
            $container.on('click', '.is-prev', () => { if (index > 0) { index--; updateSlider(); } });
            $container.on('click', '.is-next', () => { if (index < total - 1) { index++; updateSlider(); } });
            $container.on('click', '.slider-dot', function() {
                index = $(this).index();
                updateSlider();
            });

            // 4. Свайпы для мобильных устройств
            let xDown = null;
            $container.on('touchstart', (e) => { xDown = e.originalEvent.touches[0].clientX; });
            $container.on('touchmove', (e) => {
                if (!xDown) return;
                let xUp = e.originalEvent.touches[0].clientX;
                let xDiff = xDown - xUp;

                if (Math.abs(xDiff) > 50) { // Порог свайпа 50px
                    if (xDiff > 0 && index < total - 1) index++;
                    else if (xDiff < 0 && index > 0) index--;

                    updateSlider();
                    xDown = null;
                }
            });

            // --- ФИНАЛЬНЫЙ ШАГ: Активация ---
            // Удаляем класс загрузки: кнопки и счетчик плавно появляются на своих местах
            $container.removeClass('slider-is-loading');
            // Синхронизируем состояние
            updateSlider();
        });
    });
});

