const axios = require("axios")
const Log = (stack, level, package, message) => {
    axios.get("http//20.244.56.144/evulation-service/logs",{
        headers:{
            "Authorization":""
        }
    }).then((res) => {
        
    } )
    .
};

module.exports = { Log };
