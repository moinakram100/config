/* checksum : 8848cfa83d28ad1e699c1ffb8f9cf748 */
@cds.external : true
@m.IsDefaultEntityContainer : 'true'
@sap.message.scope.supported : 'true'
@sap.supported.formats : 'atom json xlsx'
service GMSVALUEHELP_SRV {};

@cds.external : true
@cds.persistence.skip : true
@sap.creatable : 'false'
@sap.updatable : 'false'
@sap.deletable : 'false'
@sap.pageable : 'false'
@sap.addressable : 'false'
@sap.content.version : '1'
entity GMSVALUEHELP_SRV.Interconnect_pointSet {
  @sap.unicode : 'false'
  @sap.label : 'Transport 1'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  key Transport1 : String(10) not null;
  @sap.unicode : 'false'
  @sap.label : 'Transport 2'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  key Transport2 : String(10) not null;
  @sap.unicode : 'false'
  @sap.label : 'Interconnect Location'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  IntLoc : String(10) not null;
  @sap.unicode : 'false'
  @sap.label : 'Location Name'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  IntLocNam : String(60) not null;
};

@cds.external : true
@cds.persistence.skip : true
@sap.creatable : 'false'
@sap.updatable : 'false'
@sap.deletable : 'false'
@sap.content.version : '1'
@sap.label : 'Capacity Release Value Help'
entity GMSVALUEHELP_SRV.xGMSxCap_Rel_vh {
  @sap.display.format : 'UpperCase'
  @sap.label : 'Location ID'
  key Locid : String(10) not null;
  @sap.display.format : 'UpperCase'
  @sap.label : 'Material'
  @sap.quickinfo : 'Material Number'
  key Material : String(40) not null;
  @sap.display.format : 'UpperCase'
  @sap.label : 'Transport system'
  Tsyst : String(10);
  @sap.label : 'Location name'
  @sap.quickinfo : 'Location name (used by system owner)'
  Locnam : String(60);
};

@cds.external : true
@cds.persistence.skip : true
@sap.creatable : 'false'
@sap.updatable : 'false'
@sap.deletable : 'false'
@sap.content.version : '1'
@sap.label : 'Value Help for Configuration'
entity GMSVALUEHELP_SRV.xGMSxCONFIGVH {
  @sap.display.format : 'UpperCase'
  @sap.label : 'Sales document'
  @sap.quickinfo : 'Sales Document'
  key ContractNumber : String(10) not null;
  @sap.display.format : 'UpperCase'
  @sap.label : 'Master Contract'
  @sap.quickinfo : 'Master Contract Number'
  key MasterContractNumber : String(10) not null;
  @sap.display.format : 'Date'
  @sap.label : 'Customer Ref. Date'
  @sap.quickinfo : 'Customer Reference Date'
  CustRefDate : Date;
  @sap.display.format : 'Date'
  @sap.label : 'Pricing Date'
  @sap.quickinfo : 'Date for Pricing and Exchange Rate'
  PriceDate : Date;
  @sap.display.format : 'UpperCase'
  @sap.label : 'Order Reason'
  @sap.quickinfo : 'Order Reason (Reason for the Business Transaction)'
  OrderReason : String(3);
  @sap.label : 'Description'
  OrderReasonDescription : String(40);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Incoterms'
  @sap.quickinfo : 'Incoterms (Part 1)'
  Incoterms : String(3);
  @sap.label : 'Description'
  IncotermsDescription : String(30);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Material Price Grp'
  @sap.quickinfo : 'Material Price Group'
  MaterialPricingGroup : String(2);
  @sap.label : 'Description'
  MaterialPricingGrpDescription : String(20);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Customer Group'
  CustomerGroup : String(2);
  @sap.label : 'Name'
  CustomerGroupDescription : String(20);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Storage location'
  StorageLocation : String(4);
  @sap.label : 'Description'
  @sap.quickinfo : 'Description of Storage Location'
  StorageLocationDescription : String(16);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Price List Type'
  PriceListType : String(2);
  @sap.label : 'Description'
  @sap.quickinfo : 'Text (20 Characters)'
  PriceListTypeDescription : String(20);
};

@cds.external : true
@cds.persistence.skip : true
@sap.creatable : 'false'
@sap.updatable : 'false'
@sap.deletable : 'false'
@sap.content.version : '1'
@sap.label : 'Contract Type Value Help'
entity GMSVALUEHELP_SRV.xGMSxContractType {
  @sap.display.format : 'UpperCase'
  @sap.label : 'Sales Document Type'
  key Auart : String(4) not null;
  @sap.display.format : 'UpperCase'
  @sap.label : 'Screen sequence grp.'
  @sap.quickinfo : 'Screen sequence group for document header & item'
  key Kopgr : String(4) not null;
  @sap.label : 'Description'
  @sap.quickinfo : 'Sales Document Type Description'
  Description : String(20);
};

@cds.external : true
@cds.persistence.skip : true
@sap.creatable : 'false'
@sap.updatable : 'false'
@sap.deletable : 'false'
@sap.content.version : '1'
@sap.label : 'Customer Group Value Help'
entity GMSVALUEHELP_SRV.xGMSxCUSTGRPVH {
  @sap.display.format : 'UpperCase'
  @sap.label : 'Customer Group'
  key CustomerGroup : String(2) not null;
  @sap.label : 'Description'
  @sap.quickinfo : 'Name'
  Description : String(20);
};

@cds.external : true
@cds.persistence.skip : true
@sap.creatable : 'false'
@sap.updatable : 'false'
@sap.deletable : 'false'
@sap.content.version : '1'
@sap.label : 'Delivery Point'
entity GMSVALUEHELP_SRV.xGMSxDel_Pt {
  @sap.display.format : 'UpperCase'
  @sap.label : 'Business location ID'
  @sap.quickinfo : 'Business location identifier (IS-Oil MRN)'
  key Pblnr : String(10) not null;
  @sap.display.format : 'UpperCase'
  @sap.label : 'Transport system'
  key Tsyst : String(10) not null;
  @sap.display.format : 'UpperCase'
  @sap.label : 'Location ID'
  key Locid : String(10) not null;
  @sap.display.format : 'UpperCase'
  @sap.label : 'Bus. Location Type'
  @sap.quickinfo : 'Business Location Type (IS-Oil MRN)'
  key Pbltyp : String(4) not null;
  @sap.display.format : 'UpperCase'
  @sap.label : 'Origin'
  @sap.quickinfo : 'OIL-TSW: Location is origin flag'
  Delivery_Point : Boolean;
  @sap.display.format : 'UpperCase'
  @sap.label : 'Destination'
  @sap.quickinfo : 'OIL-TSW: Location destination flag'
  Redelivery_Point : Boolean;
};

@cds.external : true
@cds.persistence.skip : true
@sap.creatable : 'false'
@sap.updatable : 'false'
@sap.deletable : 'false'
@sap.content.version : '1'
@sap.label : 'Distribution Channel'
entity GMSVALUEHELP_SRV.xGMSxDistribution {
  @sap.display.format : 'UpperCase'
  @sap.label : 'Distribution Channel'
  key Vtweg : String(2) not null;
};

@cds.external : true
@cds.persistence.skip : true
@sap.creatable : 'false'
@sap.updatable : 'false'
@sap.deletable : 'false'
@sap.content.version : '1'
@sap.label : 'Division'
entity GMSVALUEHELP_SRV.xGMSxDivision {
  @sap.display.format : 'UpperCase'
  @sap.label : 'Division'
  key Spart : String(2) not null;
};

@cds.external : true
@cds.persistence.skip : true
@sap.creatable : 'false'
@sap.updatable : 'false'
@sap.deletable : 'false'
@sap.content.version : '1'
@sap.label : 'Get Delivery Points'
entity GMSVALUEHELP_SRV.xGMSxDP_GET {
  @sap.display.format : 'UpperCase'
  @sap.label : 'Location ID'
  key DeliveryPoint : String(10) not null;
  @sap.label : 'Location name'
  @sap.quickinfo : 'Location name (used by system owner)'
  key DeliveryPointName : String(60) not null;
};

@cds.external : true
@cds.persistence.skip : true
@sap.creatable : 'false'
@sap.updatable : 'false'
@sap.deletable : 'false'
@sap.content.version : '1'
@sap.label : 'Exchange Types Value Help'
entity GMSVALUEHELP_SRV.xGMSxEXCHGTYPEVH {
  @sap.label : 'Language Key'
  key Spras : String(2) not null;
  @sap.display.format : 'UpperCase'
  @sap.text : 'Exgtxt'
  @sap.label : 'Exchange type'
  key Exgtyp : String(4) not null;
  @sap.label : 'Exchange type'
  @sap.quickinfo : 'Exchange type description'
  Exgtxt : String(30);
};

