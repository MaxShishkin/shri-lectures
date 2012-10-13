define(["jquery", "underscore"], function ($, _) {

  var homePath = "",

    activeSection = {},

    links = {},

    // TODO: Add arguments checking
    init = function (home, $nav) {
      homePath = home;

      $nav.find("a").each(function (i, el) {
        var $el = $(el);
        links[$el.attr("href")] = $el;
      });

      addListeners();
      onHashChange();
    },

    addListeners = function () {
      $(window).on("hashchange", onHashChange);
    },

    onHashChange = function () {
      switchSection(window.location.hash);
    },

    // TODO: ? Change url when switching to a new section manually
    switchSection = function (path) {
      if (!path || path === "#") {
        path = homePath;
      }

      var $section = $(path);

      if (!$section.length) {
        return;
      }

      if (!_.isEmpty(activeSection)) {
        activeSection.$section.removeClass("section-active");
        links[activeSection.path].parent().removeClass("active");
      }

      $section.addClass("section-active");
      if(links[path]) {
        links[path].parent().addClass("active");
      }

      activeSection.$section = $section;
      activeSection.path = path;
    };

    return {
      init: init,
      switchSection: switchSection
    }
});