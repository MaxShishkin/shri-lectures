define(["jquery", "underscore", "app/utils/objectUtil"], function ($, _, objectUtil) {

  var sectionNavigation = {

    home: "",

    links: {},

    sections: {},

    activeId: null,

    initialized: false,

    init: _.once(function (home, $nav) {
      var that = this;

      this.home = home;

      $nav.find("a").each(function (i, link) {
        var $link = $(link),
          id = $link.attr("href");

        that.links[id] = $link;
        that.sections[id] = $(id);
      });

      this.addListeners();

      this.initialized = true;

      this.switchSection();
    }),

    addListeners: function () {
      var that = this;

      $(window).on("hashchange", function () {
        that.switchSection();
      });
    },

    switchSection: function (id) {
      if (!this.initialized) {
        return false;
      }

      id = id || window.location.hash || this.home;

      if (!this.sections[id]) {
        return false;
      }

      if (this.activeId) {
        this.sections[this.activeId].removeClass("section-active");
        this.links[this.activeId].parent().removeClass("active");
      }

      this.sections[id].addClass("section-active");
      this.links[id].parent().addClass("active");

      this.activeId = id;

      return true;
    }
  };

  sectionNavigation.expose = objectUtil.expose;

  return {
    init: sectionNavigation.expose("init"),
    switchSection: sectionNavigation.expose("switchSection")
  }
});