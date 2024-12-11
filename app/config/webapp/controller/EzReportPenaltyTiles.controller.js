sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/IconPool"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller,IconPool) {
        "use strict";
 
        return Controller.extend("com.ingenx.config.controller.EzReportPenaltyTiles", {
            onInit: function () {
                this._loadIcons();
            },
            _loadIcons: function () {
                const aFonts = [
                    {
                        fontFamily: "SAP-icons-TNT",
                        fontURI: sap.ui.require.toUrl("sap/tnt/themes/base/fonts/")
                    },
                    {
                        fontFamily: "BusinessSuiteInAppSymbols",
                        fontURI: sap.ui.require.toUrl("sap/ushell/themes/base/fonts/")
                    }
                ];
           
                aFonts.forEach(oFont => {
                    IconPool.registerFont(oFont);
                });
            },
            onEzReport:function(){
                const EzTable = this.getOwnerComponent().getRouter();
                EzTable.navTo("RouteEzIDView");
            },
 
            onPaneltyEz:function(){
                const Panelty = this.getOwnerComponent().getRouter();
                Panelty.navTo("RouteEzPanelty");
            },
 
            onPenaltyOperations:function(){
                const Operation = this.getOwnerComponent().getRouter();
                Operation.navTo("RoutePenaltyParamOperations");
            }
           
        });
    })