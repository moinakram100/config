sap.ui.define(
    [
      "sap/ui/core/mvc/Controller",
      "sap/ui/model/odata/v4/ODataModel",
      "sap/m/ColumnListItem",
    ],
    function (Controller, ODataModel, ColumnListItem) {
      "use strict";
      var lastAllocMapID;
      var initialDelAllocMapArray = {
        ID: [],
      };
      var uniqueLocIds;
      var validateNewAllocMap;
      let allocMapping;
  
      return Controller.extend("com.ingenx.config.controller.allocationMapping", {
        onInit: function () {
          var oData = new sap.ui.model.json.JSONModel("");
  
          this.getView().setModel(oData, "allocMapDataModel");
          let oModel = this.getOwnerComponent().getModel();
          let oBindList = oModel.bindList("/xGMSxLocMatnr");
          oBindList.requestContexts(0, Infinity).then(function (aContexts) {
            var distinctValues = {};
            var result = [];
            var property = "Locid";
            aContexts.forEach(function (item) {
              var propertyValue = item.getObject()[property];
              if (!distinctValues[propertyValue]) {
                distinctValues[propertyValue] = true;
                result.push(propertyValue);
              }
            });
            uniqueLocIds = result;
          });
        },
  
        onNewMap: function (oEvent) {
          this.usedAllocMapping();
          var count = this.getView().byId("allocTableMapping").getItems().length;
          var oView = this.getView();
          const addAllocMapData = {
            mapID: "",
            location: "",
            schedulingReduction: "",
            technicalBalancing: "",
            buisnessBalancing: "",
          };
          const allocMapDataModel = new sap.ui.model.json.JSONModel(
            addAllocMapData
          );
          oView.setModel(allocMapDataModel, "allocMapDataModel");
          if (!this._oDialogAllocMap) {
            this._oDialogAllocMap = sap.ui.xmlfragment(
              "com.ingenx.config.fragments.addAllocationMapping",
              this
            );
            oView.addDependent(this._oDialogAllocMap);
          }
          this._oDialogAllocMap.open();
        },
  
        oncancelAllocMapping: function () {
          this._oDialogAllocMap.close();
        },
  
        // ALLOCATION LOCATION
  
        onAllocLocation: function () {
          var oView = this.getView();
          if (!this._oDialogAllocLocation) {
            // this._oDialogAllocLocation = sap.ui.xmlfragment("app.config.fragments.allocMapLoc", this);
            this._oDialogAllocLocation = sap.ui.xmlfragment(
              oView.getId(),
              "com.ingenx.config.fragments.allocMapLoc",
              this
            );
            oView.addDependent(this._oDialogAllocLocation);
          }
  
          var locModel = new sap.ui.model.json.JSONModel();
          locModel.setData(uniqueLocIds);
          this._oDialogAllocLocation.setModel(locModel, "uniqueLocations");
          this._oDialogAllocLocation.open();
        },
        allocMapDialogSearch: function (oEvent) {
          var sValue = oEvent.getParameter("value");
          var oFilter = new Filter("Auart", FilterOperator.Contains, sValue);
          oEvent.getSource().getBinding("items").filter([oFilter]);
        },
        allocMapValueHelpClose: function (oEvent) {
          var selectedLoc,
            oSelectedItem = oEvent.getParameter("selectedItem");
          oEvent.getSource().getBinding("items").filter([]);
  
          if (!oSelectedItem) {
            return;
          }
  
          selectedLoc = oSelectedItem.getTitle();
          this.getView()
            .getModel("allocMapDataModel")
            .setProperty("/location", selectedLoc);
          this._oDialogAllocLocation.close();
        },
        allocMapValueHelpCancel: function () {
          this._oDialogAllocLocation.close();
        },
  
        // SCHEDULING REDUCTION
  
        onSchedulingReduction: function () {
          var oView = this.getView();
          if (!this._oDialogAllocSchRed) {
            this._oDialogAllocSchRed = sap.ui.xmlfragment(
              "com.ingenx.config.fragments.allocSchRed",
              this
            );
            oView.addDependent(this._oDialogAllocSchRed);
          }
          this._oDialogAllocSchRed.open();
        },
        schRedDialogSearch: function (oEvent) {
          var sValue = oEvent.getParameter("value");
          var oFilter = new Filter("title", FilterOperator.Contains, sValue);
          oEvent.getSource().getBinding("items").filter([oFilter]);
        },
        schRedValueHelpClose: function (oEvent) {
          var selectedSchRed,
            oSelectedItem = oEvent.getParameter("selectedItem");
          oEvent.getSource().getBinding("items").filter([]);
  
          if (!oSelectedItem) {
            return;
          }
  
          selectedSchRed = oSelectedItem.getTitle();
          this.getView()
            .getModel("allocMapDataModel")
            .setProperty("/schedulingReduction", selectedSchRed);
          this._oDialogAllocSchRed.close();
        },
        schRedValueHelpCancel: function () {
          this._oDialogAllocSchRed.close();
        },
  
        // TECHNICAL BALANCING
  
        onTechnicalBalancing: function () {
          var oView = this.getView();
          if (!this._oDialogAllocTecBal) {
            this._oDialogAllocTecBal = sap.ui.xmlfragment(
              "com.ingenx.config.fragments.allocTecBal",
              this
            );
            oView.addDependent(this._oDialogAllocTecBal);
          }
          this._oDialogAllocTecBal.open();
        },
        tecBalDialogSearch: function (oEvent) {
          var sValue = oEvent.getParameter("value");
          var oFilter = new Filter("title", FilterOperator.Contains, sValue);
          oEvent.getSource().getBinding("items").filter([oFilter]);
        },
        tecBalValueHelpClose: function (oEvent) {
          var selectedTecBal,
            oSelectedItem = oEvent.getParameter("selectedItem");
          oEvent.getSource().getBinding("items").filter([]);
  
          if (!oSelectedItem) {
            return;
          }
  
          selectedTecBal = oSelectedItem.getTitle();
          this.getView()
            .getModel("allocMapDataModel")
            .setProperty("/technicalBalancing", selectedTecBal);
          this._oDialogAllocTecBal.close();
        },
        tecBalValueHelpCancel: function () {
          this._oDialogAllocTecBal.close();
        },
  
        // BUSINESS BALANCING
  
        onBuisnessBalancing: function () {
          var oView = this.getView();
          if (!this._oDialogAllocBusinessBal) {
            this._oDialogAllocBusinessBal = sap.ui.xmlfragment(
              "com.ingenx.config.fragments.allocBusinessBal",
              this
            );
            oView.addDependent(this._oDialogAllocBusinessBal);
          }
          this._oDialogAllocBusinessBal.open();
        },
        businessBalDialogSearch: function (oEvent) {
          var sValue = oEvent.getParameter("value");
          var oFilter = new Filter("title", FilterOperator.Contains, sValue);
          oEvent.getSource().getBinding("items").filter([oFilter]);
        },
        businessBalValueHelpClose: function (oEvent) {
          var selectedBusinessBal,
            oSelectedItem = oEvent.getParameter("selectedItem");
          oEvent.getSource().getBinding("items").filter([]);
  
          if (!oSelectedItem) {
            return;
          }
  
          selectedBusinessBal = oSelectedItem.getTitle();
          this.getView()
            .getModel("allocMapDataModel")
            .setProperty("/buisnessBalancing", selectedBusinessBal);
          this._oDialogAllocBusinessBal.close();
        },
        businessBalValueHelpCancel: function () {
          this._oDialogAllocBusinessBal.close();
        },
  
        // VALIDATE NEW ALLOCATION MAPPING
  
        usedAllocMapping: function () {
          var that = this;
  
          return new Promise(function (resolve, reject) {
            var usedAllocMappingDataModel = new sap.ui.model.json.JSONModel();
            that
              .getView()
              .setModel(usedAllocMappingDataModel, "usedAllocMappingDataModel");
            let oModel = that.getOwnerComponent().getModel();
            let oBindList = oModel.bindList("/AllocationLocation");
  
            oBindList.requestContexts(0, Infinity).then(
              function (aContexts) {
                allocMapping = [];
                aContexts.forEach(function (oContext) {
                  allocMapping.push(oContext.getObject());
                });
                usedAllocMappingDataModel.setData(allocMapping);
  
                var usedAllocMappingModelData = that
                  .getView()
                  .getModel("usedAllocMappingDataModel")
                  .getData();
                console.log(usedAllocMappingModelData);
                validateNewAllocMap = usedAllocMappingModelData.map(function (
                  obj
                ) {
                  return {
                    ID: obj.mapID,
                    location: obj.location,
                  };
                });
                console.log(
                  "Validate New Allocation Mapping",
                  validateNewAllocMap
                );
                resolve(allocMapping);
              }.bind(this)
            );
          });
        },
  
        // LAST ID
  
        onLastMapID: function () {
          try {
            var oTable = this.getView().byId("allocTableMapping");
            var oItems = oTable.getItems();
  
            var maxID = 0;
            oItems.forEach(function (oItem) {
              var currentID = parseInt(oItem.getCells()[1].getText(), 10);
              if (!isNaN(currentID) && currentID > maxID) {
                maxID = currentID;
              }
            });
  
            lastAllocMapID = maxID.toString();
          } catch (error) {
            lastAllocMapID = "0";
          }
          console.log("Max ID:", lastAllocMapID);
        },
  
        // ON SUBMIT ALLOCATION MAPPING
  
        onsaveAllcoationMapping: function () {
          this.onLastMapID();
          var mapEntryData = this.getView()
            .getModel("allocMapDataModel")
            .getData();
          var entryDataAllocMap = {
            mapID: parseInt(lastAllocMapID, 10) + 1,
            location: mapEntryData.location,
            schedulingReduction: mapEntryData.schedulingReduction,
            technicalBalancing: mapEntryData.technicalBalancing,
            buisnessBalancing: mapEntryData.buisnessBalancing,
          };
  
          if (
            entryDataAllocMap.location === "" ||
            entryDataAllocMap.schedulingReduction === "" ||
            entryDataAllocMap.technicalBalancing === "" ||
            entryDataAllocMap.buisnessBalancing === ""
          ) {
            sap.m.MessageToast.show("Input fields cannot be blank.", {
              duration: 3000,
              width: "15em",
              my: "center top",
              at: "center top",
              of: window,
              offset: "30 30",
              onClose: function () {
                console.log("Message toast closed");
              },
            });
            console.log("All fields should be filled");
            return;
          } else {
            var isDuplicateAllocMapping = validateNewAllocMap.some(function (
              entry
            ) {
              return (
                entry.location.toLowerCase() ===
                entryDataAllocMap.location.toLowerCase()
              );
            });
  
            if (isDuplicateAllocMapping) {
              sap.m.MessageToast.show("Mapping already exists.", {
                duration: 3000,
                width: "15em",
                my: "center top",
                at: "center top",
                of: window,
                offset: "30 30",
                onClose: function () {
                  console.log("Message toast closed");
                },
              });
              console.log("Duplicate location found");
              return;
            } else {
              validateNewAllocMap.push(entryDataAllocMap);
              console.log("Entry added successfully");
            }
          }
  
          let oModel = this.getView().getModel();
          let oBindListAM = oModel.bindList("/AllocationLocation");
          oBindListAM.create(entryDataAllocMap);
          this._oDialogAllocMap.close();
          this.RefreshData();
          sap.m.MessageBox.success("Mapping created!");
        },
  
        // REFRESH ALLOCATION TABLE
  
        RefreshData: function () {
          this.getView().byId("allocTableMapping").getBinding("items").refresh();
        },
  
        // DELETE MAPPING
  
        onDeleteAllocMap: function () {
          var addAllocMap = this.byId("allocNewMappingBtn");
          var delAllocMap = this.byId("deleteAllocMappingBtn");
          var confirmDelAlloc = this.byId("deleteAllocMapConfirmBtn");
          var cancelDelAlloc = this.byId("cancelAllocMapDeleteBtn");
          var delCheckBoxAlloc = this.byId("deleteMapLabel");
  
          // TOGGLE VISIBILTY
          addAllocMap.setVisible(!addAllocMap.getVisible());
          delAllocMap.setVisible(!delAllocMap.getVisible());
          confirmDelAlloc.setVisible(!confirmDelAlloc.getVisible());
          cancelDelAlloc.setVisible(!cancelDelAlloc.getVisible());
          delCheckBoxAlloc.setVisible(!delCheckBoxAlloc.getVisible());
        },
  
        onCancelAllocMapDeletion: function () {
          this.onDeleteAllocMap();
          this.onNullSelectedAllocMapping();
          this.onAllocationUnCheckBox();
        },
  
        // SELECT ALL MAPPING
  
        onSelectAllocMap: function (oEvent) {
          var oTable = this.byId("allocTableMapping");
          var oItems = oTable.getItems();
          var selectAll = oEvent.getParameter("selected");
  
          if (!selectAll) {
            initialDelAllocMapArray.ID = [];
          } else {
            initialDelAllocMapArray.ID = oItems.map(function (oItem) {
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
  
        // UNCHECK ALL SELECTED ROWS
  
        onAllocationUnCheckBox: function () {
          var selectedItems = initialDelAllocMapArray.ID;
          var oTable = this.byId("allocTableMapping");
          var oItems = oTable.getItems();
  
          oItems.forEach(function (oItem) {
            oItem.getCells()[0].setSelected(false);
          });
  
          this.getView().byId("selectAllAllocMap").setSelected(false);
          this.onNullSelectedAllocMapping();
        },
  
        // DELETE ARRAY
  
        onDeleteAllocMapArray: function (oEvent) {
          var selectedPaths = oEvent
            .getSource()
            .getParent()
            .getAggregation("cells");
  
          for (var i = 0; i < selectedPaths.length; i++) {
            if (i === 0) {
              let checkbox = selectedPaths[i];
              let paths = selectedPaths[i + 1].getProperty("text");
  
              if (checkbox.getSelected()) {
                if (initialDelAllocMapArray.ID.indexOf(paths) === -1) {
                  initialDelAllocMapArray.ID.push(paths);
                }
              } else {
                var index = initialDelAllocMapArray.ID.indexOf(paths);
                if (index !== -1) {
                  initialDelAllocMapArray.ID.splice(index, 1);
                }
              }
            }
          }
  
          console.log("Initial Path Delete Array:", initialDelAllocMapArray.ID);
          this.RefreshData();
        },
  
        // EMPTY ARRAY
  
        onNullSelectedAllocMapping: function () {
          initialDelAllocMapArray = {
            ID: [],
          };
        },
  
        onConfirmAllocMapDeletion: function () {
          var unfilteredItems = initialDelAllocMapArray.ID;
          var selectedItems = Array.from(new Set(unfilteredItems));
          console.log("Selected Items:", selectedItems);
  
          if (selectedItems.length > 0) {
            sap.m.MessageBox.confirm(
              "Are you sure you want to delete the selected mapping?",
              {
                title: "Confirmation",
                onClose: function (oAction) {
                  if (oAction === sap.m.MessageBox.Action.OK) {
                    var oTable = this.byId("allocTableMapping");
                    var oItems = oTable.getItems();
  
                    selectedItems.forEach(function (itemId) {
                      oItems.forEach(function (oItem) {
                        var sRowId = oItem.getCells()[1].getText();
  
                        if (sRowId === itemId) {
                          oItem
                            .getBindingContext()
                            .delete()
                            .catch(function (oError) {
                              if (!oError.canceled) {
                                MessageBox.error("Error :", oError);
                              }
                              this.RefreshData();
                            });
                        }
                      });
                    });
                  } else if (oAction === sap.m.MessageBox.Action.CANCEL) {
                    this.onNullSelectedAllocMapping();
                    this.onAllocationUnCheckBox();
                  }
                }.bind(this),
              }
            );
          } else {
            sap.m.MessageBox.information(
              "Please select at least one mapping for deletion."
            );
          }
          this.onDeleteAllocMap();
          this.onNullSelectedAllocMapping();
          this.onAllocationUnCheckBox();
        },
  
        // Validity Period
        datePickerAllocMap: function (oEvent) {
          let oDatePicker = oEvent.getSource();
          let oRow = oDatePicker.getParent();
  
          let oValidFromDatePicker = oRow.getCells()[6];
          let oValidToDatePicker = oRow.getCells()[7];
  
          let validFromDate = oValidFromDatePicker.getDateValue();
          let validToDate = oValidToDatePicker.getDateValue();
  
          if (validFromDate && validToDate && validToDate < validFromDate) {
            sap.m.MessageToast.show("Valid to cannot be past valid from.");
            oValidToDatePicker.setValue(null);
            oValidToDatePicker.focus();
          }
        },
      });
    }
  );
  