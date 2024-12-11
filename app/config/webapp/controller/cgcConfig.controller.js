sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    'sap/ui/core/Fragment',
    "sap/ui/model/Filter",
    "sap/ui/model/FilterType",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageBox"
  ],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel, Fragment, Filter, FilterType, FilterOperator, MessageBox) {
      "use strict";
      let lastID;
      let initialArray = {
        ID: []
      };
  
      let docData;
      let staticData = [];
      let dynamicData = [];
      let uniqueDocs;
  
      return Controller.extend("com.ingenx.config.controller.cgcConfig", {
        onInit: function () {
  
  
          var that = this;
          let documentTypeHI = this.getOwnerComponent().getModel();
          let oBindList = documentTypeHI.bindList("/DocumentNoProfileMapping");
  
          oBindList.requestContexts(0, Infinity).then(function (aContexts) {
            docData = [];
            aContexts.forEach(function (oContext) {
              docData.push(oContext.getObject());
            });
  
            let uniqueDocumentKeys = {};
            uniqueDocs = docData.filter(function (doc) {
              let key = doc.DocumentNo + "_" + doc.DocumentDesc;
              if (!uniqueDocumentKeys[key]) {
                uniqueDocumentKeys[key] = true;
                return true;
              }
              return false;
            });
  
            console.log("Unique Documents:", uniqueDocs);
            var docTypesModel = new sap.ui.model.json.JSONModel(uniqueDocs);
            that.getView().setModel(docTypesModel, "docHITypes");
  
          })
  
          this.headerConfig()
  
  
  
          // ONINIT ENDS
        },
  
  
        headerConfig: function () {
          let staticModel = new sap.ui.model.json.JSONModel();
          this.getView().setModel(staticModel, "staticModel");
  
          let dynamicModel = new sap.ui.model.json.JSONModel();
          this.getView().setModel(dynamicModel, "dynamicModel");
  
          let parameterModel = this.getOwnerComponent().getModel();
          let paramBindList = parameterModel.bindList("/HeaderItem_Config");
  
          paramBindList.requestContexts(0, Infinity).then(function (aContexts) {
            let getModelData = [];
            getModelData = aContexts.map(function (oContext) {
              return oContext.getObject();
            });
  
            staticData = getModelData.filter((item) => item.flag === null);
            staticData.sort(function (a, b) {
              return a.ID - b.ID;
            });
            staticModel.setData(staticData);
            staticModel.refresh();
  
            dynamicData = getModelData.filter((item) => item.flag !== null);
            dynamicData.sort(function (a, b) {
              return a.ID - b.ID;
            });
  
            dynamicModel.setData(dynamicData);
            dynamicModel.attachRequestCompleted(function () {
              var dataRel = dynamicModel.getData();
              var selectedKey = dataRel.parameterRelevancy;
              console.log("ads", selectedKey)
  
              if (selectedKey) {
                oView.byId("comboDynamic").setSelectedKey(selectedKey);
              }
            });
  
            dynamicModel.attachRequestFailed(function () {
              MessageBox.error("Failed to load data from backend.");
            });
  
            dynamicModel.refresh();
  
          }.bind(this));
        },
  
        refreshModel: function () {
          try {
            var documentTypeControl = this.getView().byId("documentType_Id");
            var selectedItem = documentTypeControl.getSelectedItem();
            if (!selectedItem) {
              console.error("No document type selected.");
              return;
            }
            var documentType = selectedItem.getText();
            let dynamicModel = this.getView().getModel("dynamicModel");
  
            let fieldsModel = this.getOwnerComponent().getModel();
            let fieldsBindList = fieldsModel.bindList("/HeaderItem_Config");
  
            fieldsBindList.requestContexts(0, Infinity).then(function (aContexts) {
              let getModelData = aContexts.map(function (oContext) {
                return oContext.getObject();
              });
  
              let dynamicData = getModelData.filter(function (item) {
                return item.flag !== null;
              }).sort(function (a, b) {
                return a.ID - b.ID;
              });
  
              let filteredData = dynamicData.filter(function (item) {
                return item.documentType === documentType;
              });
  
              dynamicModel.setData(filteredData);
              dynamicModel.refresh(true);
  
            }.bind(this)).catch(function (error) {
              console.error("Error requesting contexts:", error);
            });
          } catch (error) {
            console.error("Error in refreshModel:", error);
          }
        },
  
        onAddDynamic: function () {
  
          var sContractType = this.getView().byId("contractType_Id").getSelectedKey();
          var sDocumentType = this.getView().byId("documentType_Id").getSelectedKey();
  
          if (!sContractType && !sDocumentType) {
            MessageBox.error("Please select Contract Type and Document Type.");
            return;
          } else if (!sContractType) {
            MessageBox.error("Please select Contract Type.");
            return;
          } else if (!sDocumentType) {
            MessageBox.error("Please select Document Type.");
            return;
          }
  
          this.onLastParamCId();
          var oView = this.getView();
          const addServiceParameterData = {
            parameterLabel: "",
            selectedFieldType: "String",
            selectedStandardType: "Price List",
            fieldLength: "",
            fieldstandard: [
              {
                key: "Master Contract",
                text: "Master Contract"
              },
              {
                key: "Pricing Date",
                text: "Pricing Date"
              },
              {
                key: "Inco Terms",
                text: "Inco Terms"
              },
              {
                key: "Material Pricing Group",
                text: "Material Pricing Group"
              },
              {
                key: "Storage Location",
                text: "Storage Location"
              }
            ],
            fieldTypeList: [
              {
                key: "String",
                text: "String"
              },
              {
                key: "Integer",
                text: "Integer"
              },
              {
                key: "Boolean",
                text: "Boolean"
              },
              {
                key: "Decimal",
                text: "Decimal"
              },
              {
                key: "Date",
                text: "Date"
              },
              {
                key: "Date and Time",
                text: "Date and Time"
              },
              {
                key: "Table",
                text: "Table"
              },
              { key: "Quantity", text: "Quantity" },
              { key: "List", text: "List" }
            ],
            listValues: []
          };
          const addServiceParameterCustom = {
            parameterName: "",
            parameterLabel: "",
            selectedFieldType: "String",
            fieldLength: "",
            fieldTypeList: [
              {
                key: "String",
                text: "String"
              },
              {
                key: "Integer",
                text: "Integer"
              },
              {
                key: "Boolean",
                text: "Boolean"
              },
              {
                key: "Decimal",
                text: "Decimal"
              },
              {
                key: "Date",
                text: "Date"
              },
              {
                key: "Date and Time",
                text: "Date and Time"
              },
              {
                key: "Table",
                text: "Table"
              },
              { key: "Quantity", text: "Quantity" },
              { key: "List", text: "List" }
            ],
            listValues: []
          };
          const addServiceParameterModel = new JSONModel(addServiceParameterData);
          oView.setModel(addServiceParameterModel, "addServiceParameterModel");
          const addServiceParameterModelCustom = new JSONModel(addServiceParameterCustom);
          oView.setModel(addServiceParameterModelCustom, "addServiceParameterModelCustom");
          if (!this._oDialogCGc) {
            this._oDialogCGc = sap.ui.xmlfragment("com.ingenx.config.fragments.addFieldCGC", this);
            oView.addDependent(this._oDialogCGc);
          }
          this._oDialogCGc.open();
        },
  
        onComboBoxChange: function (oEvent) {
          var selectedKey = oEvent.getParameter("selectedItem").getKey();
          var oView = this.getView();
          oView.getModel("addServiceParameterModel").setProperty("/selectedFieldType", selectedKey);
          oView.getModel("addServiceParameterModel").setProperty("/fieldLength", "");
        },
  
        onComboBoxChange2: function (oEvent) {
          var selectedKey = oEvent.getParameter("selectedItem").getKey();
          var oView = this.getView();
          oView.getModel("addServiceParameterModel").setProperty("/selectedStandardType", selectedKey);
          oView.getModel("addServiceParameterModel").setProperty("/fieldLength", "");
        },
  
        onAddListItemStandatd: function () {
          var oView = this.getView();
          var listValues = oView.getModel("addServiceParameterModel").getProperty("/listValues");
          listValues.push({ value: "" });
          oView.getModel("addServiceParameterModel").setProperty("/listValues", listValues);
        },
  
        onAddListItemCustom: function () {
          var oView = this.getView();
          var listValues = oView.getModel("addServiceParameterModelCustom").getProperty("/listValues");
          listValues.push({ value: "" });
          oView.getModel("addServiceParameterModelCustom").setProperty("/listValues", listValues);
        },
  
        onLastParamCId: function () {
          try {
            let oTable = this.getView().byId("dynamicTable"); // Correct table ID
            let oItems = oTable.getItems();
  
            let maxID = 0;
            oItems.forEach(function (oItem) {
              var currentID = parseInt(oItem.getCells()[1].getText(), 10);
              if (!isNaN(currentID) && currentID > maxID) {
                maxID = currentID;
              }
            });
  
            lastID = maxID.toString();
          } catch (error) {
            console.error("Error finding max ID:", error);
            this.lastID = "0";
          }
          console.log("Max ID:", lastID);
        },
  
        checkMandatory: function (flag) {
          if (flag === null || flag === undefined) {
            return false; 
          }
          return true;
        },
  
  
  
        onContractTypeSelect: function (oEvent) {
          var selectedText = oEvent.getParameter("selectedItem").getText();
          console.log("Selected Contract Type:", selectedText);
  
          var docTypesModel = this.getView().getModel("docHITypes");
  
          var filteredDocs = [];
          if (selectedText === "Sales Contract") {
            filteredDocs = uniqueDocs.filter(function (doc) {
              return doc.DocumentDesc === "LP";
            });
          } else if (selectedText === "Purchase Contract") {
            filteredDocs = uniqueDocs.filter(function (doc) {
              return doc.DocumentDesc === "K" || doc.DocumentDesc === "F";
            });
          }
  
          docTypesModel.setData({ DocumentTypes: filteredDocs });
          console.log("Filtered Document Types:", filteredDocs);
  
          var staticTable = this.byId("staticTable");
          var dynamicTable = this.byId("dynamicTable");
  
          staticTable.setVisible(false);
          dynamicTable.setVisible(false);
  
          var documentTypeSelect = this.byId("documentType_Id");
          documentTypeSelect.bindItems({
            path: "docHITypes>/DocumentTypes",
            template: new sap.ui.core.Item({
              key: "{docHITypes>DocumentNo}",
              text: "{docHITypes>DocumentNo}"
            })
          });
        },
  
        onDocumentTypeSelect: function (oEvent) {
          let selectedDocType = oEvent.getParameter("selectedItem").getText();
  
          let staticModel = this.getView().getModel("staticModel");
          let dynamicModel = this.getView().getModel("dynamicModel");
  
          let staticFilteredData = staticData.filter(function (item) {
            return item.documentType === selectedDocType;
          });
  
          let dynamicFilteredData = dynamicData.filter(function (item) {
            return item.documentType === selectedDocType;
          });
  
          staticModel.setData(staticFilteredData);
          dynamicModel.setData(dynamicFilteredData);
  
          let staticTable = this.byId("staticTable");
          let dynamicTable = this.byId("dynamicTable");
  
          staticTable.setVisible(true);
          dynamicTable.setVisible(true);
        },
  
        onMandatoryChange: function (oEvent) {
          let selectedItem = oEvent.getParameter("selectedItem");
          let selectedKey = selectedItem ? selectedItem.getKey() : null;
          let selectedText = selectedItem ? selectedItem.getText() : "Select";
  
          let oBindingContext = selectedItem ? selectedItem.getBindingContext("dynamicModel") : null;
          let sUniqueId = oBindingContext ? oBindingContext.getModel().getProperty(oBindingContext.getPath() + "/unique") : null;
          let sPath = "/HeaderItem_Config";
  
          this.handleEdit(sPath, sUniqueId, {
            parameterRelevancy: selectedText
          });
        },
  
        onStaticLabelUpdate: function (oEvent) {
          let oInput = oEvent.getSource();
          let sNewValue = oInput.getValue()
          let oBindingContext = oInput.getBindingContext("staticModel");
          let oModel = oBindingContext.getModel();
          let sUniqueId = oModel.getProperty(oBindingContext.getPath() + "/unique");
          let sPath = "/HeaderItem_Config";
      
          // Check if the new value is empty lax
          if (sNewValue === "") {
              
              sap.m.MessageBox.error("Please fill the label field.");
      
             
              oInput.setValueState(sap.ui.core.ValueState.Error);
              oInput.setValueStateText("This field cannot be empty.");
          } else {
              
              oInput.setValueState(sap.ui.core.ValueState.None); 
      //end
              this.handleEdit(sPath, sUniqueId, {
                  label: sNewValue
              });
          }
      },
  
        onDynamicLabelUpdate: function (oEvent) {
          let oInput = oEvent.getSource();
          let sNewValue = oInput.getValue();
          let oBindingContext = oInput.getBindingContext("dynamicModel");
          let oModel = oBindingContext.getModel();
          let sUniqueId = oModel.getProperty(oBindingContext.getPath() + "/unique");
          let sPath = "/HeaderItem_Config";
  
          this.handleEdit(sPath, sUniqueId, {
            label: sNewValue
          });
        },
  
        onMandatoryCheckboxChange: function (oEvent) {
          var oCheckBox = oEvent.getSource();
          var bSelected = oEvent.getParameter("selected");
  
          var oBindingContext = oCheckBox.getBindingContext("dynamicModel");
          var oModel = oBindingContext.getModel();
          var sUniqueId = oModel.getProperty(oBindingContext.getPath() + "/unique");
          let sPath = "/HeaderItem_Config";
  
          this.handleEdit(sPath, sUniqueId, {
            mandatory: bSelected
          });
        },
  
        onVisibleCheckboxChange: function (oEvent) {
          var oCheckBox = oEvent.getSource();
          var bSelected = oEvent.getParameter("selected");
  
          var oBindingContext = oCheckBox.getBindingContext("dynamicModel");
          var oModel = oBindingContext.getModel();
          var sUniqueId = oModel.getProperty(oBindingContext.getPath() + "/unique");
  
          let sPath = "/HeaderItem_Config";
  
          this.handleEdit(sPath, sUniqueId, {
            visible: bSelected
          });
        },
  
        handleEdit: function (sPath, sUniqueId, oUpdatedData) {
          let oModel = this.getView().getModel();
  
          let oFilter = new sap.ui.model.Filter("unique", sap.ui.model.FilterOperator.EQ, sUniqueId);
  
          oModel.bindList(sPath, null, null, [oFilter]).requestContexts().then(function (aContexts) {
            if (aContexts.length > 0) {
              let oContext = aContexts[0];
  
              Object.keys(oUpdatedData).forEach(function (sProperty) {
                oContext.setProperty(sProperty, oUpdatedData[sProperty]);
              });
            } else {
              console.error("No item found with unique ID:", sUniqueId);
            }
          }).catch(function (error) {
            console.error("Error updating item:", error);
          });
        },
  
        onSaveCustom: function () {
          var ContractType = this.getView().byId("contractType_Id").getSelectedItem().getText();
          var documentType = this.getView().byId("documentType_Id").getSelectedItem().getText();
  
          var oView = this.getView();
          var oModels = oView.getModel("addServiceParameterModelCustom");
          var listValues = oModels.getProperty("/listValues");
  
          var addServiceParameterCustom = this.getView().getModel("addServiceParameterModelCustom").getData();
          var flag = this.getView().byId("staticTable").getItems().length + 1;
  
  
          var oEntryDataCustomParameter = {
            ID: (parseInt(lastID, 10) + 1),
            contractType: ContractType,
            documentType: documentType,
            flag: flag,
            service_parameter: addServiceParameterCustom.parameterName,
            label: addServiceParameterCustom.parameterLabel,
            serviceParameterType: addServiceParameterCustom.selectedFieldType,
            serviceParameterlength: addServiceParameterCustom.fieldLength,
            mandatory: this.checkMandatory(addServiceParameterCustom.parameterName),
            List: listValues.map(item => item.value),
            visible: this.checkMandatory(addServiceParameterCustom.parameterName),
          };
  
          let oModel = this.getView().getModel();
          let oBindListSP = oModel.bindList("/HeaderItem_Config");
          oBindListSP.create(oEntryDataCustomParameter);
          oBindListSP.attachCreateCompleted((oEvent) => {
            let params = oEvent.getParameters();
  
            if (params.success) {
              this.refreshModel()
            }
          })
  
          this._oDialogCGc.close();
        },
  
  
        onSaveStandard: function () {
  
          var ContractType = this.getView().byId("contractType_Id").getSelectedItem().getText();
          var documentType = this.getView().byId("documentType_Id").getSelectedItem().getText();
          var oView = this.getView();
          var oModels = oView.getModel("addServiceParameterModel");
          var listValues = oModels.getProperty("/listValues");
  
          var selectedItemKey = this.getView().byId("contractType_Id").mProperties.selectedKey
          console.log("selectedItemKey", selectedItemKey)
  
  
          var addServiceParameterData = this.getView().getModel("addServiceParameterModel").getData();
          var flag = this.getView().byId("staticTable").getItems().length + 1
          var oEntryDataServiceParameter = {
            ID: (parseInt(lastID, 10) + 1),
            contractType: ContractType,
            documentType: documentType,
            flag: flag,
            service_parameter: addServiceParameterData.selectedStandardType,
            label: addServiceParameterData.parameterLabel,
            serviceParameterType: addServiceParameterData.selectedFieldType,
            serviceParameterlength: addServiceParameterData.fieldLength,
            mandatory: this.checkMandatory(addServiceParameterData.selectedStandardType),
            List: listValues.map(item => item.value),
            visible: this.checkMandatory(addServiceParameterData.selectedStandardType),
          };
  
          let oModel = this.getView().getModel();
          let oBindListSP = oModel.bindList("/HeaderItem_Config");
          oBindListSP.create(oEntryDataServiceParameter);
          oBindListSP.attachCreateCompleted((oEvent) => {
            let params = oEvent.getParameters();
  
            if (params.success) {
              this.refreshModel()
            }
          })
  
          this._oDialogCGc.close();
        },
  
  
  
  
        //Delete
        onDeleteDynamic: function () {
  
  
          var addField = this.byId("createFieldID");
          var delField = this.byId("deleteFieldID");
          var confirmDelField = this.byId("deleteFieldConfirmBtn");
          var cancelDelField = this.byId("cancelFieldDeleteBtn");
          var delDynamicCheckBox = this.byId("deleteDynamicField");
  
          // TOGGLE VISIBILTY
          addField.setVisible(!addField.getVisible());
          delField.setVisible(!delField.getVisible());
          confirmDelField.setVisible(!confirmDelField.getVisible());
          cancelDelField.setVisible(!cancelDelField.getVisible());
          delDynamicCheckBox.setVisible(!delDynamicCheckBox.getVisible());
        },
  
        onCancelFieldDeletion: function () {
          this.onDeleteDynamic();
          this.onNullSelected();
          this.onFieldUnCheckBox();
        },
  
        onSelectAllDynamicField: function (oEvent) {
          var oTable = this.byId("dynamicTable");
          var oItems = oTable.getItems();
          var selectAll = oEvent.getParameter("selected");
  
          if (!selectAll) {
            initialArray.ID = [];
          } else {
            oItems.forEach(function (oItem) {
              var uniqueValue = oItem.getBindingContext("dynamicModel").getProperty("unique");
              if (oItem.getCells()[4].getProperty("enabled")) {
                if (initialArray.ID.indexOf(uniqueValue) === -1) {
                  initialArray.ID.push(uniqueValue);
                }
              }
            });
          }
  
          for (var i = 0; i < oItems.length; i++) {
            var oItem = oItems[i];
            var oCheckBox = oItem.getCells()[0];
            var flagStatus = oItem.getCells()[4];
  
            if (oCheckBox instanceof sap.m.CheckBox && flagStatus.getProperty("enabled")) {
              oCheckBox.setSelected(selectAll);
            }
          }
  
          console.log("initialArray.ID", initialArray.ID);
        },
  
  
        onFieldUnCheckBox: function () {
          var selectedItems = initialArray.ID;
          var selectedItemKey = this.getView().byId("contractType_Id").getSelectedKey();
     
          var oTable;
          if (selectedItemKey === "salesContract") {
              oTable = this.byId("dynamicTable");
          } else {
              oTable = this.byId("table2");
          }
     
          // Check if oTable is found before proceeding
          if (!oTable) {
              console.error("Table not found for the selected key: " + selectedItemKey);
              return;
          }
      // end
          var oItems = oTable.getItems();
          oItems.forEach(function (oItem) {
              oItem.getCells()[0].setSelected(false);
          });
     
          this.getView().byId("selectAllDynamicFields").setSelected(false);
      },  
  
        onDeleteDynamicFieldArray: function (oEvent) {
          var selectedPaths = oEvent.getSource().getParent().getAggregation("cells");
  
          for (var i = 0; i < selectedPaths.length; i++) {
            if (i === 0) {
              let checkbox = selectedPaths[i];
              let uniqueValue = selectedPaths[i + 1].getBindingContext("dynamicModel").getProperty("unique");
  
              if (checkbox.getSelected()) {
                if (initialArray.ID.indexOf(uniqueValue) === -1) {
                  initialArray.ID.push(uniqueValue);
                }
              } else {
                var index = initialArray.ID.indexOf(uniqueValue);
                if (index !== -1) {
                  initialArray.ID.splice(index, 1);
                }
              }
            }
          }
  
          console.log("Initial Path Delete Array:", initialArray.ID);
        },
  
  
  
        onConfirmFieldDeletion: function () {
  
          let fieldsModel = this.getOwnerComponent().getModel();
          let fieldsBindList = fieldsModel.bindList("/HeaderItem_Config");
  
          if (initialArray.ID.length === 0) {
            sap.m.MessageBox.error("Please select at least one checkbox.");
            return;
          }
  
          sap.m.MessageBox.confirm("Are you sure you want to delete the selected fields?", {
            onClose: async (sAction) => {
              if (sAction === sap.m.MessageBox.Action.OK) {
                let aFilters = initialArray.ID.map(id => new sap.ui.model.Filter("unique", sap.ui.model.FilterOperator.EQ, id));
                let oCombinedFilter = new sap.ui.model.Filter({
                  filters: aFilters,
                  and: false
                });
  
                try {
                  let aContexts = await fieldsBindList.filter(oCombinedFilter).requestContexts();
                  for (let i = 0; i < aContexts.length; i++) {
                    await aContexts[i].delete();
                  }
  
                  initialArray.ID = [];
                  this.refreshModel()
                  this.onDeleteDynamic();
                  this.onNullSelected();
                  this.onFieldUnCheckBox();
                } catch (error) {
                  sap.m.MessageBox.error("Error during deletion: " + error.message);
                  console.error("Error during deletion: ", error);
                }
              }
            }
          });
  
        },
  
  
        onNullSelected: function () {
          initialArray = {
            ID: []
          };
        },
  
        oncancelNewParameter: function () {
          this._oDialogCGc.close();
        },
  
      });
    });
  
  