@cds.external : true
@cds.persistence.skip : true
@sap.creatable : 'false'
@sap.updatable : 'false'
@sap.deletable : 'false'
@sap.content.version : '1'
@sap.label : 'Incoterms Value Help'
entity GMSVALUEHELP_SRV.xGMSxINCO1VH {
  @sap.display.format : 'UpperCase'
  @sap.label : 'Incoterms'
  @sap.quickinfo : 'Incoterms (Part 1)'
  key Incoterms : String(3) not null;
  @sap.label : 'Incoterms Description'
  @sap.quickinfo : 'Description'
  Description : String(30);
};

@cds.external : true
@cds.persistence.skip : true
@sap.creatable : 'false'
@sap.updatable : 'false'
@sap.deletable : 'false'
@sap.content.version : '1'
@sap.label : 'Interconnect'
entity GMSVALUEHELP_SRV.xGMSxInterconnect {
  @sap.display.format : 'UpperCase'
  @sap.label : 'Business location ID'
  @sap.quickinfo : 'Business location identifier (IS-Oil MRN)'
  key Pblnr : String(10) not null;
  @sap.display.format : 'UpperCase'
  @sap.label : 'Transport system'
  key Tsyst : String(10) not null;
  @sap.display.format : 'UpperCase'
  @sap.label : 'Location ID'
  key Locid : String(10) not null;
  @sap.display.format : 'UpperCase'
  @sap.label : 'Bus. Location Type'
  @sap.quickinfo : 'Business Location Type (IS-Oil MRN)'
  key Pbltyp : String(4) not null;
  @sap.display.format : 'UpperCase'
  @sap.label : 'Origin'
  @sap.quickinfo : 'OIL-TSW: Location is origin flag'
  Delivery_Point : Boolean;
  @sap.display.format : 'UpperCase'
  @sap.label : 'Destination'
  @sap.quickinfo : 'OIL-TSW: Location destination flag'
  Redelivery_Point : Boolean;
};

@cds.external : true
@cds.persistence.skip : true
@sap.creatable : 'false'
@sap.updatable : 'false'
@sap.deletable : 'false'
@sap.content.version : '1'
@sap.label : 'Location'
entity GMSVALUEHELP_SRV.xGMSxLocation {
  @sap.display.format : 'UpperCase'
  @sap.label : 'Business location ID'
  @sap.quickinfo : 'Business location identifier (IS-Oil MRN)'
  key Pblnr : String(10) not null;
  @sap.display.format : 'UpperCase'
  @sap.label : 'Business loc. name'
  @sap.quickinfo : 'Internal name field'
  Name1 : String(35);
};

@cds.external : true
@cds.persistence.skip : true
@sap.creatable : 'false'
@sap.updatable : 'false'
@sap.deletable : 'false'
@sap.content.version : '1'
@sap.label : 'Location Material VH'
entity GMSVALUEHELP_SRV.xGMSxLocMatnr {
  @sap.display.format : 'UpperCase'
  @sap.label : 'Location ID'
  key Locid : String(10) not null;
  @sap.display.format : 'UpperCase'
  @sap.label : 'Material'
  @sap.quickinfo : 'Material Number'
  key Pmatnr : String(40) not null;
  @sap.display.format : 'UpperCase'
  @sap.label : 'Transport system'
  key Tsyst : String(10) not null;
  @sap.display.format : 'UpperCase'
  @sap.label : 'Location type'
  @sap.quickinfo : 'OIL-TSW: Location type'
  Loctyp : String(4);
  @sap.label : 'Location name'
  @sap.quickinfo : 'Location name (used by system owner)'
  Locnam : String(60);
  @sap.label : 'Planning UoM'
  @sap.quickinfo : 'OIL-TSW: Planning UoM'
  @sap.semantics : 'unit-of-measure'
  Pluom : String(3);
  @sap.label : 'Material description'
  Pmatname : String(40);
};

@cds.external : true
@cds.persistence.skip : true
@sap.creatable : 'false'
@sap.updatable : 'false'
@sap.deletable : 'false'
@sap.content.version : '1'
@sap.label : 'Location Points'
entity GMSVALUEHELP_SRV.xGMSxLocPoint {
  @sap.display.format : 'UpperCase'
  @sap.label : 'Location ID'
  key Locid : String(10) not null;
  @sap.label : 'Location Name'
  @sap.quickinfo : 'Location name (used by system owner)'
  Locnam : String(60);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Location Type'
  @sap.quickinfo : 'OIL-TSW: Location type'
  Loctyp : String(4);
  @sap.label : 'Location Type Short Text'
  @sap.quickinfo : 'Short text'
  LoctypText : String(15);
  @sap.label : 'Location Type Long Text'
  @sap.quickinfo : 'OIL-TSW: Documentation text (with length 60 char)'
  LoctypLongText : String(60);
};

@cds.external : true
@cds.persistence.skip : true
@sap.creatable : 'false'
@sap.updatable : 'false'
@sap.deletable : 'false'
@sap.content.version : '1'
@sap.label : 'Location Points - DP'
entity GMSVALUEHELP_SRV.xGMSxLocPoint_DP {
  @sap.display.format : 'UpperCase'
  @sap.label : 'Location ID'
  key Locid : String(10) not null;
  @sap.label : 'Location Name'
  @sap.quickinfo : 'Location name (used by system owner)'
  Locnam : String(60);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Location Type'
  @sap.quickinfo : 'OIL-TSW: Location type'
  Loctyp : String(4);
  @sap.label : 'Location Type Short Text'
  @sap.quickinfo : 'Short text'
  LoctypText : String(15);
  @sap.label : 'Location Type Long Text'
  @sap.quickinfo : 'OIL-TSW: Documentation text (with length 60 char)'
  LoctypLongText : String(60);
};

@cds.external : true
@cds.persistence.skip : true
@sap.creatable : 'false'
@sap.updatable : 'false'
@sap.deletable : 'false'
@sap.content.version : '1'
@sap.label : 'Location Path Mapping Value Help'
entity GMSVALUEHELP_SRV.xGMSxLocPoint_Map {
  @sap.display.format : 'UpperCase'
  @sap.label : 'Business location ID'
  @sap.quickinfo : 'Business location identifier (IS-Oil MRN)'
  key Pblnr : String(10) not null;
  @sap.display.format : 'UpperCase'
  @sap.label : 'Transport system'
  key Tsyst : String(10) not null;
  @sap.display.format : 'UpperCase'
  @sap.label : 'Location ID'
  key Locid : String(10) not null;
  @sap.display.format : 'UpperCase'
  @sap.label : 'Bus. Location Type'
  @sap.quickinfo : 'Business Location Type (IS-Oil MRN)'
  key Pbltyp : String(4) not null;
  @sap.display.format : 'UpperCase'
  @sap.label : 'Origin'
  @sap.quickinfo : 'OIL-TSW: Location is origin flag'
  Delivery_Point : Boolean;
  @sap.display.format : 'UpperCase'
  @sap.label : 'Destination'
  @sap.quickinfo : 'OIL-TSW: Location destination flag'
  Redelivery_Point : Boolean;
  isDeliveryPoint : String(3);
  isRedeliveryPoint : String(3);
  isInterconnect : String(3);
};

@cds.external : true
@cds.persistence.skip : true
@sap.creatable : 'false'
@sap.updatable : 'false'
@sap.deletable : 'false'
@sap.content.version : '1'
@sap.label : 'Location Points - RDP'
entity GMSVALUEHELP_SRV.xGMSxLocPoint_RDP {
  @sap.display.format : 'UpperCase'
  @sap.label : 'Location ID'
  key Locid : String(10) not null;
  @sap.label : 'Location Name'
  @sap.quickinfo : 'Location name (used by system owner)'
  Locnam : String(60);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Location Type'
  @sap.quickinfo : 'OIL-TSW: Location type'
  Loctyp : String(4);
  @sap.label : 'Location Type Short Text'
  @sap.quickinfo : 'Short text'
  LoctypText : String(15);
  @sap.label : 'Location Type Long Text'
  @sap.quickinfo : 'OIL-TSW: Documentation text (with length 60 char)'
  LoctypLongText : String(60);
};

