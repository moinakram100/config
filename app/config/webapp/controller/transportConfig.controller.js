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
  function (Controller,ODataModel,JSONModel,Filter,MessageBox,MessageToast,Core) {
    "use strict";
    var lastID;
    let getPurchaseDocData = [];
    var selectedIDs = [];
    var getdesData = [];
    return Controller.extend("com.ingenx.config.controller.transportConfig", {

      onInit: async function () {
        await this._onTransportConfigDataLoaded();
      },

      _onTransportConfigDataLoaded: async function () {
            const fetchData = async (model, entitySet) => {
            const bindList = model.bindList(entitySet);
            const contexts = await bindList.requestContexts(0, Infinity);
            return contexts.map((context) => context.getObject());
        };
        const updateDescriptions = (data, contractData) => {
            data.forEach((doc) => {
                const matchingContract = contractData.find(
                    (contract) => contract.Auart === doc.DocumentNo
                );
                if (matchingContract) {
                    doc.Description = matchingContract.Description;
                }
            });
        };
        const oModel = new sap.ui.model.json.JSONModel();
        this.getView().setModel(oModel, "docTCTypes");
        const oMainModel = this.getOwnerComponent().getModel();
        const documentData = await fetchData(oMainModel, "/DocumentNoProfileMapping");
        const lpData = [];
        const uniqueDocumentNos = new Set();
        documentData.forEach((doc) => {
            if (doc.DocumentDesc === "LP" && !uniqueDocumentNos.has(doc.DocumentNo)) {
                uniqueDocumentNos.add(doc.DocumentNo);
                lpData.push(doc);
            }
        });
        const contractData = await fetchData(oMainModel, "/xGMSxContractType");
        updateDescriptions(lpData, contractData);
        oModel.setData(lpData);
        const oModelPD = new sap.ui.model.json.JSONModel();
        this.getView().setModel(oModelPD, "docTCTypesPD");
        const kfData = [];
        const uniqueDocuments = new Set();
        documentData.forEach((doc) => {
            if (
                (doc.DocumentDesc === "K" || doc.DocumentDesc === "F") &&
                !uniqueDocuments.has(doc.DocumentNo)
            ) {
                uniqueDocuments.add(doc.DocumentNo);
                kfData.push(doc);
            }
        });
        updateDescriptions(kfData, contractData);
        oModelPD.setData(kfData);1
        this.setTransportConfigModel();
    },

    setTransportConfigModel: function () {
      const oTransportConfigModel = this.getOwnerComponent().getModel();
      const oTransportConfigBindList = oTransportConfigModel.bindList("/TransportConfig");
      const oTransportConfigJsonModel = new JSONModel();
      let that = this;
      let aArray = [];
      oTransportConfigBindList.requestContexts(0, Infinity).then(function (aContexts) {
              aContexts.forEach((context) => aArray.push(context.getObject()));
              console.log("Read data:", aArray)
              aArray.forEach(
                  (item) => (item.documentType = that.formatDocType(item.documentType))
              );
              oTransportConfigJsonModel.setData({ TransportConfig: aArray });
              oTransportConfigJsonModel.refresh();
              console.log("Table data:", oTransportConfigJsonModel.getData());
              that.getView().setModel(oTransportConfigJsonModel, "transportconfig");
          })
          .catch(function (error) {
              console.error("Error while fetching TransportConfig data:", error);
          });
  },
  

      onTransmissionTypeChange: function (oEvent) {
        var oSelect = oEvent.getSource();
        var sSelectedText = oSelect.getSelectedItem().getText();
        this.selectedTransmission = sSelectedText;
      },

      // method is used for opening a create transmission type dialog
      onAddNewTransType: function (oEvent) {
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
          this._oDialogtrans = sap.ui.xmlfragment("com.ingenx.config.fragments.addTransport",this);
          oView.addDependent(this._oDialogtrans);
        }
        this._oDialogtrans.open();
      },

      // method is using for refreshed the dialog data after clicked on cancel
      oncancelTransmissionType: function () {
        debugger;
        this._oDialogtrans.close();
        var salesDocInput = sap.ui.getCore().byId("salesDocSingle_Id");
        var purDocInput = sap.ui.getCore().byId("purchase_Id");
        var comboBox = sap.ui.getCore().byId("combo1_2");
        var oSelect = this.byId("transportConfig_selectTransType");
        oSelect.setSelectedKey(null);
        purDocInput.removeAllTokens();
        salesDocInput.setValue("");
        purDocInput.setValue("");
        comboBox.setSelectedKey("");
      },

      // method is used for opening a value help that is calling from addTransport fragment
      onDocType: function (oEvent) {
        this.salesDoc = oEvent.getSource();
        var oView = this.getView();
        if (!this._oDialogDoc) {
          this._oDialogDoc = sap.ui.xmlfragment("com.ingenx.config.fragments.transConfig",this);
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
        this._onCommonSearchFilter(oEvent,"DocumentNo")
      },

      _onCommonSearchFilter : function(oEvent,filterValue){
              let sValue = oEvent.getParameter("value")
              let oFilter = new sap.ui.model.Filter(
                filterValue,sap.ui.model.FilterOperator.Contains,sValue
              )
              let oBinding = oEvent.getSource().getBinding("items")
              oBinding.filter([oFilter])
      },

      // Method is used for closing the dialog and calling from transConfig dialog
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
            this.salesDoc.setValue(aSelectedItems.getTitle());
          }
        }
      },

      // used for opening the purchase doc type value help
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
        this._onCommonSearchFilter(oEvent,"DocumentNo")
      },

      // close the value help dialog
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

      onLastID:async function (oEvent) {
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

      onsaveTransmissionType:async function () {
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
        var selectedText = comboBox.getSelectedItem().getText() || "";
        await this.onLastID();
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
      try {
        var oModel = this.getView().getModel();
        var oBindListSPM = oModel.bindList("/TransportConfig");
        oBindListSPM.create(oEntrytransData, {
          success: function () {
              sap.m.MessageToast.show("Entry created successfully!");
          },
          error: function (oError) {
              sap.m.MessageBox.error("Failed to create entry. Please try again.");
          }
      });
      } catch (error) {
        console.log("Error:",error)
      }     
        salesDocInput.removeAllTokens();
        purDocInput.removeAllTokens();
        salesDocInput.setValue("");
        purDocInput.setValue("");
        var oSelect = this.byId("transportConfig_selectTransType");
        oSelect.setSelectedKey(null);
        comboBox.setSelectedKey("");
        this._oDialogtrans.close();
        this.setTransportConfigModel();
      },

   
      onConfirmDelete: function () {
        let oModel3 = this.getOwnerComponent().getModel();
        let oBindList3 = oModel3.bindList("/TransportConfig");
    
        // Check if any items are selected
        if (!selectedIDs || selectedIDs.length === 0) {
            sap.m.MessageToast.show("Please select at least one item to delete.");
            return;
        }
    
        sap.m.MessageBox.confirm(
            "Are you sure you want to delete the selected fields?",
            {
                onClose: async (sAction) => {
                    if (sAction === sap.m.MessageBox.Action.OK) {
                        let aFilters = selectedIDs.map((id) =>
                            new sap.ui.model.Filter("ID", sap.ui.model.FilterOperator.EQ, id)
                        );
                        let oCombinedFilter = new sap.ui.model.Filter({
                            filters: aFilters,
                            and: false,
                        });
    
                        try {
                            let aContexts = await oBindList3.filter(oCombinedFilter).requestContexts();
                            for (let i = 0; i < aContexts.length; i++) {
                                await aContexts[i].delete();
                            }
    
                            // Clear selected IDs after successful deletion
                            selectedIDs = [];
    
                            // Reset filters and refresh models/views
                            oBindList3.filter([]);
                            await this.setTransportConfigModel();
                            oModel3.refresh();
                            this.onDelete();
                            this.getView().byId("transportTable").getBinding("items").refresh();
                        } catch (error) {
                            console.error("Error during deletion: ", error);
                            sap.m.MessageToast.show("An error occurred while deleting the selected items.");
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

    //  formatter function
    formatDocType: function (aTypes) {
      if (aTypes && aTypes.length > 0) {
          return aTypes.reduce((acc, curr) => {
              if (acc) return `${acc},${curr}`;
              return `${curr}`;
          });
      }
      return ""; 
  },
  
    });
  }
);
