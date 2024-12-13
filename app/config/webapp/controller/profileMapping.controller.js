sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    'sap/ui/core/Fragment',
    "../model/formatter",
    "sap/ui/model/odata/v4/ODataModel",
    "sap/m/MessageBox"

],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel, Filter, Fragment, formatter, ODataModel, MessageBox) {
        "use strict";
        
        this.sModelType;
        let oView;

        return Controller.extend("com.ingenx.config.controller.profileMapping", {
            formatter: formatter,
            onInit: function () {
                oView = this.getView();
                this.sModelType = "Sales" //  default value 

            },
            onFilterSelect: function (oEvent) {
                this.sModelType = oEvent.getSource().getSelectedKey();


            },

            onAddMap: function () {



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
                    profileName: "",
                    profileDesc: ""
                };

                const tempAddDocDataPurchaseModel = new JSONModel(tempAddDocDataPurchase);

                // Set the temporary models for Sales and Purchase
                oView.setModel(tempAddDocDataSalesModel, "addDocDataModelSales");
                oView.setModel(tempAddDocDataPurchaseModel, "addDocDataModelPurchase");

                if (!this._oDialogDOCNoMapping) {
                    this._oDialogDOCNoMapping = sap.ui.xmlfragment("com.ingenx.config.fragments.addDocumentNo", this);
                    oView.addDependent(this._oDialogDOCNoMapping);
                }

                this._oDialogDOCNoMapping.open();
            },
            onDocValueHelpKF: async function () {

                try {

                    // Load and open the fragment
                    if (!this._oDialogDOCvalueHelpMapKF) {
                        this._oDialogDOCvalueHelpMapKF = sap.ui.xmlfragment("com.ingenx.config.fragments.docTypeKF", this);
                        oView.addDependent(this._oDialogDOCvalueHelpMapKF);
                    }

                    this._oDialogDOCvalueHelpMapKF.open();
                    this.sModelType = "Purchase";
                } catch (oError) {
                    // Handle errors
                    sap.m.MessageToast.show("Failed to fetch data. Please try again.");
                    console.log(oError);
                }
            },


            onValueHelpDialogPurchaseClose: function (oEvent) {
                let sDescription,
                    oSelectedItem = oEvent.getParameter("selectedItem");
                oEvent.getSource().getBinding("items").filter([]);

                if (!oSelectedItem) {
                    return;
                }

                sDescription = oSelectedItem.getTitle();
                oView.getModel("addDocDataModelPurchase").setProperty("/DocumentNo", sDescription);
                oView.getModel("addDocDataModelPurchase").setProperty("/description", oSelectedItem.getDescription());
                oView.getModel("addDocDataModelPurchase").setProperty("/DocumentNoDesc", oSelectedItem.getInfo());


            },

            onDocValueHelpLP: async function () {

                try {

                    // Load and open the fragment
                    if (!this._oDialogDOCvalueHelpMapLP) {
                        this._oDialogDOCvalueHelpMapLP = sap.ui.xmlfragment("com.ingenx.config.fragments.docTypeLP", this);
                        oView.addDependent(this._oDialogDOCvalueHelpMapLP);
                    }

                    this._oDialogDOCvalueHelpMapLP.open();
                    this.sModelType = "Sales";
                } catch (oError) {
                    // Handle errors
                    sap.m.MessageToast.show("Failed to fetch data. Please try again.");
                    console.log(oError);
                }
            },

            onValueHelpDialogSalesClose: function (oEvent) {
                // console.log("Retrieved Model Type: ", this.sModelType);

                let sDescription,
                    oSelectedItem = oEvent.getParameter("selectedItem");
                oEvent.getSource().getBinding("items").filter([]);

                if (!oSelectedItem) {
                    return;
                }

                sDescription = oSelectedItem.getTitle();
                oView.getModel("addDocDataModelSales").setProperty("/DocumentNo", sDescription);
                oView.getModel("addDocDataModelSales").setProperty("/description", oSelectedItem.getDescription());
                oView.getModel("addDocDataModelSales").setProperty("/DocumentNoDesc", oSelectedItem.getInfo());


            },

            onServiceProfileValueHelp: function () {
                console.log("Retrieved Model Type: ", this.sModelType);


                if (!this._oDialogSPvalueHelpNo) {
                    this._oDialogSPvalueHelpNo = sap.ui.xmlfragment("com.ingenx.config.fragments.serviceProfile", this);
                    oView.addDependent(this._oDialogSPvalueHelpNo);
                }

                // Set the model type to the dialog for later reference
                this._oDialogSPvalueHelpNo.data("modelType", this.sModelType);
                this._oDialogSPvalueHelpNo.open();
            },
            onServiceProfileValueHelpClose: function (oEvent) {
                let sDescription,
                    oSelectedItem = oEvent.getParameter("selectedItem");
                oEvent.getSource().getBinding("items").filter([]);

                if (!oSelectedItem) {
                    return;
                }

                sDescription = oSelectedItem.getTitle();

                let sModelType = this._oDialogSPvalueHelpNo.data("modelType");
                console.log("Model Type retrieved in close event: ", sModelType);

                if (sModelType === "Sales") {
                    oView.getModel("addDocDataModelSales").setProperty("/profileName", sDescription);
                    oView.getModel("addDocDataModelSales").setProperty("/profileDesc", oSelectedItem.getDescription());
                    oView.getModel("addDocDataModelSales").setProperty("/ID", oSelectedItem.getBindingContext().getObject().ID);
                } else if (sModelType === "Purchase") {
                    oView.getModel("addDocDataModelPurchase").setProperty("/profileName", sDescription);
                    oView.getModel("addDocDataModelPurchase").setProperty("/profileDesc", oSelectedItem.getDescription());
                    oView.getModel("addDocDataModelPurchase").setProperty("/ID", oSelectedItem.getBindingContext().getObject().ID);
                }

            },

            // Handler function for creating  sales Document profile mapping
            onsaveDocumentNoMappingSales: function () {

                this.onsaveDocumentNoMapping("Sales");

            },
            onsaveDocumentNoMappingPurchase: function () {

                this.onsaveDocumentNoMapping("Purchase");

            },

            onsaveDocumentNoMapping: function (context) {
                let that = this;

                try {
                    let oView = this.getView();
                    let currentData =
                        context === "Sales"
                            ? oView.getModel("addDocDataModelSales").getData()
                            : oView.getModel("addDocDataModelPurchase").getData();
                    let oppositeData =
                        context === "Sales"
                            ? oView.getModel("addDocDataModelPurchase").getData()
                            : oView.getModel("addDocDataModelSales").getData();

                    // Prepare the entry for Service Profile Mapping
                    let oEntryServProfMapping = {
                        DocumentNo: currentData.DocumentNo,
                        DocumentDesc: currentData.DocumentNoDesc,
                        serviceProfileName: currentData.profileName,
                        serviceProfileDesc: currentData.profileDesc,
                        description: currentData.description || "",
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

                    let oModel = this.getOwnerComponent().getModel();
                    let oBindList = oModel.bindList("/DocumentNoProfileMapping");

                    oBindList.attachEventOnce("dataReceived", function () {
                        try {
                            let existingEntries = oBindList.getContexts().map(context => context.getObject());
                            let isDuplicate = existingEntries.some(entry =>
                                entry.DocumentNo === oEntryServProfMapping.DocumentNo &&
                                entry.serviceProfileName === oEntryServProfMapping.serviceProfileName
                            );

                            if (isDuplicate) {
                                sap.m.MessageToast.show("Mapping already exists.");
                                return;
                            }

                            // Create a new entry
                            oBindList.create(oEntryServProfMapping);

                            oBindList.attachCreateCompleted((p) => {
                                try {
                                    let p1 = p.getParameters();
                                    if (p1.success) {
                                        sap.m.MessageToast.show("Service Profile Successfully Mapped.");
                                        that.RefreshData();
                                    } else {
                                        sap.m.MessageToast.show(p1.context.oModel.mMessages[""][0].message || "Error during mapping.");
                                    }
                                } catch (error) {
                                    sap.m.MessageToast.show("Error in attachCreateCompleted: " + error.message);
                                    console.log("Error in attachCreateCompleted:", error);
                                }
                            });

                            // Clear and refresh current data
                            currentData.DocumentNo = "";
                            currentData.DocumentNoDesc = "";
                            currentData.profileName = "";
                            currentData.profileDesc = "";
                            currentData.description = "";

                            if (context === "Sales") {
                                oView.getModel("addDocDataModelSales").setData(currentData);
                                oView.getModel("addDocDataModelSales").refresh();
                            } else {
                                oView.getModel("addDocDataModelPurchase").setData(currentData);
                                oView.getModel("addDocDataModelPurchase").refresh();
                            }

                            // Handle opposite data confirmation
                            if (oppositeData.DocumentNo && oppositeData.profileName) {
                                sap.m.MessageBox.confirm(
                                    `${context} data saved successfully. Do you want to save ${context === "Sales" ? "Purchase" : "Sales"} data?`,
                                    {
                                        actions: [sap.m.MessageBox.Action.OK, sap.m.MessageBox.Action.CANCEL],
                                        onClose: function (sAction) {
                                            if (sAction === sap.m.MessageBox.Action.OK) {
                                                // const oIconTabBar1 = sap.ui.getCore().byId("configProfileMap_IconTabBar");
                                                // oIconTabBar1.setSelectedKey(context === "Sales" ? "Purchase" : "Sales");
                                            } else {
                                                that._oDialogDOCNoMapping.close();
                                            }
                                        }.bind(this)
                                    }
                                );
                            } else {
                                that._oDialogDOCNoMapping.close();
                            }
                        } catch (error) {
                            sap.m.MessageToast.show("Error in dataReceived event: " + error.message);
                            console.log("Error in dataReceived event:", error);
                        }
                    });

                    // Trigger the data fetch
                    oBindList.getContexts();
                } catch (error) {
                    sap.m.MessageToast.show("Unexpected error occurred: " + error.message);
                    console.log("Error in onsaveDocumentNoMapping:", error);
                }
            },


            oncanceleNewDocumentNo: function () {
                this._oDialogDOCNoMapping.close();
            },

            onServiceProfileValueHelpDialogSearch: function (oEvent) {
                let sValue = oEvent.getParameter("value");
                let oFilter = new sap.ui.model.Filter("serviceProfileName", sap.ui.model.FilterOperator.Contains, sValue);
                let oDialog = oEvent.getSource();
                let oBinding = oDialog.getBinding("items");

                // Apply the filter
                oBinding.filter([oFilter]);

                // Attach to the "change" event to check the updated binding contexts after filtering
                oBinding.attachEventOnce("change", function () {
                    // Get the filtered items length
                    let aFilteredContexts = oBinding.aLastContexts || []; // Use cached contexts to avoid conflicts
                    console.log(aFilteredContexts.length);

                    if (aFilteredContexts.length === 0) {
                        oDialog.setNoDataText("No Service Profile Found");
                    } else {
                        oDialog.setNoDataText("Loading ...");
                    }
                });
            },

            onServiceProfileValueHelpCancel: function () {
                // this._oDialogSPvalueHelpNo.close();
            },

            // Common filter used for fagment DocTypeLP  and DoctTypeKF
            onFilterDocTypeDialog: function (oEvent) {
                let sValue = oEvent.getParameter("value");
                let oFilter = new sap.ui.model.Filter("Auart", sap.ui.model.FilterOperator.Contains, sValue);
                let oDialog = oEvent.getSource(); // Reference to the SelectDialog
                let oBinding = oDialog.getBinding("items");

                // Apply the filter
                oBinding.filter([oFilter]);

                // Attach to the "change" event to check the updated binding contexts after filtering
                oBinding.attachEventOnce("change", function () {
                    // Get the filtered items length
                    let aFilteredContexts = oBinding.aLastContexts || []; // Use cached contexts to avoid conflicts
                    console.log(aFilteredContexts.length);
                    console.log(aFilteredContexts.length);

                    if (aFilteredContexts.length === 0) {
                        oDialog.setNoDataText("No Document Found");
                    } else {
                        oDialog.setNoDataText("Loading ...");
                    }
                });
            },

            //refresh the table binding
            RefreshData: function () {
                oView.byId("tablemapping").getBinding("items").refresh();
            },

            // Hander function to senabling table checkboxe column for deletion and toggling buttons
            onDeletePressMap: function () {
                let addMap = this.byId("addMappingBtn");
                let delMap = this.byId("deleteMappingBtn");
                let conDelMap = this.byId("deleteMapConfirmBtn");
                let canDelMap = this.byId("cancelMapDeleteBtn")
                let delMapLabel = this.byId("configProfileMap_col_checkbox")

                // Toggle Visibility
                addMap.setVisible(!addMap.getVisible());
                delMap.setVisible(!delMap.getVisible());
                conDelMap.setVisible(!conDelMap.getVisible());
                canDelMap.setVisible(!canDelMap.getVisible());
                delMapLabel.setVisible(!delMapLabel.getVisible());
                let oTable = this.byId("tablemapping");
                oTable.getItems().forEach(function (oItem) {
                    let oCheckBox = oItem.getCells()[0];
                    oCheckBox.setSelected(false);
                });
            },

            onCancelMapDeletion: function () {
              
                this.onDeletePressMap();
              
            },
            onConfirmMapDeletion: async function () {
                let that = this;
                let oTable = this.byId("tablemapping");
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
                          let oBindList = oModel.bindList("/DocumentNoProfileMapping");
                          let aContexts = await oBindList.requestContexts();
        
                          for (let sPath of oSelectedItems) {
                            let oContext = aContexts.find(context => context.getPath() === sPath);
                            if (oContext) {
                              await oContext.delete("$auto");
                            }
                          }
                          sap.m.MessageToast.show("Selected Mapping deleted successfully.");
        
        
                          await that.RefreshData();
                          that.onCancelMapDeletion();
                        } catch (oError) {
                          sap.m.MessageToast.show("Error occurred while deleting path(s).");
                          console.log("Deletion Error:", oError);
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

          

        });
    });
