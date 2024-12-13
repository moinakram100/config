const cds = require('@sap/cds');

module.exports = async (srv) => 
{        
    // Using CDS API      
    const GMSVALUEHELP_SRV = await cds.connect.to("GMSVALUEHELP_SRV"); 
      srv.on('READ', 'xGMSxEXCHGTYPEVH', req => GMSVALUEHELP_SRV.run(req.query)); 
}