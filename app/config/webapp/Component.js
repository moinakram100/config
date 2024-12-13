/**
 * eslint-disable @sap/ui5-jsdocs/no-jsdoc
 */
 
sap.ui.define([
    "sap/ui/core/UIComponent",
    "sap/ui/Device",
    "com/ingenx/config/model/models"
],
function (UIComponent, Device, models) {
    "use strict";

    return UIComponent.extend("com.ingenx.config.Component", {
        metadata: {
            manifest: "json"
        },

        /**
         * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
         * @public
         * @override
         */
        init: function () {
            let oDataModel = this.getModel();
            // call the base component's init function
            UIComponent.prototype.init.apply(this, arguments);

            // enable routing
            this.getRouter().initialize();

            // set the device model
            this.setModel(models.createDeviceModel(), "device");

            // set exchange type data model
            this.setModel(models.createExchangeTypeModel(oDataModel), "exchangetypes")

            // EZ REPORT MODEL
            this.setModel(models.createEzReportNavModel(),"oSharedModel");
        }
    });
}
);