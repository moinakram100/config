using {igmsConfigDb} from '../db/configSchema';
using GMSVALUEHELP_SRV from './external/GMSVALUEHELP_SRV.cds';

service configServices {
    function uniqueDelLocorAllocMapRule(searchTerm : String)                              returns array of {
        Locid : String;
    };

    function getPenalityRelevant(serviceProfileName : String ) returns array of {
        penalityVal : String;
    };

    entity ServiceProfileMaster          as projection on igmsConfigDb.ServiceProfileMaster;
    entity FieldMapping                  as projection on igmsConfigDb.FieldMapping;
    entity TableMappings                 as projection on igmsConfigDb.TableMappings;
    entity EzIdTable                     as projection on igmsConfigDb.EzIdTable;
    entity AddiFunction                  as projection on igmsConfigDb.AddiFunction;
    entity transportAgreementDetail      as projection on igmsConfigDb.transportAgreementDetail;
    entity pathAndFuelMapping            as projection on igmsConfigDb.pathAndFuelMapping;
    entity serviceParametersItems        as projection on igmsConfigDb.serviceParametersItems;
    entity serviceProfileParametersItems as projection on igmsConfigDb.serviceProfileParametersItems;
    entity DocumentNoProfileMapping      as projection on igmsConfigDb.DocumentNoProfileMappingMaster;
    entity AllocationProfile             as projection on igmsConfigDb.AllocationProfile;
    entity AllocationLocation            as projection on igmsConfigDb.AllocationLocation;
    entity AllocationRuleOnLocation      as projection on igmsConfigDb.AllocationRuleOnLocation;
    entity serviceParameterNode          as projection on igmsConfigDb.serviceParameterNode;
    entity HeaderItem_Config             as projection on igmsConfigDb.HeaderItem_Config;
    entity penalties                     as projection on igmsConfigDb.penalties;
    entity TransportConfig               as projection on igmsConfigDb.TransportConfig;

    // **********************************GMSVALUEHELP_SRV*******************************
    entity xGMSxContractType             as
        projection on GMSVALUEHELP_SRV.xGMSxContractType {
            key Auart,
            key Kopgr,
                Description
        };

    entity xGMSxLocPoint                 as
        projection on GMSVALUEHELP_SRV.xGMSxLocPoint {
            key Locid,
                Locnam,
                Loctyp,
                LoctypText,
                LoctypLongText
        };

    entity xGMSxLocPoint_Map             as
        projection on GMSVALUEHELP_SRV.xGMSxLocPoint_Map {
            key Pblnr,
            key Tsyst,
            key Locid,
            key Pbltyp,
                Delivery_Point,
                Redelivery_Point,
                isDeliveryPoint,
                isRedeliveryPoint,
                isInterconnect
        };

    entity xGMSxLocPoint_RDP             as
        projection on GMSVALUEHELP_SRV.xGMSxLocPoint_RDP {
            key Locid,
                Locnam,
                Loctyp,
                LoctypText,
                LoctypLongText
        };

    entity xGMSxLocPoint_DP              as
        projection on GMSVALUEHELP_SRV.xGMSxLocPoint_DP {
            key Locid,
                Locnam,
                Loctyp,
                LoctypText,
                LoctypLongText
        };

    entity xGMSxInterconnect             as
        projection on GMSVALUEHELP_SRV.xGMSxInterconnect {
            key Pblnr,
            key Tsyst,
            key Locid,
            key Pbltyp,
                Delivery_Point,
                Redelivery_Point
        };

    entity xGMSxLocMatnr                 as
        projection on GMSVALUEHELP_SRV.xGMSxLocMatnr {
            key Locid,
            key Pmatnr,
            key Tsyst,
                Loctyp,
                Locnam,
                Pluom,
                Pmatname
        };

    entity Interconnect_pointSet         as
        projection on GMSVALUEHELP_SRV.Interconnect_pointSet {
            key Transport1,
            key Transport2,
                IntLoc,
                IntLocNam
        };

    entity xGMSxEXCHGTYPEVH              as
        projection on GMSVALUEHELP_SRV.xGMSxEXCHGTYPEVH {
            key Spras,
            key Exgtyp,
                Exgtxt
        };
}