@cds.external : true
@cds.persistence.skip : true
@sap.creatable : 'false'
@sap.updatable : 'false'
@sap.deletable : 'false'
@sap.content.version : '1'
@sap.label : 'Material'
entity GMSVALUEHELP_SRV.xGMSxMaterial {
  @sap.display.format : 'UpperCase'
  @sap.label : 'Material'
  @sap.quickinfo : 'Material Number'
  key Matnr : String(40) not null;
  @sap.label : 'Base Unit of Measure'
  @sap.semantics : 'unit-of-measure'
  Meins : String(3);
};

@cds.external : true
@cds.persistence.skip : true
@sap.creatable : 'false'
@sap.updatable : 'false'
@sap.deletable : 'false'
@sap.content.version : '1'
@sap.label : 'Material Pricing Group Value Help'
entity GMSVALUEHELP_SRV.xGMSxMATPRCGRPVH {
  @sap.display.format : 'UpperCase'
  @sap.label : 'Material Pricing Group'
  @sap.quickinfo : 'Material Price Group'
  key MaterialPricingGroup : String(2) not null;
  @sap.label : 'Description'
  Description : String(20);
};

@cds.external : true
@cds.persistence.skip : true
@sap.creatable : 'false'
@sap.updatable : 'false'
@sap.deletable : 'false'
@sap.content.version : '1'
@sap.label : 'Purchasing Contract Validity'
entity GMSVALUEHELP_SRV.xGMSxMMVALIDITY {
  @sap.display.format : 'UpperCase'
  @sap.label : 'Purchasing Document'
  @sap.quickinfo : 'Purchasing Document Number'
  key Purchasingdocument : String(10) not null;
  @sap.display.format : 'UpperCase'
  @sap.label : 'Vendor'
  @sap.quickinfo : 'Vendor''s account number'
  Vendor : String(10);
  @sap.label : 'Name of Supplier'
  VendorName : String(80);
  @sap.display.format : 'Date'
  @sap.label : 'Validity Per. Start'
  @sap.quickinfo : 'Start of Validity Period'
  ValidityStartDate : Date;
  @sap.display.format : 'Date'
  @sap.label : 'Validity Period End'
  @sap.quickinfo : 'End of Validity Period'
  ValidityEndDate : Date;
  ContractualDays : Integer;
  DaysFromExpiry : Integer;
  IsExpired : String(1);
};

@cds.external : true
@cds.persistence.skip : true
@sap.creatable : 'false'
@sap.updatable : 'false'
@sap.deletable : 'false'
@sap.content.version : '1'
@sap.label : 'Master Contract Number Value Help'
entity GMSVALUEHELP_SRV.xGMSxMSRTCONTRVH {
  @sap.display.format : 'UpperCase'
  @sap.label : 'Contract Number'
  @sap.quickinfo : 'Sales Document'
  key ContractNumber : String(10) not null;
};

@cds.external : true
@cds.persistence.skip : true
@sap.creatable : 'false'
@sap.updatable : 'false'
@sap.deletable : 'false'
@sap.content.version : '1'
@sap.label : 'Nomination Balancing'
entity GMSVALUEHELP_SRV.xGMSxNomination {
  @sap.display.format : 'UpperCase'
  @sap.label : 'Sales document'
  @sap.quickinfo : 'Sales Document'
  key Vbeln : String(10) not null;
  @sap.display.format : 'UpperCase'
  @sap.label : 'Material'
  @sap.quickinfo : 'Material Number'
  Material : String(40);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Transport system'
  Transys : String(10);
};

@cds.external : true
@cds.persistence.skip : true
@sap.creatable : 'false'
@sap.updatable : 'false'
@sap.deletable : 'false'
@sap.content.version : '1'
@sap.label : 'Order Reason Value Help'
entity GMSVALUEHELP_SRV.xGMSxORDRSN_VH {
  @sap.display.format : 'UpperCase'
  @sap.label : 'Order Reason'
  @sap.quickinfo : 'Order Reason (Reason for the Business Transaction)'
  key OrderReason : String(3) not null;
  @sap.label : 'Description'
  Description : String(40);
};

@cds.external : true
@cds.persistence.skip : true
@sap.creatable : 'false'
@sap.updatable : 'false'
@sap.deletable : 'false'
@sap.content.version : '1'
@sap.label : 'Plant'
entity GMSVALUEHELP_SRV.xGMSxPlant {
  @sap.display.format : 'UpperCase'
  @sap.label : 'Material'
  @sap.quickinfo : 'Material Number'
  key Matnr : String(40) not null;
  @sap.display.format : 'UpperCase'
  @sap.label : 'Plant'
  key Werks : String(4) not null;
};

@cds.external : true
@cds.persistence.skip : true
@sap.creatable : 'false'
@sap.updatable : 'false'
@sap.deletable : 'false'
@sap.content.version : '1'
@sap.label : 'Price List Value Help'
entity GMSVALUEHELP_SRV.xGMSxPRCLISTVH {
  @sap.display.format : 'UpperCase'
  @sap.label : 'Price List'
  @sap.quickinfo : 'Price List Type'
  key PriceList : String(2) not null;
  @sap.label : 'Description'
  @sap.quickinfo : 'Text (20 Characters)'
  Description : String(20);
};

@cds.external : true
@cds.persistence.skip : true
@sap.creatable : 'false'
@sap.updatable : 'false'
@sap.deletable : 'false'
@sap.content.version : '1'
@sap.label : 'Price List Value Help'
entity GMSVALUEHELP_SRV.xGMSxPRICELISTVH {
  @sap.display.format : 'UpperCase'
  @sap.text : 'to_PriceListType/PriceListType_Text'
  @sap.label : 'Price List Type'
  @sap.value.list : 'standard'
  key PriceListType : String(2) not null;
  @sap.label : 'Language Key'
  key Language : String(2) not null;
  @sap.label : 'Description'
  @sap.quickinfo : 'Text (20 Characters)'
  PriceListTypeName : String(20);
  to_PriceListType : Association to GMSVALUEHELP_SRV.I_PriceListType {  };
};

@cds.external : true
@cds.persistence.skip : true
@sap.creatable : 'false'
@sap.updatable : 'false'
@sap.deletable : 'false'
@sap.content.version : '1'
@sap.label : 'Get ReDelivery Points'
entity GMSVALUEHELP_SRV.xGMSxRDP_GET {
  @sap.display.format : 'UpperCase'
  @sap.label : 'Location ID'
  key ReDeliveryPoint : String(10) not null;
  @sap.label : 'Location name'
  @sap.quickinfo : 'Location name (used by system owner)'
  key ReDeliveryPointName : String(60) not null;
};

@cds.external : true
@cds.persistence.skip : true
@sap.creatable : 'false'
@sap.updatable : 'false'
@sap.deletable : 'false'
@sap.content.version : '1'
@sap.label : 'Redelivery Point'
entity GMSVALUEHELP_SRV.xGMSxRd_Point {
  @sap.display.format : 'UpperCase'
  @sap.label : 'Business location ID'
  @sap.quickinfo : 'Business location identifier (IS-Oil MRN)'
  key Pblnr : String(10) not null;
  @sap.display.format : 'UpperCase'
  @sap.label : 'Transport system'
  key Tsyst : String(10) not null;
  @sap.display.format : 'UpperCase'
  @sap.label : 'Location ID'
  key Locid : String(10) not null;
  @sap.display.format : 'UpperCase'
  @sap.label : 'Bus. Location Type'
  @sap.quickinfo : 'Business Location Type (IS-Oil MRN)'
  key Pbltyp : String(4) not null;
  @sap.display.format : 'UpperCase'
  @sap.label : 'Origin'
  @sap.quickinfo : 'OIL-TSW: Location is origin flag'
  Delivery_Point : Boolean;
  @sap.display.format : 'UpperCase'
  @sap.label : 'Destination'
  @sap.quickinfo : 'OIL-TSW: Location destination flag'
  Redelivery_Point : Boolean;
};

@cds.external : true
@cds.persistence.skip : true
@sap.creatable : 'false'
@sap.updatable : 'false'
@sap.deletable : 'false'
@sap.content.version : '1'
@sap.label : 'Sales Contract'
entity GMSVALUEHELP_SRV.xGMSxSales_Cont {
  @sap.display.format : 'UpperCase'
  @sap.label : 'Sales document'
  @sap.quickinfo : 'Sales Document'
  key Vbeln : String(10) not null;
};

