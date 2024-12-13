sap.ui.define([
    "sap/ui/model/json/JSONModel",
    "sap/ui/Device"
], 
    /**
     * provide app-view type models (as in the first "V" in MVVC)
     * 
     * @param {typeof sap.ui.model.json.JSONModel} JSONModel
     * @param {typeof sap.ui.Device} Device
     * 
     * @returns {Function} createDeviceModel() for providing runtime info for the device the UI5 app is running on
     */
    function (JSONModel, Device) {
        "use strict";

        return {
            createDeviceModel: function () {
                var oModel = new JSONModel(Device);
                oModel.setDefaultBindingMode("OneWay");
                return oModel;
        },
        createExchangeTypeModel: function (oDataModel) {
 
            let aExchangeTypeValueHelpData = [];
            let oExchangeTypeModel  = new JSONModel()
            let oBindList = oDataModel.bindList("/xGMSxEXCHGTYPEVH")
            oBindList.requestContexts().then(aContext => {
                aContext.forEach(element => {                    
                    aExchangeTypeValueHelpData.push(element.getObject())
                });
            })
            oExchangeTypeModel.setData(aExchangeTypeValueHelpData);
            return oExchangeTypeModel
        },

        createEzReportNavModel:function(){
            var oSharedModel = new JSONModel({
                EzID:"",
                Table:"",
            });
            return oSharedModel;
        }
    };
});