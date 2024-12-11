using { igmsConfigDb } from '../db/configSchema';
using GMSVALUEHELP_SRV from './external/GMSVALUEHELP_SRV.cds';

service configServices {

    entity ServiceProfileMaster as projection on igmsConfigDb.ServiceProfileMaster;
    entity FieldMapping                   as projection on igmsConfigDb.FieldMapping;
    entity TableMappings                  as projection on igmsConfigDb.TableMappings;
    entity EzIdTable                      as projection on igmsConfigDb.EzIdTable;
    entity AddiFunction                   as projection on igmsConfigDb.AddiFunction;
    entity transportAgreementDetail       as projection on igmsConfigDb.transportAgreementDetail;
    entity pathAndFuelMapping             as projection on igmsConfigDb.pathAndFuelMapping;
    entity serviceParametersItems         as projection on igmsConfigDb.serviceParametersItems;
    entity serviceProfileParametersItems  as projection on igmsConfigDb.serviceProfileParametersItems;
    entity DocumentNoProfileMapping       as projection on igmsConfigDb.DocumentNoProfileMappingMaster;
    entity AllocationProfile              as projection on igmsConfigDb.AllocationProfile;
    entity AllocationLocation             as projection on igmsConfigDb.AllocationLocation;
    entity serviceParameterNode           as projection on igmsConfigDb.serviceParameterNode;
    entity HeaderItem_Config              as projection on igmsConfigDb.HeaderItem_Config;
    entity penalties                      as projection on igmsConfigDb.penalties;
    entity TransportConfig                as projection on igmsConfigDb.TransportConfig;


    // **********************************GMSVALUEHELP_SRV*******************************

    entity xGMSxContractType as projection on GMSVALUEHELP_SRV.xGMSxContractType
    {        key Auart, key Kopgr, Description     };
}