@cds.external : true
@cds.persistence.skip : true
@sap.creatable : 'false'
@sap.updatable : 'false'
@sap.deletable : 'false'
@sap.content.version : '1'
@sap.label : 'Sales Organization'
entity GMSVALUEHELP_SRV.xGMSxSales_Org {
  @sap.display.format : 'UpperCase'
  @sap.label : 'Sales Organization'
  key Vkorg : String(4) not null;
};

@cds.external : true
@cds.persistence.skip : true
@sap.creatable : 'false'
@sap.updatable : 'false'
@sap.deletable : 'false'
@sap.content.version : '1'
@sap.label : 'Sales Contract Validity'
entity GMSVALUEHELP_SRV.xGMSxSDVALIDITY {
  @sap.display.format : 'UpperCase'
  @sap.label : 'Sales document'
  @sap.quickinfo : 'Sales Document'
  key SalesDocument : String(10) not null;
  @sap.display.format : 'UpperCase'
  @sap.label : 'Sold-To Party'
  Customer : String(10);
  @sap.label : 'Name of Customer'
  CustomerName : String(80);
  @sap.display.format : 'Date'
  @sap.label : 'Valid-From Date'
  @sap.quickinfo : 'Valid-From Date (Outline Agreements, Product Proposals)'
  ValidityStartDate : Date;
  @sap.display.format : 'Date'
  @sap.label : 'Valid-To Date'
  @sap.quickinfo : 'Valid-To Date (Outline Agreements, Product Proposals)'
  ValidityEndDate : Date;
  ContractualDays : Integer;
  DaysToExpiry : Integer;
  IsExpired : String(1);
};

@cds.external : true
@cds.persistence.skip : true
@sap.creatable : 'false'
@sap.updatable : 'false'
@sap.deletable : 'false'
@sap.content.version : '1'
@sap.label : 'Ship To Party'
entity GMSVALUEHELP_SRV.xGMSxShip_To_Party {
  @sap.display.format : 'UpperCase'
  @sap.label : 'Customer'
  @sap.quickinfo : 'Customer Number'
  key Kunnr : String(10) not null;
  @sap.display.format : 'UpperCase'
  @sap.label : 'Sales Organization'
  key Vkorg : String(4) not null;
  @sap.display.format : 'UpperCase'
  @sap.label : 'Distribution Channel'
  key Vtweg : String(2) not null;
  @sap.display.format : 'UpperCase'
  @sap.label : 'Division'
  key Spart : String(2) not null;
};

@cds.external : true
@cds.persistence.skip : true
@sap.creatable : 'false'
@sap.updatable : 'false'
@sap.deletable : 'false'
@sap.content.version : '1'
@sap.label : 'Sold to Party'
entity GMSVALUEHELP_SRV.xGMSxSold_to_Party {
  @sap.display.format : 'UpperCase'
  @sap.label : 'Customer'
  @sap.quickinfo : 'Customer Number'
  key Kunnr : String(10) not null;
};

@cds.external : true
@cds.persistence.skip : true
@sap.creatable : 'false'
@sap.updatable : 'false'
@sap.deletable : 'false'
@sap.content.version : '1'
@sap.label : 'Storage Location Value Help'
entity GMSVALUEHELP_SRV.xGMSxSTRLOCVH {
  @sap.display.format : 'UpperCase'
  @sap.label : 'Storage Location'
  @sap.quickinfo : 'Storage location'
  key StorageLocation : String(4) not null;
  @sap.display.format : 'UpperCase'
  @sap.label : 'Plant'
  key Plant : String(4) not null;
  @sap.label : 'Description'
  @sap.quickinfo : 'Description of Storage Location'
  Description : String(16);
};

@cds.external : true
@cds.persistence.skip : true
@sap.creatable : 'false'
@sap.updatable : 'false'
@sap.deletable : 'false'
@sap.content.version : '1'
@sap.label : 'Transport'
entity GMSVALUEHELP_SRV.xGMSxTransport {
  @sap.display.format : 'UpperCase'
  @sap.label : 'Transport system'
  key Tsyst : String(10) not null;
  @sap.label : 'System name'
  @sap.quickinfo : 'OIL-TSW: Transport system name'
  Tsnam : String(60);
};

@cds.external : true
@cds.persistence.skip : true
@sap.creatable : 'false'
@sap.updatable : 'false'
@sap.deletable : 'false'
@sap.content.version : '1'
@sap.label : 'Transport System Location'
entity GMSVALUEHELP_SRV.xGMSxTsystLoc {
  @sap.display.format : 'UpperCase'
  @sap.label : 'Transport system'
  key Tsyst : String(10) not null;
  @sap.display.format : 'UpperCase'
  @sap.label : 'Location ID'
  key Locid : String(10) not null;
  @sap.label : 'Location name'
  @sap.quickinfo : 'Location name (used by system owner)'
  Locnam : String(60);
};

@cds.external : true
@cds.persistence.skip : true
@sap.creatable : 'false'
@sap.updatable : 'false'
@sap.deletable : 'false'
@sap.content.version : '1'
@sap.label : 'Uom'
entity GMSVALUEHELP_SRV.xGMSxUOM {
  @sap.label : 'Internal UoM'
  @sap.quickinfo : 'Unit of Measurement'
  @sap.semantics : 'unit-of-measure'
  key Msehi : String(3) not null;
};

@cds.external : true
@cds.persistence.skip : true
@sap.creatable : 'false'
@sap.updatable : 'false'
@sap.deletable : 'false'
@sap.content.version : '1'
@sap.label : 'Uom'
entity GMSVALUEHELP_SRV.xGMSxUOM_value {
  @sap.label : 'Unit of Measure'
  @sap.quickinfo : 'Unit of Measurement'
  @sap.semantics : 'unit-of-measure'
  key Msehi : String(3) not null;
  @sap.display.format : 'UpperCase'
  @sap.label : 'Dimension Key'
  @sap.quickinfo : 'Dimension key'
  Dimid : String(6);
  @sap.label : 'Unit of Measure Short Text'
  @sap.quickinfo : 'Unit of Measurement Text (Maximum 10 Characters)'
  Mseht : String(10);
  @sap.label : 'Unit of Measure Long Text'
  @sap.quickinfo : 'Unit of Measurement Text (Maximum 30 Characters)'
  Msehl : String(30);
};

