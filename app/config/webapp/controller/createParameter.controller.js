sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    'sap/ui/core/Fragment',
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/FilterType",
    "sap/m/MessageBox",
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel, Fragment, Filter, FilterOperator, FilterType, MessageBox) {
        "use strict";
        var lastID;
        var initialDeleteArray = {
            ID: [],
            Name: []
        };
        var validateNewParameter;
        var proParameters;
        let parametersCount
 
        return Controller.extend("com.ingenx.config.controller.createParameter", {
            onInit: function () {
                var oTable = this.byId("parameterTable");
                oTable.setSticky([sap.m.Sticky.ColumnHeaders, sap.m.Sticky.HeaderToolbar]);


                  // getting count of entries
                  let oModel2 = this.getOwnerComponent().getModel();
                  let oBindListSPM = oModel2.bindList("/serviceParametersItems");
              
                  // Get the total count of all entries
                  oBindListSPM.requestContexts().then(function(aContexts) {
                      parametersCount = aContexts.length;
                      console.log("Total number of entries:", parametersCount);
                  });
            },
            onCreate: function () {
                this.usedNameAndDesc();
                var oView = this.getView();
                const addServiceData = {
                    fieldName: "",
                    fieldDesc: "",
                    selectedFieldType: "String",
                    fieldLength: "",
                    fieldTypeList: [
                        { key: "String", text: "String" },
                        { key: "Integer", text: "Integer" },
                        { key: "Boolean", text: "Boolean" },
                        { key: "Decimal", text: "Decimal" },
                        { key: "Date", text: "Date" },
                        { key: "Date and Time", text: "Date and Time" },
                        { key: "Table", text: "Table" },
                        { key: "Quantity", text: "Quantity" },
                        { key: "List", text: "List" }
                    ],
                    listValues: []
                };
                const addParameterModel = new JSONModel(addServiceData);
                oView.setModel(addParameterModel, "addParameterModel");
                if (!this._oDialogItem) {
                    this._oDialogItem = sap.ui.xmlfragment("com.ingenx.config.fragments.addServiceParameter", this);
                    oView.addDependent(this._oDialogItem);
                }
                this._oDialogItem.open();
            },

            onComboBoxChange: function (oEvent) {
                var selectedKey = oEvent.getParameter("selectedItem").getKey();
                var oView = this.getView();
                oView.getModel("addParameterModel").setProperty("/selectedFieldType", selectedKey);
                oView.getModel("addParameterModel").setProperty("/fieldLength", "");
                if (selectedKey !== 'List') {
                    oView.getModel("addParameterModel").setProperty("/listValues", []);
                }
                
            },
 
            oncancelNewParameter: function () {
                this._oDialogItem.close();
            },

            inputHandler: function(oEvent) {
                var oInput = oEvent.getSource();
                var sValue = oInput.getValue();           
                var sValidatedValue = sValue.replace(/[^a-zA-Z0-9\-_+\.\/ ]/g, '');           
                var capitalizeWords = function(value) {
                    return value.replace(/\b\w/g, function(char) {
                        return char.toUpperCase();
                    });
                };
                var sCapitalizedValue = capitalizeWords(sValidatedValue);
                oInput.setValue(sCapitalizedValue);
              },  

              onStringLengthChange: function(oEvent) {
                var oInput = oEvent.getSource();
                var iValue = parseInt(oInput.getValue(), 10);               
                if (iValue > 30) {
                    sap.m.MessageToast.show("The maximum allowed value is 30.");
                    oInput.setValue(30);
                }
            },
 
            onAddListItem: function () {
                var oView = this.getView();
                var listValues = oView.getModel("addParameterModel").getProperty("/listValues");
                listValues.push({ value: "" });
                oView.getModel("addParameterModel").setProperty("/listValues", listValues);
            },
 
            // LAST ID
            onLastID: function (oEvent) {
                try {
                    var oTable = this.getView().byId("parameterTable");
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
 
                console.log("Next Available ID:", lastID);
            },

            onFieldNameChange: function(oEvent) {
                var oInput = oEvent.getSource();
                var sValue = oInput.getValue();
                
                // Regular expression to allow only alphanumeric characters, dots, dashes, and spaces
                var sValidatedValue = sValue.replace(/[^a-zA-Z0-9 .-]/g, '');
                
                // Automatically capitalize the entire string
                var sCapitalizedValue = sValidatedValue.toUpperCase();
                
                // Set the corrected and capitalized value back to the input field
                oInput.setValue(sCapitalizedValue);
            
            },  
 
            usedNameAndDesc: function () {
                var that = this;
 
                var loadDataPromise = new Promise(function (resolve, reject) {
                    var usedParameterDataModel = new sap.ui.model.json.JSONModel();
                    that.getView().setModel(usedParameterDataModel, "usedParameterDataModel");
                    let oModel = that.getOwnerComponent().getModel();
                    let oBindList = oModel.bindList("/serviceParametersItems");
                    oBindList.requestContexts(0, Infinity).then(function (aContexts) {
                        proParameters = [];
                        aContexts.forEach(function (oContext) {
                            proParameters.push(oContext.getObject());
                        });
                        usedParameterDataModel.setData(proParameters);
                        var usedParameterModelData = that.getView().getModel("usedParameterDataModel").getData();
                        validateNewParameter = usedParameterModelData.map(function (obj) {
                            return {
                                ID: obj.ID,
                                serviceParameter: obj.serviceParameter,
                                serviceParameterDesc: obj.serviceParameterDesc
                            };
                        });
                        console.log("Validate New Parameter", validateNewParameter);
                        resolve(proParameters);
                    });
                });
            },
 
 
            onsaveNewParameter: function () {
                var oView = this.getView();
                var oModels = oView.getModel("addParameterModel");
                var addServicedata = this.getView().getModel("addParameterModel").getData();
                var listValues = oModels.getProperty("/listValues");
                if (addServicedata.fieldLength) {
                    var fieldLength = parseInt(addServicedata.fieldLength)
                } else {
                    var fieldLength = 0;
                }
 
                this.onLastID();
 
                var oEntryDataServiceParameterMapping = {
                    ID: parseInt(lastID, 10),
                    serviceParameter: addServicedata.fieldName.trim(),
                    serviceParameterDesc: addServicedata.fieldDesc.trim(),
                    serviceParameterType: addServicedata.selectedFieldType,
                    serviceParameterlength: fieldLength,
                    List: listValues.map(item => item.value),
                    Level: "",
                };
 
                if (oEntryDataServiceParameterMapping.serviceParameter === '' || oEntryDataServiceParameterMapping.serviceParameterDesc === '') {
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
                    console.log("serviceParameter or serviceParameterDesc cannot be null");
                    return;
                } else {
                    var isDuplicateParameter = validateNewParameter.some(function (entry) {
                        return entry.serviceParameter.toLowerCase() === oEntryDataServiceParameterMapping.serviceParameter.toLowerCase() || entry.serviceParameterDesc.toLowerCase() === oEntryDataServiceParameterMapping.serviceParameterDesc.toLowerCase();
                    });
 
                    if (isDuplicateParameter) {
                        sap.m.MessageToast.show("Parameter or Description already exists.", {
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
                        console.log("Duplicate serviceParameter or serviceParameterDesc found");
                        return;
                    } else {
                        validateNewParameter.push(oEntryDataServiceParameterMapping);
                        console.log("Entry added successfully");
                    }
                }
 
 
                let oModel = this.getView().getModel();
                let oBindListSPM = oModel.bindList("/serviceParametersItems");
                oBindListSPM.create(oEntryDataServiceParameterMapping);
                parametersCount++
                this._oDialogItem.close();
                this.RefreshData();
            },
 
            // REFRESH
 
            RefreshData: function () {
                this.getView().byId("parameterTable").getBinding("items").refresh();
            },
 
            // BUTTONS
 
            onDelete: function () {
                var createParam = this.byId("createParameterBtn");
                var oDeleteLabel = this.byId("deleteLabel");
                var oDeleteCheckBox = this.byId("deleteCheckBox");
                var confirmDelete = this.byId("deleteConfirmBtn")
                var deleteParamBtn = this.byId("deleteParameterBtn")
                var cancelBtn = this.byId("cancelDeleteBtn")
 
                // Toggle Visibility
                createParam.setVisible(!createParam.getVisible());
                oDeleteLabel.setVisible(!oDeleteLabel.getVisible());
                oDeleteCheckBox.setVisible(!oDeleteCheckBox.getVisible());
                confirmDelete.setVisible(!confirmDelete.getVisible());
                deleteParamBtn.setVisible(!deleteParamBtn.getVisible());
                cancelBtn.setVisible(!cancelBtn.getVisible());
            },
 
            onCancelDeletion: function () {
                this.onDelete();
                this.onRCheckBox();
                this.onNullSelectedParameters();
            },
 
            onNullSelectedParameters: function () {
                initialDeleteArray = {
                    ID: [],
                    Name: []
                };
            },
 
            onRCheckBox: function () {
                var selectedItems = initialDeleteArray.ID;
                var oTable = this.byId("parameterTable");
                var oItems = oTable.getItems();
                this.getView().byId("selectAll").setSelected(false);
 
                selectedItems.forEach(function (itemId) {
                    oItems.forEach(function (oItem) {
                        var sRowId = oItem.getCells()[1].getText();
 
                        if (sRowId === itemId) {
                            oItem.getCells()[0].setSelected(false);
                        }
                    });
                });
            },
 
            onSelectAll: function (oEvent) {
                var oTable = this.byId("parameterTable");
                var oItems = oTable.getItems();
                var selectAll = oEvent.getParameter("selected");

                console.log("slall", selectAll)
                console.log("initialProDeleteArray",initialDeleteArray)
                

                if (!selectAll) {
                    initialDeleteArray.ID = [];
                    initialDeleteArray.Name = [];
                }

            
                for (var i = 0; i < oItems.length; i++) {
                    var oItem = oItems[i];
                    var oCheckBox = oItem.getCells()[0];
                    var sID = oItem.getCells()[1].getText();
                    var sName = oItem.getCells()[3].getText();
 
                    if (oCheckBox instanceof sap.m.CheckBox) {
                        oCheckBox.setSelected(selectAll);
 
                        if (selectAll && oCheckBox.getSelected()) {
                            initialDeleteArray.ID.push(sID);
                            initialDeleteArray.Name.push(sName);
                        }
                    }
                }
            },
 
 
            onDeleteArray: function (oEvent) {
                var selectedParameters = oEvent.getSource().getParent().getAggregation("cells");
 
                for (var i = 0; i < selectedParameters.length; i++) {
                    if (i === 0) {
                        let checkbox = selectedParameters[i];
                        let parameters = selectedParameters[i + 1].getProperty("text");
                        let parameterName = selectedParameters[i + 3].getProperty("text");
 
                        if (checkbox.getSelected()) {
                            if (initialDeleteArray.ID.indexOf(parameters) === -1) {
                                initialDeleteArray.ID.push(parameters);
                                initialDeleteArray.Name.push(parameterName);
                            }
                        } else {
                            var index = initialDeleteArray.ID.indexOf(parameters);
                            if (index !== -1) {
                                initialDeleteArray.ID.splice(index, 1);
                                initialDeleteArray.Name.splice(index, 1);
                            }
                        }
                    }
                }

                 // handling select all checkbox  toggel
                 var selectAllCheckbox = this.byId("selectAll");
                 console.log("parametersCount",parametersCount)
                 console.log("initialDeleteArray",initialDeleteArray.ID.length)
                 if (parametersCount !== initialDeleteArray.ID.length) {
                     if (selectAllCheckbox.getSelected()) {
                        selectAllCheckbox.setSelected(false)
                     }
                 }
                 else {
                    selectAllCheckbox.setSelected(true)
                     console.log("i'm here")
                 }
                 
                console.log("Initial deleteArray ID:", initialDeleteArray.ID);
                console.log("Initial deleteArray Name:", initialDeleteArray.Name);
                this.RefreshData();
            },
 
 
            onConfirmDeletion: function () {
                var unfilteredItems = initialDeleteArray.ID;
                var selectedItems = Array.from(new Set(unfilteredItems));
 
                if (selectedItems.length > 0) {
                    sap.m.MessageBox.confirm("Are you sure you want to delete the selected parameters?", {
                        title: "Confirmation",
                        onClose: function (oAction) {
                            if (oAction === sap.m.MessageBox.Action.OK) {
                                var oTable = this.byId("parameterTable");
                                var oItems = oTable.getItems();
                                this.parameterVanish();
 
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
                                this.onRCheckBox();
                                this.onNullSelectedParameters();
                            }
                        }.bind(this)
                    });
                } else {
                    MessageBox.information("Please select at least one parameter for deletion.");
                }
                this.onDelete();
                this.onRCheckBox();
            },
 
            // DELETE PARAMETERS FROM THE PROFILE PARAMETERS TABLE
 
            parameterVanish: function () {
                var unfilteredItems = initialDeleteArray.Name;
                var selectedItems = Array.from(new Set(unfilteredItems));
                console.log("Selected Items:", selectedItems);
                var that = this;
                let oModel = that.getView().getModel();
 
                selectedItems.forEach(function (parameter) {
                    let oBindList = oModel.bindList("/serviceProfileParametersItems");
                    let aFilter = new sap.ui.model.Filter("serviceParameter", sap.ui.model.FilterOperator.EQ, parameter);
 
                    oBindList.filter(aFilter).requestContexts().then(function (aContexts) {
                        aContexts.forEach(function (context) {
                            context.delete();
                            parametersCount--
                        });
                    });
                });
                this.onNullSelectedParameters();
            },
        });
    });
 