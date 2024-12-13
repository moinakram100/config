sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/ui/model/json/JSONModel",
  "sap/ui/model/odata/v4/ODataModel",
  "sap/ui/model/Filter",
  "sap/ui/model/FilterOperator",
  "sap/m/MessageBox",
],
  /**
   * @param {typeof sap.ui.core.mvc.Controller} Controller
   */
  function (Controller, JSONModel, ODataModel, Filter, FilterOperator, MessageBox) {
    "use strict";

    
    let profileName;

    return Controller.extend("com.ingenx.config.controller.ezReportMapping", {

      onInit: function () {

      },
      // Open dialog to add new penality mapping
      onAddNewPenalityMap: function () {

        let oView = this.getView();
        const addPenaltydata = {
          profileName: "",
          paneltyParmeter: "",
          ezReportId: "",
        };
        const addPenaltyModel = new JSONModel(addPenaltydata);
        oView.setModel(addPenaltyModel, "addPenaltyModel");
        if (!this._oDialogpen) {
          this._oDialogpen = sap.ui.xmlfragment("com.ingenx.config.fragments.addPenalityMapping", this);
          console.log("Fragment created:", this._oDialogpen);
          oView.addDependent(this._oDialogpen);
        }
        this._oDialogpen.open();
      },
      // close the add penality dialog
      oncancelPenaltyMapping: function () {
        this._oDialogpen.close();
      },
      // open value help to choose service profile
      onServiceProfile: function () {
        let oView = this.getView();
        if (!this._oDialogServ) {
          this._oDialogServ = sap.ui.xmlfragment(
            oView.getId(),
            "com.ingenx.config.fragments.penalityserviceProfile",
            this
          );
          oView.addDependent(this._oDialogServ);
        }
        this._oDialogServ.open();
      },
      onServiceProfileValueHelpClose: function (oEvent) {
        let oSelectedItem = oEvent.getParameter("selectedItem");
        console.log("oSelectedItem", oSelectedItem);
        oEvent.getSource().getBinding("items").filter([]);

        if (!oSelectedItem) {
          return;
        }
        profileName = oSelectedItem.getTitle();
        console.log("profileName", profileName);
        this.getView().getModel("addPenaltyModel").setProperty("/profileName", profileName);

      },

      onServiceProfileValueHelpDialogSearch: function (oEvent) {


        let sValue1 = oEvent.getParameter("value").toUpperCase();

        let oFilter1 = new sap.ui.model.Filter("serviceProfileName", sap.ui.model.FilterOperator.Contains, sValue1);
        let oBinding = oEvent.getSource().getBinding("items");
        let oSelectDialog = oEvent.getSource();

        oBinding.filter([oFilter1]);

        oBinding.attachEventOnce("dataReceived", function () {
          let aItems = oBinding.getCurrentContexts();

          if (aItems.length === 0) {
            oSelectDialog.setNoDataText("No data found");
          } else {
            oSelectDialog.setNoDataText("Loading");
          }
        });
      },


      // Value help to choose Penality Id
      onEzId: function () {
        let oView = this.getView();
        if (!this._oDialogEZ) {
          this._oDialogEZ = sap.ui.xmlfragment(
            oView.getId(),
            "com.ingenx.config.fragments.ezId",
            this
          );
          oView.addDependent(this._oDialogEZ);
        }
        this._oDialogEZ.open();
      },
      // setting up data after PenalityIdvaluehelp close
      onValueHelpCloseEz: function (oEvent) {
        let Ez,
          oSelectedItem = oEvent.getParameter("selectedItem");
        console.log("oSelectedItem", oSelectedItem);
        oEvent.getSource().getBinding("items").filter([]);

        if (!oSelectedItem) {
          return;
        }
        Ez = oSelectedItem.getTitle();
        this.getView().getModel("addPenaltyModel").setProperty("/ezReportId", Ez);

      },
      onValueHelpSearchEz: function (oEvent) {


        let sValue1 = oEvent.getParameter("value").toUpperCase();

        let oFilter1 = new sap.ui.model.Filter("EzID", sap.ui.model.FilterOperator.Contains, sValue1);
        let oBinding = oEvent.getSource().getBinding("items");
        let oSelectDialog = oEvent.getSource();

        oBinding.filter([oFilter1]);

        oBinding.attachEventOnce("dataReceived", function () {
          let aItems = oBinding.getCurrentContexts();

          if (aItems.length === 0) {
            oSelectDialog.setNoDataText("No data found");
          } else {
            oSelectDialog.setNoDataText("Loading");
          }
        });
      },

      onServiceParam: function () {
        let oView = this.getView();

   
        if (!this._oDialogpenalty) {
          this._oDialogpenalty = sap.ui.xmlfragment(
            oView.getId(),
            "com.ingenx.config.fragments.penalityParameters",
            this
          );
          oView.addDependent(this._oDialogpenalty);
        }
        this.getPenalityParaData(profileName)
        this._oDialogpenalty.open();
      },
    //   getting penality parameter  based on service profile
      getPenalityParaData : async function(serviceProfileName){
        
        let serviceParameterData = [];
        let oModel = this.getOwnerComponent().getModel();
        let oBindList = oModel.bindList(`/getPenalityRelevant?serviceProfileName=${profileName}&Price_Relevant=true`);

        await oBindList.requestContexts().then(function (aContexts) {
              aContexts.forEach(oContext => {
                  console.log(oContext.getObject());
                   serviceParameterData.push(oContext.getObject());
              });
          });
          console.log("data",serviceParameterData);
          let paneltyModel = new sap.ui.model.json.JSONModel(serviceParameterData);
         this.getView().setModel(paneltyModel, "paneltyVal");
          

      },

      onValueHelpSearchPenaltyParam: function (oEvent) {


        let sValue1 = oEvent.getParameter("value").toUpperCase();

        let oFilter1 = new sap.ui.model.Filter("serviceParameter", sap.ui.model.FilterOperator.Contains, sValue1);
        let oBinding = oEvent.getSource().getBinding("items");
        let oSelectDialog = oEvent.getSource();

        oBinding.filter([oFilter1]);

        oBinding.attachEventOnce("dataReceived", function () {
          let aItems = oBinding.getCurrentContexts();

          if (aItems.length === 0) {
            oSelectDialog.setNoDataText("No data found");
          } else {
            oSelectDialog.setNoDataText("Loading");
          }
        });
      },
      

      onValueHelpClosePenalty: function (oEvent) {
        let Penalty,
          oSelectedItem = oEvent.getParameter("selectedItem");
        console.log("oSelectedItem", oSelectedItem);
        oEvent.getSource().getBinding("items").filter([]);

        if (!oSelectedItem) {
          return;
        }
        Penalty = oSelectedItem.getTitle();
        this.getView().getModel("addPenaltyModel").setProperty("/paneltyParmeter", Penalty);

      },



      onsavePenaltyMapping: function () {
        let that = this;
        let PenalitymodelData = this.getView().getModel("addPenaltyModel").getData();
        let payload = {
          profileName: PenalitymodelData.profileName,
          paneltyParmeter: PenalitymodelData.paneltyParmeter,
          ezReportId: PenalitymodelData.ezReportId,
        };

        if (!payload.profileName || !payload.paneltyParmeter || !payload.ezReportId) {
          sap.m.MessageToast.show("Input fields cannot be blank.", { duration: 3000 });
          return;
        }

        let oModel = this.getOwnerComponent().getModel();
        let oBindList = oModel.bindList("/penalties");

        oBindList.attachEventOnce("dataReceived", function () {
          let existingEntries = oBindList.getContexts().map(context => context.getObject());
          let isDuplicate = existingEntries.some(entry =>
            entry.profileName === payload.profileName &&
            entry.paneltyParmeter === payload.paneltyParmeter &&
            entry.ezReportId === payload.ezReportId
          );

          if (isDuplicate) {
            sap.m.MessageToast.show("Mapping already exists.", { duration: 3000 });
            return;
          }

          try {
            oBindList.create(payload);
            sap.m.MessageToast.show("Penalty Mapping created successfully.", {
              duration: 3000
            });

            that.RefreshData();
            that.oncancelPenaltyMapping();
          } catch (error) {
            sap.m.MessageToast.show("Unexpected error occurred while saving.", { duration: 3000 });
            console.error("Error during creation:", error);
          }
        });

        oBindList.getContexts();
      },

      onDeletePenaltyMap: function () {

        let addPenaltyMap = this.byId("createPenaltyID");
        let delPenaltyMap = this.byId("deletePenaltyID");
        let confirmDelPenalty = this.byId("deletePenaltyMapConfirmBtn");
        let cancelDelPenalty = this.byId("cancelPenaltyMapDeleteBtn");
        let delCheckBoxPenalty = this.byId("PenalityMapDeleteMapLabel");

        // TOGGLE VISIBILTY
        addPenaltyMap.setVisible(!addPenaltyMap.getVisible());
        delPenaltyMap.setVisible(!delPenaltyMap.getVisible());
        confirmDelPenalty.setVisible(!confirmDelPenalty.getVisible());
        cancelDelPenalty.setVisible(!cancelDelPenalty.getVisible());
        delCheckBoxPenalty.setVisible(!delCheckBoxPenalty.getVisible());
        let oTable = this.byId("penaltyTable");
        oTable.getItems().forEach(function (oItem) {
          let oCheckBox = oItem.getCells()[0];
          oCheckBox.setSelected(false);
        });
      },
      onConfirmPenaltyMapDeletion: async function () {
        let that = this;
        let oTable = this.byId("penaltyTable");
        let oSelectedItems = [];


        oTable.getItems().forEach(function (oItem) {
          let oCheckBox = oItem.getCells()[0];
          if (oCheckBox.getSelected()) {
            oSelectedItems.push(oItem.getBindingContext().getPath());
          }
        });

        if (oSelectedItems.length === 0) {
          sap.m.MessageToast.show("No Mapping selected for deletion.");
          return;
        }

        sap.m.MessageBox.confirm(
          `Are you sure you want to delete the selected Mapping(s)?`,
          {
            actions: [sap.m.MessageBox.Action.OK, sap.m.MessageBox.Action.CANCEL],
            onClose: async function (sAction) {
              if (sAction === sap.m.MessageBox.Action.OK) {

                sap.ui.core.BusyIndicator.show(0);

                try {
                  let oModel = that.getView().getModel();
                  let oBindList = oModel.bindList("/penalties");
                  let aContexts = await oBindList.requestContexts();

                  for (let sPath of oSelectedItems) {
                    let oContext = aContexts.find(context => context.getPath() === sPath);
                    if (oContext) {
                      await oContext.delete("$auto");
                    }
                  }
                  sap.m.MessageToast.show("Selected Mapping deleted successfully.");


                  await that.RefreshData();
                  that.onCancelPenaltyMapDeletion();
                } catch (oError) {
                  sap.m.MessageToast.show("Error occurred while deleting path(s).");
                  console.error("Deletion Error:", oError);
                } finally {

                  sap.ui.core.BusyIndicator.hide();
                }
              } else if (sAction === sap.m.MessageBox.Action.CANCEL) {

                oTable.getItems().forEach(function (oItem) {
                  let oCheckBox = oItem.getCells()[0];
                  oCheckBox.setSelected(false);
                });
              }
            }
          }
        );
      },
      onCancelPenaltyMapDeletion: function () {
        this.onDeletePenaltyMap();

      },

      RefreshData: function () {
        this.getView().byId("penaltyTable").getBinding("items").refresh();

      },

    });
  });
