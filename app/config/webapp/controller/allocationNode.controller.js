sap.ui.define(
    [
      "sap/ui/core/mvc/Controller",
      "sap/m/Dialog",
      "sap/m/Button",
      "sap/m/Input",
      "sap/m/Label",
      "sap/suite/ui/commons/library",
      "sap/suite/ui/commons/networkgraph/GraphRenderer"
    ],
    function (Controller, Label) {
      "use strict";
      var oNode;
      var parameterData = [];
      var currentNodeLevel;
      var currentNodeTitle;
      var newSParameterArray;
      var serviceProfileData;
      var jsonData;
      
      var uniqueLineObjects;
      var parameterTitles;
      let AllocationNodeModel;
      let fieldValueToFilter = undefined;
      return Controller.extend("com.ingenx.config.controller.allocationNode", {
        onInit: async function () {
          var oRouter = this.getOwnerComponent().getRouter();
          oRouter
            .getRoute("RouteallocationNodeTree")
            .attachPatternMatched(this.onObjectMatched, this);
  
          let paramModel = this.getOwnerComponent().getModel();
          let paramBindList = paramModel.bindList("/serviceParametersItems");
  
          paramBindList.requestContexts(0, Infinity).then(
            function (aContexts) {
              aContexts.forEach(
                function (oContext) {
                  parameterData.push(oContext.getObject());
                }.bind(this)
              );
            }.bind(this)
          );
        },
  
        onObjectMatched: async function(oEvent) {
          const rule = {
            ruleID: oEvent.getParameter("arguments").ID,
            allocationProfileName:
              oEvent.getParameter("arguments").allocationProfileName,
            allocationProfileDesc:
              oEvent.getParameter("arguments").allocationProfileDesc,
          };
          
          fieldValueToFilter = rule.allocationProfileName;
          var oToolbar = this.getView().byId("graph").getToolbar();
          oToolbar.insertContent(
            new sap.m.Label({ text: fieldValueToFilter }),
            0
          );
          let ruleParamModel = this.getOwnerComponent().getModel();
          let aFilter = new sap.ui.model.Filter(
            "allocationID",
            sap.ui.model.FilterOperator.EQ,
            fieldValueToFilter
          );
  
          let ruleParamBindList = ruleParamModel.bindList(
            "/serviceParameterNode",
            undefined,
            undefined,
            [aFilter]
          );
  
          ruleParamBindList.requestContexts(0, Infinity).then(
            function (aContexts) {
              this.serviceProfileData = [];
              aContexts.forEach(
                function (oContext) {
                  this.serviceProfileData.push(oContext.getObject());
                }.bind(this)
              );
  
              this._oValueHelpDialog = sap.ui.xmlfragment(
                "com.ingenx.config.fragments.editNodeServicePara",
                this
              );
              this.getView().addDependent(this._oValueHelpDialog);
  
              var oValueHelpModel = new sap.ui.model.json.JSONModel({
                yourValueHelpData: this.serviceProfileData,
              });
  
              this._oValueHelpDialog.setModel(oValueHelpModel, "valueHelpModel");
              jsonData = this.graphData(this.serviceProfileData);
  
              let oView = this.getView();
              let oModel = new sap.ui.model.json.JSONModel(jsonData);
              oView.setModel(oModel, "AllocationNodeModel");
              console.log("AllocationNodeModel", AllocationNodeModel);
            }.bind(this)
          );
          
        },
  
        fetchAllocationData: async function(){
          let ruleParamModel = this.getOwnerComponent().getModel();
          let aFilter = new sap.ui.model.Filter(
            "allocationID",
            sap.ui.model.FilterOperator.EQ,
            fieldValueToFilter
          );
  
          let ruleParamBindList = ruleParamModel.bindList(
            "/serviceParameterNode",
            undefined,
            undefined,
            [aFilter]
          );
          let oResponse = [];
          let oBindListResponse = await ruleParamBindList.requestContexts(0,Infinity).then(function (aContexts) {
            aContexts.forEach(oContext => {
                // console.log(oContext.getObject());
                oResponse.push(oContext.getObject());
            });
          });
          
          jsonData = await this.graphData(oResponse);
          console.log("oResponse ", jsonData);
          let nodeModel  = this.getView().getModel("AllocationNodeModel");
          nodeModel.setData(jsonData);
          nodeModel.refresh();
          return;
        },
  
        graphData: function (serviceProfileData) {
          var transformedData = {
            nodes: [],
            lines: [],
          };
  
          var serviceTitleLookup = {};
          for (var i = 0; i < serviceProfileData.length; i++) {
            serviceTitleLookup[serviceProfileData[i].ID] =
              serviceProfileData[i].servicetitle;
          }
  
          for (var i = 0; i < serviceProfileData.length; i++) {
            var parentServiceTitle =
              serviceTitleLookup[serviceProfileData[i].parentID] || null;
  
            transformedData.nodes.push({
              id: serviceProfileData[i].ID,
              title: serviceProfileData[i].servicetitle,
              allocationId: serviceProfileData[i].allocationID,
              parentServiceTitle: parentServiceTitle, // Add the parent service title
              attributes: [
                {
                  label: "Level",
                  value: serviceProfileData[i].nodeLevel,
                },
                {
                  label: "Rank",
                  value: serviceProfileData[i].rank,
                },
              ],
            });
  
            // Check if the current node has a parentID, push both parentID and ID to "lines"
            if (serviceProfileData[i].parentID) {
              transformedData.lines.push({
                from: serviceProfileData[i].parentID,
                to: serviceProfileData[i].ID,
              });
            }
          }
  
          return transformedData;
        },
  
        onCancel: function (oDialog) {
          // Close the dialog
          this._oDialogEditNode.close();
        },
  
        onEditNode: function (oEvent) {
          var oNode = oEvent
            .getSource()
            .getBindingContext("AllocationNodeModel")
            .getObject();
  
          // Create or recreate the fragment with the provided data
          if (!this._oDialogEditNode) {
            this._oDialogEditNode = sap.ui.xmlfragment(
              "com.ingenx.config.fragments.editAllocationNode",
              this
            );
            this.getView().addDependent(this._oDialogEditNode);
          }
          this._oDialogEditNode.setBindingContext(
            oEvent.getSource().getBindingContext("AllocationNodeModel")
          );
  
          // Create a JSONModel and set it to the fragment for two-way binding
          var oModel = new sap.ui.model.json.JSONModel(oNode);
          this._oDialogEditNode.setModel(oModel);
  
          // Attach event handlers
          this._oDialogEditNode.attachEvent(
            "onSaveEditNode",
            this.onSaveEditNode.bind(this, this._oDialogEditNode)
          );
          this._oDialogEditNode.attachEvent(
            "onCancel",
            this.onCancel.bind(this, this._oDialogEditNode)
          );
  
          // Open the dialog
          this._oDialogEditNode.open();
        },
  
        onSaveEditNode: function () {
          // Get the controls from the fragment
          var nodeID = sap.ui.getCore().byId("ChildId").getText();
          var sTitleId = sap.ui.getCore().byId("titleId").getText();
          var sLevel = sap.ui.getCore().byId("levelId").getText();
          var sNewRank = sap.ui.getCore().byId("rankId").getValue();
          var sNewParentId = sap.ui.getCore().byId("newParentId").getValue();
  
          let parentData = sNewParentId.split(":");
          sNewParentId = parentData[2];
          let newNodeLevel = parentData[1];
  
          let serviceprofileModel = this.getOwnerComponent().getModel();
          var sPath = "/serviceParameterNode(" + nodeID + ")";
          var oNodeBinding = serviceprofileModel.bindContext(sPath); // Bind to the context
  
          // Check if the context is available and then update properties
          if (oNodeBinding && sNewParentId) {
            var oNodeContext = oNodeBinding.getBoundContext();
            oNodeContext.setProperty("parentID", sNewParentId);
            oNodeContext.setProperty("nodeLevel", parseInt(newNodeLevel) + 1);
            oNodeContext.setProperty("rank", parseInt(sNewRank));
          } else if (oNodeBinding) {
            var oNodeContext = oNodeBinding.getBoundContext();
            oNodeContext.setProperty("rank", parseInt(sNewRank));
          }
  
          // Submit the changes using a batch request
          var sBatchGroupId = "yourGroupId";
  
          // Submit the changes using a batch request
          serviceprofileModel
            .submitBatch(sBatchGroupId)
            .then(function () {
              console.log("Batch request submitted successfully");
            })
            .catch(function (oError) {
              console.error("Error submitting batch request", oError);
            });
  
          // Close the dialog
          this._oDialogEditNode.close();
          this.fetchAllocationData();
          // location.reload();
        },
  
        // Function to handle the press event of the "Add Child" button
        onAddChild: function (oEvent) {
          // this.getRanksByLevel(oEvent);
          oNode = oEvent
            .getSource()
            .getBindingContext("AllocationNodeModel")
            .getObject();
          var toValue = oNode.id;
          currentNodeTitle = oNode.title;
          var sAllocationID = oNode.allocationId;
          var sNodeLevel = oNode.attributes[0].value;
          currentNodeLevel = sNodeLevel;
          var oView = this.getView();
          const addNodeData = {
            parentID: toValue,
            nodeLevel: parseInt(sNodeLevel) + 1,
            allocationID: sAllocationID,
            
            serviceTitle: "",
            rank: "",
          };
          const allocationNodeModel = new sap.ui.model.json.JSONModel(
            addNodeData
          );
          oView.setModel(allocationNodeModel, "allocationNodeModel");
          if (!this._oDialogNewNode) {
            this._oDialogNewNode = sap.ui.xmlfragment(
              "com.ingenx.config.fragments.addAllocationNode",
              this
            );
            oView.addDependent(this._oDialogNewNode);
          }
          this._oDialogNewNode.open();
        },
  
        onsaveNewNode: function () {
          var addAllocationNodeData = this.getView()
            .getModel("allocationNodeModel")
            .getData();
          var oEntryData = {
            parentID: String(addAllocationNodeData.parentID),
            nodeLevel: addAllocationNodeData.nodeLevel,
            allocationID: addAllocationNodeData.allocationID,
            servicetitle: addAllocationNodeData.serviceTitle,
            rank: parseInt(addAllocationNodeData.rank),
          };
  
          if (oEntryData.rank <= 0) {
            sap.m.MessageToast.show(
              "Rank cannot be negative or zero. Please enter a valid rank.",
              {
                duration: 3000,
                width: "20em",
                my: "center top",
                at: "center top",
                of: window,
                offset: "30 30",
                onClose: function () {
                  console.log("Message toast closed");
                },
              }
            );
            return;
          }
  
          if (
            addAllocationNodeData.serviceTitle.length !== 0 &&
            addAllocationNodeData.rank.length !== 0
          ) {
            let oModel = this.getView().getModel();
            let oBindListSP = oModel.bindList("/serviceParameterNode");
            oBindListSP.create(oEntryData);
            this._oDialogNewNode.close();
            this.fetchAllocationData();
            // location.reload();
          } else {
            sap.m.MessageToast.show(
              "Please Enter both Service Parameter and Rank",
              {
                duration: 3000,
                width: "15em",
                my: "center top",
                at: "center top",
                of: window,
                offset: "30 30",
                onClose: function () {
                  console.log("Message toast closed");
                },
              }
            );
            return;
          }
        },
  
        oncancelNewNode: function () {
          this._oDialogNewNode.close();
        },
  
        onDeleteNode: function (oEvent) {
          let that = this;
          var oNode = oEvent
            .getSource()
            .getBindingContext("AllocationNodeModel")
            .getObject();
          var nodeID = oNode.id;
          var isNodeIDMatched = jsonData.lines.some(function (line) {
            return line.from === nodeID;
          });
          if (isNodeIDMatched) {
            sap.m.MessageToast.show(
              "Please First Delete the connected child Node to Delete this node",
              {
                duration: 3000,
                width: "15em",
                my: "center top",
                at: "center top",
                of: window,
                offset: "30 30",
                onClose: function () {
                  console.log("Message toast closed");
                },
              }
            );
            return;
          }
          var serviceprofileModel = this.getOwnerComponent().getModel();
          var sPath = "/serviceParameterNode(" + nodeID + ")";
          // Delete the entity using the delete method of the model
          serviceprofileModel
            .delete(sPath)
            .then(function () {
              console.log("Node deleted successfully.");
              // Refresh the model or the binding to reflect the changes
              //   serviceprofileModel.refresh();
              // location.reload();
              that.fetchAllocationData();
  
            })
            .catch(function (oError) {
              console.error("Error deleting node:", oError);
            });
        },
  
        groupNodesByLevel: function (oEvent) {
          const groupedNodes = {};
          var selectedNodes = this.getView()
            .getModel("AllocationNodeModel")
            .getData().nodes;
  
          selectedNodes.forEach((node) => {
            const level = node.attributes.find(
              (attr) => attr.label === "Level"
            ).value;
  
            if (!groupedNodes[level]) {
              groupedNodes[level] = [];
            }
  
            groupedNodes[level].push(node);
          });
  
          return groupedNodes;
        },
  
        onValuehelp: function (oEvent) {
          this.selectedContext = oEvent.getSource().getBindingContext();
  
          var oView = this.getView();
          var selectedNodes = this.getView()
            .getModel("AllocationNodeModel")
            .getData().nodes;
          this.groupNodesByLevel(oEvent);
          var titles = selectedNodes.map((node) => ({
            parentServiceTitle: node.parentServiceTitle,
            title: node.title,
          }));
  
          var filteredNodeVal = parameterData.map(function (obj1) {
            return {
              serviceParameter: obj1.serviceParameter,
              serviceParameterDesc: obj1.serviceParameterDesc,
              parameterLevel: obj1.Level,
            };
          });
  
          if (currentNodeLevel === 0) {
            newSParameterArray = filteredNodeVal.filter(function (obj) {
              return (
                obj.parameterLevel === "1" &&
                !titles.some(
                  (titleObj) => titleObj.title === obj.serviceParameter
                )
              );
            });
          } else {
            for (var level = currentNodeLevel - 1; level >= 0; level--) {
              newSParameterArray = filteredNodeVal.filter(function (obj) {
                let parentTitles = titles.filter(
                  (titleObj) => titleObj.parentServiceTitle === currentNodeTitle
                );
                return (
                  obj.parameterLevel === (currentNodeLevel + 1).toString() &&
                  !parentTitles.some(
                    (titleObj) => titleObj.title === obj.serviceParameter
                  )
                );
              });
            }
          }
          if (newSParameterArray) {
            filteredNodeVal = newSParameterArray;
          }
  
          var addServiceModel = new sap.ui.model.json.JSONModel(filteredNodeVal);
          oView.setModel(addServiceModel, "filteredNodeVal");
  
          if (!this._oDialogNewNode1) {
            this._oDialogNewNode1 = sap.ui.xmlfragment(
              "com.ingenx.config.fragments.addParametersNode",
              this
            );
            oView.addDependent(this._oDialogNewNode1);
          }
          this._oDialogNewNode1.open();
        },
  
        onValueHelpDialogSearch1: function (oEvent) {
          var sValue = oEvent.getParameter("value");
          var oFilter = new sap.ui.model.Filter(
            "serviceParameter",
            sap.ui.model.FilterOperator.Contains,
            sValue
          );
          oEvent.getSource().getBinding("items").filter([oFilter]);
        },
  
        onValueHelpDialogClose1: function (oEvent) {
          var sDescription,
            oSelectedItem = oEvent.getParameter("selectedItem");
          oEvent.getSource().getBinding("items").filter([]);
          if (!oSelectedItem) {
            return;
          }
  
          sDescription = oSelectedItem.getTitle();
          this.getView()
            .getModel("allocationNodeModel")
            .setProperty("/serviceTitle", sDescription);
          this._oDialogNewNode1.close();
        },
  
        onValueHelpNewParent: function () {
          // Open the Value Help Dialog
          this._oValueHelpDialog.open();
        },
  
        onValueDialogClose: function (oEvent) {
          var oTable = oEvent.getSource();
          var aSelectedItems = oTable.getSelectedItems();
  
          if (aSelectedItems.length > 0) {
            var oSelectedItem = aSelectedItems[0];
            var oBindingContext =
              oSelectedItem.getBindingContext("valueHelpModel");
  
            if (oBindingContext) {
              // Extract the data from the selected item's binding context
              var sNewParent = oBindingContext.getProperty("servicetitle");
              var sParentID = oBindingContext.getProperty("ID");
              var sNodeLevel = oBindingContext.getProperty("nodeLevel");
  
              // Set the selected value to the model property bound to the input field
              var oModel = oEvent.getSource().getModel("valueHelpModel");
  
              if (oModel) {
                var oInput = sap.ui.getCore().byId("newParentId");
  
                let sSeletedValue =
                  sNewParent + ":" + sNodeLevel + ":" + sParentID;
                oInput.setValue(sSeletedValue);
  
                // Close the dialog
                var oValueHelpDialog = sap.ui.getCore().byId("valueHelpDialog");
                if (oValueHelpDialog) {
                  oValueHelpDialog.close();
                } else {
                  console.error("Dialog not found");
                }
              } else {
                console.error("Model 'valueHelpModel' not found");
              }
            } else {
              console.error("Binding context not found");
            }
          }
        },
      });
    }
  );