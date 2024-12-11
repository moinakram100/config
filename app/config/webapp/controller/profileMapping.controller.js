sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    'sap/ui/core/Fragment',
    "../model/formatter",
    "sap/ui/model/odata/v4/ODataModel",
    
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel, Filter, Fragment, formatter, ODataModel) {
        "use strict";
        var lastMapID;
        var initialDelMapArray = {
            ID: []
        };
        var validateNewMapping;
        var proMapping;
        var docTypeArray = [];
        let profileMapCount ;
        // count of total entries
        this.sModelType = "";

        return Controller.extend("com.ingenx.config.controller.profileMapping", {
            formatter: formatter,
            onInit: function () {
                let oModel = this.getOwnerComponent().getModel();
                var oData = oModel.bindList("/xGMSxContractType");
                oData.requestContexts(0, Infinity).then(function (aContexts) {
                docTypeArray = [];
                aContexts.forEach(function (oContext) {
                    docTypeArray.push(oContext.getObject());
                });
                })

                 // getting count of entries
                 let oModel2 = this.getOwnerComponent().getModel();
                 let oBindListSPM = oModel2.bindList("/DocumentNoProfileMapping");
             
                 // Get the total count of all entries
                 oBindListSPM.requestContexts().then(function(aContexts) {
                    profileMapCount = aContexts.length;
                     console.log("Total number of entries:", profileMapCount);
                 });

                
 
            },

             // shruti code
            
            

            

             onAddMap: function () {
                this.usedMappingAndDesc();
    
                // Create temporary data models for Sales and Purchase
                const tempAddDocDataSales = {
                    DocumentNo: "",
                    DocumentNoDesc: "",
                    ID: "",
                    profileName: "",
                    profileDesc: ""
                };
    
                const tempAddDocDataSalesModel = new JSONModel(tempAddDocDataSales);
                const tempAddDocDataPurchase = {
                    DocumentNo: "",
                    DocumentNoDesc: "",
                    ID: "",
                    profileName: "",
                    profileDesc: ""
                };
    
                const tempAddDocDataPurchaseModel = new JSONModel(tempAddDocDataPurchase);
    
                var oView = this.getView();
                // Set the temporary models for Sales and Purchase
                oView.setModel(tempAddDocDataSalesModel, "addDocDataModelSales");
                oView.setModel(tempAddDocDataPurchaseModel, "addDocDataModelPurchase");
    
                if (!this._oDialogDOCNoMapping) {
                    this._oDialogDOCNoMapping = sap.ui.xmlfragment("com.ingenx.config.fragments.addDocumentNo", this);
                    oView.addDependent(this._oDialogDOCNoMapping);
                }
    
                this._oDialogDOCNoMapping.open();
            },
             onDocValueHelpKF:function(){
                var oView = this.getView();
                if (!this._oDialogDOCvalueHelpMapKF) {
                    this._oDialogDOCvalueHelpMapKF = sap.ui.xmlfragment("com.ingenx.config.fragments.docTypeKF", this);
                    oView.addDependent(this._oDialogDOCvalueHelpMapKF);
                }
                var docTypeKFArray=docTypeArray.filter(function (obj) {
                    return (obj.Kopgr === "K" || obj.Kopgr === "F" );
                });
                var doctypeKFmodel = new sap.ui.model.json.JSONModel(docTypeKFArray);
                oView.setModel(doctypeKFmodel, "doctypeKFmodel");
                this._oDialogDOCvalueHelpMapKF.open();
               this.sModelType = "Purchase"

            },
             onValueHelpDialogPurchaseClose: function (oEvent) {
                var sDescription,
                    oSelectedItem = oEvent.getParameter("selectedItem");
                oEvent.getSource().getBinding("items").filter([]);
 
                if (!oSelectedItem) {
                    return;
                }
 
                sDescription = oSelectedItem.getTitle();
                this.getView().getModel("addDocDataModelPurchase").setProperty("/DocumentNo", sDescription);
                this.getView().getModel("addDocDataModelPurchase").setProperty("/description", oSelectedItem.getDescription());
                this.getView().getModel("addDocDataModelPurchase").setProperty("/DocumentNoDesc", oSelectedItem.getInfo());
                this._oDialogDOCvalueHelpMap.close();
              
            },
            onDocValueHelpLP:function(){
                var oView = this.getView();

                if (!this._oDialogDOCvalueHelpMapLP) {
                    this._oDialogDOCvalueHelpMapLP = sap.ui.xmlfragment("com.ingenx.config.fragments.docTypeLP", this);
                    oView.addDependent(this._oDialogDOCvalueHelpMapLP);
                }
                var docTypeLPArray=docTypeArray.filter(function (obj) {
                    return obj.Kopgr === "LP" ;
                });
                var doctypeLPmodel = new sap.ui.model.json.JSONModel(docTypeLPArray);
                oView.setModel(doctypeLPmodel, "doctypeLPmodel");
                this._oDialogDOCvalueHelpMapLP.open();
                this.sModelType = "Sales"; 
               
              
            },
            onValueHelpDialogSalesClose: function (oEvent) {
                  console.log("Retrieved Model Type: ", this.sModelType);
                 
                var sDescription,
                    oSelectedItem = oEvent.getParameter("selectedItem");
                oEvent.getSource().getBinding("items").filter([]);
 
                if (!oSelectedItem) {
                    return;
                }
 
                sDescription = oSelectedItem.getTitle();
                this.getView().getModel("addDocDataModelSales").setProperty("/DocumentNo", sDescription);
                this.getView().getModel("addDocDataModelSales").setProperty("/description", oSelectedItem.getDescription());
                this.getView().getModel("addDocDataModelSales").setProperty("/DocumentNoDesc", oSelectedItem.getInfo());
                this._oDialogDOCvalueHelpMap.close();
            
               
            },
           
    
           
    
           
            onServiceProfileValueHelp: function () { 
                console.log("Retrieved Model Type: ", this.sModelType);
                

                var oView = this.getView();
                if (!this._oDialogSPvalueHelpNo) {
                    this._oDialogSPvalueHelpNo = sap.ui.xmlfragment("com.ingenx.config.fragments.serviceProfile", this);
                    oView.addDependent(this._oDialogSPvalueHelpNo);
                }
            
                // Set the model type to the dialog for later reference
                this._oDialogSPvalueHelpNo.data("modelType",  this.sModelType);
                this._oDialogSPvalueHelpNo.open();
            },
            onServiceProfileValueHelpClose: function(oEvent) {
                var sDescription,
                    oSelectedItem = oEvent.getParameter("selectedItem");
                oEvent.getSource().getBinding("items").filter([]);
            
                if (!oSelectedItem) {
                    return;
                }
            
                sDescription = oSelectedItem.getTitle();
                
                var sModelType = this._oDialogSPvalueHelpNo.data("modelType");
                console.log("Model Type retrieved in close event: ", sModelType); 
            
                if (sModelType === "Sales") {
                    this.getView().getModel("addDocDataModelSales").setProperty("/profileName", sDescription);
                    this.getView().getModel("addDocDataModelSales").setProperty("/profileDesc", oSelectedItem.getDescription());
                    this.getView().getModel("addDocDataModelSales").setProperty("/ID", oSelectedItem.getBindingContext().getObject().ID);
                } else if (sModelType === "Purchase") {
                    this.getView().getModel("addDocDataModelPurchase").setProperty("/profileName", sDescription);
                    this.getView().getModel("addDocDataModelPurchase").setProperty("/profileDesc", oSelectedItem.getDescription());
                    this.getView().getModel("addDocDataModelPurchase").setProperty("/ID", oSelectedItem.getBindingContext().getObject().ID);
                }
            
                this._oDialogSPvalueHelpNo.close();
            },
            onsaveDocumentNoMappingSales: function () {
                this.onLastMapID();
            
                var salesData = this.getView().getModel("addDocDataModelSales").getData();
                var purchaseData = this.getView().getModel("addDocDataModelPurchase").getData();
            
                var oEntryServProfMapping = {
                    ID: parseInt(lastMapID, 10).toString(),
                    DocumentNo: salesData.DocumentNo,
                    DocumentDesc: salesData.DocumentNoDesc,
                    serviceProfileName: salesData.profileName,
                    serviceProfileDesc: salesData.profileDesc,
                    description: salesData.description || "",
                    field2: "",
                    field3: "",
                    field4: "",
                    field5: ""
                };
            
                // Validation
                if (!oEntryServProfMapping.DocumentNo || !oEntryServProfMapping.serviceProfileName) {
                    sap.m.MessageToast.show("Input fields cannot be blank.");
                    return;
                }
            
                // Duplicate Check
                var isDuplicateMapping = validateNewMapping.some(entry =>
                    entry.DocumentNo.toLowerCase() === oEntryServProfMapping.DocumentNo.toLowerCase() &&
                    entry.serviceProfileName.toLowerCase() === oEntryServProfMapping.serviceProfileName.toLowerCase()
                );
            
                if (isDuplicateMapping) {
                    sap.m.MessageToast.show("Mapping already exists.");
                    return;
                } else {
                    validateNewMapping.push(oEntryServProfMapping);
                    console.log("Entry added successfully");
                }
            
                let oModel = this.getView().getModel();
                let oBindListSP = oModel.bindList("/DocumentNoProfileMapping");
            
                try {
                    oBindListSP.create(oEntryServProfMapping);
                    profileMapCount++;
                    this.RefreshData();
            
                    // Clear the sales document fields after successful save
                    salesData.DocumentNo = "";
                    salesData.DocumentNoDesc = "";
                    salesData.profileName = "";
                    salesData.profileDesc = "";
                    salesData.description = "";
            
                    // Update the sales model to reflect the cleared values
                    this.getView().getModel("addDocDataModelSales").setData(salesData);
                    this.getView().getModel("addDocDataModelSales").refresh();
            
                    // Now check for purchase data and show the confirmation dialog
                    if (purchaseData.DocumentNo && purchaseData.profileName) {
                        sap.m.MessageBox.confirm(
                            "Sales data saved successfully. Do you want to save Purchase data?",
                            {
                                actions: [sap.m.MessageBox.Action.OK, sap.m.MessageBox.Action.CANCEL],
                                onClose: function (sAction) {
                                    if (sAction === sap.m.MessageBox.Action.OK) {
                                        // Allow the user to save purchase data
                                    } else {
                                        this._oDialogDOCNoMapping.close();
                                    }
                                }.bind(this)
                            }
                        );
                    } else {
                        // If no purchase data, just close the dialog and refresh
                        this._oDialogDOCNoMapping.close();
                        this.RefreshData();
                    }
                } catch (error) {
                    sap.m.MessageToast.show("Error saving the mapping: " + error.message);
                    console.error("Error during create operation:", error);
                }
            },
            onsaveDocumentNoMappingPurchase: function () {
                this.onLastMapID();
            
                var purchaseData = this.getView().getModel("addDocDataModelPurchase").getData();
                var salesData = this.getView().getModel("addDocDataModelSales").getData();
            
                var oEntryServProfMapping = {
                    ID: parseInt(lastMapID, 10).toString(),
                    DocumentNo: purchaseData.DocumentNo,
                    DocumentDesc: purchaseData.DocumentNoDesc,
                    serviceProfileName: purchaseData.profileName,
                    serviceProfileDesc: purchaseData.profileDesc,
                    description: purchaseData.description || "",
                    field2: "",
                    field3: "",
                    field4: "",
                    field5: ""
                };
            
                // Validation
                if (!oEntryServProfMapping.DocumentNo || !oEntryServProfMapping.serviceProfileName) {
                    sap.m.MessageToast.show("Input fields cannot be blank.");
                    return;
                }
            
                // Duplicate Check
                var isDuplicateMapping = validateNewMapping.some(entry =>
                    entry.DocumentNo.toLowerCase() === oEntryServProfMapping.DocumentNo.toLowerCase() &&
                    entry.serviceProfileName.toLowerCase() === oEntryServProfMapping.serviceProfileName.toLowerCase()
                );
            
                if (isDuplicateMapping) {
                    sap.m.MessageToast.show("Mapping already exists.");
                    return;
                } else {
                    validateNewMapping.push(oEntryServProfMapping);
                    console.log("Entry added successfully");
                }
            
                let oModel = this.getView().getModel();
                let oBindListSP = oModel.bindList("/DocumentNoProfileMapping");
            
                try {
                    oBindListSP.create(oEntryServProfMapping);
                    profileMapCount++;
                    this.RefreshData();
            
                    // Clear the purchase document fields after successful save
                    purchaseData.DocumentNo = "";
                    purchaseData.DocumentNoDesc = "";
                    purchaseData.profileName = "";
                    purchaseData.profileDesc = "";
                    purchaseData.description = "";
            
                    // Update the purchase model to reflect the cleared values
                    this.getView().getModel("addDocDataModelPurchase").setData(purchaseData);
                    this.getView().getModel("addDocDataModelPurchase").refresh();
            
                    // Check if Sales data is filled and show confirmation dialog
                    if (salesData.DocumentNo && salesData.profileName) {
                        sap.m.MessageBox.confirm(
                            "Purchase data saved successfully. Do you want to save Sales data?",
                            {
                                actions: [sap.m.MessageBox.Action.OK, sap.m.MessageBox.Action.CANCEL],
                                onClose: function (sAction) {
                                    if (sAction === sap.m.MessageBox.Action.OK) {
                                        // Keep the dialog open for the user to save sales data
                                    } else {
                                        this._oDialogDOCNoMapping.close();
                                    }
                                }.bind(this)
                            }
                        );
                    } else {
                        // If no sales data, just close the dialog and refresh
                        this._oDialogDOCNoMapping.close();
                        this.RefreshData();
                    }
                } catch (error) {
                    sap.m.MessageToast.show("Error saving the mapping: " + error.message);
                    console.error("Error during create operation:", error);
                }
            },
            
           
          
         
            
            

            
            
          
            


            // shruti code ends here
    
    
        
            
            
            
            
    
     
            
            

            usedMappingAndDesc: function () {
                var that = this;
           
                return new Promise(function (resolve, reject) {
                    var usedMappingData = new sap.ui.model.json.JSONModel();
                    var usedMappingDataModel = new sap.ui.model.json.JSONModel();
                    that.getView().setModel(usedMappingDataModel, "usedMappingDataModel");
                    let oModel = that.getOwnerComponent().getModel();
                    let oBindList = oModel.bindList("/DocumentNoProfileMapping");
           
                    oBindList.requestContexts(0,Infinity).then(function (aContexts){
                        proMapping=[];
                        aContexts.forEach(function (oContext) {
                            proMapping.push(oContext.getObject());
                        });
                        usedMappingDataModel.setData(proMapping);
                        that.getView().setModel(usedMappingDataModel, "usedMappingDataModel");
                        var usedMappingModelData = that.getView().getModel("usedMappingDataModel").getData();
                        console.log(usedMappingModelData)
                        validateNewMapping = usedMappingModelData.map(function (obj) {
                            return {
                                ID: obj.ID,
                                DocumentNo: obj.DocumentNo,
                                serviceProfileName: obj.serviceProfileName
                            };
                        });
                        console.log("Validate New Mapping", validateNewMapping);
           
                        resolve(proMapping);
                        });
                        usedMappingData.attachRequestFailed(function (oError) {
                            reject(oError);
                        });
 
                    });
            },
            

            oncanceleNewDocumentNo: function () {
                this._oDialogDOCNoMapping.close();
            },
           
            onServiceProfileValueHelpDialogSearch: function (oEvent) {
                var sValue = oEvent.getParameter("value");
                var oFilter = new sap.ui.model.Filter("serviceProfileName", sap.ui.model.FilterOperator.Contains, sValue);
                oEvent.getSource().getBinding("items").filter([oFilter]);
            },
           
            onServiceProfileValueHelpCancel: function () {
                this._oDialogSPvalueHelpNo.close();
            },
 
           
 
        
 
            onValueHelpDialogSearch: function (oEvent) {
                var sValue = oEvent.getParameter("value");
                var oFilter = new sap.ui.model.Filter("Auart", sap.ui.model.FilterOperator.Contains, sValue);
                oEvent.getSource().getBinding("items").filter([oFilter]);
            },

           


            onValueHelpDialogCancel: function () {
                this._oDialogDOCvalueHelpMap.close();
            },
 
            // FETCH LAST ID USED
 
            onLastMapID: function () {
                try {
                    var oTable = this.getView().byId("tablemapping");
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
                            lastMapID = i.toString();
                            break;
                        }
                    }
                } catch (error) {
                    lastMapID = "0";
                }
 
                console.log("Next Available Mapping ID:", lastMapID);
            },  
 
           
           
 
          
            RefreshData: function () {
                this.getView().byId("tablemapping").getBinding("items").refresh();
            },
 
            // BUTTONS
 
            // DELETE
 
            onDeleteMap: function () {
                var addMap = this.byId("addMappingBtn");
                var delMap = this.byId("deleteMappingBtn");
                var conDelMap = this.byId("deleteMapConfirmBtn");
                var canDelMap = this.byId("cancelMapDeleteBtn")
                var delMapLabel = this.byId("deleteMapLabel")
 
                // Toggle Visibility
                addMap.setVisible(!addMap.getVisible());
                delMap.setVisible(!delMap.getVisible());
                conDelMap.setVisible(!conDelMap.getVisible());
                canDelMap.setVisible(!canDelMap.getVisible());
                delMapLabel.setVisible(!delMapLabel.getVisible());
            },
 
            onCancelMapDeletion: function () {
                this.onDeleteMap();
                this.onNullSelectedMapping();
                this.onUnCheckBox();
            },
 
            onNullSelectedMapping: function () {
                initialDelMapArray = {
                    ID: []
                };
            },
 
            onUnCheckBox: function () {
                var selectedItems = initialDelMapArray.ID;
                var oTable = this.byId("tablemapping");
                var oItems = oTable.getItems();
                this.getView().byId("selectAllMap").setSelected(false);
 
                selectedItems.forEach(function (itemId) {
                    oItems.forEach(function (oItem) {
                        var sRowId = oItem.getCells()[1].getText();
 
                        if (sRowId === itemId) {
                            oItem.getCells()[0].setSelected(false);
                        }
                    });
                });
            },
 
            onSelectAllMap: function (oEvent) {
                var oTable = this.byId("tablemapping");
                var oItems = oTable.getItems();
                var selectAll = oEvent.getParameter("selected");

                if (!selectAll) {
                    initialDelMapArray.ID = []
                }
 
                for (var i = 0; i < oItems.length; i++) {
                    var oItem = oItems[i];
                    var oCheckBox = oItem.getCells()[0];
                    var sID = oItem.getCells()[1].getText();
 
                    if (oCheckBox instanceof sap.m.CheckBox) {
                        oCheckBox.setSelected(selectAll);
 
                        if (selectAll && oCheckBox.getSelected()) {
                            initialDelMapArray.ID.push(sID);
                        }
                    }
                }
            },
 
            onDeleteMapArray: function (oEvent) {
                var selectedMapping = oEvent.getSource().getParent().getAggregation("cells");
 
                for (var i = 0; i < selectedMapping.length; i++) {
                    if (i === 0) {
                        let checkbox = selectedMapping[i];
                        let mapping = selectedMapping[i + 1].getProperty("text");
 
                        if (checkbox.getSelected()) {
                            if (initialDelMapArray.ID.indexOf(mapping) === -1) {
                                initialDelMapArray.ID.push(mapping);
                            }
                        } else {
                            var index = initialDelMapArray.ID.indexOf(mapping);
                            if (index !== -1) {
                                initialDelMapArray.ID.splice(index, 1);
                            }
                        }
                    }
                }
                
                // handling select all checkbox

                var selectAllCheckbox = this.byId("selectAllMap");

                if (profileMapCount !== initialDelMapArray.ID.length) {
                    if (selectAllCheckbox.getSelected()) {
                        selectAllCheckbox.setSelected(false)
                    }
                }
                else {
                    selectAllCheckbox.setSelected(true)
                    console.log("i'm here")
                }
 
                console.log("Updated deleteArray:", initialDelMapArray.ID);
                this.RefreshData();
            },
 
            onConfirmMapDeletion: function () {
                var unfilteredItems = initialDelMapArray.ID;
                var selectedItems = Array.from(new Set(unfilteredItems));
                console.log("Selected Items:", selectedItems);
 
                if (selectedItems.length > 0) {
                    sap.m.MessageBox.confirm("Are you sure you want to delete the selected document mapping?", {
                        title: "Confirmation",
                        onClose: function (oAction) {
                            if (oAction === sap.m.MessageBox.Action.OK) {
                                var oTable = this.byId("tablemapping");
                                var oItems = oTable.getItems();
 
                                selectedItems.forEach(function (itemId) {
                                    oItems.forEach(function (oItem) {
                                        var sRowId = oItem.getCells()[1].getText();
 
                                        if (sRowId === itemId) {
                                            var con = oItem.getBindingContext();
                                            console.log("Context:", con);
                                            oItem.getBindingContext().delete().then(function () {
                                                    // This code runs when the deletion is successful
                                                    // MessageBox.success("Item deleted successfully!");
                                                    profileMapCount--
                                                    // Add your custom logic here
                                                    // For example, refresh the data or update the UI
                                                    this.RefreshData();
                                                }.bind(this))
                                                .catch(function (oError) {
                                                    // This code runs when there is an error
                                                    if (!oError.canceled) {
                                                        MessageBox.error("Error during deletion: " + oError.message);
                                                    }
                                                    // You can also refresh data if necessary after error handling
                                                    this.RefreshData();
                                                }.bind(this));
                                            
                                        }
                                    });
                                });
                            } else if (oAction === sap.m.MessageBox.Action.CANCEL) {
                                this.onNullSelectedMapping();
                                this.onUnCheckBox();
                            }
                        }.bind(this)
                    });
                } else {
                    MessageBox.information("Please select at least one mapping for deletion.");
                }
                this.onDeleteMap();
                this.onNullSelectedMapping();
                this.onUnCheckBox();
            },
 
        });
    });
 