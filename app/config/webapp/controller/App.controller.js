sap.ui.define(
  ["sap/ui/core/mvc/Controller", "sap/ui/core/routing/History"],
  function (BaseController, History) {
    "use strict";

    return BaseController.extend("com.ingenx.config.controller.App", {
      onInit: function () {},
      onPressBack: function () {
        window.history.back();
      },
    });
  }
);
