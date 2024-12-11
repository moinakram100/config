sap.ui.define(
    ["sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/FilterType",
    "sap/ui/core/routing/HashChanger",
    "sap/ui/model/json/JSONModel"
  ],
    function (BaseController, History,Filter,FilterOperator,FilterType,HashChanger,JSONModel) {
      "use strict";
      var EzID;
      var Table;
      var SubProcessID;
      let fieldsArray;
      var flag = false;
      let usedFieldsArray;
      let validateNewField;
      return BaseController.extend("com.ingenx.config.controller.tableFieldMapping", {
        onInit: function () {
       
        this.getOwnerComponent().getRouter().getRoute("RouteFieldMapping").attachPatternMatched(this.handleRouteMatched, this);
  
        let oModel = this.getOwnerComponent().getModel();
        var oBindlistEzFields = oModel.bindList("/FieldMapping");
        oBindlistEzFields.requestContexts(0,Infinity).then(function(aContexts){
            fieldsArray=[];
            aContexts.forEach(function(aContext){
              if(aContext.getObject().selected === true && aContext.getObject().EzID === EzID && aContext.getObject().Table === Table ){
                fieldsArray.push(aContext.getObject())
              }
            })
        });
        // window.history.pushState({ page: 1 }, "", "");
        // window.addEventListener('popstate', this.onPopState.bind(this));
  
        },
        handleRouteMatched: function () {
          var EzNavModel=this.getOwnerComponent().getModel("oSharedModel");
              EzID = EzNavModel.getProperty("/EzID");
              Table = EzNavModel.getProperty("/Table");
              SubProcessID = EzNavModel.getProperty("/SubProcessId");
          var oFilterTable = new Filter("Table", FilterOperator.EQ, Table);
          var oFilterEzID  = new Filter("EzID", FilterOperator.EQ, EzID);
          var aFilters = [oFilterTable, oFilterEzID];
          this.getView().byId("FieldsTable").getBinding("items").filter(aFilters, FilterType.Application);
         
      },
  
      // onPopState: function(event) {
      //   if(flag){
      //     sap.m.MessageBox.confirm("Do you really want to exit without saving?", {
      //       actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
      //       onClose: function (oAction) {
      //           if (oAction === sap.m.MessageBox.Action.YES) {
      //               window.removeEventListener('popstate', this.onPopState.bind(this));
      //               window.history.back();
      //           } else {
      //               window.history.pushState({ page: 1 }, "", "");
      //           }
      //       }.bind(this)
      //     });
      //   }
      //   else {
      //     window.removeEventListener('popstate', this.onPopState.bind(this));
      //     window.history.back();
      //   }
      // },
     
      onSearch: function (oEvent) {
        var oTableSearchState = [],
        sQuery = oEvent.getParameter("query");
  
        console.log("length",sQuery.length);
  
        if (sQuery && sQuery.length > 0) {
          oTableSearchState = [new Filter("Field", FilterOperator.Contains, sQuery),new Filter("Table", FilterOperator.EQ, Table),new Filter("EzID", FilterOperator.EQ, EzID)];
        }
        else {
          oTableSearchState = [new Filter("Table", FilterOperator.EQ, Table),new Filter("EzID", FilterOperator.EQ, EzID)]
        }
       
  
        this.getView().byId("FieldsTable").getBinding("items").filter(oTableSearchState, "Application");
      },
  
      onAdd:function(){
        this.usedFieldAndDesc();
        var oView=this.getView();
        const addFieldData = {
            fieldName: "",
            fieldDesc: "",
            fieldType: "",
        };
        const addFieldModel = new JSONModel(addFieldData);
        oView.setModel(addFieldModel,"addFieldModel");
        if(!this._oDialogField){
            this._oDialogField=sap.ui.xmlfragment("com.ingenx.config.fragments.addField", this);
            oView.addDependent(this._oDialogField);
        }
        this._oDialogField.open();
      },
  
      oncancelNewField:function(){
        this._oDialogField.close();
      },
  
      usedFieldAndDesc: function () {
        var that = this;
  
        let oModel = that.getOwnerComponent().getModel();
        let oBindList = oModel.bindList("/FieldMapping");
        oBindList.requestContexts(0,Infinity).then(function (aContexts){
            usedFieldsArray=[];
            aContexts.forEach(function (oContext) {
              if(oContext.getObject().Table!=null && EzID == oContext.getObject().EzID && Table == oContext.getObject().Table){
                  usedFieldsArray.push(oContext.getObject());
              }
            });
            validateNewField = usedFieldsArray.map(function (obj) {
                return {
                    Snum: obj.Snum,
                    EzID: obj.EzID,
                    Field: obj.Field,
                    FieldDesc: obj.FieldDesc
                };
            });
            console.log("Validate New Field", validateNewField);
        });
      },
  
      onFieldType:function(){
        var oView = this.getView();
        if(!this._oDialogFieldtype){
          this._oDialogFieldtype = sap.ui.xmlfragment("com.ingenx.config.fragments.fieldType",this);
          oView.addDependent(this._oDialogFieldtype);
        }
        this._oDialogFieldtype.open();
      },
  
      onValueHelpCloseFieldType:function(oEvent){
        var oSelectedItem = oEvent.getParameter("selectedItem");
        oEvent.getSource().getBinding("items").filter([]);
  
        if (!oSelectedItem) {
          return;
        }
        var sDataType = oSelectedItem.getTitle();
        this.getView().getModel("addFieldModel").setProperty("/fieldType", sDataType);
        this._oDialogFieldtype.close();
      },
  
      onSaveNewField:function(){
        var addFieldData = this.getView().getModel("addFieldModel").getData();
        var oEntryField = {
          Snum: validateNewField[0].Snum,
          EzID: EzID,
          Table: Table,
          Field: addFieldData.fieldName,
          SubProcessId: SubProcessID,
          FieldType: addFieldData.fieldType,
          FieldID: "",
          FieldDesc: addFieldData.fieldDesc,
          selected:false,
          display:false,
          mandatory:false,          
          filterfield:false,
          Operation: "",
          DefaultVal: "",
        }
       
        if (oEntryField.Field === '' || oEntryField.FieldDesc === '' || oEntryField.FieldType === '') {
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
      }else {
  
          var isDuplicateField = validateNewField.some(function (entry) {
              return (
                  entry.Field.toLowerCase() === oEntryField.Field.toLowerCase() || entry.FieldDesc.toLowerCase() ===  oEntryField.FieldDesc.toLowerCase()
              );
          });
  
          if (isDuplicateField) {
              sap.m.MessageToast.show("Field or Description already exists.", {
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
          } else {
              validateNewField.push(oEntryField);
              console.log("Entry added successfully");
          }
      }
  
      let oModel = this.getView().getModel();
      let oBindListSP = oModel.bindList("/FieldMapping");
      oBindListSP.create(oEntryField);
  
      this._oDialogField.close();
      this.RefreshData();
      },
  
      RefreshData: function () {
        this.getView().byId("FieldsTable").getBinding("items").refresh();
      },
  
   
  });
   
  });