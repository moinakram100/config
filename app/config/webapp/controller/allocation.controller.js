sap.ui.define(
    [
      "sap/ui/core/mvc/Controller",
      "sap/ui/model/json/JSONModel",
      "sap/ui/core/Fragment",
      "../model/formatter",
    ],
    function (BaseController, JSONModel, Fragment, formatter) {
      "use strict";
      var AllocRuleLastID;
      var initialAllocRuleDelArray = {
        ID: [],
        Name: [],
      };
      var validateNewRule;
      let getModelData;
      let allocRuleName;
  
      return BaseController.extend("com.ingenx.gms.controller.allocation", {
        formatter: formatter,
        onInit: function () {},
  
        onCreateAlloc: function (oEvent) {
          this.onAllocRuleLastID();
          this.usedRuleName();
          var oView = this.getView();
          const addAllocationRuleData = {
            ruleName: "",
            ruleDesc: "",
          };
          const addAllocationRuleModel = new JSONModel(addAllocationRuleData);
          oView.setModel(addAllocationRuleModel, "addAllocationRuleModel");
          if (!this._oDialogAllocation) {
            this._oDialogAllocation = sap.ui.xmlfragment(
              "com.ingenx.config.fragments.addAllocationProfile",
              this
            );
            oView.addDependent(this._oDialogAllocation);
          }
          this._oDialogAllocation.open();
        },
        oncancelNewRule: function () {
          this._oDialogAllocation.close();
          this.clearFields();
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
  
        usedRuleName: function () {
          var that = this;
  
          return new Promise(function (resolve, reject) {
            var usedRuleDataModel = new sap.ui.model.json.JSONModel();
            that.getView().setModel(usedRuleDataModel, "usedRuleDataModel");
            let oModel = that.getOwnerComponent().getModel();
            let oBindList = oModel.bindList("/AllocationProfile");
  
            oBindList.requestContexts(0, Infinity).then(
              function (aContexts) {
                allocRuleName = [];
                aContexts.forEach(function (oContext) {
                  allocRuleName.push(oContext.getObject());
                });
                usedRuleDataModel.setData(allocRuleName);
  
                var usedRuleNameModelData = that
                  .getView()
                  .getModel("usedRuleDataModel")
                  .getData();
                console.log(usedRuleNameModelData);
                validateNewRule = usedRuleNameModelData.map(function (obj) {
                  return {
                    ID: obj.ID,
                    allocationProfileName: obj.allocationProfileName,
                    allocationProfileDesc: obj.allocationProfileDesc,
                  };
                });
                console.log("Validate New Rule", validateNewRule);
  
                resolve();
              }.bind(this)
            );
          });
        },
  
        onsaveNewRule: function () {
          var addAllocationRuleData = this.getView()
            .getModel("addAllocationRuleModel")
            .getData();
          var oEntryDataAllocationRule = {
            ID: parseInt(AllocRuleLastID, 10),
            allocationProfileName: addAllocationRuleData.ruleName,
            allocationProfileDesc: addAllocationRuleData.ruleDesc,
            allocationfield1: "",
            allocationfield2: "",
            allocationfield3: "",
            allocationfield4: "",
            allocationfield5: "",
          };
  
          if (
            oEntryDataAllocationRule.allocationProfileName === "" ||
            oEntryDataAllocationRule.allocationProfileDesc === ""
          ) {
            sap.m.MessageToast.show("Input fields cannot be blank.", {
              duration: 3000,
              width: "15em",
              my: "center top",
              at: "center top",
              of: window,
              offset: "30 30",
              onClose: function () {
                console.log("Message toast closed");
              },
            });
            console.log("Allocation name or description cannot be null");
            return;
          } else {
            var isDuplicateRule = validateNewRule.some(function (entry) {
              return (
                entry.allocationProfileName.toLowerCase() ===
                oEntryDataAllocationRule.allocationProfileName.toLowerCase()
              );
            });
  
            if (isDuplicateRule) {
              sap.m.MessageToast.show("Rule already exists.", {
                duration: 3000,
                width: "15em",
                my: "center top",
                at: "center top",
                of: window,
                offset: "30 30",
                onClose: function () {
                  console.log("Message toast closed");
                },
              });
              console.log("Rule found");
              return;
            } else {
              validateNewRule.push(oEntryDataAllocationRule);
              console.log("Entry added successfully");
            }
          }
          let oModel = this.getView().getModel();
          let oBindListSP = oModel.bindList("/AllocationProfile");
          oBindListSP.create(oEntryDataAllocationRule);
  
          var oEntryData = {
            parentID: "",
            allocationID: addAllocationRuleData.ruleName,
            nodeLevel: 0,
            servicetitle: "Location",
            rank: 1,
          };
  
          let oBindListNode = oModel.bindList("/serviceParameterNode");
          oBindListNode.create(oEntryData);
          this._oDialogAllocation.close();
          this.clearFields();
          this.RefreshData();
        },
  
        // CLEAR FIELDS
  
        clearFields: function () {
          var oView = this.getView();
          /**
           * Array of input fields.
           * @type {Array}
           */
          var aInputFields = oView.findElements(true);
  
          aInputFields.forEach(function (oInputField) {
            if (oInputField.setValue) {
              oInputField.setValue("");
            }
          });
        },
  
        // DELETION FUNCTIONS
  
        onDeleteAlloc: function () {
          var allocDelLabel = this.byId("deleteAllocLabel");
          var allocDelCheckBox = this.byId("deleteAllocCheckBox");
          var addAllocBtn = this.byId("addAllocRuleBtn");
          var delAllocBtn = this.byId("delAllocBtn");
          var cancelAllocDel = this.byId("cancelAllocDeleteBtn");
          var confirmAllocDel = this.byId("deleteAllocConfirmBtn");
  
          // Toggle Visibility
          allocDelLabel.setVisible(!allocDelLabel.getVisible());
          allocDelCheckBox.setVisible(!allocDelCheckBox.getVisible());
          addAllocBtn.setVisible(!addAllocBtn.getVisible());
          delAllocBtn.setVisible(!delAllocBtn.getVisible());
          cancelAllocDel.setVisible(!cancelAllocDel.getVisible());
          confirmAllocDel.setVisible(!confirmAllocDel.getVisible());
        },
  
        onCancelAllocDeletion: function () {
          this.onDeleteAlloc();
          this.onAllocRuleUnCheckBox();
        },
  
        onAllocRuleUnCheckBox: function () {
          var selectedItems = initialAllocRuleDelArray.ID;
          var oTable = this.byId("tableAllocRule");
          var oItems = oTable.getItems();
          this.getView().byId("selectAllAllocRule").setSelected(false);
  
          selectedItems.forEach(function (itemId) {
            oItems.forEach(function (oItem) {
              var sRowId = oItem.getCells()[1].getText();
  
              if (sRowId === itemId) {
                oItem.getCells()[0].setSelected(false);
              }
            });
          });
        },
  
        onSelectAllAllocRule: function (oEvent) {
          var oTable = this.byId("tableAllocRule");
          var oItems = oTable.getItems();
          var selectAll = oEvent.getParameter("selected");
  
          if (!selectAll) {
            initialAllocRuleDelArray.ID = [];
          } else {
            initialAllocRuleDelArray.ID = oItems.map(function (oItem) {
              return oItem.getCells()[1].getText();
            });
          }
  
          for (var i = 0; i < oItems.length; i++) {
            var oItem = oItems[i];
            var oCheckBox = oItem.getCells()[0];
  
            if (oCheckBox instanceof sap.m.CheckBox) {
              oCheckBox.setSelected(selectAll);
            }
          }
        },
  
        onDelAllocRuleArray: function (oEvent) {
          var selectedPaths = oEvent
            .getSource()
            .getParent()
            .getAggregation("cells");
  
          for (var i = 0; i < selectedPaths.length; i++) {
            if (i === 0) {
              let checkbox = selectedPaths[i];
              let paths = selectedPaths[i + 1].getProperty("text");
              let allocName = selectedPaths[i + 2].getProperty("text");
  
              if (checkbox.getSelected()) {
                if (initialAllocRuleDelArray.ID.indexOf(paths) === -1) {
                  initialAllocRuleDelArray.ID.push(paths);
                  initialAllocRuleDelArray.Name.push(allocName);
                }
              } else {
                var index = initialAllocRuleDelArray.ID.indexOf(paths);
                if (index !== -1) {
                  initialAllocRuleDelArray.ID.splice(index, 1);
                  initialAllocRuleDelArray.Name.splice(index, 1);
                }
              }
            }
          }
  
          console.log("Initial Path Delete Array:", initialAllocRuleDelArray.ID);
          console.log(
            "Initial Path Delete Array:",
            initialAllocRuleDelArray.Name
          );
          this.RefreshData();
        },
  
        onNullSelectedPath: function () {
          initialAllocRuleDelArray = {
            ID: [],
            Name: [],
          };
          this.onAllocRuleUnCheckBox();
        },
  
        deleteParameter: function (oEvent) {
          var oSelectedItem = oEvent.getSource().getParent();
  
          if (oSelectedItem) {
            var allocationRuleID = oSelectedItem
              .getAggregation("cells")[1]
              .getProperty("text");
            var oTable = this.byId("tableAllocRule");
            var oRow = null;
            for (var i = 0; i < oTable.getItems().length; i++) {
              var oItem = oTable.getItems()[i];
              var sRowId = oItem.getCells()[1].getText();
  
              if (sRowId === allocationRuleID) {
                oRow = oItem;
                break;
              }
            }
            console.log(oRow);
            oRow
              .getBindingContext()
              .delete()
              .catch(function (oError) {
                if (!oError.canceled) {
                  // Error was already reported to message model
                }
                this.RefreshData();
              });
          }
        },
  
        onSelectAllocationRule: function (oEvent) {
          var oRouter = this.getOwnerComponent().getRouter();
          var allocationRuleData = oEvent
            .getSource()
            .getBindingContext()
            .getObject();
  
          oRouter.navTo("RouteallocationNodeTree", {
            ID: allocationRuleData.ID,
            allocationProfileName: allocationRuleData.allocationProfileName,
            allocationProfileDesc: allocationRuleData.allocationProfileDesc,
            isNewSelection: true,
          });
  
          location.reload(); // For Deployment
        },
  
        // CONFIRM DELETION
  
        onConfirmAllocDeletion: function () {
          var unfilteredItems = initialAllocRuleDelArray.ID;
          var selectedItems = Array.from(new Set(unfilteredItems));
          console.log("Selected Items:", selectedItems);
  
          if (selectedItems.length > 0) {
            sap.m.MessageBox.confirm(
              "Are you sure you want to delete the selected rule?",
              {
                title: "Confirmation",
                onClose: function (oAction) {
                  if (oAction === sap.m.MessageBox.Action.OK) {
                    var oTable = this.byId("tableAllocRule");
                    var oItems = oTable.getItems();
                    this.allocationNodeVanish();
  
                    selectedItems.forEach(function (itemId) {
                      oItems.forEach(function (oItem) {
                        var sRowId = oItem.getCells()[1].getText();
  
                        if (sRowId === itemId) {
                          oItem
                            .getBindingContext()
                            .delete()
                            .catch(function (oError) {
                              if (!oError.canceled) {
                                MessageBox.error("Error :", oError);
                              }
                              this.RefreshData();
                            });
                        }
                      });
                    });
                  } else if (oAction === sap.m.MessageBox.Action.CANCEL) {
                    this.onAllocRuleUnCheckBox();
                    this.onNullSelectedPath();
                  }
                }.bind(this),
              }
            );
          } else {
            sap.m.MessageBox.information(
              "Please select at least one rule for deletion."
            );
          }
          this.onDeleteAlloc();
          this.onAllocRuleUnCheckBox();
        },
  
        // LAST ALLOC RULE ID
  
        onAllocRuleLastID: function () {
          try {
            var oTable = this.getView().byId("tableAllocRule");
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
                AllocRuleLastID = i.toString();
                break;
              }
            }
          } catch (error) {
            AllocRuleLastID = "0";
          }
  
          console.log("Next Available Alloc Rule ID:", AllocRuleLastID);
        },
  
        RefreshData: function () {
          this.getView().byId("tableAllocRule").getBinding("items").refresh();
        },
  
        allocationNodeVanish: function () {
          var unfilteredItems = initialAllocRuleDelArray.Name;
          var selectedItems = Array.from(new Set(unfilteredItems));
          console.log("Selected Items:", selectedItems);
          var that = this;
          let oModel = that.getView().getModel();
  
          selectedItems.forEach(function (allocParameter) {
            let oBindList = oModel.bindList("/serviceParameterNode");
            let allocFilter = new sap.ui.model.Filter(
              "allocationID",
              sap.ui.model.FilterOperator.EQ,
              allocParameter
            );
  
            oBindList
              .filter(allocFilter)
              .requestContexts()
              .then(function (aContexts) {
                aContexts.forEach(function (context) {
                  context.delete();
                });
              });
          });
          this.onNullSelectedPath();
        },
      });
    }
  );
  