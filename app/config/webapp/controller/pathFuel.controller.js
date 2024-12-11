sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/FilterType",
    "sap/m/ColumnListItem",
    "sap/m/MessageBox",
    "sap/m/Input",
  ], function (Controller, JSONModel, MessageBox, Filter, FilterOperator, FilterType, ColumnListItem, Input) {
    "use strict";
  
    var pathLastID;
    var initialPathDeleteArray = {
      ID: []
    };
    var validateNewPF;
    var zloc;
    var Msys;
    var Tsys;
    var sloc;
    let cellId1, cellId2, cellId3, cellId4;
    let pathModel;
    var newRowAdded = false;
    let intrData;
    let pFDataEntry;
    let del;
    let reDel;
  
    const interconnect = {
      YES: 'Yes',
      NO: 'No'
    }
  
    let emptyPathRowTemplate = {
      sNo: "",
      delPoint: "",
      delPointTsyst: "",
      reDelPoint: "",
      reDelPointTsyst: "",
      isInterconnect: "",
      bInterconnect: false,
      sInterconnect: "",
      path: "",
      fuelpct: ""
    }
  
    var interconnectData = null;
    var flag = true;
  
    return Controller.extend("com.ingenx.config.controller.pathFuel", {
  
      onInit1: function () {
        let that = this;
        var inputField = this.byId("_IDGenInput5");
        var oData = new sap.ui.model.json.JSONModel("");
        var oModel = this.getOwnerComponent().getModel();
        oModel.attachDataReceived(this.onReceive, this);
  
        let bindList = oModel.bindList("/xGMSxLocPoint_Map");
        bindList.requestContexts(0, Infinity).then(function (aContexts) {
          zloc = [];
          aContexts.forEach(function (oContext) {
            zloc.push(oContext.getObject());
          });
        });
  
        let initialData = structuredClone(emptyPathRowTemplate);
        console.log("initialData", initialData);
        initialData.sNo = "1";
        pathModel = new JSONModel([initialData]);
        this.getView().setModel(pathModel, "pathmodel");
  
        let isErrorDisplayed = false;
  
        this.getView().getModel("pathmodel").attachPropertyChange(function (oEvent) {
          console.log("ping");
          let path = oEvent.getParameter('context').getPath();
          let delPointTsyst = oEvent.getParameter('context').getProperty("delPointTsyst");
          let delPoint = oEvent.getParameter('context').getProperty("delPoint");
          let reDelPoint = oEvent.getParameter('context').getProperty("reDelPoint");
          let reDelPointTsyst = oEvent.getParameter('context').getProperty("reDelPointTsyst");
          let sInterconnect = oEvent.getParameter('context').getProperty("sInterconnect");
  
          if (delPointTsyst && reDelPointTsyst) {
            if (delPointTsyst === reDelPointTsyst) {
              pathModel.setProperty(`${path}/isInterconnect`, interconnect.NO);
              pathModel.setProperty(`${path}/bInterconnect`, false);
              sInterconnect = "";
              pathModel.setProperty(`${path}/sInterconnect`, sInterconnect);
            } else {
              that.getView().setModel(oData, "oData");
              let oModel2 = that.getOwnerComponent().getModel();
              let filter1 = new sap.ui.model.Filter("Transport1", sap.ui.model.FilterOperator.EQ, delPointTsyst);
              let filter2 = new sap.ui.model.Filter("Transport2", sap.ui.model.FilterOperator.EQ, reDelPointTsyst);
              let combinedFilter = new sap.ui.model.Filter({
                filters: [filter1, filter2],
                and: true
              });
              console.log("combinedFilter", combinedFilter);
  
              let oBindList2 = oModel2.bindList("/Interconnect_pointSet", undefined, undefined, [combinedFilter]);
              oBindList2.requestContexts(0, Infinity)
                .then(function (aContexts) {
                  intrData = [];
                  aContexts.forEach(function (oContext) {
                    intrData.push(oContext.getObject());
                  });
                  console.log("intrData", intrData);
                  return intrData;
                })
                .then(function (intrData) {
                  interconnectData = intrData;
                  console.log("map", interconnectData);
                  return interconnectData[0].IntLoc;
                })
                .then(function (result) {
                  pathModel.setProperty(`${path}/isInterconnect`, interconnect.YES);
                  pathModel.setProperty(`${path}/bInterconnect`, true);
                  let spath = `${delPoint}:${result}:${reDelPoint}`;
                  flag = false;
                  pathModel.setProperty(`${path}/sInterconnect`, result);
                  pathModel.setProperty(`${path}/path`, spath);
                })
                .catch((err) => {
                  console.log("we found an error", err);
  
                  if (!isErrorDisplayed) {
                    sap.m.MessageBox.information("Path Not Found on selected points!, Please Change Path");
                    that.clearFields();
                    isErrorDisplayed = true;
                  }
                });
            }
          }
  
          if (flag) {
            let finalPath = [delPoint, sInterconnect, reDelPoint].map((tsyst, i) => {
              if (tsyst) {
                return i === 0 ? tsyst : `:${tsyst}`;
              }
            }).toString().replaceAll(",", "");
            pathModel.setProperty(`${path}/path`, finalPath);
          }
        });
  
        let oBindList = oModel.bindList("/pathAndFuelMapping");
        let aData = [];
        oBindList.requestContexts().then(aContext => {
          aContext.forEach(context => aData.push(context.getObject()));
        });
        setTimeout(() => { }, 2000);
        console.table(aData);
      },
      onInit: function () {
        let that = this;
        var inputField = this.byId("_IDGenInput5");
        var oData = new sap.ui.model.json.JSONModel("");
        var oModel = this.getOwnerComponent().getModel();
        oModel.attachDataReceived(this.onReceive, this);
      
        let bindList = oModel.bindList("/xGMSxLocPoint_Map");
        bindList.requestContexts(0, Infinity).then(function (aContexts) {
          zloc = [];
          aContexts.forEach(function (oContext) {
            zloc.push(oContext.getObject());
          });
        });
      
        let initialData = structuredClone(emptyPathRowTemplate);
        console.log("initialData", initialData);
        initialData.sNo = "1";
        pathModel = new JSONModel([initialData]);
        this.getView().setModel(pathModel, "pathmodel");
      
        // Flag to track if error message has been displayed
        let isErrorDisplayed = false;
      
        this.getView().getModel("pathmodel").attachPropertyChange(function (oEvent) {
          console.log("ping");
          let path = oEvent.getParameter('context').getPath();
          let delPointTsyst = oEvent.getParameter('context').getProperty("delPointTsyst");
          let delPoint = oEvent.getParameter('context').getProperty("delPoint");
          let reDelPoint = oEvent.getParameter('context').getProperty("reDelPoint");
          let reDelPointTsyst = oEvent.getParameter('context').getProperty("reDelPointTsyst");
          let sInterconnect = oEvent.getParameter('context').getProperty("sInterconnect");
      
          isErrorDisplayed = false;
      
          if (delPointTsyst && reDelPointTsyst) {
            if (delPointTsyst === reDelPointTsyst) {
              pathModel.setProperty(`${path}/isInterconnect`, interconnect.NO);
              pathModel.setProperty(`${path}/bInterconnect`, false);
              sInterconnect = "";
              pathModel.setProperty(`${path}/sInterconnect`, sInterconnect);
              pathModel.setProperty(`${path}/path`, "");
            } else {
              that.getView().setModel(oData, "oData");
              let oModel2 = that.getOwnerComponent().getModel();
              let filter1 = new sap.ui.model.Filter("Transport1", sap.ui.model.FilterOperator.EQ, delPointTsyst);
              let filter2 = new sap.ui.model.Filter("Transport2", sap.ui.model.FilterOperator.EQ, reDelPointTsyst);
              let combinedFilter = new sap.ui.model.Filter({
                filters: [filter1, filter2],
                and: true
              });
              console.log("combinedFilter", combinedFilter);
      
              let oBindList2 = oModel2.bindList("/Interconnect_pointSet", undefined, undefined, [combinedFilter]);
              oBindList2.requestContexts(0, Infinity)
                .then(function (aContexts) {
                  intrData = [];
                  aContexts.forEach(function (oContext) {
                    intrData.push(oContext.getObject());
                  });
                  console.log("intrData", intrData);
                  return intrData;
                })
                .then(function (intrData) {
                  interconnectData = intrData;
                  console.log("map", interconnectData);
                  return interconnectData.length > 0 ? interconnectData[0].IntLoc : null;
                })
                .then(function (result) {
                  if (result) {
                    pathModel.setProperty(`${path}/isInterconnect`, interconnect.YES);
                    pathModel.setProperty(`${path}/bInterconnect`, true);
                    let spath = `${delPoint}:${result}:${reDelPoint}`;
                    pathModel.setProperty(`${path}/sInterconnect`, result);
                    pathModel.setProperty(`${path}/path`, spath);
                  } else {
                    throw new Error("No path found");
                  }
                })
                .catch((err) => {
                  console.log("we found an error", err);
                 
                  if (!isErrorDisplayed) {
                    sap.m.MessageBox.information("Path Not Found on selected points! Please Change Path");
                    that.clearFields();
                    isErrorDisplayed = true;
                  }
  
                 
                });
            }
          }
      
          if (flag) {
            let finalPath = [delPoint, sInterconnect, reDelPoint].map((tsyst, i) => {
              if (tsyst) {
                return i === 0 ? tsyst : `:${tsyst}`;
              }
            }).toString().replaceAll(",", "");
            pathModel.setProperty(`${path}/path`, finalPath);
          }
        });
      
        let oBindList = oModel.bindList("/pathAndFuelMapping");
        let aData = [];
        oBindList.requestContexts().then(aContext => {
          aContext.forEach(context => aData.push(context.getObject()));
        });
        setTimeout(() => { }, 2000);
        console.table(aData);
      },
      
      
      
     
      
     
  
      onDeliveryPoint: function (rowIndex) {
        console.log("Hello from onDeliveryPoint");
        let cell = rowIndex.getSource().getParent().getAggregation("cells")
        cellId1 = cell[1].sId
        cellId2 = cell[2].sId
  
        var oView = this.getView();
        if (!this.onLocationfrag) {
          this.onLocationfrag = sap.ui.xmlfragment(
            oView.getId(),
            "com.ingenx.config.fragments.deliveryPoint",
            this
          );
          oView.addDependent(this.onLocationfrag);
        }
        // Pass the row index to the fragment
        this.onLocationfrag.data("rowIndex", rowIndex);
        this.onLocationfrag.open();
      },
  
  
      ondelivery: function (oEvent) {
        var oSelectedItem = oEvent.getParameter("selectedItem");
        var selectedRow = oEvent.getSource();
        console.log("Selected Row ", selectedRow);
        oEvent.getSource().getBinding("items").filter([]);
  
        if (!oSelectedItem) {
          return;
        }
  
        this.byId("Delivery_Point").setValue(oSelectedItem.getTitle());
        this.byId(cellId1).setValue(oSelectedItem.getTitle());
        this.byId(cellId2).setValue(oSelectedItem.getDescription())
  
      },
  
  
  
      onValueHelpDialogSearchde: function (oEvent) {
        var sValue = oEvent.getParameter("value");
        var oFilter = new sap.ui.model.Filter("Locid", sap.ui.model.FilterOperator.Contains, sValue);
        oEvent.getSource().getBinding("items").filter([oFilter]);
       
          var oBinding = oEvent.getSource().getBinding("items");
          var oSelectDialog = oEvent.getSource();
      
          oBinding.filter([oFilter]);
      
          oBinding.attachEventOnce("dataReceived", function() {
              var aItems = oBinding.getCurrentContexts();
      
              if (aItems.length === 0) {
                  oSelectDialog.setNoDataText("No  Location found");
              } else {
                  oSelectDialog.setNoDataText("Loading");
              }
          });
  
  
  
  
      },
  
      onReDeliveryPoint: function (rowIndex) {
        console.log("Hello from onDeliveryPoint");
        let rowNo = rowIndex.oSource.oParent;
        let cell = rowNo.mAggregations.cells;
        cellId3 = cell[3].sId
        cellId4 = cell[4].sId
        console.log("Value is for", cellId1, cellId2, cellId3);
  
        var oView = this.getView();
        if (!this.onLocationfrag1) {
          this.onLocationfrag1 = sap.ui.xmlfragment(
            oView.getId(),
            "com.ingenx.config.fragments.reDeliveryPoint",
            this
          );
          oView.addDependent(this.onLocationfrag1);
        }
  
        this.onLocationfrag1.data("rowIndex", rowIndex);
        this.onLocationfrag1.open();
  
  
      },
  
  
      onValueredivery: function (oEvent) {
  
        var oSelectedItem = oEvent.getParameter("selectedItem");
        var selectedRow = oEvent.getSource();
        console.log("Selected Row ", selectedRow);
        oEvent.getSource().getBinding("items").filter([]);
  
        if (!oSelectedItem) {
          return;
        }
  
  
        this.byId(cellId3).setValue(oSelectedItem.getTitle());
        this.byId(cellId4).setValue(oSelectedItem.getDescription())
  
      },
  
      onValueHelpDialogSearch: function (oEvent) {
        var sValue = oEvent.getParameter("value");
        var oFilter = new sap.ui.model.Filter("Locid", sap.ui.model.FilterOperator.Contains, sValue);
        oEvent.getSource().getBinding("items").filter([oFilter]);
       
          var oBinding = oEvent.getSource().getBinding("items");
          var oSelectDialog = oEvent.getSource();
      
          oBinding.filter([oFilter]);
      
          oBinding.attachEventOnce("dataReceived", function() {
              var aItems = oBinding.getCurrentContexts();
      
              if (aItems.length === 0) {
                  oSelectDialog.setNoDataText("No  Location found");
              } else {
                  oSelectDialog.setNoDataText("Loading");
              }
          });
  
  
  
  
      },
      RefreshData: function () {
        this.getView().byId("viewPathtable").getBinding("items").refresh();
      },
  
      RefreshDataAdd: function () {
        this.getView().byId("addPathtable").getBinding("items").refresh();
      },
  
      // LAST ID
  
      onPathLastID: function () {
        try {
          var oTable = this.getView().byId("viewPathtable");
          var oItems = oTable.getItems();
  
          var maxID = 0;
          oItems.forEach(function (oItem) {
            var currentID = parseInt(oItem.getCells()[1].getText(), 10);
            if (!isNaN(currentID) && currentID > maxID) {
              maxID = currentID;
            }
          });
  
          pathLastID = maxID.toString();
        } catch (error) {
          pathLastID = "0";
        }
        console.log("Max ID:", pathLastID);
      },
  
      usedPathNFuel: function () {
        var that = this;
  
        //var usedPFData = new sap.ui.model.json.JSONModel();
        var usedPFDataModel = new sap.ui.model.json.JSONModel();
        that.getView().setModel(usedPFDataModel, "usedPFDataModel");
        let oModel = that.getOwnerComponent().getModel();
        let oBindList = oModel.bindList("/pathAndFuelMapping");
  
        oBindList.requestContexts(0, Infinity).then(function (aContexts) {
          pFDataEntry = [];
          aContexts.forEach(function (oContext) {
            pFDataEntry.push(oContext.getObject());
          });
          usedPFDataModel.setData(pFDataEntry);
          var usedPFModelData = that.getView().getModel("usedPFDataModel").getData();
          validateNewPF = usedPFModelData.map(function (obj) {
            return {
              ID: obj.rowID,
              DeliveryPoint: obj.DeliveryPoint,
              ReDeliveryPoint: obj.ReDeliveryPoint
            };
          });
          console.log("Validate Path Fuel Data", validateNewPF);
        });
      },
  
      // FUEL PERCENTAGE (<100)
  
      onFuelPerChange: function (oEvent) {
        let perValue = oEvent.getSource().getValue();
        if (perValue > 100) {
          sap.m.MessageBox.information("Percentage cannot be more than 100%");
          oEvent.getSource().setValue("");
        }
      },
  
      // VALIDATE POINTS (DEL/REDEL)
  
      validatePoint: function () {
        if (del === "" && reDel === "") {
          return;
        } else {
          if (del === reDel) {
            sap.m.MessageBox.information("Delivery & Redelivery point cannot be the same.");
            this.clearFields();
          }
        }
      },
  
  
      //Submit to HANA DB
      onSubmit: function () {
        var pathModelData = this.getView().getModel("pathmodel").getData();
  
        var payload = {
          rowID: (parseInt(pathLastID, 10) + 1),
          DeliveryPoint: pathModelData[0].delPoint,
          DpTsSystem: pathModelData[0].delPointTsyst,
          ReDeliveryPoint: pathModelData[0].reDelPoint,
          RDpTsSystem: pathModelData[0].reDelPointTsyst,
          InterconnectPath: pathModelData[0].isInterconnect,
          Interconnect: pathModelData[0].sInterconnect,
          path: pathModelData[0].path,
          FuelPercentage: parseFloat(pathModelData[0].fuelpct).toFixed(3)
        };
  
        if (payload.DeliveryPoint === '' || payload.ReDeliveryPoint === '' || isNaN(payload.FuelPercentage)) {
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
          console.log("No field cannot be null");
          return;
        }
  
        else {
          var isDuplicatePF = validateNewPF.some(function (entry) {
            return entry.DeliveryPoint.toLowerCase() === payload.DeliveryPoint.toLowerCase() && entry.ReDeliveryPoint.toLowerCase() === payload.ReDeliveryPoint.toLowerCase();
          });
  
          if (isDuplicatePF) {
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
            console.log("Entry Already found");
            return;
          } else {
            validateNewPF.push(payload);
            console.log("Entry added successfully");
          }
  
  
          let oModel = this.getOwnerComponent().getModel();
          let oBindListPF = oModel.bindList("/pathAndFuelMapping");
          oBindListPF.create(payload);
          this.clearFields();
          this.onAddPath();
          this.RefreshDataAdd();
          this.RefreshData();
        }
      },
  
      // onSubmit: function () {
      //   let sGroupID = "CreatePNFMap";
      //   var payloads;
      //   var pathModelData = this.getView().getModel("pathmodel").getData();
      //   let pathFuelPostModel = this.getOwnerComponent().getModel();
      //   let oBindList = pathFuelPostModel.bindList("/pathAndFuelMapping", { $$groupId: sGroupID });
  
      //   if (Array.isArray(pathModelData) && pathModelData.length > 0) {
      //     // Create payloads for each item in the array
      //     for (let i = 0; i < pathModelData.length; i++) {
      //       var payloads = {
      //         rowID: (parseInt(pathLastID, 10) + 1),
      //         DeliveryPoint: pathModelData[i].delPoint,
      //         DpTsSystem: pathModelData[i].delPointTsyst,
      //         ReDeliveryPoint: pathModelData[i].reDelPoint,
      //         RDpTsSystem: pathModelData[i].reDelPointTsyst,
      //         InterconnectPath: pathModelData[i].isInterconnect,
      //         Interconnect: pathModelData[i].sInterconnect,
      //         path: pathModelData[i].path,
      //         FuelPercentage: parseFloat(pathModelData[i].fuelpct).toFixed(3)
      //       };
      //       this.onAddPath();
  
      //       oBindList.create(payloads);
      //       // this.getView().getModel("pathmodel").refresh();
      //       this.clearFields();
      //       this.RefreshDataAdd();
      //       this.RefreshData();
      //     }
  
      //     pathFuelPostModel.submitBatch(sGroupID).then((resolve) => {
      //       console.log(resolve);
      //       sap.m.MessageBox.success("Path created.")
      //     }, (reject) => {
      //       console.log(reject);
      //     });
      //   }
      // },
  
      // CLEAR FIELDS
  
      clearFields: function () {
        var oView = this.getView();
        /**
         * Array of input fields.
         * @type {Array}
         */
        var aInputFields = oView.findElements(true);
  
        aInputFields.forEach(function (oInputField) {
          if (oInputField.setValue) {
            oInputField.setValue("");
          }
        });
      },
  
      setNull: function () {
        return {
          del: "",
          reDel: ""
        };
      },
  
      // ADD PATH BUTTON
  
      onAddPath: function () {
  
        // GET LAST ID
        this.onPathLastID();
        this.usedPathNFuel();
        this.clearFields();
        this.setNull();
  
        console.log("ID", pathLastID)
        var pathHeading = this.byId("pathHeading");
        var addPathRow = this.byId("addPathtable");
        var addPath = this.byId("addPathBtn");
        var addSubmitPath = this.byId("submitPathBtn");
        var cancelAddPath = this.byId("canAddBtn");
        var delPathBtn = this.byId("deletePathBtn");
  
        // TOGGLE VISIBILTY
        pathHeading.setVisible(!pathHeading.getVisible());
        addPath.setVisible(!addPath.getVisible());
        addPathRow.setVisible(!addPathRow.getVisible());
        addSubmitPath.setVisible(!addSubmitPath.getVisible());
        cancelAddPath.setVisible(!cancelAddPath.getVisible());
        delPathBtn.setVisible(!delPathBtn.getVisible());
      },
  
      onCancelAddPath: function () {
        this.onAddPath();
        this.clearFields();
      },
  
      // DELETE FUNCTIONALITY
  
      onDelPath: function () {
        var addPath = this.byId("addPathBtn");
        var delPathBtn = this.byId("deletePathBtn");
        var delPathCon = this.byId("delPathConfirm");
        var canPDelete = this.byId("canPathDelete");
        var deletePL = this.byId("deletePathLabel");
        var delCheckBox = this.byId("deletePathCB");
  
        // Toggle Visibility
        addPath.setVisible(!addPath.getVisible());
        delPathBtn.setVisible(!delPathBtn.getVisible());
        delPathCon.setVisible(!delPathCon.getVisible());
        canPDelete.setVisible(!canPDelete.getVisible());
        deletePL.setVisible(!deletePL.getVisible());
        delCheckBox.setVisible(!delCheckBox.getVisible());
      },
  
      onCancelDelPath: function () {
        this.onDelPath();
        this.onPathUnCheckBox();
      },
  
      onPathUnCheckBox: function () {
        var selectedItems = initialPathDeleteArray.ID;
        var oTable = this.byId("viewPathtable");
        var oItems = oTable.getItems();
        this.getView().byId("selectAllPath").setSelected(false);
  
        selectedItems.forEach(function (itemId) {
          oItems.forEach(function (oItem) {
            var sRowId = oItem.getCells()[1].getText();
  
            if (sRowId === itemId) {
              oItem.getCells()[0].setSelected(false);
            }
          });
        });
      },
  
      onSelectAllPath: function (oEvent) {
        var oTable = this.byId("viewPathtable");
        var oItems = oTable.getItems();
        var selectAll = oEvent.getParameter("selected");
  
        if (!selectAll) {
          // If "Select All" is unchecked, clear the array
          initialPathDeleteArray.ID = [];
        } else {
          // If "Select All" is checked, add all IDs to the array
          initialPathDeleteArray.ID = oItems.map(function (oItem) {
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
  
      onDeletePathArray: function (oEvent) {
        var selectedPaths = oEvent.getSource().getParent().getAggregation("cells");
  
        for (var i = 0; i < selectedPaths.length; i++) {
          if (i === 0) {
            let checkbox = selectedPaths[i];
            let paths = selectedPaths[i + 1].getProperty("text");
  
            if (checkbox.getSelected()) {
              if (initialPathDeleteArray.ID.indexOf(paths) === -1) {
                initialPathDeleteArray.ID.push(paths);
              }
            } else {
              var index = initialPathDeleteArray.ID.indexOf(paths);
              if (index !== -1) {
                initialPathDeleteArray.ID.splice(index, 1);
              }
            }
          }
        }
  
        console.log("Initial Path Delete Array:", initialPathDeleteArray.ID);
        this.RefreshData();
      },
  
      onNullSelectedPath: function () {
        initialPathDeleteArray = {
          ID: []
        };
        this.onPathUnCheckBox();
      },
  
      onConfirmPath: function () {
        var unfilteredItems = initialPathDeleteArray.ID;
        var selectedItems = Array.from(new Set(unfilteredItems));
        console.log("Selected Items:", selectedItems);
  
        if (selectedItems.length > 0) {
          sap.m.MessageBox.confirm("Are you sure you want to delete the selected path?", {
            title: "Confirmation",
            onClose: function (oAction) {
              if (oAction === sap.m.MessageBox.Action.OK) {
                var oTable = this.byId("viewPathtable");
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
                this.onPathUnCheckBox();
                this.onNullSelectedPath();
              }
            }.bind(this)
          });
        } else {
          sap.m.MessageBox.information("Please select at least one path for deletion.");
        }
        this.onDelPath();
        this.onPathUnCheckBox();
        this.onNullSelectedPath();
      },
  
    });
  });