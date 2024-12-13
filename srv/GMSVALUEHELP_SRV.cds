using GMSVALUEHELP_SRV from './external/GMSVALUEHELP_SRV.cds';

service GMSVALUEHELP_SRVSampleService {
    @readonly
    entity xGMSxEXCHGTYPEVH as projection on GMSVALUEHELP_SRV.xGMSxEXCHGTYPEVH
    {        key Spras, key Exgtyp, Exgtxt     }    
;
}