sap.ui.define(
    [
      "sap/ui/core/mvc/Controller",
      "sap/ui/model/odata/v4/ODataModel",
      "sap/ui/model/json/JSONModel",
      "sap/ui/model/Filter",
      "sap/ui/core/Core",
      "sap/m/MessageToast",
      "sap/m/MessageBox",
    ],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (
      Controller,
      ODataModel,
      JSONModel,
      Filter,
      MessageBox,
      MessageToast,
      Core
    ) {
      "use strict";
      var lastID;
  
      let getPurchaseDocData = [];
      var selectedIDs = [];
      var getdesData = [];
  
      return Controller.extend("com.ingenx.config.controller.transportConfig", {
        onInit: function () {
          let oModel = new sap.ui.model.json.JSONModel();
          this.getView().setModel(oModel, "docTCTypes");
  
          let oModel3 = this.getOwnerComponent().getModel();
          let oBindList3 = oModel3.bindList("/DocumentNoProfileMapping");
  
          oBindList3.requestContexts(0, Infinity).then(
            function (aContexts) {
              let getModelData = [];
              let uniqueDocumentNos = new Set();
  
              aContexts.forEach(function (oContext) {
                let data = oContext.getObject();
                if (
                  data.DocumentDesc === "LP" &&
                  !uniqueDocumentNos.has(data.DocumentNo)
                ) {
                  uniqueDocumentNos.add(data.DocumentNo);
                  getModelData.push(data);
                }
              });
  
              oModel.setData(getModelData);
              console.log("mydata", getModelData);
  
              // Fetch xGMSxContractType data after DocumentNoProfileMapping data is retrieved
              let oModeldes = new sap.ui.model.json.JSONModel();
              this.getView().setModel(oModeldes, "dataModel");
              let oModeldescription = this.getOwnerComponent().getModel();
              let oBindListdes = oModeldescription.bindList("/xGMSxContractType");
  
              oBindListdes.requestContexts(0, Infinity).then(
                function (aContexts) {
                  let getdesData = [];
  
                  aContexts.forEach(function (oContext) {
                    getdesData.push(oContext.getObject());
                  });
  
                  // Loop through retrieved data and update description in getModelData
                  getModelData.forEach(function (doc) {
                    let matchingContract = getdesData.find(function (contract) {
                      return contract.Auart === doc.DocumentNo;
                    });
  
                    if (matchingContract) {
                      doc.Description = matchingContract.Description;
                    }
                  });
  
                  // Update the model with the modified data
                  oModel.setData(getModelData);
                  console.log("Updated mydata", getModelData);
                }.bind(this)
              );
            }.bind(this)
          );
  
          let oModelPD = new sap.ui.model.json.JSONModel();
          this.getView().setModel(oModelPD, "docTCTypesPD");
  
          let oModelPDT = this.getOwnerComponent().getModel();
          let oBindList = oModelPDT.bindList("/DocumentNoProfileMapping");
  
          let uniqueDocuments = {}; // Object to store unique documents
  
          oBindList.requestContexts(0, Infinity).then(
            function (aContexts) {
              aContexts.forEach(function (oContext) {
                let data = oContext.getObject();
                if (data.DocumentDesc === "K" || data.DocumentDesc === "F") {
                  if (!uniqueDocuments[data.DocumentNo]) {
                    uniqueDocuments[data.DocumentNo] = true;
                    getPurchaseDocData.push(data);
                  }
                }
              });
  
              oModelPD.setData(getPurchaseDocData);
  
              let oModeldesPD = new sap.ui.model.json.JSONModel();
              this.getView().setModel(oModeldesPD, "dataModelPD");
              let oModeldescriptionPD = this.getOwnerComponent().getModel();
              let oBindListdesPD =
                oModeldescriptionPD.bindList("/xGMSxContractType");
  
              oBindListdesPD.requestContexts(0, Infinity).then(
                function (aContexts) {
                  let getdesDataPD = [];
  
                  aContexts.forEach(function (oContext) {
                    getdesDataPD.push(oContext.getObject());
                  });
  
                  getPurchaseDocData.forEach(function (doc) {
                    let matchingContract = getdesDataPD.find(function (contract) {
                      return contract.Auart === doc.DocumentNo;
                    });
  
                    if (matchingContract) {
                      doc.Description = matchingContract.Description;
                    }
                  });
  
                  oModelPD.setData(getPurchaseDocData);
                }.bind(this)
              );
            }.bind(this)
          );
  
          this.setTransportConfigModel();
        },
        setTransportConfigModel: function () {
          const oTransportConfigModel = this.getOwnerComponent().getModel();
          const oTransportConfigBindList =
            oTransportConfigModel.bindList("/TransportConfig");
          const oTransportConfigJsonModel = new JSONModel();
          let that = this;
          let aArray = [];
          oTransportConfigBindList
            .requestContexts(0, Infinity)
            .then(function (aContexts) {
              aContexts.forEach((context) => aArray.push(context.getObject()));
              aArray.forEach(
                (item) =>
                  (item.documentType = that.formatDocType(item.documentType))
              );
              oTransportConfigJsonModel.setData({ TransportConfig: aArray });
              oTransportConfigJsonModel.refresh();
            });
          this.getView().setModel(oTransportConfigJsonModel, "transportconfig");
        },
  
        onTransmissionTypeChange: function (oEvent) {
          var oSelect = oEvent.getSource();
          var sSelectedText = oSelect.getSelectedItem().getText();
          this.selectedTransmission = sSelectedText;
        },
  
        onAdd: function (oEvent) {
          var oView = this.getView();
  
          if (!this.selectedTransmission) {
            sap.m.MessageBox.show("Please select a Transmission Type", {
              icon: sap.m.MessageBox.Icon.WARNING,
              title: "Transmission Type Required",
              actions: [sap.m.MessageBox.Action.OK],
            });
            return;
          }
  
          if (!this._oDialogtrans) {
            this._oDialogtrans = sap.ui.xmlfragment(
              "com.ingenx.config.fragments.addTransport",
              this
            );
            oView.addDependent(this._oDialogtrans);
          }
          this._oDialogtrans.open();
        },
  
        oncancelTransmissionType: function () {
          debugger;
  
          this._oDialogtrans.close();
  
          var salesDocInput = sap.ui.getCore().byId("salesDocSingle_Id");
          var purDocInput = sap.ui.getCore().byId("purchase_Id");
          var comboBox = sap.ui.getCore().byId("combo1_2");
          var oSelect = this.byId("mySelect");
          oSelect.setSelectedKey(null);
  
          purDocInput.removeAllTokens();
          salesDocInput.setValue("");
          purDocInput.setValue("");
  
          comboBox.setSelectedKey("");
        },
  
        onDocType: function (oEvent) {
          this.salesDoc = oEvent.getSource();
          var oView = this.getView();
  
          if (!this._oDialogDoc) {
            this._oDialogDoc = sap.ui.xmlfragment(
              "com.ingenx.config.fragments.transConfig",
              this
            );
            oView.addDependent(this._oDialogDoc);
          }
          if (this.selectedTransmission === "1 : N") {
            this._oDialogDoc.setMultiSelect(true);
          } else {
            this._oDialogDoc.setMultiSelect(false);
          }
          this._oDialogDoc.open();
        },
  
        onValueHelpDialogSearchTC: function (oEvent) {
          var sValue = oEvent.getParameter("value");
          var oFilter = new sap.ui.model.Filter(
            "DocumentNo",
            sap.ui.model.FilterOperator.Contains,
            sValue
          );
          var oBinding = oEvent.getSource().getBinding("items");
          oBinding.filter([oFilter]);
        },
  
        onValueHelpDialogCloseTC: function (oEvent) {
          var aSelectedItems;
          if (this.selectedTransmission === "1 : N") {
            aSelectedItems = oEvent.getParameter("selectedItems");
  
            oEvent.getSource().getBinding("items").filter([]);
  
            if (!aSelectedItems || aSelectedItems.length === 0) {
              return;
            }
  
            if (this.salesDoc) {
              var aValues = aSelectedItems.map(function (oSelectedItem) {
                return oSelectedItem.getTitle();
              });
  
              // Add the selected values to the MultiInput control
              aValues.forEach(
                function (sValue) {
                  this.salesDoc.addToken(
                    new sap.m.Token({ key: sValue, text: sValue })
                  );
                }.bind(this)
              );
            }
          } else {
            aSelectedItems = oEvent.getParameter("selectedItem");
            oEvent.getSource().getBinding("items").filter([]);
            if (!aSelectedItems) {
              return;
            }
            if (this.salesDoc) {
              // this.byId("_IDGenInput1").setValue(oSelectedItem.getTitle());
              this.salesDoc.setValue(aSelectedItems.getTitle());
            }
          }
        },
  
        onPurchaseDocType: function (oEvent) {
          this.purchaseDoc = oEvent.getSource();
          var oView = this.getView();
          if (!this._oDialogDocTy) {
            this._oDialogDocTy = sap.ui.xmlfragment(
              "com.ingenx.config.fragments.transConfigPurchaseDoc",
              this
            );
            oView.addDependent(this._oDialogDocTy);
          }
  
          if (this.selectedTransmission === "N : 1") {
            this._oDialogDocTy.setMultiSelect(true);
          } else {
            this._oDialogDocTy.setMultiSelect(false);
          }
  
          this._oDialogDocTy.open();
        },
  
        onValueHelpDialogSearchPD: function (oEvent) {
          var sValue = oEvent.getParameter("value");
          var oFilter = new sap.ui.model.Filter(
            "DocumentNo",
            sap.ui.model.FilterOperator.Contains,
            sValue
          );
          var oBinding = oEvent.getSource().getBinding("items");
          oBinding.filter([oFilter]);
        },
  
        onValueHelpDialogClosePD: function (oEvent) {
          var aSelectedItems;
          if (this.selectedTransmission === "N : 1") {
            aSelectedItems = oEvent.getParameter("selectedItems");
  
            oEvent.getSource().getBinding("items").filter([]);
  
            if (!aSelectedItems || aSelectedItems.length === 0) {
              return;
            }
  
            if (this.purchaseDoc) {
              var aValues = aSelectedItems.map(function (oSelectedItem) {
                return oSelectedItem.getTitle();
              });
  
              aValues.forEach(
                function (sValue) {
                  this.purchaseDoc.addToken(
                    new sap.m.Token({ key: sValue, text: sValue })
                  );
                }.bind(this)
              );
            }
          } else {
            var oSelectedItem = oEvent.getParameter("selectedItem");
            oEvent.getSource().getBinding("items").filter([]);
            if (!oSelectedItem) {
              return;
            }
            if (this.purchaseDoc) {
              this.purchaseDoc.setValue(oSelectedItem.getTitle());
            }
          }
        },
  
        onLastID: function (oEvent) {
          try {
            var oTable = this.getView().byId("transportTable");
            var oItems = oTable.getItems();
  
            var usedIDs = new Set();
  
            oItems.forEach(function (oItem) {
              var currentID = parseInt(oItem.getCells()[1].getText(), 10);
              if (!isNaN(currentID)) {
                usedIDs.add(currentID);
              }
            });
  
            // Find the smallest available ID
            for (let i = 1; i <= oItems.length + 1; i++) {
              if (!usedIDs.has(i)) {
                lastID = i;
                break;
              }
            }
          } catch (error) {
            lastID = "0";
          }
        },
  
        onsaveTransmissionType: function () {
          var oView = this.getView();
  
          var salesDocInput = sap.ui.getCore().byId("salesDocSingle_Id");
          var purDocInput = sap.ui.getCore().byId("purchase_Id");
          var comboBox = sap.ui.getCore().byId("combo1_2");
  
          if (!salesDocInput) {
            console.error("Sales Document Input not found!");
            return;
          }
          if (!purDocInput) {
            console.error("Purchase Document Input not found!");
            return;
          }
          if (!comboBox) {
            console.error("ComboBox not found!");
            return;
          }
  
          var salesDocTokens = salesDocInput.getTokens();
          var salesDocValues = salesDocTokens.map(function (token) {
            return token.getText();
          });
  
          if (salesDocValues.length === 0) {
            salesDocValues.push(salesDocInput.getValue());
          }
  
          var purDocTokens = purDocInput.getTokens();
          var purDocValues = purDocTokens.map(function (token) {
            return token.getText();
          });
  
          if (purDocValues.length === 0) {
            purDocValues.push(purDocInput.getValue());
          }
  
          var selectedText = comboBox.getSelectedItem().getText();
  
          this.onLastID();
  
          let salesDoc = [];
          salesDocValues.forEach((item) => salesDoc.push(item));
  
          let purcDoc = [];
          purDocValues.forEach((item) => purcDoc.push(item));
  
          var oEntrytransData = {
            ID: parseInt(lastID, 10),
            documentType: salesDoc,
            side: purcDoc,
            exchangeType: selectedText,
          };
  
          var oModel = this.getView().getModel();
          var oBindListSPM = oModel.bindList("/TransportConfig");
          oBindListSPM.create(oEntrytransData);
  
          salesDocInput.removeAllTokens();
          purDocInput.removeAllTokens();
          salesDocInput.setValue("");
          purDocInput.setValue("");
          var oSelect = this.byId("mySelect");
          oSelect.setSelectedKey(null);
  
          comboBox.setSelectedKey("");
  
          this._oDialogtrans.close();
          this.setTransportConfigModel();
        },
  
        onConfirmDelete: function () {
          let oModel3 = this.getOwnerComponent().getModel();
          let oBindList3 = oModel3.bindList("/TransportConfig");
  
          sap.m.MessageBox.confirm(
            "Are you sure you want to delete the selected fields?",
            {
              onClose: async (sAction) => {
                if (sAction === sap.m.MessageBox.Action.OK) {
                  // Create an array of filters for each selected ID
                  let aFilters = selectedIDs.map(
                    (id) =>
                      new sap.ui.model.Filter(
                        "ID",
                        sap.ui.model.FilterOperator.EQ,
                        id
                      )
                  );
                  // Combine filters with OR operator
                  let oCombinedFilter = new sap.ui.model.Filter({
                    filters: aFilters,
                    and: false,
                  });
  
                  try {
                    let aContexts = await oBindList3
                      .filter(oCombinedFilter)
                      .requestContexts();
                    for (let i = 0; i < aContexts.length; i++) {
                      await aContexts[i].delete();
                    }
  
                    // Clear the selected IDs after deletion
                    selectedIDs = [];
  
                    // Clear the filters after deletion
                    oBindList3.filter([]);
  
                    // Refresh the model and table binding
                    await this.setTransportConfigModel();
                    oModel3.refresh();
                    this.onDelete();
                    this.getView()
                      .byId("transportTable")
                      .getBinding("items")
                      .refresh();
                  } catch (error) {
                    console.error("Error during deletion: ", error);
                  }
                }
              },
            }
          );
        },
  
        onSelectTransport: function (oEvent) {
          var oCheckbox = oEvent.getSource();
          var oBindingContext = oCheckbox.getBindingContext("transportconfig");
          if (!oBindingContext) {
            console.error(
              "Binding context is undefined. Ensure the checkbox is properly bound."
            );
            return;
          }
  
          var oModelObject = oBindingContext.getObject();
          var sID = oModelObject.ID;
  
          if (oCheckbox.getSelected()) {
            selectedIDs.push(sID);
          } else {
            var index = selectedIDs.indexOf(sID);
            if (index !== -1) {
              selectedIDs.splice(index, 1);
            }
          }
        },
  
        RefreshData: function () {
          this.getView().byId("transportTable").getBinding("items").refresh();
        },
  
        onSelectAll: function (oEvent) {
          var oTable = this.byId("transportTable");
          var oItems = oTable.getItems();
          var selectAll = oEvent.getParameter("selected");
  
          if (!selectAll) {
            selectedIDs;
          } else {
            selectedIDs = oItems.map(function (oItem) {
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
  
        onDelete: function () {
          var addAllocMap = this.byId("createTransID");
          var delAllocMap = this.byId("deleteTransID");
          var confirmDelAlloc = this.byId("deleteTransportConfirmBtn");
          var cancelDelAlloc = this.byId("cancelTransportDeleteBtn");
          var delCheckBoxAlloc = this.byId("deletetransLabel");
  
          // TOGGLE VISIBILTY
          addAllocMap.setVisible(!addAllocMap.getVisible());
          delAllocMap.setVisible(!delAllocMap.getVisible());
          confirmDelAlloc.setVisible(!confirmDelAlloc.getVisible());
          cancelDelAlloc.setVisible(!cancelDelAlloc.getVisible());
          delCheckBoxAlloc.setVisible(!delCheckBoxAlloc.getVisible());
        },
  
        onCancelTransportDeletion: function () {
          this.onDelete();
          salesDocInput.removeAllTokens();
        },
  
        formatExchangeType: function (exType) {
          switch (exType) {
            case "B/L":
              return "Borrow / Loan";
              break;
            case "B/S":
              return "Buy / Sell";
              break;
            case "TO/U":
              return "Terminalling for Others (TO)";
              break;
            default:
              return extype;
              break;
          }
        },
        formatDocType: function (aTypes) {
          return aTypes.reduce((acc, curr) => {
            if (acc) return `${acc},${curr}`;
            return `${curr}`;
          });
        },
      });
    }
  );
  