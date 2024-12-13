sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/ui/model/json/JSONModel",
  "sap/ui/model/Filter",
  "sap/ui/model/FilterOperator",
  "sap/ui/model/FilterType",
  "sap/m/ColumnListItem",
  "sap/m/MessageBox",
  "sap/m/Input",
], function (Controller, JSONModel, MessageBox, Filter, FilterOperator, FilterType, ColumnListItem, Input) {
  "use strict";
  let cellId1, cellId2, cellId3, cellId4;
  let pathModel;
  const interconnect = {
    YES: 'Yes',
    NO: 'No'
  }

  let emptyPathRowTemplate = {
    delPoint: "",
    delPointTsyst: "",
    reDelPoint: "",
    reDelPointTsyst: "",
    isInterconnect: "",
    bInterconnect: false,
    sInterconnect: "",
    path: "",
    fuelpct: ""
  }



  return Controller.extend("com.ingenx.config.controller.pathFuel", {


    onInit: function () {

      this.initializePathModel();
      this.attachPathModelChangeHandler();


    },
    initializePathModel: function () {
      const initialData = structuredClone(emptyPathRowTemplate);

      const pathModel = new sap.ui.model.json.JSONModel([initialData]);
      this.getView().setModel(pathModel, "pathmodel");
    },
    attachPathModelChangeHandler: function () {
      const pathModel = this.getView().getModel("pathmodel");
      pathModel.attachPropertyChange(this.handlePathModelChange.bind(this));
    },
    // handle change in path of interconnect
    handlePathModelChange: async function (oEvent) {
      const path = oEvent.getParameter('context').getPath();
      const properties = oEvent.getParameter('context').getObject();


      const { delPoint, delPointTsyst, reDelPoint, reDelPointTsyst } = properties;


      if (delPointTsyst && reDelPointTsyst) {
        if (delPointTsyst === reDelPointTsyst) {
          this.clearInterconnect(path);
        } else {
          await this.handleInterconnect(path, delPoint, delPointTsyst, reDelPoint, reDelPointTsyst); // Fetch interconnect data
        }
      }

      this.updatePathField(path, properties);
    },
    // clear interconnect if delivery and redelivery both points are same
    clearInterconnect: function (path) {
      const pathModel = this.getView().getModel("pathmodel");
      pathModel.setProperty(`${path}/isInterconnect`, interconnect.NO);
      pathModel.setProperty(`${path}/bInterconnect`, false);
      pathModel.setProperty(`${path}/sInterconnect`, "");
      pathModel.setProperty(`${path}/path`, "");
    },
    //   filter to find whether path exist or not between delivery and redelivery point 
    handleInterconnect: async function (path, delPoint, delPointTsyst, reDelPoint, reDelPointTsyst) {
      try {
        const oModel = this.getOwnerComponent().getModel();
        const filters = [
          new sap.ui.model.Filter("Transport1", sap.ui.model.FilterOperator.EQ, delPointTsyst),
          new sap.ui.model.Filter("Transport2", sap.ui.model.FilterOperator.EQ, reDelPointTsyst)
        ];
        const combinedFilter = new sap.ui.model.Filter({
          filters: filters,
          and: true
        });

        const oBindList2 = oModel.bindList("/Interconnect_pointSet", undefined, undefined, [combinedFilter]);
        const contexts = await oBindList2.requestContexts(0, Infinity);
        const interconnectData = contexts.map(context => context.getObject());

        if (interconnectData.length > 0) {
          const result = interconnectData[0].IntLoc;
          this.setInterconnect(path, result, delPoint, reDelPoint);
        } else {
          throw new Error("No path found");
        }
      } catch (err) {

        if (!this.errorDisplayed) {
          console.log("Error:", err);
          sap.m.MessageBox.information("Path Not Found on selected points! Please Change Path");
          this.errorDisplayed = true;
        }
        this.clearFields();
      }
    },
    //  set the interconnect on field on the basis of filter
    setInterconnect: function (path, result, delPoint, reDelPoint) {
      const pathModel = this.getView().getModel("pathmodel");
      pathModel.setProperty(`${path}/isInterconnect`, interconnect.YES);
      pathModel.setProperty(`${path}/bInterconnect`, true);
      const spath = `${delPoint}:${result}:${reDelPoint}`;
      pathModel.setProperty(`${path}/sInterconnect`, result);
      pathModel.setProperty(`${path}/path`, spath);
    },
    //  update the Interconnect Path
    updatePathField: function (path, properties) {
      const { delPoint, sInterconnect, reDelPoint } = properties;
      const finalPath = [delPoint, sInterconnect, reDelPoint].map((tsyst, i) => {
        if (tsyst) {
          return i === 0 ? tsyst : `:${tsyst}`;
        }
      }).toString().replaceAll(",", "");

      const pathModel = this.getView().getModel("pathmodel");
      pathModel.setProperty(`${path}/path`, finalPath);
    },

    // on press of create button
    onAddPath: function () {


      this.clearFields();
      this.setNull();


      let pathHeading = this.byId("PathFuelpathHeading");
      let addPathRow = this.byId("PathFueladdPathTable");
      let addPath = this.byId("PathFueladdPathBtn");
      let addSubmitPath = this.byId("PathFuelsubmitPathBtn");
      let cancelAddPath = this.byId("PathFuelcancelAddBtn");
      let delPathBtn = this.byId("PathFueldeletePathBtn");

      // TOGGLE VISIBILTY
      pathHeading.setVisible(!pathHeading.getVisible());
      addPath.setVisible(!addPath.getVisible());
      addPathRow.setVisible(!addPathRow.getVisible());
      addSubmitPath.setVisible(!addSubmitPath.getVisible());
      cancelAddPath.setVisible(!cancelAddPath.getVisible());
      delPathBtn.setVisible(!delPathBtn.getVisible());
    },
    // value help delivery point
    onDeliveryPoint: function (rowIndex) {

      console.log("Hello from onDeliveryPoint");
      let cell = rowIndex.getSource().getParent().getAggregation("cells")
      cellId1 = cell[1].sId
      cellId2 = cell[2].sId

      let oView = this.getView();
      if (!this.onLocationfrag) {
        this.onLocationfrag = sap.ui.xmlfragment(
          oView.getId(),
          "com.ingenx.config.fragments.deliveryPoint",
          this
        );
        oView.addDependent(this.onLocationfrag);
      }
      // Pass the row index to the fragment
      this.onLocationfrag.data("rowIndex", rowIndex);
      this.onLocationfrag.open();
    },

    // on selection of delivery from value help
    ondeliverypointSelection: function (oEvent) {
      let oSelectedItem = oEvent.getParameter("selectedItem");
      let selectedRow = oEvent.getSource();
      console.log("Selected Row ", selectedRow);
      oEvent.getSource().getBinding("items").filter([]);

      if (!oSelectedItem) {
        return;
      }


      this.byId(cellId1).setValue(oSelectedItem.getTitle());
      this.byId(cellId2).setValue(oSelectedItem.getDescription())

    },


    // delivery point value help search
    onsearchDeliveryLocation: function (oEvent) {
      let sValue = oEvent.getParameter("value");
      let oFilter = new sap.ui.model.Filter("Locid", sap.ui.model.FilterOperator.Contains, sValue);
      oEvent.getSource().getBinding("items").filter([oFilter]);

      let oBinding = oEvent.getSource().getBinding("items");
      let oSelectDialog = oEvent.getSource();

      oBinding.filter([oFilter]);

      oBinding.attachEventOnce("dataReceived", function () {
        let aItems = oBinding.getCurrentContexts();

        if (aItems.length === 0) {
          oSelectDialog.setNoDataText("No  Location found");
        } else {
          oSelectDialog.setNoDataText("Loading");
        }
      });




    },
    // Redelivery point value help
    onReDeliveryPoint: function (rowIndex) {
      console.log("Hello from onDeliveryPoint");
      let rowNo = rowIndex.oSource.oParent;
      let cell = rowNo.mAggregations.cells;
      cellId3 = cell[3].sId
      cellId4 = cell[4].sId
      console.log("Value is for", cellId1, cellId2, cellId3);

      let oView = this.getView();
      if (!this.onLocationfrag1) {
        this.onLocationfrag1 = sap.ui.xmlfragment(
          oView.getId(),
          "com.ingenx.config.fragments.reDeliveryPoint",
          this
        );
        oView.addDependent(this.onLocationfrag1);
      }

      this.onLocationfrag1.data("rowIndex", rowIndex);
      this.onLocationfrag1.open();


    },

    // on selection of redelivery from value help
    onRedeliverypointSelection: function (oEvent) {

      let oSelectedItem = oEvent.getParameter("selectedItem");
      let selectedRow = oEvent.getSource();
      console.log("Selected Row ", selectedRow);
      oEvent.getSource().getBinding("items").filter([]);

      if (!oSelectedItem) {
        return;
      }


      this.byId(cellId3).setValue(oSelectedItem.getTitle());
      this.byId(cellId4).setValue(oSelectedItem.getDescription());



    },
    // Redelivery point value help search
    onSearchRedeliveryLocation: function (oEvent) {
      let sValue = oEvent.getParameter("value");
      let oFilter = new sap.ui.model.Filter("Locid", sap.ui.model.FilterOperator.Contains, sValue);
      oEvent.getSource().getBinding("items").filter([oFilter]);

      let oBinding = oEvent.getSource().getBinding("items");
      let oSelectDialog = oEvent.getSource();

      oBinding.filter([oFilter]);

      oBinding.attachEventOnce("dataReceived", function () {
        let aItems = oBinding.getCurrentContexts();

        if (aItems.length === 0) {
          oSelectDialog.setNoDataText("No  Location found");
        } else {
          oSelectDialog.setNoDataText("Loading");
        }
      });




    },
    // refresh the data of  path fuel view table
    RefreshData: function () {
      this.getView().byId("PathFuelviewPathtable").getBinding("items").refresh();
    },
    // refresh the coloumn of add path table
    RefreshDataAdd: function () {
      this.getView().byId("PathFueladdPathTable").getBinding("items").refresh();
    },
    onFuelPerChange: function (oEvent) {
      let perValue = oEvent.getSource().getValue();
      if (perValue > 100) {
        sap.m.MessageBox.information("Percentage cannot be more than 100%");
        oEvent.getSource().setValue("");
      }
    },
    //Submit to HANA DB
    onSubmit1: function () {
      let that = this;

      let pathModelData = this.getView().getModel("pathmodel").getData();
      let payload = {
        DeliveryPoint: pathModelData[0].delPoint,
        DpTsSystem: pathModelData[0].delPointTsyst,
        ReDeliveryPoint: pathModelData[0].reDelPoint,
        RDpTsSystem: pathModelData[0].reDelPointTsyst,
        InterconnectPath: pathModelData[0].isInterconnect,
        Interconnect: pathModelData[0].sInterconnect,
        path: pathModelData[0].path,
        FuelPercentage: parseFloat(pathModelData[0].fuelpct).toFixed(3)
      };


      if (!payload.DeliveryPoint || !payload.ReDeliveryPoint || isNaN(payload.FuelPercentage)) {
        sap.m.MessageToast.show("Input fields cannot be blank.", { duration: 3000 });
        return;
      }


      let oModel = this.getOwnerComponent().getModel();
      let oBindList = oModel.bindList("/pathAndFuelMapping");


      oBindList.attachEventOnce("dataReceived", function () {
        let existingEntries = oBindList.getContexts().map(context => context.getObject());
        let isDuplicate = existingEntries.some(entry =>
          entry.DeliveryPoint === payload.DeliveryPoint &&
          entry.ReDeliveryPoint === payload.ReDeliveryPoint
        );

        if (isDuplicate) {
          sap.m.MessageToast.show("Mapping already exists.", { duration: 3000 });
          return;
        }


        try {
          oBindList.create(payload);
          sap.m.MessageBox.success("Path created successfully.", {
            onClose: function () {
              that.clearFields();
              that.onAddPath();
              that.RefreshDataAdd();
              that.RefreshData();
            }
          });
        } catch (error) {
          sap.m.MessageToast.show("Unexpected error occurred while saving.", { duration: 3000 });
          console.error("Error during creation:", error);
        }
      });


      oBindList.getContexts();
    },
    onSubmit: function () {
      let that = this;
  
      let pathModelData = this.getView().getModel("pathmodel").getData();
      let payload = {
          DeliveryPoint: pathModelData[0].delPoint,
          DpTsSystem: pathModelData[0].delPointTsyst,
          ReDeliveryPoint: pathModelData[0].reDelPoint,
          RDpTsSystem: pathModelData[0].reDelPointTsyst,
          InterconnectPath: pathModelData[0].isInterconnect,
          Interconnect: pathModelData[0].sInterconnect,
          path: pathModelData[0].path,
          FuelPercentage: parseFloat(pathModelData[0].fuelpct).toFixed(3)
      };
  
      if (!payload.DeliveryPoint || !payload.ReDeliveryPoint || isNaN(payload.FuelPercentage)) {
          sap.m.MessageToast.show("Input fields cannot be blank.", { duration: 3000 });
          return;
      }
  
      let oModel = this.getOwnerComponent().getModel();
      let oBindList = oModel.bindList("/pathAndFuelMapping");
  
      oBindList.attachEventOnce("dataReceived", function () {
          let existingEntries = oBindList.getContexts().map(context => context.getObject());
          let isDuplicate = existingEntries.some(entry =>
              entry.DeliveryPoint === payload.DeliveryPoint &&
              entry.ReDeliveryPoint === payload.ReDeliveryPoint
          );
  
          if (isDuplicate) {
              sap.m.MessageToast.show("Mapping already exists.", { duration: 3000 });
              return;
          }
  
          try {
              oBindList.create(payload);
              sap.m.MessageToast.show("Path created successfully.", { duration: 3000 });
  
              // Perform the subsequent actions after showing the success message
              that.clearFields();
              that.onAddPath();
              that.RefreshDataAdd();
              that.RefreshData();
          } catch (error) {
              sap.m.MessageToast.show("Unexpected error occurred while saving.", { duration: 3000 });
              console.error("Error during creation:", error);
          }
      });
  
      oBindList.getContexts();
  },
  
    // CLEAR FIELDS
    clearFields: function () {
      let oView = this.getView();

      let aInputFields = oView.findElements(true);

      aInputFields.forEach(function (oInputField) {
        if (oInputField.setValue) {
          oInputField.setValue("");
        }
      });
    },

    setNull: function () {
      return {
        del: "",
        reDel: ""
      };
    },
    // on press of add path  cancel
    onCancelAddPath: function () {
      this.onAddPath();
      this.clearFields();
    },
    // on delete press
    onDeletePath: function () {
      let addPath = this.byId("PathFueladdPathBtn");
      let delPathBtn = this.byId("PathFueldeletePathBtn");
      let delPathCon = this.byId("PathFueldelPathConfirm");
      let canPDelete = this.byId("PathFuelcancelPathDelete");
      let deletePL = this.byId("PathFueldeletePathLabel");
      let delCheckBox = this.byId("PathdeletePathCB");

      // Toggle Visibility
      addPath.setVisible(!addPath.getVisible());
      delPathBtn.setVisible(!delPathBtn.getVisible());
      delPathCon.setVisible(!delPathCon.getVisible());
      canPDelete.setVisible(!canPDelete.getVisible());
      deletePL.setVisible(!deletePL.getVisible());
      delCheckBox.setVisible(!delCheckBox.getVisible());
      let oTable = this.byId("PathFuelviewPathtable");
      oTable.getItems().forEach(function (oItem) {
        let oCheckBox = oItem.getCells()[0];
        oCheckBox.setSelected(false);
      });
    },
    //  on press of delete confirm 


    onConfirmDeletePath: async function () {
      let that = this;
      let oTable = this.byId("PathFuelviewPathtable");
      let oSelectedItems = [];

      // Collect keys of selected items
      oTable.getItems().forEach(function (oItem) {
        let oCheckBox = oItem.getCells()[0]; // Assuming the checkbox is the first cell
        if (oCheckBox.getSelected()) {
          oSelectedItems.push(oItem.getBindingContext().getPath());
        }
      });

      if (oSelectedItems.length === 0) {
        sap.m.MessageToast.show("No items selected for deletion.");
        return;
      }

      sap.m.MessageBox.confirm(
        `Are you sure you want to delete the selected path(s)?`,
        {
          actions: [sap.m.MessageBox.Action.OK, sap.m.MessageBox.Action.CANCEL],
          onClose: async function (sAction) {
            if (sAction === sap.m.MessageBox.Action.OK) {
              // Show busy indicator
              sap.ui.core.BusyIndicator.show(0);

              try {
                let oModel = that.getView().getModel();
                let oBindList = oModel.bindList("/pathAndFuelMapping");
                let aContexts = await oBindList.requestContexts();

                for (let sPath of oSelectedItems) {
                  let oContext = aContexts.find(context => context.getPath() === sPath);
                  if (oContext) {
                    await oContext.delete("$auto");
                  }
                }
                sap.m.MessageToast.show("Selected path(s) deleted successfully.");

                // Refresh data and other tasks
                await that.RefreshDataAdd();
                await that.RefreshData();
                that.onCancelDelPath();
              } catch (oError) {
                sap.m.MessageToast.show("Error occurred while deleting path(s).");
                console.error("Deletion Error:", oError);
              } finally {
                // Hide busy indicator
                sap.ui.core.BusyIndicator.hide();
              }
            } else if (sAction === sap.m.MessageBox.Action.CANCEL) {
              // Reset checkbox selections
              oTable.getItems().forEach(function (oItem) {
                let oCheckBox = oItem.getCells()[0];
                oCheckBox.setSelected(false);
              });
            }
          }
        }
      );
    },



    // on press of delete cancel 
    onCancelDelPath: function () {
      this.onDeletePath();
      let oTable = this.byId("PathFuelviewPathtable");
      oTable.getItems().forEach(function (oItem) {
        let oCheckBox = oItem.getCells()[0];
        oCheckBox.setSelected(false);
      });

    }

  });
});