@cds.external : true
@cds.persistence.skip : true
@sap.creatable : 'false'
@sap.updatable : 'false'
@sap.deletable : 'false'
@sap.content.version : '1'
@sap.label : 'Vendor, Purch Org'
entity GMSVALUEHELP_SRV.xGMSxVendPurchOrgCoVH {
  @sap.display.format : 'UpperCase'
  @sap.text : 'to_Supplier/SupplierName'
  @sap.label : 'Vendor'
  @sap.quickinfo : 'Vendor''s account number'
  @sap.value.list : 'standard'
  key Supplier : String(10) not null;
  @sap.display.format : 'UpperCase'
  @sap.text : 'PurchasingOrganizationName'
  @sap.label : 'Purch. organization'
  @sap.quickinfo : 'Purchasing organization'
  key PurchasingOrganization : String(4) not null;
  @sap.label : 'Purch. Org. Name'
  @sap.quickinfo : 'Purchasing Organization Name'
  PurchasingOrganizationName : String(20);
  @sap.display.format : 'UpperCase'
  @sap.text : 'PurchasingGroupName'
  @sap.label : 'Purchasing Group'
  PurchasingGroup : String(3);
  @sap.label : 'Purchasing Grp Name'
  @sap.quickinfo : 'Purchasing Group Name'
  PurchasingGroupName : String(18);
  @sap.label : 'Planned Deliv. Time'
  @sap.quickinfo : 'Planned Delivery Time in Days'
  MaterialPlannedDeliveryDurn : Decimal(3, 0);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Pur. block POrg'
  @sap.quickinfo : 'Purchasing block at purchasing organization level'
  PurchasingIsBlockedForSupplier : Boolean;
  @sap.label : 'Salesperson'
  @sap.quickinfo : 'Responsible Salesperson at Supplier''s Office'
  SupplierRespSalesPersonName : String(30);
  @sap.label : 'Telephone'
  @sap.quickinfo : 'Supplier''s Telephone Number'
  SupplierPhoneNumber : String(16);
  @sap.label : 'Order currency'
  @sap.quickinfo : 'Purchase order currency'
  @sap.semantics : 'currency-code'
  PurchaseOrderCurrency : String(5);
  @sap.unit : 'PurchaseOrderCurrency'
  @sap.label : 'Minimum order value'
  MinimumOrderAmount : Decimal(14, 3);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Schema Grp, Supplier'
  @sap.quickinfo : 'Group for Calculation Schema (Supplier)'
  CalculationSchemaGroupCode : String(2);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Payment terms'
  @sap.quickinfo : 'Terms of payment key'
  PaymentTerms : String(4);
  @sap.label : 'Payment Terms Description'
  @sap.quickinfo : 'Own Explanation of Term of Payment'
  PaymentTermsDescription : String(50);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Pricing Date Control'
  @sap.quickinfo : 'Price Determination (Pricing) Date Control'
  PricingDateControl : String(1);
  @sap.display.format : 'UpperCase'
  @sap.label : 'ABC indicator'
  SupplierABCClassificationCode : String(1);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Shipping Conditions'
  ShippingCondition : String(2);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Automatic PO'
  @sap.quickinfo : 'Automatic Generation of Purchase Order Allowed'
  PurOrdAutoGenerationIsAllowed : Boolean;
  @sap.display.format : 'UpperCase'
  @sap.label : 'GR-Based Inv. Verif.'
  @sap.quickinfo : 'Indicator: GR-Based Invoice Verification'
  InvoiceIsGoodsReceiptBased : Boolean;
  @sap.display.format : 'UpperCase'
  @sap.text : 'IncotermsClassificationName'
  @sap.label : 'Incoterms'
  @sap.quickinfo : 'Incoterms (Part 1)'
  IncotermsClassification : String(3);
  @sap.label : 'Incoterms Classification Desc'
  @sap.quickinfo : 'Description'
  IncotermsClassificationName : String(30);
  to_customer : Association to GMSVALUEHELP_SRV.I_Customer {  };
  to_IncotermsClassfctnText : Association to GMSVALUEHELP_SRV.C_IncotermsClassfctnTextVHTemp {  };
  to_PurgOrganization : Association to GMSVALUEHELP_SRV.I_PurchasingOrganization {  };
  to_Supplier : Association to GMSVALUEHELP_SRV.I_Supplier {  };
};

@cds.external : true
@cds.persistence.skip : true
@sap.creatable : 'false'
@sap.updatable : 'false'
@sap.deletable : 'false'
@sap.searchable : 'true'
@sap.content.version : '1'
@sap.label : 'Incoterms classfication value help text'
entity GMSVALUEHELP_SRV.C_IncotermsClassfctnTextVHTemp {
  @sap.display.format : 'UpperCase'
  @sap.label : 'Incoterms'
  @sap.quickinfo : 'Incoterms (Part 1)'
  key IncotermsClassification : String(3) not null;
  @sap.label : 'Language Key'
  key Language : String(2) not null;
  @sap.label : 'Incoterms Classification Desc'
  @sap.quickinfo : 'Description'
  IncotermsClassificationName : String(30);
};

@cds.external : true
@cds.persistence.skip : true
@sap.creatable : 'false'
@sap.updatable : 'false'
@sap.deletable : 'false'
@sap.addressable : 'false'
@sap.content.version : '1'
@sap.label : 'Address'
entity GMSVALUEHELP_SRV.I_Address {
  @sap.display.format : 'UpperCase'
  @sap.label : 'Address Number'
  key AddressID : String(10) not null;
  @sap.label : 'c/o'
  @sap.quickinfo : 'c/o name'
  CareOfName : String(40);
  @sap.label : 'Street 5'
  AdditionalStreetSuffixName : String(40);
  @sap.label : 'Language Key'
  CorrespondenceLanguage : String(2);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Comm. Method'
  @sap.quickinfo : 'Communication Method (Key) (Business Address Services)'
  PrfrdCommMediumType : String(3);
  @sap.display.format : 'UpperCase'
  @sap.label : 'PO Box'
  POBox : String(10);
  @sap.display.format : 'UpperCase'
  @sap.label : 'PO Box w/o No.'
  @sap.quickinfo : 'Flag: PO Box Without Number'
  POBoxIsWithoutNumber : Boolean;
  @sap.display.format : 'UpperCase'
  @sap.label : 'PO Box Postal Code'
  POBoxPostalCode : String(10);
  @sap.label : 'PO Box Lobby'
  POBoxLobbyName : String(40);
  @sap.label : 'PO Box City'
  @sap.quickinfo : 'PO Box city'
  POBoxDeviatingCityName : String(40);
  @sap.display.format : 'UpperCase'
  @sap.label : 'PO Box Region'
  @sap.quickinfo : 'Region for PO Box (Country, State, Province, ...)'
  POBoxDeviatingRegion : String(3);
  @sap.display.format : 'UpperCase'
  @sap.label : 'PO box country'
  POBoxDeviatingCountry : String(3);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Delvry Serv Type'
  @sap.quickinfo : 'Type of Delivery Service'
  DeliveryServiceTypeCode : String(4);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Delivery Service No.'
  @sap.quickinfo : 'Number of Delivery Service'
  DeliveryServiceNumber : String(10);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Time zone'
  @sap.quickinfo : 'Address time zone'
  AddressTimeZone : String(6);
  @sap.label : 'Full Name'
  @sap.quickinfo : 'Full name of a party (Bus. Partner, Org. Unit, Doc. address)'
  FullName : String(80);
  @sap.label : 'City'
  CityName : String(40);
  @sap.label : 'District'
  District : String(40);
  @sap.display.format : 'UpperCase'
  @sap.label : 'City Code'
  @sap.quickinfo : 'City code for city/street file'
  CityCode : String(12);
  @sap.label : 'Different City'
  @sap.quickinfo : 'City (different from postal city)'
  HomeCityName : String(40);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Postal Code'
  @sap.quickinfo : 'City postal code'
  PostalCode : String(10);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Company Postal Code'
  @sap.quickinfo : 'Company Postal Code (for Large Customers)'
  CompanyPostalCode : String(10);
  @sap.label : 'Street'
  StreetName : String(60);
  @sap.label : 'Street 2'
  StreetPrefixName : String(40);
  @sap.label : 'Street 3'
  AdditionalStreetPrefixName : String(40);
  @sap.label : 'Street 4'
  StreetSuffixName : String(40);
  @sap.label : 'House Number'
  HouseNumber : String(10);
  @sap.label : 'Supplement'
  @sap.quickinfo : 'House number supplement'
  HouseNumberSupplementText : String(10);
  @sap.label : 'Building Code'
  @sap.quickinfo : 'Building (Number or Code)'
  Building : String(20);
  @sap.label : 'Floor'
  @sap.quickinfo : 'Floor in building'
  Floor : String(10);
  @sap.label : 'Room Number'
  @sap.quickinfo : 'Room or Apartment Number'
  RoomNumber : String(10);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Country Key'
  Country : String(3);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Region'
  @sap.quickinfo : 'Region (State, Province, County)'
  Region : String(3);
  @sap.label : 'County'
  County : String(40);
  @sap.display.format : 'UpperCase'
  @sap.label : 'County code'
  @sap.quickinfo : 'County code for county'
  CountyCode : String(8);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Title'
  @sap.quickinfo : 'Form-of-Address Key'
  FormOfAddress : String(4);
  @sap.label : 'Name'
  @sap.quickinfo : 'Name 1'
  BusinessPartnerName1 : String(40);
  @sap.label : 'Name 2'
  BusinessPartnerName2 : String(40);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Address Version'
  @sap.quickinfo : 'Version ID for International Addresses'
  Nation : String(1);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Telephone'
  @sap.quickinfo : 'First telephone no.: dialling code+number'
  PhoneNumber : String(30);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Fax'
  @sap.quickinfo : 'First fax no.: dialling code+number'
  FaxNumber : String(30);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Search Term 1'
  SearchTerm1 : String(20);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Search Term 2'
  SearchTerm2 : String(20);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Street'
  @sap.quickinfo : 'Street Name in Uppercase for Search Help'
  StreetSearch : String(25);
  @sap.display.format : 'UpperCase'
  @sap.label : 'City'
  @sap.quickinfo : 'City name in Uppercase for Search Help'
  CitySearch : String(25);
  @sap.label : 'Name 3'
  BusinessPartnerName3 : String(40);
  @sap.label : 'Name 4'
  BusinessPartnerName4 : String(40);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Tax Jurisdiction'
  TaxJurisdiction : String(15);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Transportation Zone'
  @sap.quickinfo : 'Transportation zone to or from which the goods are delivered'
  TransportZone : String(10);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Person number'
  Person : String(10);
};

