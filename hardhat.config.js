/**
 * @type import('hardhat/config').HardhatUserConfig
 * const provider = new ethers.providers.JsonRpcProvider(
  `https://eth-sepolia.g.alchemy.com/v2/${Alchemy_Sepolia_ID}`
);
 */
require("@nomiclabs/hardhat-waffle");
const { dotenv } = require("dotenv").config();

const Alchemy_Sepolia_ID = process.env.ALCHEMY_SEPOLIA_ID;
const ALCHEMY_URL = `https://eth-sepolia.g.alchemy.com/v2/${Alchemy_Sepolia_ID}`;
const PRIVATE_KEY = process.env.PRIVATE_KEY;

module.exports = {
  solidity: "0.8.0",
  networks: {
    sepolia: {
      url: ALCHEMY_URL,
      accounts: [`0x${PRIVATE_KEY}`],
    },
  },
};
