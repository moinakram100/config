sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/FilterType",
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller,JSONModel,Filter,FilterOperator,FilterType,) {
        "use strict";
        var ezdata;
        var TableArray;
        var validateNewTable;
        var Bool;
        let FieldArray;
        let tableShortDescription;
        var isInteger;
 
        return Controller.extend("com.ingenx.config.controller.EzIdtableMapping", {
            onInit: function () {
                this.getOwnerComponent().getRouter().getRoute("RouteTables").attachPatternMatched(this.handleRouteMatched, this);
            },
 
            handleRouteMatched: function (oEvent) {
               
                ezdata = {
                    snum: oEvent.getParameter("arguments").Snum,
                    ezId: oEvent.getParameter("arguments").EzID,
                }
                console.log("ezdata",ezdata);
 
                var oFilter = new Filter("EzID", FilterOperator.EQ, oEvent.getParameter("arguments").EzID);
                this.getView().byId("_IDGenTable1").getBinding("items").filter(oFilter, FilterType.Application);
            },
           
            onAddNew:function(){
                this.usedTableAndDesc();
                //this.availableTable();
                var oView=this.getView();
                const addTable = {
                    Table: "",
                    subProcessId: "",
                };
                const addTableModel = new JSONModel(addTable);
                oView.setModel(addTableModel,"addTableModel");
                if(!this._oDialogTab){
                    this._oDialogTab=sap.ui.xmlfragment("com.ingenx.config.fragments.addtables", this);
                    oView.addDependent(this._oDialogTab);
                }
                this._oDialogTab.open();
            },
 
            usedTableAndDesc: function () {
                var that = this;
                let oModel = that.getOwnerComponent().getModel();
                let oBindList = oModel.bindList("/TableMappings");
                oBindList.requestContexts(0,Infinity).then(function (aContexts){
                    TableArray=[];
                    aContexts.forEach(function (oContext) {
                        if(oContext.getObject().Table!=null &&  ezdata.snum == oContext.getObject().Snum){
                            TableArray.push(oContext.getObject());
                        }
                    });
                    validateNewTable = TableArray.map(function (obj) {
                        return {
                            Snum: obj.Snum,
                            EzID: obj.EzID,
                            Table: obj.Table,
                            TableDesc:obj.TableDesc,
                            SubProcessId:obj.SubProcessId
                        };
                    });
                    console.log("Validate New Table", validateNewTable);
                });
            },
 
            onSaveNewTable: async function(){
                var InputData = this.getView().getModel("addTableModel").getData().Table;
 
                let oBusyDialog = sap.ui.core.BusyIndicator
                oBusyDialog.show(0);
                try{
                await this.availableTable(InputData);
                var addTableData = this.getView().getModel("addTableModel").getData();
                var oEntryData={
                    Snum: ezdata.snum,
                    EzID: ezdata.ezId,
                    Table: addTableData.Table,
                    SubProcessId: addTableData.subProcessId,
                    TableDesc: tableShortDescription[0],
                };
 
                var oEntry2=
                {
                    "Operation" : Math.random().toString().substring(2,5),
                    "VCIDTableMapNav" : [
                      {
                        "Vcid" :  ezdata.ezId,
                        "VcprId" : addTableData.subProcessId,
                        "VcprTabid" :  "001",
                        "VcDesc" : "GMS Test report",
                        "VcprDesc" : "test",
                        "Strname" : "",
                        "Tabname" : addTableData.Table,
                        "Ddtext" : tableShortDescription[0],
                        "Aenam" : "",
                        "Aedat" : null,
                        "Incl" : false
                      }
                    ]
                  }
                console.log("oEntry2",oEntry2);
                isInteger = parseInt(oEntryData.SubProcessId,10);
 
                if (oEntryData.Table === '' || oEntryData.SubProcessId === '') {
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
                    return;
                }
                else if(isNaN(isInteger)){
                    sap.m.MessageToast.show("Sub Process ID must be a Number.", {
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
                    return;
                }
                else {
 
                    var isDuplicateTable = validateNewTable.some(function (entry) {
                        return (
                            entry.Table.toLowerCase() === oEntryData.Table.toLowerCase() || entry.SubProcessId === oEntryData.SubProcessId
                        );
                    });
 
                    if (isDuplicateTable) {
                        sap.m.MessageToast.show("Table or SubProcess ID Already Exists !", {
                            duration: 3000,
                            width: "15em",
                            my: "center top",
                            at: "center top",
                            of: window,
                            offset: "30 30",
                            onClose: function () {
                                //that.getView().byId("inp1").getBinding("value").setValueState("Error");
                                console.log("Message toast closed");
                            }
                        });
                        return;
                    }else if(!Bool){
                            sap.m.MessageToast.show("Entered value is not a Table !", {
                                duration: 3000,
                                width: "15em",
                                my: "center top",
                                at: "center top",
                                of: window,
                                offset: "30 30",
                                onClose: function () {
                                    //that.getView().byId("inp1").getBinding("value").setValueState("Error");
                                    console.log("Message toast closed");
                                }
                            });
                            return;
                        }
                    else {
                        validateNewTable.push(oEntryData);
                        console.log("Entry added successfully");
                    }
                   
                }
                let oModel = this.getView().getModel();
                let oBindList1 = oModel.bindList("/EzIDMapSet")
                oBindList1.create(oEntry2,true)
                let oBindList = oModel.bindList("/TableMappings");
                oBindList.create(oEntryData);
 
                this.loadFields(InputData);
                this._oDialogTab.close();
                this.RefreshData();
 
                }
                finally {
                    oBusyDialog.hide();
                }  
            },
 
            availableTable: function(InputData) {
                return new Promise((resolve, reject) => {
                    let oAvailableTableModel = this.getOwnerComponent().getModel();
                    let aFilter = new sap.ui.model.Filter("TableName", sap.ui.model.FilterOperator.EQ, InputData);
                    let oBindList = oAvailableTableModel.bindList("/xGMSxGETTABLEFIELDS", undefined, undefined, [aFilter], { $select: "TableName",$select: "TableShortDescription" });
                   
                    oBindList.requestContexts(0, 1).then(function(aContexts) {
                        let AvailTable = [];
                        aContexts.forEach(function(oContext) {
                            AvailTable.push(oContext.getObject());
                        });
                        console.log("AvailTable",AvailTable);
                       
                        tableShortDescription = AvailTable.map(function(item) {
                            return item.TableShortDescription;
                        });
 
                        Bool = (AvailTable.length === 1);
                        console.log("Bool", Bool);
                        resolve();
                    }).catch(function(error) {
                        console.error("Error in fetching data:", error);
                        reject();
                    });
                });
            },
 
            loadFields:function(InputData){
                var that = this;
                var loadDataPromise = new Promise(function (resolve, reject){
                let oModelFields=that.getOwnerComponent().getModel();
                let aFilterField = new sap.ui.model.Filter("TableName", sap.ui.model.FilterOperator.EQ, InputData);
                let oBindListField = oModelFields.bindList("/xGMSxGETTABLEFIELDS", undefined, undefined, [aFilterField]);
 
                oBindListField.requestContexts(0, Infinity).then(function(aContexts) {
                        FieldArray=[];
                        aContexts.forEach(function(oContext) {
                            FieldArray.push(oContext.getObject());
                        });
                        resolve(FieldArray);
                    });
                });
                loadDataPromise.then(function (FieldArray) {
                    that.createFields(FieldArray);
                    // console.log("executed1");
                    //that.createFieldsS4(FieldArray);
                });
            },
 
            createFields:function(FieldArray){
                let arrayData=FieldArray;
                var TableValue = this.getView().getModel("addTableModel").getData();
                for (var i = 0; i < arrayData.length; i++){
                    var oEntryField={
                        Snum:ezdata.snum,
                        EzID:ezdata.ezId,
                        Table:TableValue.Table,
                        SubProcessId:TableValue.subProcessId,
                        Field:arrayData[i].TableFieldName,
                        FieldType: "",
                        FieldID: "",
                        FieldDesc:arrayData[i].TableFieldShortDescription,
                        selected:false,
                        display:false,
                        mandatory:false,          
                        filterfield:false,
                        Operation: "",
                        DefaultVal: "",
                        MappedTable:"",
                        MappedField:"",
                        AddiFunction:"",
                        Formula:""
                    };
 
                    var oModelField = this.getView().getModel();
                    var oBindListNewEntryField = oModelField.bindList("/FieldMapping");
                    oBindListNewEntryField.create(oEntryField);
                   
                }
                this.RefreshData();
            },
 
            createFieldsS4:function(FieldArray){
                let arrayDatas4=FieldArray;
                var TableValue = this.getView().getModel("addTableModel").getData();
                for (var i = 0; i < arrayDatas4.length; i++){
                     var oEntryField2={
                        "Vcid" : ezdata.ezId,
                        "VcprId" : Math.random().toString().substring(2, 5),
                        "VcprTabid" : Math.random().toString().substring(2, 5),
                        "VcprFldid" : Math.random().toString().substring(2, 5),
                        "VcDesc" : "GMS Test report",
                        "VcprDesc" : "test",
                        "Tabname" : TableValue.Table,
                        "Ddtext" : tableShortDescription[0],
                        "Fieldname" : arrayDatas4[i].TableFieldName,
                        "FieldDesc" : arrayDatas4[i].TableFieldShortDescription,
                        "FieldType" : "FLT",
                        "TableFieldMapNav" : [
                            {
                            "Vcid" : ezdata.ezId,
                            "VcprId" : Math.random().toString().substring(2, 5),
                            "VcprTabid" : Math.random().toString().substring(2, 5),
                            "VcprFldid" : Math.random().toString().substring(2, 5),
                            "VcDesc" : "GMS Test report",
                            "VcprDesc" : "test",
                            "Tabname" : TableValue.Table,
                            "Ddtext" : tableShortDescription[0],
                            "Fieldname" : arrayDatas4[i].TableFieldName,
                            "FieldDesc" : arrayDatas4[i].TableFieldShortDescription,
                            }
                        ]
                    }
                    var oModelFieldS4 = this.getView().getModel();
                    var oBindListS4 = oModelFieldS4.bindList("/FieldMapSet");
                    oBindListS4.create(oEntryField2);
                }
            },
 
            oncancelNewTable:function(){
                this._oDialogTab.close();
            },
 
            onDelete: function (oEvent) {
               
                var oButton = oEvent.getSource();
                var oItem = oButton.getParent();
                var oContext = oItem.getBindingContext();
                var sPath = oContext.getPath();
                var oModel = this.getView().getModel();
 
                var ezIdValue = oEvent.getSource().getBindingContext().getObject().EzID;
                console.log("ezIdValue",ezIdValue);
                var tableValue = oEvent.getSource().getBindingContext().getObject().Table;
                var vcpirId  = oEvent.getSource().getBindingContext().getObject().SubProcessId;
                let oModeldelete = this.getView().getModel();
 
                sap.m.MessageBox.confirm("Are you sure you want to delete this entry?", {
                    actions: [sap.m.MessageBox.Action.OK, sap.m.MessageBox.Action.CANCEL],
                    onClose: function (oAction) {
                        if (oAction === sap.m.MessageBox.Action.OK) {
                            oModel.delete(sPath);
                            oModel.delete(`/TableMapSet(Vcid='${ezIdValue}',VcprId='${vcpirId}')`)
                                let oBindList = oModeldelete.bindList("/FieldMapping");
                                let tableFilter = new sap.ui.model.Filter("Table", sap.ui.model.FilterOperator.EQ, tableValue);
                                let EzIdFilter  = new sap.ui.model.Filter("EzID",sap.ui.model.FilterOperator.EQ, ezIdValue);
                                let aFilter=[tableFilter,EzIdFilter]
                                oBindList.filter(aFilter).requestContexts(0, Infinity).then(function (aContexts) {
                                    aContexts.forEach(function (context) {
                                        context.delete();
                                    });
                                })
                                .then(function () {
                                    sap.m.MessageBox.success("Entry deleted successfully.");
                                })
                                .catch(function () {
                                    sap.m.MessageBox.error("Error deleting entry.");
                                });   
                        }
                    }
                });
            },
 
            onNavTable:function(oEvent){
                const router = this.getOwnerComponent().getRouter();
                var selectedEzID = oEvent.getSource().getBindingContext().getObject().EzID;
                var selectedTable = oEvent.getSource().getBindingContext().getObject().Table;
                var selectedSubId = oEvent.getSource().getBindingContext().getObject().SubProcessId;
                console.log("selectedSubId",selectedSubId);
                var EzNavModel=this.getOwnerComponent().getModel("oSharedModel");
                EzNavModel.setProperty("/EzID",selectedEzID);
                EzNavModel.setProperty("/Table",selectedTable);
                EzNavModel.setProperty("/SubProcessId",selectedSubId);
                router.navTo("RouteFieldMapping")
            },
 
            RefreshData:  function () {
                this.getView().byId("_IDGenTable1").getBinding("items").refresh();
            }
           
        });
    });