@cds.external : true
@cds.persistence.skip : true
@sap.creatable : 'false'
@sap.updatable : 'false'
@sap.deletable : 'false'
@sap.searchable : 'true'
@sap.content.version : '1'
@sap.label : 'Company Code'
entity GMSVALUEHELP_SRV.I_CompanyCode {
  @sap.display.format : 'UpperCase'
  @sap.text : 'CompanyCodeName'
  @sap.label : 'Company Code'
  key CompanyCode : String(4) not null;
  @sap.label : 'Company Name'
  @sap.quickinfo : 'Name of Company Code or Company'
  CompanyCodeName : String(25);
  @sap.label : 'City'
  CityName : String(25);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Country Key'
  Country : String(3);
  @sap.label : 'Currency'
  @sap.quickinfo : 'Currency Key'
  @sap.semantics : 'currency-code'
  Currency : String(5);
  @sap.label : 'Language Key'
  Language : String(2);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Chart of Accounts'
  ChartOfAccounts : String(4);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Fiscal Year Variant'
  FiscalYearVariant : String(2);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Company'
  Company : String(6);
  @sap.display.format : 'UpperCase'
  @sap.text : 'CreditControlArea_Text'
  @sap.label : 'Credit control area'
  @sap.value.list : 'standard'
  CreditControlArea : String(4);
  @sap.label : 'Description'
  @sap.quickinfo : 'Description of the credit control area'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  CreditControlArea_Text : String(35);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Country Chart/Accts'
  @sap.quickinfo : 'Chart of Accounts According to Country Legislation'
  CountryChartOfAccounts : String(4);
  @sap.display.format : 'UpperCase'
  @sap.label : 'FM Area'
  @sap.quickinfo : 'Financial Management Area'
  FinancialManagementArea : String(4);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Address'
  AddressID : String(10);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Taxes on Sals/Purch.'
  @sap.quickinfo : 'Sales/Purchases Tax Group'
  TaxableEntity : String(4);
  @sap.display.format : 'UpperCase'
  @sap.label : 'VAT Registration No.'
  @sap.quickinfo : 'VAT Registration Number'
  VATRegistration : String(20);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Extended WTax Active'
  @sap.quickinfo : 'Indicator: Extended Withholding Tax Active'
  ExtendedWhldgTaxIsActive : Boolean;
  @sap.display.format : 'UpperCase'
  @sap.text : 'ControllingArea_Text'
  @sap.label : 'Controlling Area'
  @sap.value.list : 'standard'
  ControllingArea : String(4);
  @sap.label : 'Controlling Area Name'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  ControllingArea_Text : String(25);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Field status variant'
  @sap.quickinfo : 'Field Status Variant'
  FieldStatusVariant : String(4);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Output Tax Code'
  @sap.quickinfo : 'Output Tax Code for Non-Taxable Transactions'
  NonTaxableTransactionTaxCode : String(2);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Tax Determ.with Doc.Date'
  @sap.quickinfo : 'Indicator: Document Date As the Basis for Tax Determination'
  DocDateIsUsedForTaxDetn : Boolean;
  @sap.display.format : 'UpperCase'
  @sap.label : 'Tax Date'
  @sap.quickinfo : 'Tax Reporting Date Active in Documents'
  TaxRptgDateIsActive : Boolean;
  to_Address : Association to GMSVALUEHELP_SRV.I_Address {  };
};

@cds.external : true
@cds.persistence.skip : true
@sap.creatable : 'false'
@sap.updatable : 'false'
@sap.deletable : 'false'
@sap.searchable : 'true'
@sap.content.version : '1'
@sap.label : 'Controlling Area'
@sap.value.list : 'true'
entity GMSVALUEHELP_SRV.I_ControllingAreaStdVH {
  @sap.display.format : 'UpperCase'
  @sap.text : 'ControllingAreaName'
  @sap.label : 'Controlling Area'
  key ControllingArea : String(4) not null;
  @sap.label : 'Controlling Area Name'
  ControllingAreaName : String(25);
};

@cds.external : true
@cds.persistence.skip : true
@sap.creatable : 'false'
@sap.updatable : 'false'
@sap.deletable : 'false'
@sap.content.version : '1'
@sap.label : 'Credit Control Area'
@sap.value.list : 'true'
entity GMSVALUEHELP_SRV.I_CreditControlAreaStdVH {
  @sap.display.format : 'UpperCase'
  @sap.text : 'CreditControlArea_Text'
  @sap.label : 'Credit Control Area'
  key CreditControlArea : String(4) not null;
  @sap.label : 'Description'
  @sap.quickinfo : 'Description of the credit control area'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  CreditControlArea_Text : String(35);
};

@cds.external : true
@cds.persistence.skip : true
@sap.creatable : 'false'
@sap.updatable : 'false'
@sap.deletable : 'false'
@sap.content.version : '1'
@sap.label : 'Customer'
entity GMSVALUEHELP_SRV.I_Customer {
  @sap.display.format : 'UpperCase'
  @sap.text : 'CustomerName'
  @sap.label : 'Customer'
  @sap.quickinfo : 'Customer Number'
  key Customer : String(10) not null;
  @sap.label : 'Name of Customer'
  CustomerName : String(80);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Customer Name'
  @sap.quickinfo : 'Customer Full Name'
  CustomerFullName : String(220);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Created by'
  @sap.quickinfo : 'Name of Person who Created the Object'
  CreatedByUser : String(12);
  @sap.display.format : 'Date'
  @sap.label : 'Created on'
  @sap.quickinfo : 'Date on which the Record Was Created'
  CreationDate : Date;
  @sap.display.format : 'UpperCase'
  @sap.label : 'Address'
  AddressID : String(10);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Customer classific.'
  @sap.quickinfo : 'Customer classification'
  CustomerClassification : String(2);
  @sap.display.format : 'UpperCase'
  @sap.label : 'VAT Registration No.'
  @sap.quickinfo : 'VAT Registration Number'
  VATRegistration : String(20);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Account group'
  @sap.quickinfo : 'Customer Account Group'
  CustomerAccountGroup : String(4);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Authorization'
  @sap.quickinfo : 'Authorization Group'
  AuthorizationGroup : String(4);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Delivery block'
  @sap.quickinfo : 'Central delivery block for the customer'
  DeliveryIsBlocked : String(2);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Posting Block'
  @sap.quickinfo : 'Central posting block'
  PostingIsBlocked : Boolean;
  @sap.display.format : 'UpperCase'
  @sap.label : 'Billing block'
  @sap.quickinfo : 'Central billing block for customer'
  BillingIsBlockedForCustomer : String(2);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Order block'
  @sap.quickinfo : 'Central order block for customer'
  OrderIsBlockedForCustomer : String(2);
  @sap.display.format : 'NonNegative'
  @sap.label : 'Int. location no. 1'
  @sap.quickinfo : 'International location number (part 1)'
  InternationalLocationNumber1 : String(7);
  @sap.display.format : 'UpperCase'
  @sap.label : 'One-time account'
  @sap.quickinfo : 'Indicator: Is the account a one-time account?'
  IsOneTimeAccount : Boolean;
  @sap.display.format : 'UpperCase'
  @sap.label : 'Tax Jurisdiction'
  TaxJurisdiction : String(15);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Industry'
  @sap.quickinfo : 'Industry key'
  Industry : String(4);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Tax number type'
  @sap.quickinfo : 'Tax Number Type'
  TaxNumberType : String(2);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Tax Number 1'
  TaxNumber1 : String(16);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Tax Number 2'
  TaxNumber2 : String(11);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Tax Number 3'
  TaxNumber3 : String(18);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Tax Number 4'
  TaxNumber4 : String(18);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Tax Number 5'
  TaxNumber5 : String(60);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Group key'
  CustomerCorporateGroup : String(10);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Vendor'
  @sap.quickinfo : 'Account Number of Vendor or Creditor'
  Supplier : String(10);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Nielsen indicator'
  @sap.quickinfo : 'Nielsen ID'
  NielsenRegion : String(2);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Industry code 1'
  IndustryCode1 : String(10);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Industry code 2'
  IndustryCode2 : String(10);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Industry code 3'
  IndustryCode3 : String(10);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Industry code 4'
  IndustryCode4 : String(10);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Industry code 5'
  IndustryCode5 : String(10);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Country'
  @sap.quickinfo : 'Country Key'
  Country : String(3);
  @sap.label : 'Name'
  @sap.quickinfo : 'Name 1'
  OrganizationBPName1 : String(35);
  @sap.label : 'Name 2'
  OrganizationBPName2 : String(35);
  @sap.label : 'City'
  CityName : String(35);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Postal Code'
  PostalCode : String(10);
  @sap.label : 'Street'
  @sap.quickinfo : 'Street and House Number'
  StreetName : String(35);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Search term'
  @sap.quickinfo : 'Sort field'
  SortField : String(10);
  @sap.label : 'Fax Number'
  FaxNumber : String(31);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Suframa Code'
  BR_SUFRAMACode : String(9);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Region'
  @sap.quickinfo : 'Region (State, Province, County)'
  Region : String(3);
  @sap.label : 'Telephone 1'
  @sap.quickinfo : 'First telephone number'
  TelephoneNumber1 : String(16);
  @sap.label : 'Telephone 2'
  @sap.quickinfo : 'Second telephone number'
  TelephoneNumber2 : String(16);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Alternative payer'
  @sap.quickinfo : 'Account number of an alternative payer'
  AlternativePayerAccount : String(10);
  @sap.display.format : 'UpperCase'
  @sap.label : 'DME indicator'
  @sap.quickinfo : 'Report key for data medium exchange'
  DataMediumExchangeIndicator : String(1);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Liable for VAT'
  VATLiability : Boolean;
  @sap.display.format : 'UpperCase'
  @sap.label : 'Purpose Completed'
  @sap.quickinfo : 'Business Purpose Completed Flag'
  IsBusinessPurposeCompleted : String(1);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Tax type'
  ResponsibleType : String(2);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Fiscal address'
  @sap.quickinfo : 'Account number of the master record with the fiscal address'
  FiscalAddress : String(10);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Natural Person'
  NFPartnerIsNaturalPerson : String(1);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Deletion flag'
  @sap.quickinfo : 'Central Deletion Flag for Master Record'
  DeletionIndicator : Boolean;
  @sap.label : 'Language Key'
  Language : String(2);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Trading Partner No.'
  @sap.quickinfo : 'Company ID of Trading Partner'
  TradingPartner : String(6);
  @sap.label : 'Rep''s Name'
  @sap.quickinfo : 'Name of Representative'
  TaxInvoiceRepresentativeName : String(10);
  @sap.label : 'Type of Business'
  BusinessType : String(30);
  @sap.label : 'Type of Industry'
  IndustryType : String(30);
};

