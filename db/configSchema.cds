namespace igmsConfigDb;

using {
    managed,
    cuid
} from '@sap/cds/common';

entity ServiceProfileMaster : managed {
    key ID                 : Integer;
    key serviceProfileName : String;
        serviceProfileDesc : String;
        field1             : String;
        field2             : String;
        field3             : String;
        field4             : String;
        field5             : String;
}

entity serviceParametersItems : managed {
    key ID                     : Integer;
    key serviceParameter       : String;
        serviceParameterDesc   : String;
        serviceParameterType   : String;
        serviceParameterlength : Integer;
        List                   : array of String;
        ParentId               : String;
        Level                  : String;
}

entity serviceProfileParametersItems : managed {
        checkedParameter       : Boolean;
    key serviceProfileName     : String;
        serviceProfileDesc     : String;
        ProfileId              : String;
    key ID                     : Integer;
    key serviceParameter       : String;
        serviceParameterDesc   : String;
        serviceParameterType   : String;
        serviceParameterlength : Integer;
        ParentId               : String;
        ContractRelevant       : Boolean;
        Value_Parameter        : Boolean;
        Threshold_Relevance    : Boolean;
        Referrence_Relevant    : Boolean;
        Nomination_Relevant    : Boolean;
        Balancing_Relevant     : Boolean;
        Allocation_Relevant    : Boolean;
        Billing_Relevant       : Boolean;
        Price_Relevant         : Boolean;
}

entity pathAndFuelMapping : managed {
    key DeliveryPoint    : String;
        DpTsSystem       : String;
    key ReDeliveryPoint  : String;
        RDpTsSystem      : String;
        InterconnectPath : String;
        Interconnect     : String;
        path             : String;
        FuelPercentage   : Decimal;
}

entity AllocationRuleOnLocation : managed {
    key location            : String(50);
        schedulingReduction : String(50);
        technicalBalancing  : String(50);
        buisnessBalancing   : String(50);
        validFromAlloc      : Date;
        validToAlloc        : Date;
}

entity DocumentNoProfileMappingMaster : managed {
    
    key  DocumentNo         : String;
        DocumentDesc       : String;
        ProfileId          : String;
    key    serviceProfileName : String;
        serviceProfileDesc : String;
        description        : String;
        field2             : String;
        field3             : String;
        field4             : String;
        field5             : String;
}

entity AllocationProfile : cuid, managed {
    key ID                    : Integer;
        allocationProfileName : String;
        allocationProfileDesc : String;
        allocationfield1      : String;
        allocationfield2      : String;
        allocationfield3      : String;
        allocationfield4      : String;
        allocationfield5      : String;
}

entity serviceParameterNode : managed {
    key ID           : UUID @Core.Computed;
        parentID     : String;
        nodeLevel    : Integer;
        allocationID : String;
        servicetitle : String;
        rank         : Integer;
}

entity AllocationLocation : managed {
        key location            : String(50);
        schedulingReduction : String(50);
        technicalBalancing  : String(50);
        buisnessBalancing   : String(50);
        validFromAlloc      : Date;
        validToAlloc        : Date;
}

entity HeaderItem_Config : managed {
    key unique                 : UUID;
        ID                     : Integer;
        contractType           : String;
        documentType           : String;
        flag                   : Integer;
        service_parameter      : String;
        label                  : String;
        serviceParameterType   : String;
        serviceParameterlength : String;
        mandatory              : Boolean;
        visible                : Boolean;
        List                   : array of String;
        parameterRelevancy     : String(20);
}


entity penalties : managed {
    
    key    profileName     : String;
    key    paneltyParmeter : String;
    key   ezReportId      : String;
}

entity TransportConfig : managed {
    key ID           : Integer;
        documentType : array of String;
        side         : array of String;
        exchangeType : String;
}

entity transportAgreementDetail : managed {
    key salesNumber    : String;
        purchaseNumber : String;
        exchangeNumber : String;
}

// PENALITY CALCULATION

entity EzIdTable : managed {
    key Snum            : Integer;
        EzID            : String;
        EzIdDescription : String;
}

entity TableMappings : managed {
    key ID           : UUID;
        Snum         : String;
    key EzID         : String;
    key Table        : String;
        SubProcessId : String;
        TableDesc    : String;
}

entity FieldMapping : managed {
    key ID           : UUID;
        Snum         : String;
    key EzID         : String;
        Table        : String;
        SubProcessId : String;
    key Field        : String;
        FieldType    : String;
        FieldID      : String;
        FieldDesc    : String;
        selected     : Boolean;
        display      : Boolean;
        mandatory    : Boolean;
        filterfield  : Boolean;
        Operation    : String;
        DefaultVal   : String;
        MappedTable  : String;
        MappedField  : String;
        AddiFunction : String;
        Formula      : String;
}

entity AddiFunction : managed {
    key Function     : String;
        FunctionDesc : String;
}
