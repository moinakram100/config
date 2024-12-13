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
        let lastID;
        let initialDeleteArray = {
            ID: [],
            Name: []
        };
        let validateNewParameter;
        let proParameters;
        let parametersCount;
        let oView;
 
        return Controller.extend("com.ingenx.config.controller.createParameter", {
            onInit: function () {
                oView = this.getView();
               
            },
            onCreate: function () {
                this.usedNameAndDesc();
                oView = this.getView();
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
                if (!this._configServiceParameter_oDialog) {
                    this._configServiceParameter_oDialog = sap.ui.xmlfragment("com.ingenx.config.fragments.addServiceParameter", this);
                    oView.addDependent(this._configServiceParameter_oDialog);
                }
                this._configServiceParameter_oDialog.open();
            },

            onComboBoxChange: function (oEvent) {
                let selectedKey = oEvent.getParameter("selectedItem").getKey();
                oView.getModel("addParameterModel").setProperty("/selectedFieldType", selectedKey);
                oView.getModel("addParameterModel").setProperty("/fieldLength", "");
                if (selectedKey !== 'List') {
                    oView.getModel("addParameterModel").setProperty("/listValues", []);
                }
                
            },
 
            oncancelNewParameter: function () {
                this._configServiceParameter_oDialog.close();
            },

            inputHandler: function(oEvent) {
                let oInput = oEvent.getSource();
                let sValue = oInput.getValue();           
                let sValidatedValue = sValue.replace(/[^a-zA-Z0-9\-_+\.\/ ]/g, '');           
                let capitalizeWords = function(value) {
                    return value.replace(/\b\w/g, function(char) {
                        return char.toUpperCase();
                    });
                };
                let sCapitalizedValue = capitalizeWords(sValidatedValue);
                oInput.setValue(sCapitalizedValue);
              },  

              onStringLengthChange: function(oEvent) {
                let oInput = oEvent.getSource();
                let iValue = parseInt(oInput.getValue(), 10);               
                if (iValue > 30) {
                    sap.m.MessageToast.show("The maximum allowed value is 30.");
                    oInput.setValue(30);
                }
            },
 
            onAddListItem: function () {
    
                let listValues = oView.getModel("addParameterModel").getProperty("/listValues");
                listValues.push({ value: "" });
                oView.getModel("addParameterModel").setProperty("/listValues", listValues);
            },
 
            //  Handler function to determine the next available smallest unused ID
            onLastID: function (oEvent) {
                try {
                    let oTable = this.getView().byId("parameterTable");
                    let oItems = oTable.getItems();
 
                    let usedIDs = new Set();
 
                    oItems.forEach(function (oItem) {
                        let currentID = parseInt(oItem.getCells()[1].getText(), 10);
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
            // function to determine already Used name and description for validating before creating new parameter
            usedNameAndDesc: function () {
                let that = this;
 
                let loadDataPromise = new Promise(function (resolve, reject) {
                    let usedParameterDataModel = new sap.ui.model.json.JSONModel();
                    that.getView().setModel(usedParameterDataModel, "usedParameterDataModel");
                    let oModel = that.getOwnerComponent().getModel();
                    let oBindList = oModel.bindList("/serviceParametersItems");
                    oBindList.requestContexts(0, Infinity).then(function (aContexts) {
                        proParameters = [];
                        aContexts.forEach(function (oContext) {
                            proParameters.push(oContext.getObject());
                        });
                        usedParameterDataModel.setData(proParameters);
                        let usedParameterModelData = oView.getModel("usedParameterDataModel").getData();
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
            reusableMessageToast : function ( msg ){
                sap.m.MessageToast.show( msg , {
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
            },
 
           // Handler function to  create new service parameter
            onsaveNewParameter: function () {
              
                let oModels = oView.getModel("addParameterModel");
                let addServicedata = this.getView().getModel("addParameterModel").getData();
                let listValues = oModels.getProperty("/listValues");
                let fieldLength = null;
                if (addServicedata.fieldLength) {
                    fieldLength = parseInt(addServicedata.fieldLength)
                } else {
                     fieldLength = 0;
                }
                // Handler Function to calculate last created ID
                this.onLastID();
 
                let oEntryDataServiceParameterMapping = {
                    ID: parseInt(lastID, 10),
                    serviceParameter: addServicedata.fieldName.trim(),
                    serviceParameterDesc: addServicedata.fieldDesc.trim(),
                    serviceParameterType: addServicedata.selectedFieldType,
                    serviceParameterlength: fieldLength,
                    List: listValues.map(item => item.value),
                    Level: "",
                };
 
                if (oEntryDataServiceParameterMapping.serviceParameter === '' || oEntryDataServiceParameterMapping.serviceParameterDesc === '') {
                   this.reusableMessageToast( "Input fields cannot be blank.");
                    console.log("serviceParameter or serviceParameterDesc cannot be null");
                    return;
                } else {
                    let isDuplicateParameter = validateNewParameter.some(function (entry) {
                        return entry.serviceParameter.toLowerCase() === oEntryDataServiceParameterMapping.serviceParameter.toLowerCase() || entry.serviceParameterDesc.toLowerCase() === oEntryDataServiceParameterMapping.serviceParameterDesc.toLowerCase();
                    });
 
                    if (isDuplicateParameter) {
                        this.reusableMessageToast( "Parameter or Description already exists.");
                        console.log("Duplicate serviceParameter or serviceParameterDesc found");
                        return;
                    } else {
                        validateNewParameter.push(oEntryDataServiceParameterMapping);
                        console.log("Entry added successfully");
                    }
                }
 
                try {
                    let oModel = oView.getModel();
                    let oBindListSPM = oModel.bindList("/serviceParametersItems");
                
                    // Create entry in the service parameters
                    oBindListSPM.create(oEntryDataServiceParameterMapping);
                
                    // Attach event listener for create completion
                    oBindListSPM.attachCreateCompleted((p) => {
                        let p1 = p.getParameters();
                        if (p1.success) {
                            sap.m.MessageToast.show("Service Parameter Successfully created.");
                        } else {
                            sap.m.MessageToast.show(p1.context.oModel.mMessages[""][0].message);
                        }
                    });
                } catch (error) {
                    sap.m.MessageToast.show("An error occurred while creating the service parameter.");
                    console.error(error.message);
                }
                
                parametersCount++
                this._configServiceParameter_oDialog.close();
                this.RefreshData();
            },
 
            // Refreshing  Table  Binding
 
            RefreshData: function () {
                oView.byId("parameterTable").getBinding("items").refresh();
            },
 
            // function  on press of Delete button
 
            onDeletePressToggle: function () {
                let createParam = this.byId("createParameterBtn");
                let oDeleteLabel = this.byId("deleteLabel");
                let oDeleteCheckBox = this.byId("ServiceParameter_deleteCheckBox");
                let confirmDelete = this.byId("deleteConfirmBtn")
                let deleteParamBtn = this.byId("deleteParameterBtn")
                let cancelBtn = this.byId("cancelDeleteBtn")
 
                // Toggle Visibility
                createParam.setVisible(!createParam.getVisible());
                oDeleteLabel.setVisible(!oDeleteLabel.getVisible());
                oDeleteCheckBox.setVisible(!oDeleteCheckBox.getVisible());
                confirmDelete.setVisible(!confirmDelete.getVisible());
                deleteParamBtn.setVisible(!deleteParamBtn.getVisible());
                cancelBtn.setVisible(!cancelBtn.getVisible());
            },
 
            onCancelDeletion: function () {
                this.onDeletePressToggle();
                this.onResetCheckBox();
                this.onNullSelectedParameters();
            },
 
            onNullSelectedParameters: function () {
                initialDeleteArray = {
                    ID: [],
                    Name: []
                };
            },
            onResetCheckBox: function () {
                let selectedItems = initialDeleteArray.ID;
                let oTable = this.byId("parameterTable");
                let oItems = oTable.getItems();
                oView.byId("selectAll").setSelected(false);
 
                selectedItems.forEach(function (itemId) {
                    oItems.forEach(function (oItem) {
                        let sRowId = oItem.getCells()[1].getText();
 
                        if (sRowId === itemId) {
                            oItem.getCells()[0].setSelected(false);
                        }
                    });
                });
            },
 
            onSelectAllCheckBoxes: function (oEvent) {
                let oTable = this.byId("parameterTable");
                let oItems = oTable.getItems();
                let selectAll = oEvent.getParameter("selected");

                console.log("slall", selectAll)
                console.log("initialProDeleteArray",initialDeleteArray);

                if (!selectAll) {
                    initialDeleteArray.ID = [];
                    initialDeleteArray.Name = [];
                }
            
                for (let i = 0; i < oItems.length; i++) {
                    let oItem = oItems[i];
                    let oCheckBox = oItem.getCells()[0];
                    let sID = oItem.getCells()[1].getText();
                    let sName = oItem.getCells()[3].getText();
 
                    if (oCheckBox instanceof sap.m.CheckBox) {
                        oCheckBox.setSelected(selectAll);
 
                        if (selectAll && oCheckBox.getSelected()) {
                            initialDeleteArray.ID.push(sID);
                            initialDeleteArray.Name.push(sName);
                        }
                    }
                }
            },
 
            onSelectCheckBox: function (oEvent) {
                let selectedParameters = oEvent.getSource().getParent().getAggregation("cells");
 
                for (let i = 0; i < selectedParameters.length; i++) {
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
                            let index = initialDeleteArray.ID.indexOf(parameters);
                            if (index !== -1) {
                                initialDeleteArray.ID.splice(index, 1);
                                initialDeleteArray.Name.splice(index, 1);
                            }
                        }
                    }
                }

                 // handling select all checkbox  toggle
                 let selectAllCheckbox = this.byId("selectAll");
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
 
           // Handler function to  take final confirmation  of user before deleting
            onConfirmDeletion: function () {
                let unfilteredItems = initialDeleteArray.ID;
                let selectedItems = Array.from(new Set(unfilteredItems));
 
                if (selectedItems.length > 0) {
                    sap.m.MessageBox.confirm("Are you sure you want to delete the selected parameters?", {
                        title: "Confirmation",
                        onClose: function (oAction) {
                            if (oAction === sap.m.MessageBox.Action.OK) {
                                let oTable = this.byId("parameterTable");
                                let oItems = oTable.getItems();
                                this.parameterVanish();
 
                                selectedItems.forEach(function (itemId) {
                                    oItems.forEach(function (oItem) {
                                        let sRowId = oItem.getCells()[1].getText();
 
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
                                sap.m.MessageToast.show("Items Successfully deleted.")
                                this.onDeletePressToggle();
                                this.onResetCheckBox();
                            } else if (oAction === sap.m.MessageBox.Action.CANCEL) {
                                this.onResetCheckBox();
                                this.onNullSelectedParameters();
                            }
                        }.bind(this)
                    });
                } else {
                    MessageBox.information("Please select at least one parameter for deletion.");
                }
               
            },
 
            // DELETE PARAMETERS FROM THE SERVICE PARAMETERS TABLE
 
            parameterVanish: function () {
                let unfilteredItems = initialDeleteArray.Name;
                let selectedItems = Array.from(new Set(unfilteredItems));
                console.log("Selected Items:", selectedItems);
            
                let oModel = oView.getModel();
 
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
 