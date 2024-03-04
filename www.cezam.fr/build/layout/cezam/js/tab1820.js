/**
 * @author: Yoann Le Crom <yoann.lecrom@abstractive.fr>
 * date:    2019-06-27 17:52:23
 */

$(document).ready(function() {
    $('.Tabs-content.open').each(function() {
        $(this).parent().height($(this).outerHeight());
    });

    function openTab(tabsElement, target) {
        var tabsNavElement = tabsElement.find('.Tabs-nav');
        var tabsContentsElement = tabsElement.find('.Tabs-contents');
        var targetElement = $('#' + target);

        tabsContentsElement.find('.Tabs-content').removeClass('open');
        tabsNavElement.find('.Tabs-nav-item').removeClass('open');

        targetElement.toggleClass('open');
        $('.Tabs-nav-item[data-target="' + target + '"]').toggleClass('open');
        tabsContentsElement.height(targetElement.outerHeight());
    }

    $('.Tabs-nav-item[data-target]').click(function(event) {
        event.preventDefault();
        var tabsElement = $(this).closest('.Tabs');
        openTab(tabsElement, $(this).data('target'));
    });

    // Reapply anchor scroll on load (fix FF bug)
    function reapplyAnchorHash() {
        if(null != document.location.hash && '' != document.location.hash) {
            var anchorElement = $(document.location.hash);
            if (undefined != anchorElement[0]) {
                $('html').scrollTop(Math.round(anchorElement.offset().top));
            }
        }
    }

    function handleUrlHash() {
        $('.Tabs-nav-item[data-target][data-url-hash]').each(function() {
            var anchorName = $(this).data('url-hash');
            if (document.location.hash == '#' + anchorName) {
                var tabsElement = $(this).closest('.Tabs');
                openTab(tabsElement, $(this).data('target'));
            }
        });
        reapplyAnchorHash();
    }

    handleUrlHash();
    $(window).on('hashchange', function() {
        handleUrlHash();
    });

    setInterval(function() {
        $('.Tabs-contents').each(function() {
            $(this).height($(this).find('.Tabs-content.open').outerHeight());
        });
    }, 1000);

    // reapplyAnchorHash();
    $(window).on('load', function() {
        reapplyAnchorHash();
    });
});
