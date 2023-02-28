import "@nomicfoundation/hardhat-chai-matchers"
import "@nomicfoundation/hardhat-toolbox"
import { config as dotenvConfig } from "dotenv"
import "hardhat-dependency-compiler"
import { HardhatUserConfig } from "hardhat/config"
import { NetworksUserConfig } from "hardhat/types"
import { resolve } from "path"
import "solidity-coverage"
import "./tasks/deploy-zkgroups"
import "./tasks/deploy-zkgroups-semaphore"

dotenvConfig({ path: resolve(__dirname, "../.env") })

function getNetworks(): NetworksUserConfig {
    if (!process.env.INFURA_API_KEY || !process.env.BACKEND_PRIVATE_KEY) {
        return {}
    }

    const infuraApiKey = process.env.INFURA_API_KEY
    const accounts = [`0x${process.env.BACKEND_PRIVATE_KEY}`]

    return {
        goerli: {
            url: `https://goerli.infura.io/v3/${infuraApiKey}`,
            chainId: 5,
            accounts
        },
        arbitrum: {
            url: "https://arb1.arbitrum.io/rpc",
            chainId: 42161,
            accounts
        }
    }
}

const hardhatConfig: HardhatUserConfig = {
    solidity: {
        version: "0.8.4"
    },
    networks: {
        hardhat: {
            chainId: 1337,
            allowUnlimitedContractSize: true
        },
        ...getNetworks()
    },
    dependencyCompiler: {
        paths: [
            "@semaphore-protocol/contracts/base/Pairing.sol",
            "@semaphore-protocol/contracts/base/SemaphoreVerifier.sol"
        ]
    },
    gasReporter: {
        currency: "USD",
        enabled: process.env.REPORT_GAS === "true",
        coinmarketcap: process.env.COINMARKETCAP_API_KEY
    },
    typechain: {
        target: "ethers-v5"
    },
    etherscan: {
        apiKey: process.env.ETHERSCAN_API_KEY
    }
}

export default hardhatConfig