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
              oView.byId("cgcConfig_DynamicSelect_Relevancy").setSelectedKey(selectedKey);
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
          var documentTypeControl = this.getView().byId("cgcConfig_Select_DocumentType");
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
        try {
          var sContractType = this.getView().byId("cgcConfig_Select_ContractType").getSelectedKey();
          var sDocumentType = this.getView().byId("cgcConfig_Select_DocumentType").getSelectedKey();
      
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
              { key: "Master Contract", text: "Master Contract" },
              { key: "Pricing Date", text: "Pricing Date" },
              { key: "Inco Terms", text: "Inco Terms" },
              { key: "Material Pricing Group", text: "Material Pricing Group" },
              { key: "Storage Location", text: "Storage Location" }
            ],
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
      
          const addServiceParameterCustom = {
            parameterName: "",
            parameterLabel: "",
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
      
          const addServiceParameterModel = new JSONModel(addServiceParameterData);
          oView.setModel(addServiceParameterModel, "addServiceParameterModel");
      
          const addServiceParameterModelCustom = new JSONModel(addServiceParameterCustom);
          oView.setModel(addServiceParameterModelCustom, "addServiceParameterModelCustom");
      
          if (!this._oDialogCGc) {
            this._oDialogCGc = sap.ui.xmlfragment("com.ingenx.config.fragments.addFieldCGC", this);
            oView.addDependent(this._oDialogCGc);
          }
          
          this._oDialogCGc.open();
        } catch (error) {
          MessageToast.show(`Error occurred: ${error.message}`);
          console.error(error);
        }
      },
     

      onComboBoxChange: function (oEvent) {
        try {
        var selectedKey = oEvent.getParameter("selectedItem").getKey();
        var oView = this.getView();
        oView.getModel("addServiceParameterModel").setProperty("/selectedFieldType", selectedKey);
        oView.getModel("addServiceParameterModel").setProperty("/fieldLength", "");
        } catch (error) {
          MessageToast.show(`Error occurred: ${error.message}`);
          console.error(error);
        }
      },

      onComboBoxChange2: function (oEvent) {
        try {
        var selectedKey = oEvent.getParameter("selectedItem").getKey();
        var oView = this.getView();
        oView.getModel("addServiceParameterModel").setProperty("/selectedStandardType", selectedKey);
        oView.getModel("addServiceParameterModel").setProperty("/fieldLength", "");
        } catch (error) {
          MessageToast.show(`Error occurred: ${error.message}`);
          console.error(error);
        }
      },

      onAddListItemStandatd: function () {
        try {
        var oView = this.getView();
        var listValues = oView.getModel("addServiceParameterModel").getProperty("/listValues");
        listValues.push({ value: "" });
        oView.getModel("addServiceParameterModel").setProperty("/listValues", listValues);
        } catch (error) {
          MessageToast.show(`Error occurred: ${error.message}`);
          console.error(error);
        }
      },

      onAddListItemCustom: function () {
        try {
        var oView = this.getView();
        var listValues = oView.getModel("addServiceParameterModelCustom").getProperty("/listValues");
        listValues.push({ value: "" });
        oView.getModel("addServiceParameterModelCustom").setProperty("/listValues", listValues);
        } catch (error) {
          MessageToast.show(`Error occurred: ${error.message}`);
          console.error(error);
        }
      },


      onLastParamCId: function () {
        try {
          let oTable = this.getView().byId("cgcConfig_DynamicTable"); // Correct table ID
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
            MessageToast.show(`Error occurred: ${error.message}`);
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
        try {
        var selectedText = oEvent.getParameter("selectedItem").getText();
        console.log("Selected Contract Type:", selectedText);
    
        // Get the OData model instance
        var oModel = this.getOwnerComponent().getModel();
        var that = this;
    
        // Bind and fetch data dynamically from the entity set
        var oBindList = oModel.bindList("/DocumentNoProfileMapping");
    
        oBindList.requestContexts(0, Infinity).then(function (aContexts) {
            // Extract data from contexts
            var docData = aContexts.map(function (oContext) {
                return oContext.getObject();
            });
    
            // Perform filtration based on the selected contract type
            var filteredDocs = [];
            if (selectedText === "Sales Contract") {
                filteredDocs = docData.filter(function (doc) {
                    return doc.DocumentDesc === "LP";
                });
            } else if (selectedText === "Purchase Contract") {
                filteredDocs = docData.filter(function (doc) {
                    return doc.DocumentDesc === "K" || doc.DocumentDesc === "F";
                });
            }
    
            // Remove duplicates based on DocumentNo
            var uniqueDocs = [];
            var uniqueKeys = new Set();
            filteredDocs.forEach(function (doc) {
                if (!uniqueKeys.has(doc.DocumentNo)) {
                    uniqueKeys.add(doc.DocumentNo);
                    uniqueDocs.push(doc);
                }
            });
    
            console.log("Filtered Unique Document Types:", uniqueDocs);
    
            // Create and set a new JSONModel with the unique filtered data
            var docTypesModel = new sap.ui.model.json.JSONModel({ DocumentTypes: uniqueDocs });
            that.getView().setModel(docTypesModel, "docHITypes");
    
            // Bind the unique data to the Document Type select control
            var documentTypeSelect = that.byId("cgcConfig_Select_DocumentType");
            documentTypeSelect.bindItems({
                path: "docHITypes>/DocumentTypes",
                template: new sap.ui.core.Item({
                    key: "{docHITypes>DocumentNo}",
                    text: "{docHITypes>DocumentNo}"
                })
            });
    
            // Hide the static and dynamic tables initially
            var staticTable = that.byId("cgcConfig_StaticTable");
            var dynamicTable = that.byId("cgcConfig_DynamicTable");
    
            staticTable.setVisible(false);
            dynamicTable.setVisible(false);
        }).catch(function (error) {
                sap.m.MessageToast.show("Error fetching DocumentNoProfileMapping data.");
            console.error("Error fetching DocumentNoProfileMapping data:", error);
        });
        } catch (error) {
            sap.m.MessageToast.show("An error occurred while processing contract type selection.");
            console.error("Error in onContractTypeSelect:", error);
        }
    },

      onDocumentTypeSelect: function (oEvent) {
        try {
        let selectedDocType = oEvent.getParameter("selectedItem").getText();

        let staticModel = this.getView().getModel("staticModel");
        let dynamicModel = this.getView().getModel("dynamicModel");
    
            let staticData = staticModel.getData();
            let dynamicData = dynamicModel.getData();

        let staticFilteredData = staticData.filter(function (item) {
          return item.documentType === selectedDocType;
        });

        let dynamicFilteredData = dynamicData.filter(function (item) {
          return item.documentType === selectedDocType;
        });

        staticModel.setData(staticFilteredData);
        dynamicModel.setData(dynamicFilteredData);

        let staticTable = this.byId("cgcConfig_StaticTable");
        let dynamicTable = this.byId("cgcConfig_DynamicTable");

        staticTable.setVisible(true);
        dynamicTable.setVisible(true);
        } catch (error) {
            sap.m.MessageToast.show("An error occurred while processing document type selection.");
            console.error("Error in onDocumentTypeSelect:", error);
        }
      },

      onMandatoryChange: function (oEvent) {
        try {
        let selectedItem = oEvent.getParameter("selectedItem");
        let selectedKey = selectedItem ? selectedItem.getKey() : null;
        let selectedText = selectedItem ? selectedItem.getText() : "Select";

        let oBindingContext = selectedItem ? selectedItem.getBindingContext("dynamicModel") : null;
        let sUniqueId = oBindingContext ? oBindingContext.getModel().getProperty(oBindingContext.getPath() + "/unique") : null;
        let sPath = "/HeaderItem_Config";

        this.handleEdit(sPath, sUniqueId, {
          parameterRelevancy: selectedText
        });
        } catch (error) {
            sap.m.MessageToast.show("An error occurred while processing mandatory change.");
            console.error("Error in onMandatoryChange:", error);
        }
      },


      onStaticLabelUpdate: function (oEvent) {
        try {
        let oInput = oEvent.getSource();
            let sNewValue = oInput.getValue();
        let oBindingContext = oInput.getBindingContext("staticModel");
        let oModel = oBindingContext.getModel();
        let sUniqueId = oModel.getProperty(oBindingContext.getPath() + "/unique");
        let sPath = "/HeaderItem_Config";
    
            // Check if the new value is empty
        if (sNewValue === "") {
            sap.m.MessageBox.error("Please fill the label field.");
            oInput.setValueState(sap.ui.core.ValueState.Error);
            oInput.setValueStateText("This field cannot be empty.");
        } else {
            oInput.setValueState(sap.ui.core.ValueState.None); 
            this.handleEdit(sPath, sUniqueId, {
                label: sNewValue
            });
        }
        } catch (oError) {
            sap.m.MessageToast.show("An error occurred while updating the static label: " + oError.message);
        }
    },

      onDynamicLabelUpdate: function (oEvent) {
        try {
        let oInput = oEvent.getSource();
        let sNewValue = oInput.getValue();
        let oBindingContext = oInput.getBindingContext("dynamicModel");
        let oModel = oBindingContext.getModel();
        let sUniqueId = oModel.getProperty(oBindingContext.getPath() + "/unique");
        let sPath = "/HeaderItem_Config";

        this.handleEdit(sPath, sUniqueId, {
          label: sNewValue
        });
        } catch (oError) {
            sap.m.MessageToast.show("An error occurred while updating the dynamic label: " + oError.message);
        }
      },

      onMandatoryCheckboxChange: function (oEvent) {
        try {
        var oCheckBox = oEvent.getSource();
        var bSelected = oEvent.getParameter("selected");

        var oBindingContext = oCheckBox.getBindingContext("dynamicModel");
        var oModel = oBindingContext.getModel();
        var sUniqueId = oModel.getProperty(oBindingContext.getPath() + "/unique");
        let sPath = "/HeaderItem_Config";

        this.handleEdit(sPath, sUniqueId, {
          mandatory: bSelected
        });
        } catch (oError) {
            sap.m.MessageToast.show("An error occurred while updating the mandatory checkbox: " + oError.message);
        }
      },

      onVisibleCheckboxChange: function (oEvent) {
        try {
        var oCheckBox = oEvent.getSource();
        var bSelected = oEvent.getParameter("selected");

        var oBindingContext = oCheckBox.getBindingContext("dynamicModel");
        var oModel = oBindingContext.getModel();
        var sUniqueId = oModel.getProperty(oBindingContext.getPath() + "/unique");

        let sPath = "/HeaderItem_Config";

        this.handleEdit(sPath, sUniqueId, {
          visible: bSelected
        });
        } catch (oError) {
            sap.m.MessageToast.show("An error occurred while updating the visible checkbox: " + oError.message);
        }
      },

      handleEdit: function (sPath, sUniqueId, oUpdatedData) {
      try {
        let oModel = this.getView().getModel();

        let oFilter = new sap.ui.model.Filter("unique", sap.ui.model.FilterOperator.EQ, sUniqueId);

        oModel.bindList(sPath, null, null, [oFilter]).requestContexts().then(function (aContexts) {
          if (aContexts.length > 0) {
            let oContext = aContexts[0];

            Object.keys(oUpdatedData).forEach(function (sProperty) {
              oContext.setProperty(sProperty, oUpdatedData[sProperty]);
            });
          } else {
                  sap.m.MessageBox.error("No item found with the specified unique ID: " + sUniqueId);
          }
        }).catch(function (error) {
              sap.m.MessageBox.error("Error updating item: " + error.message);
        });
      } catch (oError) {
          sap.m.MessageBox.error("An unexpected error occurred: " + oError.message);
      }
      },

      onSaveCustom: function () {
      try {
        var ContractType = this.getView().byId("cgcConfig_Select_ContractType").getSelectedItem().getText();
        var documentType = this.getView().byId("cgcConfig_Select_DocumentType").getSelectedItem().getText();

        var oView = this.getView();
        var oModels = oView.getModel("addServiceParameterModelCustom");
        var listValues = oModels.getProperty("/listValues");

          var addServiceParameterCustom = oModels.getData();
        var flag = this.getView().byId("cgcConfig_StaticTable").getItems().length + 1;

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
                  this.refreshModel();
          }
          });

        this._oDialogCGc.close();
      } catch (oError) {
          sap.m.MessageBox.error("An error occurred while saving custom data: " + oError.message);
      }
      },


      onSaveStandard: function () {
      try {
        var ContractType = this.getView().byId("cgcConfig_Select_ContractType").getSelectedItem().getText();
        var documentType = this.getView().byId("cgcConfig_Select_DocumentType").getSelectedItem().getText();
        var oView = this.getView();
        var oModels = oView.getModel("addServiceParameterModel");
        var listValues = oModels.getProperty("/listValues");

          var selectedItemKey = this.getView().byId("cgcConfig_Select_ContractType").mProperties.selectedKey;
          console.log("selectedItemKey", selectedItemKey);

          var addServiceParameterData = oModels.getData();
          var flag = this.getView().byId("cgcConfig_StaticTable").getItems().length + 1;

        var addServiceParameterData = this.getView().getModel("addServiceParameterModel").getData();
        var flag = this.getView().byId("cgcConfig_StaticTable").getItems().length + 1
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
                  this.refreshModel();
          }
          });

        this._oDialogCGc.close();
      } catch (oError) {
          sap.m.MessageBox.error("An error occurred while saving standard data: " + oError.message);
      }
      },



      onDeleteDynamic: function () {
    try {
        var addField = this.byId("cgcConfig_Button_Create");
        var delField = this.byId("cgcConfig_Button_DeleteField");
        var confirmDelField = this.byId("cgcConfig_Button_ConfirmDeletion");
        var cancelDelField = this.byId("cgcConfig_Button_CancelDeletion");
        var delDynamicCheckBox = this.byId("cgcConfig_DynamicColumn_Delete");

        // TOGGLE VISIBILTY
        addField.setVisible(!addField.getVisible());
        delField.setVisible(!delField.getVisible());
        confirmDelField.setVisible(!confirmDelField.getVisible());
        cancelDelField.setVisible(!cancelDelField.getVisible());
        delDynamicCheckBox.setVisible(!delDynamicCheckBox.getVisible());
    } catch (error) {
        sap.m.MessageToast.show("Error toggling dynamic field deletion controls: " + error.message);
        console.error("Error in onDeleteDynamic:", error);
    }
      },

      onCancelFieldDeletion: function () {
    try {
        this.onDeleteDynamic();
        this.onNullSelected();
        this.onFieldUnCheckBox();
    } catch (error) {
        sap.m.MessageToast.show("Error cancelling field deletion: " + error.message);
        console.error("Error in onCancelFieldDeletion:", error);
    }
      },

      onSelectAllDynamicField: function (oEvent) {
    try {
        var oTable = this.byId("cgcConfig_DynamicTable");
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

        oItems.forEach(function (oItem) {
          var oCheckBox = oItem.getCells()[0];
          var flagStatus = oItem.getCells()[4];

          if (oCheckBox instanceof sap.m.CheckBox && flagStatus.getProperty("enabled")) {
            oCheckBox.setSelected(selectAll);
          }
        });

        console.log("initialArray.ID", initialArray.ID);
    } catch (error) {
        sap.m.MessageToast.show("Error selecting all fields: " + error.message);
        console.error("Error in onSelectAllDynamicField:", error);
    }
      },


      onFieldUnCheckBox: function () {
    try {
        var selectedItemKey = this.getView().byId("cgcConfig_Select_ContractType").getSelectedKey();
        var oTable = (selectedItemKey === "salesContract") ? this.byId("cgcConfig_DynamicTable") : null;

        if (!oTable) {
            sap.m.MessageToast.show("Table not found for the selected key.");
            return;
        }

        oTable.getItems().forEach(function (oItem) {
            oItem.getCells()[0].setSelected(false);
        });
   
        this.getView().byId("cgcConfig_DynamicColumn_Checkbox_SelectAll").setSelected(false);
    } catch (error) {
        sap.m.MessageToast.show("Error unchecking fields: " + error.message);
        console.error("Error in onFieldUnCheckBox:", error);
    }
    },  

      onDeleteDynamicFieldArray: function (oEvent) {
    try {
        var selectedPaths = oEvent.getSource().getParent().getAggregation("cells");

        selectedPaths.forEach(function (cell, i) {
          if (i === 0) {
                let checkbox = cell;
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
        });

        console.log("Initial Path Delete Array:", initialArray.ID);
    } catch (error) {
        sap.m.MessageToast.show("Error updating delete array: " + error.message);
        console.error("Error in onDeleteDynamicFieldArray:", error);
    }
      },



      onConfirmFieldDeletion: function () {
    try {
        let fieldsModel = this.getOwnerComponent().getModel();
        let fieldsBindList = fieldsModel.bindList("/HeaderItem_Config");

        if (initialArray.ID.length === 0) {
            sap.m.MessageToast.show("Please select at least one checkbox.");
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
                        for (let context of aContexts) {
                            await context.delete();
                }

                initialArray.ID = [];
                        this.refreshModel();
                this.onDeleteDynamic();
                this.onNullSelected();
                this.onFieldUnCheckBox();

                        sap.m.MessageToast.show("Fields deleted successfully.");
              } catch (error) {
                        sap.m.MessageToast.show("Error during deletion: " + error.message);
                        console.error("Error in onConfirmFieldDeletion:", error);
              }
            }
          }
        });
    } catch (error) {
        sap.m.MessageToast.show("Error initiating field deletion: " + error.message);
        console.error("Error in onConfirmFieldDeletion:", error);
    }
      },


      onNullSelected: function () {
    try {
        initialArray = { ID: [] };
    } catch (error) {
        sap.m.MessageToast.show("Error resetting selected fields: " + error.message);
        console.error("Error in onNullSelected:", error);
    }
      },

      oncancelNewParameter: function () {
    try {
        this._oDialogCGc.close();
    } catch (error) {
        sap.m.MessageToast.show("Error cancelling parameter creation: " + error.message);
        console.error("Error in oncancelNewParameter:", error);
    }
      },

    });
  });