@cds.external : true
@cds.persistence.skip : true
@sap.creatable : 'false'
@sap.updatable : 'false'
@sap.deletable : 'false'
@sap.searchable : 'true'
@sap.content.version : '1'
@sap.label : 'Language'
entity GMSVALUEHELP_SRV.I_Language {
  @sap.text : 'Language_Text'
  @sap.label : 'Language Key'
  key Language : String(2) not null;
  @sap.label : 'Name'
  @sap.quickinfo : 'Name of Language'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  Language_Text : String(16);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Lang. (ISO 639)'
  @sap.quickinfo : '2-Character SAP Language Code'
  LanguageISOCode : String(2);
};

@cds.external : true
@cds.persistence.skip : true
@sap.creatable : 'false'
@sap.updatable : 'false'
@sap.deletable : 'false'
@sap.content.version : '1'
@sap.label : 'Movement Type Text Basic View'
entity GMSVALUEHELP_SRV.I_Movement_TypeText {
  @sap.display.format : 'UpperCase'
  @sap.label : 'Movement type'
  @sap.quickinfo : 'Movement type (inventory management)'
  key MovementType : String(3) not null;
  @sap.label : 'Language Key'
  key Language : String(2) not null;
  @sap.label : 'Movement Type Text'
  @sap.quickinfo : 'Movement Type Text (Inventory Management)'
  MovementTypeDescription : String(20);
};

@cds.external : true
@cds.persistence.skip : true
@sap.creatable : 'false'
@sap.updatable : 'false'
@sap.deletable : 'false'
@sap.content.version : '1'
@sap.label : 'Responsible Purchasing Organizations for Plant'
entity GMSVALUEHELP_SRV.I_PlantPurchasingOrganization {
  @sap.display.format : 'UpperCase'
  @sap.label : 'Purch. organization'
  @sap.quickinfo : 'Purchasing organization'
  key PurchasingOrganization : String(4) not null;
  @sap.display.format : 'UpperCase'
  @sap.label : 'Plant'
  key Plant : String(4) not null;
};

@cds.external : true
@cds.persistence.skip : true
@sap.creatable : 'false'
@sap.updatable : 'false'
@sap.deletable : 'false'
@sap.content.version : '1'
@sap.label : 'Price List Type'
entity GMSVALUEHELP_SRV.I_PriceListType {
  @sap.display.format : 'UpperCase'
  @sap.text : 'PriceListType_Text'
  @sap.label : 'Price List Type'
  key PriceListType : String(2) not null;
  @sap.label : 'Description'
  @sap.quickinfo : 'Text (20 Characters)'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  PriceListType_Text : String(20);
};

@cds.external : true
@cds.persistence.skip : true
@sap.creatable : 'false'
@sap.updatable : 'false'
@sap.deletable : 'false'
@sap.searchable : 'true'
@sap.content.version : '1'
@sap.label : 'Purchasing Group'
entity GMSVALUEHELP_SRV.I_PurchasingGroup {
  @sap.display.format : 'UpperCase'
  @sap.text : 'PurchasingGroupName'
  @sap.label : 'Purchasing Group'
  key PurchasingGroup : String(3) not null;
  @sap.label : 'Purchasing Grp Name'
  @sap.quickinfo : 'Purchasing Group Name'
  PurchasingGroupName : String(18);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Tel.no. purch. group'
  @sap.quickinfo : 'Telephone number of purchasing group (buyer group)'
  PurchasingGroupPhoneNumber : String(12);
  @sap.label : 'Fax number'
  @sap.quickinfo : 'Fax number of purchasing (buyer) group'
  FaxNumber : String(31);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Telephone'
  @sap.quickinfo : 'Telephone no.: dialling code+number'
  PhoneNumber : String(30);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Extension'
  @sap.quickinfo : 'Telephone no.: Extension'
  PhoneNumberExtension : String(10);
  @sap.label : 'E-Mail Address'
  EmailAddress : String(241);
};

@cds.external : true
@cds.persistence.skip : true
@sap.creatable : 'false'
@sap.updatable : 'false'
@sap.deletable : 'false'
@sap.searchable : 'true'
@sap.content.version : '1'
@sap.label : 'Purchasing Organization'
entity GMSVALUEHELP_SRV.I_PurchasingOrganization {
  @sap.display.format : 'UpperCase'
  @sap.text : 'PurchasingOrganizationName'
  @sap.label : 'Purchasing Organization'
  key PurchasingOrganization : String(4) not null;
  @sap.label : 'Purch. Org. Name'
  @sap.quickinfo : 'Purchasing Organization Name'
  PurchasingOrganizationName : String(20);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Company Code'
  CompanyCode : String(4);
  to_Plant : Association to many GMSVALUEHELP_SRV.I_PlantPurchasingOrganization {  };
};

