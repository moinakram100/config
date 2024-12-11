sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    'sap/ui/core/Fragment',
    "../model/formatter",
    "sap/m/MessageBox",
    "sap/ui/core/ID",
    
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller,
        JSONModel,
        Fragment,
        formatter,
        MessageBox,
        ID) {
        "use strict";
        var proParameterData;
        var proParameterModelData;
        var validateNewProfile;
        var proLastID;
        var initialProDeleteArray = {
            ID: [],
            serviceProfileName: []
        };
        var allAssociatedParameters = [];
        let proParameters;
        let proCopyParameters;
        let dataArray;
        var getModelData = []
        let profileCount // count of total entries
 
        return Controller.extend("com.ingenx.config.controller.createProfile", {
            formatter: formatter,
            onInit: function () {
                // ON INIT
 
                let oModel = new sap.ui.model.json.JSONModel();
                this.getView().setModel(oModel, "dataModel");
                let oModel3 = this.getOwnerComponent().getModel();
                let oBindList = oModel3.bindList("/DocumentNoProfileMapping");
                oBindList.requestContexts(0, Infinity).then(function (aContexts) {
                    aContexts.forEach(function (oContext) {
                        getModelData.push(oContext.getObject());
                    });
                    oModel.setData(getModelData);
                }.bind(this))
                console.log("mydata", getModelData)

               // getting count of entries
                let oModel2 = this.getOwnerComponent().getModel();
                let oBindListSPM = oModel2.bindList("/ServiceProfileMaster");
            
                // Get the total count of all entries
                oBindListSPM.requestContexts().then(function(aContexts) {
                    profileCount = aContexts.length;
                    console.log("Total number of entries:", profileCount);
                });

            },

            inputHandler: function(oEvent) {
                var oInput = oEvent.getSource();
                var sValue = oInput.getValue();
           
                // Regular expression to allow only alphanumeric characters, dots, dashes, underscores, pluses, slashes, and spaces
                var sValidatedValue = sValue.replace(/[^a-zA-Z0-9\-_+\.\/ ]/g, '');
           
                // Function to capitalize the first letter of each word
                var capitalizeWords = function(value) {
                    return value.replace(/\b\w/g, function(char) {
                        return char.toUpperCase();
                    });
                };
           
                // Capitalize every first letter of the word
                var sCapitalizedValue = capitalizeWords(sValidatedValue);
           
                // Set the corrected and capitalized value back to the input field
                oInput.setValue(sCapitalizedValue);
              },  
         


            testread: function () {
                this.getView().getModel().getServiceUrl();
                var sServiceUrl = this.getView().getModel().getServiceUrl();
 
                var oModel = new ODataModel({
                    serviceUrl: sServiceUrl,
                    synchronizationMode: "None",
                    autoExpandSelect: true,
                    operationMode: "Server",
                    groupId: "$auto"
                });
                oModel.attachRequestCompleted(function (oEvent) {
                    if (oEvent.getParameter("success")) {
                        alert('haha')
                    } else {
                        console.error("OData request failed");
                    }
                }, this);
            },
            onCreatePro: function (oEvent) {
                this.usedProNameAndDesc();
                var oView = this.getView();
                const addServiceProfileData = {
                    profileName: "",
                    profileDesc: ""
                };
                const addServiceProfileModel = new JSONModel(addServiceProfileData);
                oView.setModel(addServiceProfileModel, "addServiceProfileModel");
                if (!this._oDialogProfile) {
                    this._oDialogProfile = sap.ui.xmlfragment("com.ingenx.config.fragments.addServiceProfile", this);
                    oView.addDependent(this._oDialogProfile);
                }
                this._oDialogProfile.open();
            },
            oncancelNewProfile: function () {
                this._oDialogProfile.close();
            },

            onProfileNameChange: function(oEvent) {
                var oInput = oEvent.getSource();
                var sValue = oInput.getValue();
                var sValidatedValue = sValue.replace(/[^a-zA-Z0-9\-_+\.\/ ]/g, '');               
                var sCapitalizedValue = sValidatedValue.toUpperCase();               
                oInput.setValue(sCapitalizedValue);
            },    
 


            ProfileNameChange: function(oEvent) {
                var oInput = oEvent.getSource();
                var sValue = oInput.getValue();
                
                // Regular expression to allow only alphanumeric characters, dots, dashes, and spaces
                var sValidatedValue = sValue.replace(/[^a-zA-Z0-9 .-]/g, '');
                
                // Automatically capitalize the entire string
                var sCapitalizedValue = sValidatedValue.toUpperCase();
                
                // Set the corrected and capitalized value back to the input field
                oInput.setValue(sCapitalizedValue);
            
            },    

        // copy form

            onCopyForm: function() {
                this.usedProNameAndDesc();
                var oView = this.getView();
                const addServiceProfileData = {
                    profileName: "",
                    profileDesc: ""
                };

                const addServiceProfileModel = new JSONModel(addServiceProfileData);
                oView.setModel(addServiceProfileModel, "addServiceProfileModel");
                if (!this._oDialogCopy) {
                    this._oDialogCopy = sap.ui.xmlfragment("com.ingenx.config.fragments.copyServiceProfile", this);
                    oView.addDependent(this._oDialogCopy);
                }
                this._oDialogCopy.open();
            },

            onCancelCopy: function () {
                this._oDialogCopy.close();
            },

            onSaveCopy: function () {
                var addServiceProfileData = this.getView().getModel("addServiceProfileModel").getData();
                this.onProLastID();
                console.log("addServiceProfileData",addServiceProfileData)
                var oEntryDataServiceProfile = {
                    ID: parseInt(proLastID, 10),
                    serviceProfileName: addServiceProfileData.profileName.trim(),
                    serviceProfileDesc: addServiceProfileData.profileDesc.trim(),
                    field1: "",
                    field2: "",
                    field3: "",
                    field4: "",
                    field5: ""
                };
 
                if (oEntryDataServiceProfile.serviceProfileName === '' || oEntryDataServiceProfile.serviceProfileDesc === '') {
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
                    console.log("Profile or Description cannot be null");
                    return;
                } else {
 
                    var isDuplicateProfile = validateNewProfile.some(function (entry) {
                        return (
                            entry.serviceProfileName.toLowerCase() === oEntryDataServiceProfile.serviceProfileName.toLowerCase() || entry.serviceProfileDesc.toLowerCase() === oEntryDataServiceProfile.serviceProfileDesc.toLowerCase()
                            // entry.serviceProfileName === oEntryDataServiceProfile.serviceProfileName ||
                        );
                    });
 
                    if (isDuplicateProfile) {
                        sap.m.MessageToast.show("Profile or Description already exists.", {
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
                        console.log("Duplicate Profile found");
                        return;
                    } else {
                        validateNewProfile.push(oEntryDataServiceProfile);
                        console.log("Entry added successfully");
                    }
                }
 
                let oModel = this.getView().getModel();
                let oBindListSP = oModel.bindList("/ServiceProfileMaster");
                oBindListSP.create(oEntryDataServiceProfile);
                profileCount++
                this.loadProParameter();
                this._oDialogCopy

                this._oDialogCopy.close();
                this.RefreshData();
            },

            loadProParameter: function() {
                var oSelect = sap.ui.getCore().byId("selectProfileToCopy");      
                // Get the selected item (ListItem)
                var oSelectedItem = oSelect.getSelectedItem();
                var sID, sProfileName;
                if (oSelectedItem) {
                    // Get the key (ID) and text (serviceProfileName) from the selected item
                    sID = oSelectedItem.getKey();  // ID of the selected profile
                    sProfileName = oSelectedItem.getText();  // serviceProfileName
            
                    console.log("Selected Profile ID: " + sID);
                    console.log("Selected Profile Name: " + sProfileName);
                    
                } else {
                    // Handle the case where no item is selected
                    sap.m.MessageToast.show("Please select a profile to copy.");
                    return; // Exit function if no item is selected
                }
            
                // Define filters to retrieve all entries with matching ID and serviceProfileName
                let aFilters = [
                    // new sap.ui.model.Filter("", sap.ui.model.FilterOperator.EQ, sID),
                    new sap.ui.model.Filter("serviceProfileName", sap.ui.model.FilterOperator.EQ, sProfileName)
                ];
            
                var that = this;
            
                var loadDataPromise = new Promise(function (resolve, reject) {
                    // Set up JSONModel to store data
                    var parameterCopyDataModel = new sap.ui.model.json.JSONModel();
                    that.getView().setModel(parameterCopyDataModel, "parameterCopyDataModel");
            
                    // Get the OData model
                    let oModel = that.getOwnerComponent().getModel();
            
                    // Bind list with filters applied
                    let oBindList = oModel.bindList("/serviceProfileParametersItems", null, null, aFilters);
            
                    // Request contexts for all matching records
                    oBindList.requestContexts(0, Infinity).then(function (aContexts) {
                        proCopyParameters = [];
                        aContexts.forEach(function (oContext) {
                            proCopyParameters.push(oContext.getObject());
                        });
            
                        // Update the model with the retrieved parameters
                        parameterCopyDataModel.setData(proCopyParameters);
                        that.getView().setModel(parameterCopyDataModel, "parameterCopyDataModel");
            
                        // Log the retrieved parameters
                        var proCopyParameterModelData = parameterCopyDataModel.getData();
                        console.log("Profile Parameters", proCopyParameterModelData);
            
                        resolve(proCopyParameterModelData);
                    }).catch(function (error) {
                        reject(error);
                        sap.m.MessageToast.show("Error while fetching profile parameters.");
                    });
                });
            
                loadDataPromise.then(function (proCopyParameterModelData) {
                    console.log("Filtered Profile Parameters", proCopyParameterModelData);
                    // Call the next function to handle the filtered data
                    that.copyProParameter(proCopyParameterModelData);
                });
            },
            
            copyProParameter: function (proCopyParameterModelData) {
                let selectedParameterData = proCopyParameterModelData;
                let addServiceProfileData = this.getView().getModel("addServiceProfileModel").getData();

                console.log("addServiceProfileData",addServiceProfileData)
 
                for (var i = 0; i < selectedParameterData.length; i++) {
                    var oEntryNewEntitySet = {
                        checkedParameter: selectedParameterData[i].checkedParameter,
                        serviceProfileName: addServiceProfileData.profileName,
                        serviceProfileDesc: addServiceProfileData.profileDesc,
                        ProfileId: (parseInt(proLastID, 10)).toString(),
                        ID: selectedParameterData[i].ID,
                        serviceParameter: selectedParameterData[i].serviceParameter,
                        serviceParameterDesc: selectedParameterData[i].serviceParameterDesc,
                        serviceParameterType: selectedParameterData[i].serviceParameterType,
                        serviceParameterlength: selectedParameterData[i].serviceParameterlength,
                        ParentId: "",
                        ContractRelevant: selectedParameterData[i].ContractRelevant,
                        Value_Parameter: selectedParameterData[i].Value_Parameter,
                        Threshold_Relevance: selectedParameterData[i].Threshold_Relevance,
                        Referrence_Relevant: selectedParameterData[i].Threshold_Relevance,
                        Nomination_Relevant: selectedParameterData[i].Nomination_Relevant,
                        Balancing_Relevant: selectedParameterData[i].Balancing_Relevant,
                        Allocation_Relevant: selectedParameterData[i].Allocation_Relevant,
                        Billing_Relevant: selectedParameterData[i].Billing_Relevant,
                        Price_Relevant: selectedParameterData[i].Price_Relevant,
                    };
 
                    var oModel = this.getView().getModel();
                    var oBindListNewEntitySet = oModel.bindList("/serviceProfileParametersItems");
                    oBindListNewEntitySet.create(oEntryNewEntitySet);
                }
 
                this.RefreshData();
            },
            

            // VALIDATE NEW PROFILE

            usedProNameAndDesc: function () {
                var that = this;
 
                // var usedProfileData = new sap.ui.model.json.JSONModel();
                var usedProfileDataModel = new sap.ui.model.json.JSONModel();
                that.getView().setModel(usedProfileDataModel, "usedProfileDataModel");
                let oModel = that.getOwnerComponent().getModel();
                let oBindList = oModel.bindList("/ServiceProfileMaster");
                oBindList.requestContexts(0, Infinity).then(function (aContexts) {
                    dataArray = [];
                    aContexts.forEach(function (oContext) {
                        dataArray.push(oContext.getObject());
                    });
                    usedProfileDataModel.setData(dataArray);
                    that.getView().setModel(usedProfileDataModel, "usedProfileDataModel");
 
                    var profileModelData = that.getView().getModel("usedProfileDataModel").getData();
                    validateNewProfile = profileModelData.map(function (obj) {
                        return {
                            ID: obj.ID,
                            serviceProfileName: obj.serviceProfileName,
                            serviceProfileDesc: obj.serviceProfileDesc
                        };
                    });
                    console.log("Validate New Profile", validateNewProfile);
                });

            },

 
            // LAST ID
 
            onProLastID: function () {
                try {
                    var oTable = this.getView().byId("createProTable");
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
                            proLastID = i.toString();
                            break;
                        }
                    }
                } catch (error) {
                    proLastID = "0";
                }
 
                console.log("Next Available ID:", proLastID);
            },
 
            onSaveNewProfile: function () {
                var addServiceProfileData = this.getView().getModel("addServiceProfileModel").getData();
                this.onProLastID();
                var oEntryDataServiceProfile = {
                    ID: parseInt(proLastID, 10),
                    serviceProfileName: addServiceProfileData.profileName.trim(),
                    serviceProfileDesc: addServiceProfileData.profileDesc.trim(),
                    field1: "",
                    field2: "",
                    field3: "",
                    field4: "",
                    field5: ""
                };
 
                if (oEntryDataServiceProfile.serviceProfileName === '' || oEntryDataServiceProfile.serviceProfileDesc === '') {
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
                    console.log("Profile or Description cannot be null");
                    return;
                } else {
 
                    var isDuplicateProfile = validateNewProfile.some(function (entry) {
                        return (
                            entry.serviceProfileName.toLowerCase() === oEntryDataServiceProfile.serviceProfileName.toLowerCase() || entry.serviceProfileDesc.toLowerCase() === oEntryDataServiceProfile.serviceProfileDesc.toLowerCase()
                            // entry.serviceProfileName === oEntryDataServiceProfile.serviceProfileName ||
                        );
                    });
 
                    if (isDuplicateProfile) {
                        sap.m.MessageToast.show("Profile or Description already exists.", {
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
                        console.log("Duplicate Profile found");
                        return;
                    } else {
                        validateNewProfile.push(oEntryDataServiceProfile);
                        console.log("Entry added successfully");
                    }
                }
 
                let oModel = this.getView().getModel();
                let oBindListSP = oModel.bindList("/ServiceProfileMaster");
                oBindListSP.create(oEntryDataServiceProfile);
                profileCount++
                this.loadParameter();
                this._oDialogProfile.close();
                this.RefreshData();
            },
 
            loadParameter: function () {
                var that = this;
 
                var loadDataPromise = new Promise(function (resolve, reject) {
                    proParameterData = new sap.ui.model.json.JSONModel();
                    var parameterDataModel = new JSONModel();
                    that.getView().setModel(parameterDataModel, "parameterDataModel");
                    let oModel = that.getOwnerComponent().getModel();
                    let oBindList = oModel.bindList("/serviceParametersItems");
 
                    oBindList.requestContexts(0, Infinity).then(function (aContexts) {
                        proParameters = [];
                        aContexts.forEach(function (oContext) {
                            proParameters.push(oContext.getObject());
                        });
                        parameterDataModel.setData(proParameters);
                        that.getView().setModel(parameterDataModel, "parameterDataModel");
 
                        proParameterModelData = that.getView().getModel("parameterDataModel").getData();
                        console.log("Profile Parameters", proParameterModelData);
 
                        resolve(proParameterModelData);
 
 
                    });
                });
 
                loadDataPromise.then(function (proParameterModelData) {
                    // console.log("proParameterModelData",proParameterModelData)
                    that.createProParameter(proParameterModelData);
                });
            },

           
            createProParameter: function (proParameterModelData) {
                let selectedParameterData = proParameterModelData;
                let addServiceProfileData = this.getView().getModel("addServiceProfileModel").getData();

                console.log("addServiceProfileData",addServiceProfileData)
 
                for (var i = 0; i < selectedParameterData.length; i++) {
                    var oEntryNewEntitySet = {
                        checkedParameter: false,
                        serviceProfileName: addServiceProfileData.profileName,
                        serviceProfileDesc: addServiceProfileData.profileDesc,
                        ProfileId: (parseInt(proLastID, 10)).toString(),
                        ID: selectedParameterData[i].ID,
                        serviceParameter: selectedParameterData[i].serviceParameter,
                        serviceParameterDesc: selectedParameterData[i].serviceParameterDesc,
                        serviceParameterType: selectedParameterData[i].serviceParameterType,
                        serviceParameterlength: selectedParameterData[i].serviceParameterlength,
                        ParentId: "",
                        ContractRelevant: false,
                        Value_Parameter: false,
                        Threshold_Relevance: false,
                        Referrence_Relevant: false,
                        Nomination_Relevant: false,
                        Balancing_Relevant: false,
                        Allocation_Relevant: false,
                        Billing_Relevant: false,
                        Price_Relevant: false,
                    };
 
                    var oModel = this.getView().getModel();
                    var oBindListNewEntitySet = oModel.bindList("/serviceProfileParametersItems");
                    oBindListNewEntitySet.create(oEntryNewEntitySet);
                }
 
                this.RefreshData();
            },
 
            RefreshData: function () {
                this.getView().byId("createProTable").getBinding("items").refresh();
            },
 
            onSelectServiceProfile: function (oEvent) {
                
                const config = this.getOwnerComponent().getRouter();
                var data = oEvent.getSource().getBindingContext().getObject();
                config.navTo("RouteprofileParameter", {
                    ID: data.ID,
                    serviceProfileName: data.serviceProfileName,
                    serviceProfileDesc: data.serviceProfileDesc
                })
            },
 
            // BUTTONS
 
            // DELETE PROFILE
 
            onDeleteProfile: function () {
                var newPro = this.byId("newServiceProfile"); // create button
                var proDeleteLabel = this.byId("deleteProfileLabel"); // checkbox column
                var proDeleteCheckBox = this.byId("deleteProfileCheckBox"); // checkbox cell
                var confirmProDelete = this.byId("deleteProConfirmBtn") // confirm dlt btn
                var deleteProBtn = this.byId("deleteProfileBtn") // delete btn
                var cancelProBtn = this.byId("cancelProDeleteBtn") // cancel btn
 
                // Toggle Visibility
                newPro.setVisible(!newPro.getVisible());
                proDeleteLabel.setVisible(!proDeleteLabel.getVisible());
                proDeleteCheckBox.setVisible(!proDeleteCheckBox.getVisible());
                confirmProDelete.setVisible(!confirmProDelete.getVisible());
                deleteProBtn.setVisible(!deleteProBtn.getVisible());
                cancelProBtn.setVisible(!cancelProBtn.getVisible());
            },
 
            onCancelProDeletion: function () {
                this.onDeleteProfile();
                this.onProCheckBox();
                this.onNullSelectedProfiles();
            },
 
            onNullSelectedProfiles: function () {
                initialProDeleteArray = {
                    ID: [],
                    serviceProfileName: []
                };
                allAssociatedParameters = [];
            },
 
            onSelectAllProfile: function (oEvent) {
                console.log("i'm triggered")
                var oTable = this.byId("createProTable");
                var oItems = oTable.getItems();
                var selectAll = oEvent.getParameter("selected");
                console.log("slall", selectAll)
                console.log("initialProDeleteArray",initialProDeleteArray)
                
                if (!selectAll) {
                    initialProDeleteArray.ID = [];
                    initialProDeleteArray.serviceProfileName = [];
                }
                
 
                // ID
                for (var i = 0; i < oItems.length; i++) {
                    var oItem = oItems[i];
                    var oCheckBox = oItem.getCells()[0];
                    var sID = oItem.getCells()[1].getText();
                    var sName = oItem.getCells()[2].getText();
 
                    if (oCheckBox instanceof sap.m.CheckBox) {
                        oCheckBox.setSelected(selectAll);
 
                        if (selectAll && oCheckBox.getSelected()) {
                            initialProDeleteArray.ID.push(sID);
                            initialProDeleteArray.serviceProfileName.push(sName);
                        }
                    }
                }


            },
 
            onProCheckBox: function () {
                var selectedItems = initialProDeleteArray.ID;
                var oTable = this.byId("createProTable");
                var oItems = oTable.getItems();
                this.getView().byId("selectAllProfile").setSelected(false);
 
                selectedItems.forEach(function (itemId) {
                    oItems.forEach(function (oItem) {
                        var sRowId = oItem.getCells()[1].getText();
 
                        if (sRowId === itemId) {
                            oItem.getCells()[0].setSelected(false);
                        }
                    });
                });
            },
 
            
 
            // DELETE PROFILE ARRAY
 
            onDeleteArrayProfile: function (oEvent) {
                // debugger
                var selectedProfiles = oEvent.getSource().getParent().getAggregation("cells");

 
                // ID and PROFILE
                for (var i = 0; i < selectedProfiles.length; i++) {
                    if (i === 0) {
                        let checkbox = selectedProfiles[i];
                        let id = selectedProfiles[i + 1].getProperty("text");
                        let profile = selectedProfiles[i + 2].getProperty("text");
 
                        if (checkbox.getSelected()) {
                            if (initialProDeleteArray.ID.indexOf(id) === -1) {
                                initialProDeleteArray.ID.push(id);
                                initialProDeleteArray.serviceProfileName.push(profile);
                            }
                        } else {
                            var index = initialProDeleteArray.ID.indexOf(id);
                            if (index !== -1) {
                                initialProDeleteArray.ID.splice(index, 1);
                                initialProDeleteArray.serviceProfileName.splice(index, 1);
                            }
                        }
                    }
                }
 
                // handling select all checkbox
                
                var selectAllCheckbox = this.byId("selectAllProfile");

                if (profileCount !== initialProDeleteArray.ID.length) {
                    if (selectAllCheckbox.getSelected()) {
                        selectAllCheckbox.setSelected(false)
                    }
                }
                else {
                    selectAllCheckbox.setSelected(true)
                    console.log("i'm here")
                }
                
                console.log("Initial Profile ID Array:", initialProDeleteArray.ID);
                console.log("Initial Profile Name Array:", initialProDeleteArray.serviceProfileName);
                this.RefreshData();
            },
 
            onConfirmProDeletion: function () {
                // debugger
                var unfilteredItems = initialProDeleteArray.ID;
                var serviceProfile = initialProDeleteArray.serviceProfileName
                console.log("serviceProfile" , serviceProfile)
                var selectedItems = Array.from(new Set(unfilteredItems));
                console.log("Selected Items:", selectedItems);
 
                let matchedProfile = getModelData.filter(function(profile){
                    return serviceProfile.includes(profile.serviceProfileName);
                });
 
                if (matchedProfile.length > 0) {
                    sap.m.MessageBox.information("Cannot delete the selected profiles because it is associated with a service profile Mapping.");
                    return;
                }
 
                if (selectedItems.length > 0) {
                    sap.m.MessageBox.confirm("Are you sure you want to delete the selected profile & associated parameters to the profile ?", {
                        title: "Confirmation",
                        onClose: function (oAction) {
                            if (oAction === sap.m.MessageBox.Action.OK) {
                                var that = this;
                                let oModel = that.getView().getModel();
 
                                let deletionPromises = selectedItems.map(function (profile) {
                                    let oBindList = oModel.bindList("/ServiceProfileMaster");
                                    let proFilter = new sap.ui.model.Filter("ID", sap.ui.model.FilterOperator.EQ, profile);
 
                                    return oBindList.filter(proFilter).requestContexts().then(function (aContexts) {
                                        aContexts.forEach(function (context) {
                                            context.delete();
                                            profileCount--
                                        });
                                    });
                                });
 
                                Promise.all(deletionPromises).then(function () {
                                    // Refresh the data after all deletions are completed
                                    that.RefreshData();
                                    that.proParameterVanish();
                                });
                            } else if (oAction === sap.m.MessageBox.Action.CANCEL) {
                                this.onProCheckBox();
                                this.onNullSelectedProfiles();
                            }
                        }.bind(this)
                    });
                } else {
                    MessageBox.information("Please select at least one profile for deletion.");
                }
 
                // Move this outside the if block to ensure it's always called
                this.onDeleteProfile();
                this.onProCheckBox();
            },

           
        // DELETE PARAMETERS ASSOCIATED TO THE PROFILE(S)
 
            proParameterVanish: function () {
                var unfilteredItems = initialProDeleteArray.serviceProfileName;
                var selectedItems = Array.from(new Set(unfilteredItems));
                console.log("Selected Parameter Items:", selectedItems);
                var that = this;
                let oModel = that.getView().getModel();
 
                selectedItems.forEach(function (proParameter) {
                    let oBindList = oModel.bindList("/serviceProfileParametersItems");
                    let proParamFilter = new sap.ui.model.Filter("serviceProfileName", sap.ui.model.FilterOperator.EQ, proParameter);
 
                    oBindList.filter(proParamFilter).requestContexts().then(function (aContexts) {
                        aContexts.forEach(function (context) {
                            context.delete()
        
                        });
                    });
                });
                this.onNullSelectedProfiles();
            },

        });
    });
 