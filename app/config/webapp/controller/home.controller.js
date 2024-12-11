sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    'sap/ui/core/Fragment',
    "sap/ui/core/IconPool"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller,JSONModel,Fragment,IconPool) {
        "use strict";

        return Controller.extend("com.ingenx.config.controller.home", {
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
            onCreateParameter: function(){
                const createP = this.getOwnerComponent().getRouter();
                createP.navTo("RoutecreateParameter");
            },
            onCreateProfile: function(){
                const createP = this.getOwnerComponent().getRouter();
                createP.navTo("RoutecreateProfile");
            },
            onPathFuel: function(){
                const pathFuel = this.getOwnerComponent().getRouter();
                pathFuel.navTo("RoutepathFuel");
            },
            onProMap: function() {
                const proMap = this.getOwnerComponent().getRouter();
                proMap.navTo("RouteprofileMapping");
            },
            onAllocationRule: function(){
                const allocationRule = this.getOwnerComponent().getRouter();
                allocationRule.navTo("RouteallocationRule");
            },
            onAllocationMapping: function(){
                const allocationmap = this.getOwnerComponent().getRouter();
                allocationmap.navTo("RouteallocationMap");
            },
            onCGCCOnfig: function(){
                const allocationmap = this.getOwnerComponent().getRouter();
                allocationmap.navTo("RoutecgcConfig");
            },
            onEZReport: function(){
                const allocationmap = this.getOwnerComponent().getRouter();
                allocationmap.navTo("Routeezreport");
            },
            onGasTrans: function(){
                const transportConfig = this.getOwnerComponent().getRouter();
                transportConfig.navTo("RoutetransportConfig");
            }
        });
    });
