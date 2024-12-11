module.exports = cds.service.impl(async (srv) => {

    srv.on("READ", "ServiceProfileMaster", async (req, next) => {
        // Call the default READ handler to fetch the data
        const data = await next();
        return data;
    });

    srv.on("CREATE", "ServiceProfileMaster", async (req, next) => {
        // Call the default READ handler to fetch the data
        const data = await next();
        return data;
    });


    srv.on("PATCH", "ServiceProfileMaster", async (req, next) => {
        // Call the default READ handler to fetch the data
        const data = await next();
        return data;
    });


    srv.on("DELETE", "ServiceProfileMaster", async (req, next) => {
        // Call the default READ handler to fetch the data
        const data = await next();
        return data;
    });

    const GMSVALUEHELP_SRV = await cds.connect.to("GMSVALUEHELP_SRV"); 
    srv.on('READ', 'xGMSxContractType', req => GMSVALUEHELP_SRV.run(req.query)); 

});
