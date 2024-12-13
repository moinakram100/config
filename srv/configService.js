module.exports = cds.service.impl(async (srv) => {
    // ***************** ServiceProfileMaster*******************************
        srv.on("READ", "ServiceProfileMaster", async (req, next) => {
            const data = await next();
            return data;
        });
        srv.on("CREATE", "ServiceProfileMaster", async (req, next) => {
            const data = await next();
            return data;
        });
    
        srv.on("PATCH", "ServiceProfileMaster", async (req, next) => {
            const data = await next();
            return data;
        });
    
        srv.on("DELETE", "ServiceProfileMaster", async (req, next) => {
            const data = await next();
            return data;
        });
    
    // ******************************Path And Fuel Mapping****************************************
        srv.on("READ", "pathAndFuelMapping", async (req, next) => {
            const data = await next();
            return data;
        });
        srv.on("checkInterConnectPath", async (req) => {
            console.log("Dataaa", req.data);
            
            const query = SELECT.from("Interconnect_pointSet").where({ Transport1: req.data.Transport1});
            query.where({ Transport2: req.data.Transport2})
            const data = await GMSVALUEHELP_SRV.run(query);
            console.log("Hellooo....", data);
            return {...data}
        });
    
    // **********************************GMSVALUEHELP_SRV****************************************
        const GMSVALUEHELP_SRV = await cds.connect.to("GMSVALUEHELP_SRV");
        srv.on('READ', 'xGMSxContractType', req => GMSVALUEHELP_SRV.run(req.query));
        srv.on('READ', 'xGMSxLocPoint', req => GMSVALUEHELP_SRV.run(req.query));
        srv.on('READ', 'xGMSxLocPoint_Map', req => GMSVALUEHELP_SRV.run(req.query));
        srv.on('READ', 'xGMSxLocPoint_RDP', req => GMSVALUEHELP_SRV.run(req.query));
        srv.on('READ', 'xGMSxLocPoint_DP', req => GMSVALUEHELP_SRV.run(req.query));
        srv.on('READ', 'xGMSxInterconnect', req => GMSVALUEHELP_SRV.run(req.query));
        srv.on('READ', 'xGMSxLocMatnr', req => GMSVALUEHELP_SRV.run(req.query));
        srv.on('READ', 'xGMSxEXCHGTYPEVH', req => GMSVALUEHELP_SRV.run(req.query));
        srv.on('READ', 'Interconnect_pointSet', req => GMSVALUEHELP_SRV.run(req.query)); 
        // **********************CUSTOM HANDLERS***************************************
        srv.on('uniqueDelLocorAllocMapRule', async (req) => {
            try {
                // Extract search term if provided
                const { searchTerm } = req.data; 
        
                // Run your query to fetch data from the table
                const query = SELECT.from("xGMSxLocMatnr");
                const data = await GMSVALUEHELP_SRV.run(query);
        
                // Filter unique Locids
                const uniqueLocids = data.reduce((acc, item) => {
                    if (!acc.some(obj => obj.Locid === item.Locid)) {
                        acc.push({ Locid: item.Locid });
                    }
                    return acc;
                }, []);
        
                // If search term is provided, filter results based on Locid
                if (searchTerm) {
                    return uniqueLocids.filter(loc => loc.Locid.includes(searchTerm));
                }
                // Return all unique Locids if no search term
                return uniqueLocids;
        
            } catch (error) {
                // Handle errors
                console.error("Error in uniqueDelLocorAllocMapRule function:", error);
        
                // Return an error message to the user or log the error details
                req.reject(500, "An error occurred while processing your request. Please try again later.");
            }
        });
        
        srv.on('getPenalityRelevant', async function (req) {
            try {
                // Extract query parameters
                const { serviceProfileName } = req.data;
                console.log("serviceProfileName", serviceProfileName);
                
                // Validate input parameters
                if (!serviceProfileName) {
                    req.reject(400, "The parameter 'serviceProfileName' is required.");
                }
                // Query the database with filtering
                const resultData = await SELECT.from('configServices.serviceProfileParametersItems').where({ serviceProfileName : serviceProfileName , Price_Relevant : true})
                // Handle case where no data is found
                if (!resultData || resultData.length === 0) {
                    req.reject(404, "No records found for the provided filters.");
                }
        
                // Transform the result data
                const penalityRelevantData = resultData.map(item => ({
                    serviceParameter: item.serviceParameter,
                    serviceParameterDesc: item.serviceParameterDesc,
                }));
        
                return penalityRelevantData;
        
            } catch (error) {
                // Log the error for debugging
                console.error("Error in getPenalityRelevant function:", error);
        
                // Return a meaningful error message to the user
                req.reject(500, "An error occurred while processing your request. Please try again later.");
            }
        });
        
        
       
    });