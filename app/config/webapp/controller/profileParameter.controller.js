sap.ui.define(
    [
      "sap/ui/core/mvc/Controller",
      "sap/ui/model/json/JSONModel",
      "sap/ui/core/Fragment",
      "sap/ui/model/Filter",
      "sap/ui/model/FilterOperator",
      "sap/ui/model/FilterType",
      "sap/m/MessageBox",
      "sap/ui/core/ID",
    ],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (
      Controller,
      JSONModel,
      Fragment,
      Filter,
      FilterOperator,
      FilterType,
      MessageBox,
      ID
    ) {
      "use strict";
      var parameterData;
      var proParameterData;
      var parameterModelData;
      var proParameterModelData;
      let allProParameters;
      let parameters;
      let allocParameters = [];
  
      return Controller.extend("com.ingenx.config.controller.profileParameter", {
        onInit: function () {
          this.getOwnerComponent()
            .getRouter()
            .getRoute("RouteprofileParameter")
            .attachPatternMatched(this.handleRouteMatched, this);
  
          let allocDataModel = this.getOwnerComponent().getModel();
          let allocBindList = allocDataModel.bindList("/serviceParametersItems");
  
          allocBindList.requestContexts(0, Infinity).then(function (parameters) {
            parameters.forEach(function (allocParam) {
              let paramObj = allocParam.getObject();
              if (paramObj.Level !== null && !isNaN(paramObj.Level)) {
                allocParameters.push(paramObj);
              }
            });
          });
        },
        handleRouteMatched: function (oEvent) {
          const profile = {
            ProfileId: oEvent.getParameter("arguments").ID,
            ProfileName: oEvent.getParameter("arguments").serviceProfileName,
            ProfileDesc: oEvent.getParameter("arguments").serviceProfileDesc,
          };
          const profileModel = new JSONModel(profile);
          this.getView().setModel(profileModel, "profileModel");
          var oFilter = new Filter(
            "serviceProfileName",
            FilterOperator.EQ,
            oEvent.getParameter("arguments").serviceProfileName
          );
          this.getView()
            .byId("profileParameterTable")
            .getBinding("items")
            .filter(oFilter, FilterType.Application);
          this.onRefreshParameter();
        },
  
        onRefreshParameter: function () {
          var that = this;
  
          Promise.all([this.addParameter(), this.parameterDataState()]).then(
            function () {
              var extraObjects = parameterModelData.filter(function (
                paramObject
              ) {
                var profileName = that
                  .getView()
                  .getModel("profileModel")
                  .getProperty("/ProfileName");
                return !proParameterModelData.some(function (proParamObject) {
                  return (
                    proParamObject.serviceParameter ===
                      paramObject.serviceParameter &&
                    proParamObject.serviceProfileName === profileName
                  );
                });
              });
  
              extraObjects.forEach(function (extraObject) {
                if (extraObject) {
                  var oEntrySet = {
                    checkedParameter: false,
                    serviceProfileName: that
                      .getView()
                      .getModel("profileModel")
                      .getProperty("/ProfileName"),
                    serviceProfileDesc: that
                      .getView()
                      .getModel("profileModel")
                      .getProperty("/ProfileDesc"),
                    ProfileId: that
                      .getView()
                      .getModel("profileModel")
                      .getProperty("/ProfileId"),
                    ID: extraObject.ID,
                    serviceParameter: extraObject.serviceParameter,
                    serviceParameterDesc: extraObject.serviceParameterDesc,
                    serviceParameterType: extraObject.serviceParameterType,
                    serviceParameterlength: extraObject.serviceParameterlength,
                    ParentId: "",
                    ContractRelevant: false,
                    Value_Parameter: false,
                    Threshold_Relevance: false,
                    Referrence_Relevant: false,
                    Nomination_Relevant: false,
                    Balancing_Relevant: false,
                    Allocation_Relevant: false,
                    Billing_Relevant: false,
                    Price_Relevant: false,
                  };
  
                  var oModel = that.getView().getModel();
                  var oBindListNewEntitySet = oModel.bindList(
                    "/serviceProfileParametersItems"
                  );
                  oBindListNewEntitySet.create(oEntrySet);
                }
              });
  
              that.RefreshData();
            }
          );
        },
  
        addParameter: function () {
          var that = this;
          return new Promise(function (resolve, reject) {
            proParameterData = new sap.ui.model.json.JSONModel();
            var proParameterDataModel = new JSONModel();
            that
              .getView()
              .setModel(proParameterDataModel, "proParameterDataModel");
            let oModel = that.getOwnerComponent().getModel();
            let oBindList = oModel.bindList("/serviceProfileParametersItems");
            oBindList.requestContexts(0, Infinity).then(function (aContexts) {
              allProParameters = [];
              aContexts.forEach(function (oContext) {
                allProParameters.push(oContext.getObject());
              });
              proParameterDataModel.setData(allProParameters);
              that
                .getView()
                .setModel(proParameterDataModel, "proParameterDataModel");
  
              proParameterModelData = that
                .getView()
                .getModel("proParameterDataModel")
                .getData();
  
              resolve();
            });
          });
        },
  
        parameterDataState: function () {
          var that = this;
          return new Promise(function (resolve, reject) {
            parameterData = new sap.ui.model.json.JSONModel();
            var parameterDataModel = new JSONModel();
            that.getView().setModel(parameterDataModel, "parameterDataModel");
            let oModel = that.getOwnerComponent().getModel();
            let oBindList = oModel.bindList("/serviceParametersItems");
            oBindList.requestContexts(0, Infinity).then(function (aContexts) {
              parameters = [];
              aContexts.forEach(function (oContext) {
                parameters.push(oContext.getObject());
              });
              parameterDataModel.setData(parameters);
              that.getView().setModel(parameterDataModel, "parameterDataModel");
  
              parameterModelData = that
                .getView()
                .getModel("parameterDataModel")
                .getData();
  
              resolve();
            });
          });
        },
  
        // REFRESH
  
        RefreshData: function () {
          this.getView()
            .byId("profileParameterTable")
            .getBinding("items")
            .refresh();
        },
  
        // Checking Allocation Level
  
        onSelectAllocRel: function (oEvent) {
          let selectedParameterObj = oEvent
            .getSource()
            .getBindingContext()
            .getObject();
          let selectedParameter = selectedParameterObj.serviceParameter;
  
          if (!selectedParameterObj.selected) {
            let isParameterInAlloc = allocParameters.some(
              (param) => param.serviceParameter === selectedParameter
            );
  
            if (isParameterInAlloc) {
              selectedParameterObj.selected = true;
            } else {
              oEvent.getSource().setSelected(false);
              sap.m.MessageToast.show("No level is defined for this parameter.");
            }
          }
        },
      });
    }
  );
  