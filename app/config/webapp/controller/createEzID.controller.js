sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller,JSONModel,) {
        "use strict";
        var LastSnum;
        var validateNewID;
        let IdArray;
        var initialDeleteArray = {
            Snum: [],
            EzID: []
        };
        var allAssociatedParameters = [];
 
        return Controller.extend("com.ingenx.config.controller.createEzID", {
            onInit: function () {
 
            },
 
            onCreatePenaltyId:function(){
                this.usedEzIdAndDesc();
                var oView=this.getView();
                const addEzIdData = {
                    EzId: "",
                    EzIdDesc: ""
                };
                const addEzidModel = new JSONModel(addEzIdData);
                oView.setModel(addEzidModel,"addEzidModel");
                if(!this._oDialogez){
                    this._oDialogez=sap.ui.xmlfragment("com.ingenx.config.fragments.ezreport", this);
                    oView.addDependent(this._oDialogez);
                }
                this._oDialogez.open();
            },
 
            oncancelNewId:function(){
                this._oDialogez.close();
            },
 
                   
 
            onSaveNewId:function(){
                var addEzIdData = this.getView().getModel("addEzidModel").getData();
                this.onLastSnum();
              // Ensure the EzID is uppercase
              addEzIdData.EzId = addEzIdData.EzId.toUpperCase();
           
              // Validate that EzID is at most 6 characters
              if (addEzIdData.EzId.length > 6) {
                  sap.m.MessageToast.show("EzID can only be up to 6 characters.", {
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
                  console.log("EzID is more than 6 characters");
                  return;
              }
                var oEntryData={
                    Snum:parseInt(LastSnum, 10),
                    EzID:addEzIdData.EzId,
                    EzIdDescription:addEzIdData.EzIdDesc,
 
                };
                if (oEntryData.EzID === '' && oEntryData.EzIdDescription === '') {
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
                    console.log("ID or Description cannot be null");
                    return;
                }else {
                   
 
                    var isDuplicateId = validateNewID.some(function (entry) {
                        return (
                            entry.EzID.toUpperCase() === oEntryData.EzID.toUpperCase()
                            // entry.serviceProfileName === oEntryDataServiceProfile.serviceProfileName ||
                        );
                    });
 
                    if (isDuplicateId) {
                        sap.m.MessageToast.show("ID already exists.", {
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
                        validateNewID.push(oEntryData);
                        console.log("Entry added successfully");
                    }
                }
 
                let oModel = this.getView().getModel();
                let oBindListSP = oModel.bindList("/EzIdTable");
                oBindListSP.create(oEntryData);
 
                this.saveEZReportId();
 
                this._oDialogez.close();
                this.RefreshData();
            },
 
            RefreshData: function () {
                this.getView().byId("PenaltyIdDefezidtable").getBinding("items").refresh();
            },
 
            saveEZReportId:function(){
                var EZData = this.getView().getModel("addEzidModel").getData();
                var oEntryDataEz={
                    Vcid: EZData.EzId,
                    VcDesc: EZData.EzIdDesc,
                    NotifDateFlg: false
                };
                console.log("oEntryDataEz",oEntryDataEz);
                let oModelEZ = this.getView().getModel();
                let oBindListEZ = oModelEZ.bindList("/EZReporstIdsSet");
                oBindListEZ.create(oEntryDataEz, true);
            },
 
 
            usedEzIdAndDesc: function () {
                var that = this;
 
                let oModel = that.getOwnerComponent().getModel();
                let oBindList = oModel.bindList("/EzIdTable");
                oBindList.requestContexts(0,Infinity).then(function (aContexts){
                    IdArray=[];
                    aContexts.forEach(function (oContext) {
                        IdArray.push(oContext.getObject());
                    });
                    validateNewID = IdArray.map(function (obj) {
                        return {
                            Snum: obj.Snum,
                            EzID: obj.EzID,
                            EzIdDescription: obj.EzIdDescription
                        };
                    });
                    console.log("Validate New Profile", validateNewID);
                });
            },
 
            onLastSnum: function () {
                try {
                    var oTable = this.getView().byId("PenaltyIdDefezidtable");
                    var oItems = oTable.getItems();
 
                    var usedSnums = new Set();
 
                    oItems.forEach(function (oItem) {
                        var currentSno = parseInt(oItem.getCells()[1].getText(), 10);
                        if (!isNaN(currentSno)) {
                            usedSnums.add(currentSno);
                        }
                    });
 
                    // Find the smallest available ID
                    for (let i = 1; i <= oItems.length + 1; i++) {
                        if (!usedSnums.has(i)) {
                            LastSnum = i.toString();
                            break;
                        }
                    }
                } catch (error) {
                    LastSnum = "0";
                }
                console.log("Next Available ID:", LastSnum);
            },
 
            onDeletePenaltyId: function () {
                var newId = this.byId("PenaltyIdDefnewId");
                var DeleteLabel = this.byId("PenaltyIdDefdeleteIdLabel");
                var DeleteCheckBox = this.byId("PenaltyIdDefDeleteEzIdCheckBox");
                var confirmDelete = this.byId("PenaltyIdDefDeleteIdConfirmBtn")
                var deleteBtn = this.byId("PenaltyIdDefDeleteIdBtn")
                var cancelBtn = this.byId("PenaltyIdDefCancelIdDeleteBtn")
 
                
                newId.setVisible(!newId.getVisible());
                DeleteLabel.setVisible(!DeleteLabel.getVisible());
                DeleteCheckBox.setVisible(!DeleteCheckBox.getVisible());
                confirmDelete.setVisible(!confirmDelete.getVisible());
                deleteBtn.setVisible(!deleteBtn.getVisible());
                cancelBtn.setVisible(!cancelBtn.getVisible());
            },
 
            ononPenaltyIdCancelIdDeletion: function () {
                this.onDeletePenaltyId();
                this.onCheckBox();
                this.onNullSelected();
            },
 
            onNullSelected: function () {
                initialDeleteArray = {
                    Snum: [],
                    EzID: []
                };
                allAssociatedParameters = [];
            },
 
            onPenaltySelectAllId:function(oEvent){
                var oTable = this.byId("PenaltyIdDefezidtable");
                var oItems = oTable.getItems();
                var selectAll = oEvent.getParameter("selected");
 
                for (var i = 0; i < oItems.length; i++) {
                    var oItem = oItems[i];
                    var oCheckBox = oItem.getCells()[0];
                    var sNum = oItem.getCells()[1].getText();
                    var sEzid = oItem.getCells()[2].getText();
 
                    if (oCheckBox instanceof sap.m.CheckBox) {
                        oCheckBox.setSelected(selectAll);
 
                        if (selectAll && oCheckBox.getSelected()) {
                            initialDeleteArray.Snum.push(sNum);
                            initialDeleteArray.EzID.push(sEzid);
                        }
                    }
                }
            },
 
            onCheckBox: function () {
                var selectedItems = initialDeleteArray.Snum;
                var oTable = this.byId("PenaltyIdDefezidtable");
                var oItems = oTable.getItems();
                this.getView().byId("PenaltyIdDefCheckboxCol").setSelected(false);
 
                selectedItems.forEach(function (itemId) {
                    oItems.forEach(function (oItem) {
                        var sRowId = oItem.getCells()[1].getText();
 
                        if (sRowId === itemId) {
                            oItem.getCells()[0].setSelected(false);
                        }
                    });
                });
            },
 
            onDeleteArrayEzId: function (oEvent) {
                var selectedProfiles = oEvent.getSource().getParent().getAggregation("cells");
 
                // ID
                for (var i = 0; i < selectedProfiles.length; i++) {
                    if (i === 0) {
                        let checkbox = selectedProfiles[i];
                        let id = selectedProfiles[i + 1].getProperty("text");
 
                        if (checkbox.getSelected()) {
                            if (initialDeleteArray.Snum.indexOf(id) === -1) {
                                initialDeleteArray.Snum.push(id);
                            }
                        } else {
                            var index = initialDeleteArray.Snum.indexOf(id);
                            if (index !== -1) {
                                initialDeleteArray.Snum.splice(index, 1);
                            }
                        }
                    }
                }
 
                // PROFILE
 
                for (var i = 0; i < selectedProfiles.length; i++) {
                    if (i === 0) {
                        let checkbox = selectedProfiles[i];
                        let profile = selectedProfiles[i + 2].getProperty("text");
 
                        if (checkbox.getSelected()) {
                            if (initialDeleteArray.EzID.indexOf(profile) === -1) {
                                initialDeleteArray.EzID.push(profile);
                            }
                        } else {
                            var index = initialDeleteArray.EzID.indexOf(profile);
                            if (index !== -1) {
                                initialDeleteArray.EzID.splice(index, 1);
                            }
                        }
                    }
                }
 
                console.log("Initial Profile ID Array:", initialDeleteArray.Snum);
                console.log("Initial Profile Name Array:", initialDeleteArray.EzID);
                this.RefreshData();
            },
 
 
            onPenaltyIdConfirmIdDeletion: function () {
                var unfilteredSnum = initialDeleteArray.Snum;
                var unfilteredID = initialDeleteArray.EzID;
                var selectedItems = Array.from(new Set(unfilteredSnum));
                var selectedId =  Array.from(new Set(unfilteredID));
               
           
                if (selectedItems.length > 0) {
                    sap.m.MessageBox.confirm("Are you sure you want to Delete the selected EzReport ID & associated Tables to this ID ?", {
                        title: "Confirmation",
                        onClose: function (oAction) {
                            if (oAction === sap.m.MessageBox.Action.OK) {
                                var that = this;
                                let oModel = that.getView().getModel();
           
                                let deletionPromisesEzIdTable = selectedItems.map(function (profile) {
                                    let oBindList = oModel.bindList("/EzIdTable");
                                    let proFilter = new sap.ui.model.Filter("Snum", sap.ui.model.FilterOperator.EQ, profile);
           
                                    return oBindList.filter(proFilter).requestContexts().then(function (aContexts) {
                                        aContexts.forEach(function (context) {
                                            context.delete();
                                        });
                                    });
                                });
           
                                let deletionPromisesEZReporstIdsSet = selectedId.map(function (selected) {
                                    return oModel.delete(`/EZReporstIdsSet('${selected}')`).then(
                                        (abc) => console.log(abc),
                                        (def) => console.log(def)
                                    );
                                });

                                let allDeletionPromises = deletionPromisesEzIdTable.concat(deletionPromisesEZReporstIdsSet);
           
                                Promise.all(allDeletionPromises).then(function () {
                                    that.RefreshData();
                                    that.AssociatedTableDelete();
                                });
                            } else if (oAction === sap.m.MessageBox.Action.CANCEL) {
                                this.onCheckBox();
                                this.onNullSelected();
                            }
                        }.bind(this)
                    });
                } else {
                    MessageBox.information("Please select at least one profile for deletion.");
                }
           
                // Ensure these are always called
                this.onDeletePenaltyId();
                this.onCheckBox();
            },
           
 
            AssociatedTableDelete:function(){
                var filteredItemsTable = initialDeleteArray.EzID;
                var selectedItemsTable = Array.from(new Set(filteredItemsTable));
 
                let oModeldelete = this.getView().getModel();
                selectedItemsTable.forEach(function (proParameter) {
                    let oBindList = oModeldelete.bindList("/TableMappings");
                    let proParamFilter = new sap.ui.model.Filter("EzID", sap.ui.model.FilterOperator.EQ, proParameter);
                    oBindList.filter(proParamFilter).requestContexts(0,Infinity).then(function (aContexts) {
                        aContexts.forEach(function (context) {
                            context.delete();
                        });
                    });
                });
 
                selectedItemsTable.forEach(function (proParameterfields) {
                    let oBindListField = oModeldelete.bindList("/FieldMapping");
                    let proParamFilterField = new sap.ui.model.Filter("EzID", sap.ui.model.FilterOperator.EQ, proParameterfields);
 
                    oBindListField.filter(proParamFilterField).requestContexts(0,Infinity).then(function (aContexts) {
                        aContexts.forEach(function (context) {
                            context.delete();
                        });
                    });
                });
 
 
                this.onNullSelected();
            },
 
            onSelectPenaltyEzId:function(oEvent){
                const router = this.getOwnerComponent().getRouter();
                var data = oEvent.getSource().getBindingContext().getObject();
                console.log("data",data);
                router.navTo("RouteTables", {
                    Snum:data.Snum,
                    EzID: data.EzID
                })
            },
 
 
        });
    });