@cds.external : true
@cds.persistence.skip : true
@sap.creatable : 'false'
@sap.updatable : 'false'
@sap.deletable : 'false'
@sap.content.version : '1'
@sap.label : 'Supplier'
entity GMSVALUEHELP_SRV.I_Supplier {
  @sap.display.format : 'UpperCase'
  @sap.text : 'SupplierName'
  @sap.label : 'Vendor'
  @sap.quickinfo : 'Account Number of Vendor or Creditor'
  key Supplier : String(10) not null;
  @sap.display.format : 'UpperCase'
  @sap.label : 'Account group'
  @sap.quickinfo : 'Vendor account group'
  SupplierAccountGroup : String(4);
  @sap.label : 'Name of Supplier'
  SupplierName : String(80);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Supplier Name'
  @sap.quickinfo : 'Supplier Full Name'
  SupplierFullName : String(220);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Purpose Completed'
  @sap.quickinfo : 'Business Purpose Completed Flag'
  IsBusinessPurposeCompleted : String(1);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Created by'
  @sap.quickinfo : 'Name of Person who Created the Object'
  CreatedByUser : String(12);
  @sap.display.format : 'Date'
  @sap.label : 'Created on'
  @sap.quickinfo : 'Date on which the Record Was Created'
  CreationDate : Date;
  @sap.display.format : 'UpperCase'
  @sap.label : 'One-time account'
  @sap.quickinfo : 'Indicator: Is the account a one-time account?'
  IsOneTimeAccount : Boolean;
  @sap.display.format : 'UpperCase'
  @sap.label : 'Authorization'
  @sap.quickinfo : 'Authorization Group'
  AuthorizationGroup : String(4);
  @sap.display.format : 'UpperCase'
  @sap.label : 'VAT Registration No.'
  @sap.quickinfo : 'VAT Registration Number'
  VATRegistration : String(20);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Posting Block'
  @sap.quickinfo : 'Central posting block'
  AccountIsBlockedForPosting : Boolean;
  @sap.display.format : 'UpperCase'
  @sap.label : 'Tax Jurisdiction'
  TaxJurisdiction : String(15);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Group key'
  SupplierCorporateGroup : String(10);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Customer'
  @sap.quickinfo : 'Customer Number'
  Customer : String(10);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Industry'
  @sap.quickinfo : 'Industry key'
  Industry : String(4);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Tax Number 1'
  TaxNumber1 : String(16);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Tax Number 2'
  TaxNumber2 : String(11);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Tax Number 3'
  TaxNumber3 : String(18);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Tax Number 4'
  TaxNumber4 : String(18);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Tax Number 5'
  TaxNumber5 : String(60);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Posting Block'
  @sap.quickinfo : 'Central posting block'
  PostingIsBlocked : Boolean;
  @sap.display.format : 'UpperCase'
  @sap.label : 'Purch. block'
  @sap.quickinfo : 'Centrally imposed purchasing block'
  PurchasingIsBlocked : Boolean;
  @sap.display.format : 'NonNegative'
  @sap.label : 'Int. location no. 1'
  @sap.quickinfo : 'International location number (part 1)'
  InternationalLocationNumber1 : String(7);
  @sap.display.format : 'NonNegative'
  @sap.label : 'Int. location no. 2'
  @sap.quickinfo : 'International location number (Part 2)'
  InternationalLocationNumber2 : String(5);
  @sap.display.format : 'NonNegative'
  @sap.label : 'Check digit'
  @sap.quickinfo : 'Check digit for the international location number'
  InternationalLocationNumber3 : String(1);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Address'
  AddressID : String(10);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Region'
  @sap.quickinfo : 'Region (State, Province, County)'
  Region : String(3);
  @sap.label : 'Name'
  @sap.quickinfo : 'Name 1'
  OrganizationBPName1 : String(35);
  @sap.label : 'Name 2'
  OrganizationBPName2 : String(35);
  @sap.label : 'City'
  CityName : String(35);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Postal Code'
  PostalCode : String(10);
  @sap.label : 'Street'
  @sap.quickinfo : 'Street and House Number'
  StreetName : String(35);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Country'
  @sap.quickinfo : 'Country Key'
  Country : String(3);
  @sap.label : 'Int. Location No.'
  @sap.quickinfo : 'Cocatenated International Location Number'
  ConcatenatedInternationalLocNo : String(20);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Block Function'
  @sap.quickinfo : 'Function That Will Be Blocked'
  SupplierProcurementBlock : String(2);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Actual QM System'
  @sap.quickinfo : 'Supplier''s QM system'
  SuplrQualityManagementSystem : String(4);
  @sap.display.format : 'Date'
  @sap.label : 'QM System Valid To'
  @sap.quickinfo : 'Validity date of certification'
  SuplrQltyInProcmtCertfnValidTo : Date;
  @sap.label : 'Language Key'
  SupplierLanguage : String(2);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Alternative Payee'
  @sap.quickinfo : 'Account Number of the Alternative Payee'
  AlternativePayeeAccountNumber : String(10);
  @sap.label : 'Telephone 1'
  @sap.quickinfo : 'First telephone number'
  PhoneNumber1 : String(16);
  @sap.label : 'Fax Number'
  FaxNumber : String(31);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Natural Person'
  IsNaturalPerson : String(1);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Tax Number'
  @sap.quickinfo : 'Tax Number at Responsible Tax Authority'
  TaxNumberResponsible : String(18);
  @sap.label : 'Business Type'
  @sap.quickinfo : 'Subcontractor''s Business Type'
  UK_ContractorBusinessType : String(12);
  @sap.label : 'Prtnr''s Trading Name'
  @sap.quickinfo : 'Partner''s Trading Name'
  UK_PartnerTradingName : String(30);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Partner''s UTR'
  @sap.quickinfo : 'Partner''s Unique Tax Reference (UTR)'
  UK_PartnerTaxReference : String(20);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Verification Status'
  UK_VerificationStatus : String(3);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Verification Number'
  UK_VerificationNumber : String(20);
  @sap.label : 'Comp. House Reg. No.'
  @sap.quickinfo : 'Companies House Registration Number'
  UK_CompanyRegistrationNumber : String(8);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Tax Status'
  @sap.quickinfo : 'Tax Status of the Verified Subcontractor'
  UK_VerifiedTaxStatus : String(1);
  @sap.label : 'Title'
  FormOfAddress : String(15);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Reference Acct Group'
  @sap.quickinfo : 'Reference Account Group for One-Time Account (Vendor)'
  ReferenceAccountGroup : String(4);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Liable for VAT'
  VATLiability : Boolean;
  @sap.display.format : 'UpperCase'
  @sap.label : 'Tax type'
  ResponsibleType : String(2);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Tax number type'
  @sap.quickinfo : 'Tax Number Type'
  TaxNumberType : String(2);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Fiscal address'
  @sap.quickinfo : 'Account number of the master record with fiscal address'
  FiscalAddress : String(10);
  @sap.label : 'Type of Business'
  BusinessType : String(30);
  @sap.display.format : 'Date'
  @sap.label : 'Date of Birth'
  @sap.quickinfo : 'Date of Birth of the Person Subject to Withholding Tax'
  BirthDate : Date;
  @sap.display.format : 'UpperCase'
  @sap.label : 'Payment block'
  @sap.quickinfo : 'Payment Block'
  PaymentIsBlockedForSupplier : Boolean;
  @sap.display.format : 'UpperCase'
  @sap.label : 'Search term'
  @sap.quickinfo : 'Sort field'
  SortField : String(10);
  @sap.label : 'Telephone 2'
  @sap.quickinfo : 'Second telephone number'
  PhoneNumber2 : String(16);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Deletion flag'
  @sap.quickinfo : 'Central Deletion Flag for Master Record'
  DeletionIndicator : Boolean;
  @sap.display.format : 'UpperCase'
  @sap.label : 'Trading Partner No.'
  @sap.quickinfo : 'Company ID of Trading Partner'
  TradingPartner : String(6);
  @sap.label : 'Rep''s Name'
  @sap.quickinfo : 'Name of Representative'
  TaxInvoiceRepresentativeName : String(10);
  @sap.label : 'Type of Industry'
  IndustryType : String(30);
  @sap.display.format : 'UpperCase'
  @sap.label : 'GST Ven Class.'
  @sap.quickinfo : 'Vendor Classification for GST'
  IN_GSTSupplierClassification : String(1);
};

@cds.external : true
@cds.persistence.skip : true
@sap.creatable : 'false'
@sap.updatable : 'false'
@sap.deletable : 'false'
@sap.searchable : 'true'
@sap.content.version : '1'
@sap.label : 'Value Help for Supplier'
@sap.value.list : 'true'
entity GMSVALUEHELP_SRV.I_Supplier_VH {
  @sap.display.format : 'UpperCase'
  @sap.text : 'SupplierName'
  @sap.label : 'Vendor'
  @sap.quickinfo : 'Account Number of Vendor or Creditor'
  key Supplier : String(10) not null;
  @sap.label : 'Name'
  @sap.quickinfo : 'Name 1'
  SupplierName : String(35);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Authorization'
  @sap.quickinfo : 'Authorization Group'
  AuthorizationGroup : String(4);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Account group'
  @sap.quickinfo : 'Vendor account group'
  SupplierAccountGroup : String(4);
  @sap.display.format : 'UpperCase'
  @sap.label : 'Purpose Completed'
  @sap.quickinfo : 'Business Purpose Completed Flag'
  IsBusinessPurposeCompleted : String(1);
};

