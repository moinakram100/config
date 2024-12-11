sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/odata/v4/ODataModel"
  ],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel) {
      "use strict";
      var lastPenaltyMapID;
      var initialDelPenaltyArray = {
        ID: []
      };
      var myData;
      var profileName;
      var validateNewEzMapping;
      let proEzMapping;
   
      return Controller.extend("com.ingenx.config.controller.ezReportMapping", {
        selectedEzReportIds: [],
        onInit: function () {
          var that = this;
          var oData = new sap.ui.model.json.JSONModel();
          that.getView().setModel(oData, "oData");
          let oModel1 = that.getOwnerComponent().getModel();
          let oBindList1 = oModel1.bindList("/serviceProfileParametersItems");
          oBindList1.requestContexts(0,Infinity).then(function (aContexts){
            myData=[];
            aContexts.forEach(function (oContext) {
              myData.push(oContext.getObject());
            });
          });
   
      },
   
        onAdd: function () {
          this.onLastMapID();
          this.usedEzMapping();
          var oView = this.getView();
          const addPenaltydata = {
            profileName: "",
            paneltyParmeter: "",
            ezReportId: "",
          };
          const addPenaltyModel = new JSONModel(addPenaltydata);
          oView.setModel(addPenaltyModel, "addPenaltyModel");
          if (!this._oDialogpen) {
            this._oDialogpen = sap.ui.xmlfragment("com.ingenx.config.fragments.addPenaltyMapping", this);
            console.log("Fragment created:", this._oDialogpen); // Log to check if fragment is created
            oView.addDependent(this._oDialogpen);
          }
          this._oDialogpen.open();
        },
   
        //For service profile
        onServiceProfile: function () {
          var oView = this.getView();
          if (!this._oDialogServ) {
            this._oDialogServ = sap.ui.xmlfragment(
              oView.getId(),
              "com.ingenx.config.fragments.serviceProfile",
              this
            );
            oView.addDependent(this._oDialogServ);
          }
          this._oDialogServ.open();
        },
        onServiceProfileValueHelpClose: function (oEvent) {
          var oSelectedItem = oEvent.getParameter("selectedItem");
          console.log("oSelectedItem", oSelectedItem);
          oEvent.getSource().getBinding("items").filter([]);
   
          if (!oSelectedItem) {
            return;
          }
          profileName = oSelectedItem.getTitle();
          console.log("profileName", profileName);
          this.getView().getModel("addPenaltyModel").setProperty("/profileName", profileName);
          this._oDialogServ.close();
        },
   
        //for Service Parameter
        onServiceParam: function () {
          console.log("hello");
          var oView = this.getView();
          if (!this._oDialogpenalty) {
            this._oDialogpenalty = sap.ui.xmlfragment(
              oView.getId(),
              "com.ingenx.config.fragments.penaltyParameters",
              this
            );
            oView.addDependent(this._oDialogpenalty);
          }
          var penaltyData = myData;
          var filterData = penaltyData.filter(function (obj) {
            return obj.Price_Relevant === true && obj.serviceProfileName === profileName && obj.checkedParameter === true;
          });
          console.log("filterData", filterData);
          var paneltyModel = new sap.ui.model.json.JSONModel(filterData);
          oView.setModel(paneltyModel, "paneltyVal");
          this._oDialogpenalty.open();
        },
   
        onValueHelpClosePenalty: function (oEvent) {
          var Penalty,
            oSelectedItem = oEvent.getParameter("selectedItem");
          console.log("oSelectedItem", oSelectedItem);
          oEvent.getSource().getBinding("items").filter([]);
   
          if (!oSelectedItem) {
            return;
          }
          Penalty = oSelectedItem.getTitle();
          this.getView().getModel("addPenaltyModel").setProperty("/paneltyParmeter", Penalty);
          this._oDialogpenalty.close();
        },
   
        //for EzId
        onEzId: function () {
          var oView = this.getView();
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
        onValueHelpCloseEz: function (oEvent) {
          var Ez,
            oSelectedItem = oEvent.getParameter("selectedItem");
          console.log("oSelectedItem", oSelectedItem);
          oEvent.getSource().getBinding("items").filter([]);
   
          if (!oSelectedItem) {
            return;
          }
          Ez = oSelectedItem.getTitle();
          this.getView().getModel("addPenaltyModel").setProperty("/ezReportId", Ez);
          this._oDialogEZ.close();
        },
   
        onLastMapID: function () {
          try {
            var oTable = this.getView().byId("penaltyTable");
            var oItems = oTable.getItems();
   
            var maxID = 0;
            oItems.forEach(function (oItem) {
              var currentID = parseInt(oItem.getCells()[1].getText(), 10);
              if (!isNaN(currentID) && currentID > maxID) {
                maxID = currentID;
              }
            });
   
            lastPenaltyMapID = maxID.toString();
          } catch (error) {
            lastPenaltyMapID = "0";
          }
          console.log("Max ID:", lastPenaltyMapID);
        },
   
        usedEzMapping: function () {
          var that = this;
   
          return new Promise(function (resolve, reject) {
            //var usedEzMappingData = new sap.ui.model.json.JSONModel();
            var usedEzMappingDataModel = new sap.ui.model.json.JSONModel();
            that.getView().setModel(usedEzMappingDataModel, "usedEzMappingDataModel");
            let oModel3 = that.getOwnerComponent().getModel();
            let oBindList3 = oModel3.bindList("/penalties");
   
            oBindList3.requestContexts(0, Infinity).then(function (aContexts) {
              proEzMapping = [];
              aContexts.forEach(function (oContext) {
                proEzMapping.push(oContext.getObject());
              });
              usedEzMappingDataModel.setData(proEzMapping);
   
              var usedEzMappingModelData = that.getView().getModel("usedEzMappingDataModel").getData();
              console.log(usedEzMappingModelData)
              validateNewEzMapping = usedEzMappingModelData.map(function (obj) {
                return {
                  profileName: obj.profileName,
                  paneltyParmeter: obj.paneltyParmeter,
                  ezReportId: obj.ezReportId
                };
              });
              console.log("Validate New Mapping", validateNewEzMapping);
              resolve(proMapping);
            }.bind(this));
          });
        },
   
        onsavePenaltyMapping: function () {
          var mapEntryData = this.getView().getModel("addPenaltyModel").getData();
          var entryDataPenaltyMap = {
            ID: (parseInt(lastPenaltyMapID, 10) + 1),
            profileName: mapEntryData.profileName,
            paneltyParmeter: mapEntryData.paneltyParmeter,
            ezReportId: mapEntryData.ezReportId,
          };
   
          if (entryDataPenaltyMap.profileName === '' || entryDataPenaltyMap.paneltyParmeter === '' || entryDataPenaltyMap.ezReportId === '') {
            sap.m.MessageToast.show("Input fields cannot be blank.", {
              duration: 3000,
              width: "15em",
              my: "center top",
              at: "center top",
              of: window,
              offset: "30 30",
              onClose: function () {
                console.log("Message toast closed");
              }
            });
            console.log("Input cannot be null");
            return;
          } else {
            var isDuplicateEzMapping = validateNewEzMapping.some(function (entry) {
              return entry.profileName.toLowerCase() === entryDataPenaltyMap.profileName.toLowerCase() && entry.ezReportId.toLowerCase() === entryDataPenaltyMap.ezReportId.toLowerCase() && entry.paneltyParmeter.toLowerCase() === entryDataPenaltyMap.paneltyParmeter.toLowerCase();
            });
   
            if (isDuplicateEzMapping) {
              sap.m.MessageToast.show("Mapping already exists.", {
                duration: 3000,
                width: "15em",
                my: "center top",
                at: "center top",
                of: window,
                offset: "30 30",
                onClose: function () {
                  console.log("Message toast closed");
                }
              });
              console.log("Duplicate data found");
              return;
            } else {
              validateNewEzMapping.push(entryDataPenaltyMap);
              console.log("Entry added successfully");
            }
          }
   
          let oModel = this.getView().getModel();
          let oBindList = oModel.bindList("/penalties");
          oBindList.create(entryDataPenaltyMap);
          this._oDialogpen.close();
          this.RefreshData();
          sap.m.MessageBox.success("Mapping created!");
        },
   
        onDeletePenaltyMap: function () {
   
          var addPenaltyMap = this.byId("createPenaltyID");
          var delPenaltyMap = this.byId("deletePenaltyID");
          var confirmDelPenalty = this.byId("deletePenaltyMapConfirmBtn");
          var cancelDelPenalty = this.byId("cancelPenaltyMapDeleteBtn");
          var delCheckBoxPenalty = this.byId("deleteMapLabel");
   
          // TOGGLE VISIBILTY
          addPenaltyMap.setVisible(!addPenaltyMap.getVisible());
          delPenaltyMap.setVisible(!delPenaltyMap.getVisible());
          confirmDelPenalty.setVisible(!confirmDelPenalty.getVisible());
          cancelDelPenalty.setVisible(!cancelDelPenalty.getVisible());
          delCheckBoxPenalty.setVisible(!delCheckBoxPenalty.getVisible());
        },
   
        onCancelPenaltyMapDeletion: function () {
          this.onDeletePenaltyMap();
          this.onNullSelectedpenaltyMapping();
          this.onpenaltyUnCheckBox();
        },
   
        onSelectPenaltyMap: function (oEvent) {
          var oTable = this.byId("penaltyTable");
          var oItems = oTable.getItems();
          var selectAll = oEvent.getParameter("selected");
   
          if (!selectAll) {
            initialDelPenaltyArray.ID = [];
          } else {
            initialDelPenaltyArray.ID = oItems.map(function (oItem) {
              return oItem.getCells()[1].getText();
            });
          }
   
          for (var i = 0; i < oItems.length; i++) {
            var oItem = oItems[i];
            var oCheckBox = oItem.getCells()[0];
   
            if (oCheckBox instanceof sap.m.CheckBox) {
              oCheckBox.setSelected(selectAll);
            }
          }
        },
   
        onPenaltyUnCheckBox: function () {
          var selectedItems = initialDelPenaltyArray.ID;
          var oTable = this.byId("penaltyTable");
          var oItems = oTable.getItems();
   
          oItems.forEach(function (oItem) {
            oItem.getCells()[0].setSelected(false);
          });
   
          this.getView().byId("selectAllPenaltyMap").setSelected(false);
          this.onNullSelectedpenaltyMapping();
        },
   
        onDeletePenaltyMapArray: function (oEvent) {
          var selectedPaths = oEvent.getSource().getParent().getAggregation("cells");
   
          for (var i = 0; i < selectedPaths.length; i++) {
            if (i === 0) {
              let checkbox = selectedPaths[i];
              let paths = selectedPaths[i + 1].getProperty("text");
   
              if (checkbox.getSelected()) {
                if (initialDelPenaltyArray.ID.indexOf(paths) === -1) {
                  initialDelPenaltyArray.ID.push(paths);
                }
              } else {
                var index = initialDelPenaltyArray.ID.indexOf(paths);
                if (index !== -1) {
                  initialDelPenaltyArray.ID.splice(index, 1);
                }
              }
            }
          }
   
          console.log("Initial Path Delete Array:", initialDelPenaltyArray.ID);
          this.RefreshData();
        },
   
        onNullSelectedpenaltyMapping: function () {
          initialDelPenaltyArray = {
            ID: []
          };
        },
   
        onConfirmPenaltyMapDeletion: function () {
          var unfilteredItems = initialDelPenaltyArray.ID;
          var selectedItems = Array.from(new Set(unfilteredItems));
          console.log("Selected Items:", selectedItems);
   
          if (selectedItems.length > 0) {
            sap.m.MessageBox.confirm("Are you sure you want to delete the selected mapping?", {
              title: "Confirmation",
              onClose: function (oAction) {
                if (oAction === sap.m.MessageBox.Action.OK) {
                  var oTable = this.byId("penaltyTable");
                  var oItems = oTable.getItems();
   
                  selectedItems.forEach(function (itemId) {
                    oItems.forEach(function (oItem) {
                      var sRowId = oItem.getCells()[1].getText();
   
                      if (sRowId === itemId) {
                        oItem.getBindingContext().delete().catch(function (oError) {
                          if (!oError.canceled) {
                            MessageBox.error("Error :", oError);
                          }
                          this.RefreshData();
                        });
                      }
                    });
                  });
                } else if (oAction === sap.m.MessageBox.Action.CANCEL) {
                  this.onNullSelectedpenaltyMapping();
                  this.onpenaltyUnCheckBox();
                }
              }.bind(this)
            });
          } else {
            sap.m.MessageBox.information("Please select at least one mapping for deletion.");
          }
          this.onDeletePenaltyMap();
          this.onNullSelectedpenaltyMapping();
          this.onpenaltyUnCheckBox();
        },
   
        oncancelPenaltyMapping: function () {
          this._oDialogpen.close();
        },
   
        RefreshData: function () {
          this.getView().byId("penaltyTable").getBinding("items").refresh();
          // var oFilter = new Filter("ProfileId", FilterOperator.EQ, this.getView().getModel("profileModel").getProperty("/ProfileId"));
          // this.getView().byId("table1").getBinding("items").filter(oFilter, FilterType.Application);
        }
      });
    });
   