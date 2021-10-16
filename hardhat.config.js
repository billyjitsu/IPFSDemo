require("@nomiclabs/hardhat-waffle");
require('dotenv').config()
require("@nomiclabs/hardhat-etherscan");


module.exports = {
  solidity: "0.8.0",

  networks: {
    
    hardhat: {
      chainId: 1337
    },

    rinkeby: {
      url: process.env.RINKEBY_RPC_URL,
      accounts: [process.env.PRIVATE_KEY],
      saveDeployments: true,
    }
 },
 etherscan: {
  // Your API key for Etherscan
  // Obtain one at https://etherscan.io/
  apiKey: process.env.ETHERSCAN_API_KEY
}
};
