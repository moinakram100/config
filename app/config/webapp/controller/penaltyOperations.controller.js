sap.ui.define([
    "sap/ui/core/mvc/Controller",
    'sap/ui/model/Filter',
    'sap/ui/model/json/JSONModel',
    "sap/ui/model/FilterOperator",
    "sap/ui/model/FilterType",
    "sap/ui/model/ValidateException",
    'sap/ui/core/library'
  ], function (Controller, Filter, JSONModel,FilterOperator,FilterType,ValidateException,coreLibrary) {
    "use strict";
    let sSelectedKey;
    let fieldArray;
    let updatedObjects=[];
    let TableArr;
    var ValueState = coreLibrary.ValueState;
  
    return Controller.extend("com.ingenx.config.controller.penaltyOperations", {
  
        onInit: function(){
            let viewModel = new JSONModel({
                busyIndicator: false
            });
            this.getView().setModel(viewModel, "viewModel");
  
        },
  
        onChange:async function(oEvent){
            updatedObjects=[];
            var oValidatedComboBox = oEvent.getSource(),
            sSelectedKey = oValidatedComboBox.getSelectedKey();
            console.log("sSelectedKey",sSelectedKey);
            await this.modelMaker(sSelectedKey);
        },
  
        modelMaker:function(sSelectedKey){
            let that=this;
            let tableSet = new Set();
            var selectedFModel = new JSONModel();
            var selectedTable = new JSONModel();
            let oModel = this.getOwnerComponent().getModel();
            let aFilter = new sap.ui.model.Filter("EzID",sap.ui.model.FilterOperator.EQ, sSelectedKey)
            let oBindList = oModel.bindList("/FieldMapping", undefined, undefined, [aFilter]);
  
            this.getView().getModel("viewModel").setProperty("/busyIndicator", true);
  
            oBindList.requestContexts(0,Infinity).then(function(aContexts){
                fieldArray=[];
                TableArr=[];
                aContexts.forEach(function (oContext) {
                    if(oContext.getObject().selected == true){
                        fieldArray.push(oContext.getObject());
                    }
                });
                updatedObjects=fieldArray;
               
                console.log("fieldArray",fieldArray);
                selectedFModel.setData(fieldArray);
                that.getView().setModel(selectedFModel, "selectedFModel");
  
                aContexts.forEach(function (oContext) {
                  if(oContext.getObject().selected == true){
                    let table = oContext.getObject();
                      if (!tableSet.has(oContext.getObject().Table)) {
                        tableSet.add(oContext.getObject().Table);
                        TableArr.push(table);
                    }
                  }
                });
                console.log("TableArr",TableArr);
                selectedTable.setData(TableArr);
                that.getView().setModel(selectedTable,"selectedTable");
                var data= that.getView().getModel("selectedTable");
                console.log("data",data);
  
                that.getView().getModel("viewModel").setProperty("/busyIndicator", false);
            }).catch(function() {
                that.getView().getModel("viewModel").setProperty("/busyIndicator", false);
            });
        },
        OnChangeCheckFilter:function(oEvent) {
            //flag = true;
            var isSlectedFil = oEvent.getParameter("selected");
            var Filterobj= oEvent.getSource().getBindingContext("selectedFModel").getObject();
            updatedObjects.findIndex(function(item){
              if(item.ID === Filterobj.ID && item.mandatory !== Filterobj.mandatory){
                Filterobj.mandatory = item.mandatory;
              }
              if(item.ID === Filterobj.ID && item.display !== Filterobj.display){
                Filterobj.display = item.display
              }
            })
   
            Filterobj.filterfield = isSlectedFil;
   
            var existingObjIndex = updatedObjects.findIndex(function (item) {
              return item.ID === Filterobj.ID;
            });
         
            if (existingObjIndex === -1) {
              updatedObjects.push(Filterobj);
            } else {
              updatedObjects[existingObjIndex] = Filterobj;
            }
            console.log("updatedObjects", updatedObjects);
        },
  
        OnChangeCheckMandatory:function(oEvent) {
            //flag = true;
            var isSlectedman = oEvent.getParameter("selected");
            var Mandatoryobj= oEvent.getSource().getBindingContext("selectedFModel").getObject();
            updatedObjects.findIndex(function(item){
              if(item.ID === Mandatoryobj.ID && item.filterfield !== Mandatoryobj.filterfield){
                Mandatoryobj.filterfield = item.filterfield;
              }
              if(item.ID === Mandatoryobj.ID && item.display !== Mandatoryobj.display){
                Mandatoryobj.display = item.display
              }
            })
   
            Mandatoryobj.mandatory = isSlectedman;
   
            var existingObjIndex = updatedObjects.findIndex(function (item) {
              return item.ID === Mandatoryobj.ID;
            });
   
            if (existingObjIndex === -1) {
              updatedObjects.push(Mandatoryobj);
            } else {
              updatedObjects[existingObjIndex] = Mandatoryobj;
            }
            console.log("updatedObjects", updatedObjects);
        },
  
          OnChangeCheckDisplay:function(oEvent) {
            //flag = true;
            var isSlectedDis = oEvent.getParameter("selected");
            var Displayobj = oEvent.getSource().getBindingContext("selectedFModel").getObject();
            updatedObjects.findIndex(function(item){
              if(item.ID === Displayobj.ID && item.filterfield !== Displayobj.filterfield){
                Displayobj.filterfield = item.filterfield;
              }
              if(item.ID === Displayobj.ID && item.mandatory !== Displayobj.mandatory){
                Displayobj.mandatory = item.mandatory
              }
            })
   
            Displayobj.display = isSlectedDis;
   
            var existingObjIndex = updatedObjects.findIndex(function (item) {
              return item.ID === Displayobj.ID;
            });
            if (existingObjIndex === -1) {
              updatedObjects.push(Displayobj);
            } else {
              updatedObjects[existingObjIndex] = Displayobj;
            }
            console.log("updatedObjects", updatedObjects);
          },
  
          onFieldIDChange: function(oEvent) {
            var newValue = oEvent.getParameter("value");
            var FieldIDobj = oEvent.getSource().getBindingContext("selectedFModel").getObject();
            this._updateObjectInArray(FieldIDobj, "FieldID", newValue);
          },
  
          onDefaultValChange: function(oEvent) {
            var newValue = oEvent.getParameter("value");
            var DefaultValobj = oEvent.getSource().getBindingContext("selectedFModel").getObject();
            this._updateObjectInArray(DefaultValobj, "DefaultVal", newValue);
          },
  
          onMappedTableValChange: function(oEvent){
            var changedVal = oEvent.getParameter("value");
            var MappedTableValobj = oEvent.getSource().getBindingContext("selectedFModel").getObject();
            this._updateObjectInArray(MappedTableValobj, "MappedTable", changedVal);
          },
  
          onMappedFieldValChange: function(oEvent){
            var changedVal = oEvent.getParameter("value");
            var MappedTableValobj = oEvent.getSource().getBindingContext("selectedFModel").getObject();
            this._updateObjectInArray(MappedTableValobj, "MappedField", changedVal);
          },
  
          onAddiFunctionValChange: function(oEvent){
            var changedVal = oEvent.getParameter("value");
            var MappedTableValobj = oEvent.getSource().getBindingContext("selectedFModel").getObject();
            this._updateObjectInArray(MappedTableValobj, "AddiFunction", changedVal);
          },
  
          onFormulaValChange: function(oEvent){
            var changedVal = oEvent.getParameter("value");
            var MappedTableValobj = oEvent.getSource().getBindingContext("selectedFModel").getObject();
            this._updateObjectInArray(MappedTableValobj, "Formula", changedVal);
          },
  
  
          onChangeOperation:function(oEvent){
            var oValidatedComboBox = oEvent.getSource(),
            sSelectedKey = oValidatedComboBox.getSelectedKey(),
            sValue = oValidatedComboBox.getValue();
  
            if (!sSelectedKey && sValue) {
              oValidatedComboBox.setValueState(ValueState.Error);
              oValidatedComboBox.setValueStateText("Please enter a valid country!");
            } else {
              oValidatedComboBox.setValueState(ValueState.Success);
            }
  
            var changedVal = oEvent.getParameter("value");
            var OperationValobj = oEvent.getSource().getBindingContext("selectedFModel").getObject();
            this._updateObjectInArray(OperationValobj, "Operation", changedVal);
          },
  
          _updateObjectInArray: function(obj, prop, value) {
            obj[prop] = value;
  
            var existingObjIndex = updatedObjects.findIndex(function(item) {
                return item.ID === obj.ID;
            });
  
            if (existingObjIndex === -1) {
                updatedObjects.push(obj);
            } else {
                updatedObjects[existingObjIndex] = obj;
            }
            console.log("updatedObjects", updatedObjects);
          },
  
       
          onSave: function() {
            let that = this;
        
            let hasEmptyFieldID = updatedObjects.some(obj => !obj.FieldID || obj.FieldID.trim() === "");
        
            let isString = updatedObjects.some(obj => {
                let parsedValue = parseInt(obj.FieldID, 10);
                return isNaN(parsedValue) || !/^\d+$/.test(obj.FieldID);
            });
        
            // Group the objects by the 'Table' property
            let tableGroups = updatedObjects.reduce((acc, obj) => {
                if (!acc[obj.Table]) {
                    acc[obj.Table] = [];
                }
                acc[obj.Table].push(obj);
                return acc;
            }, {});
        
            // Check for duplicate FieldIDs within each table group
            let hasDuplicateFieldID = Object.keys(tableGroups).some(table => {
                let fieldIDSet = new Set();
                return tableGroups[table].some(obj => {
                    if (fieldIDSet.has(obj.FieldID)) {
                        return true;
                    }
                    fieldIDSet.add(obj.FieldID);
                    return false;
                });
            });
        
            console.log("updatedObjects", updatedObjects);
        
            if (hasEmptyFieldID) {
                sap.m.MessageBox.error("Field ID cannot be empty. Please fill in all Field IDs before saving.");
                return;
            }
        
            if (hasDuplicateFieldID) {
                sap.m.MessageBox.error("Duplicate Field IDs found within the same table. Please ensure all Field IDs are unique within each table before saving.");
                return;
            }
        
            if (isString) {
                sap.m.MessageBox.error("Field ID cannot be a string. Please ensure all Field IDs are numbers before saving.");
                return;
            }
        
            // Proceed with your save logic...
            let oModel = this.getView().getModel();
            let aFilters = updatedObjects.map(obj => new sap.ui.model.Filter("ID", sap.ui.model.FilterOperator.EQ, obj.ID));
            let oCombinedFilter = new sap.ui.model.Filter({
                filters: aFilters,
                and: false
            });
            let oBindList = oModel.bindList("/FieldMapping", undefined, undefined, [oCombinedFilter]);
        
            sap.m.MessageBox.confirm("Do you want to save the following Configuration?", {
                actions: [sap.m.MessageBox.Action.OK, sap.m.MessageBox.Action.CANCEL],
                onClose: function (oAction) {
                    if (oAction === sap.m.MessageBox.Action.OK) {
                        that.createFieldsS4(updatedObjects);
        
                        oBindList.requestContexts(0, Infinity).then(function (aContexts) {
                            aContexts.forEach(function (oContext) {
                                let contextID = oContext.getProperty("ID");
                                let updatedObject = updatedObjects.find(obj => obj.ID === contextID);
                                if (updatedObject) {
                                    oContext.setProperty("filterfield", updatedObject.filterfield);
                                    oContext.setProperty("mandatory", updatedObject.mandatory);
                                    oContext.setProperty("display", updatedObject.display);
                                    oContext.setProperty("FieldID", updatedObject.FieldID);
                                    oContext.setProperty("DefaultVal", updatedObject.DefaultVal);
                                    oContext.setProperty("Operation", updatedObject.Operation);
                                    oContext.setProperty("MappedTable", updatedObject.MappedTable);
                                    oContext.setProperty("MappedField", updatedObject.MappedField);
                                    oContext.setProperty("AddiFunction", updatedObject.AddiFunction);
                                    oContext.setProperty("Formula", updatedObject.Formula);
                                }
                            });
                            sap.m.MessageBox.success("Entries saved successfully");
                        }).catch(function (error) {
                            sap.m.MessageBox.error("Error saving entries: " + error.message);
                        });
                    }
                }
            });
        },
        
  
        createFieldsS4:function(FieldArray){
          let arrayDatas4=FieldArray;
          console.log("arrayDatas4",arrayDatas4);
          for (var i = 0; i < arrayDatas4.length; i++){
               var oEntryField2={
                  "Vcid" : arrayDatas4[i].EzID,
                  "VcprId" : arrayDatas4[i].SubProcessId,
                  "VcprTabid" :"001",
                  "VcprFldid" : arrayDatas4[i].FieldID,
                  "VcDesc" : "GMS Test report",
                  "VcprDesc" : "test",
                  "Tabname" : arrayDatas4[i].Table,
                  "Ddtext" : "Test Table",
                  "Fieldname" : arrayDatas4[i].Field,
                  "FieldDesc" : arrayDatas4[i].FieldDesc,
                  "FieldType" : "FLT",
                  "Addfunc" : arrayDatas4[i].AddiFunction ,
                  "LogicalFormula" : "",
                  "TableFieldMapNav" : [
                      {
                      "Vcid" : arrayDatas4[i].EzID,
                      "VcprId" : arrayDatas4[i].SubProcessId,
                      "VcprTabid" :"001",
                      "VcprFldid" : arrayDatas4[i].FieldID,
                      "VcDesc" : "GMS Test report",
                      "VcprDesc" : "test",
                      "Tabname" : arrayDatas4[i].Table,
                      "Ddtext" : "Test Table",
                      "Fieldname" : arrayDatas4[i].Field,
                      "FieldDesc" : arrayDatas4[i].FieldDesc,
                      "Operation": arrayDatas4[i].Operation
                      
                      }
                  ]
              };
              console.log("oEntryField2 (single-line):", JSON.stringify(oEntryField2));
              var oModelFieldS4 = this.getView().getModel();
              var oBindListS4 = oModelFieldS4.bindList("/FieldMapSet");
              oBindListS4.create(oEntryField2,true);
          }
        },
       
        onLiveChange: function(oEvent) {
            var oInput = oEvent.getSource();
            let newValue = oEvent.getParameter("newValue");
       
            oInput.setValueState(sap.ui.core.ValueState.Success);
            var isInteger = parseInt(newValue, 10);
            if (isNaN(isInteger) || !/^\d+$/.test(newValue)) {
              isInteger = NaN;
            }
            console.log("isInteger",isInteger);
            if (isNaN(isInteger)) {
                oInput.setValueState(sap.ui.core.ValueState.Error);
                oInput.setValueStateText("'" + newValue + "' is not a valid Number");
            }
          },
  
  
          onAdditionalFunct: function (oEvent) {
            var oView = this.getView();
       
            // Store the reference to the input field
            this._inputField = oEvent.getSource();
       
            if (!this._oDialogFunction) {
                this._oDialogFunction = sap.ui.xmlfragment("com.ingenx.config.fragments.addFunction", this);
                oView.addDependent(this._oDialogFunction);
            };
            this._oDialogFunction.open();
        },
       
        handleValueHelpClose: function (oEvent) {
            var oSelectedItem = oEvent.getParameter("selectedItem");
            oEvent.getSource().getBinding("items").filter([]);
       
            if (!oSelectedItem) {
                return;
            }
       
            var sDataType = oSelectedItem.getCells()[0].getText();
            console.log("sDataType", sDataType);
       
            // Use the stored reference to set the value of the input field
            if (this._inputField) {
                this._inputField.setValue(sDataType); // Set the value to the input field
                //console.log("Input field value set to:", this._inputField.getValue());
            }
       
            this._oDialogFunction.close();
        }
       
    });
  });
  