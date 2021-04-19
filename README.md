# Merkle Distributor Front end

A simple front-end app for token airdrop using @uniswap/merkle-distributor

## Instructions
### 1. Use @uniswap/merkle-distributor to create merkle tree
In the directory of your merkle-distributor code, find the example.json file inside of "scripts" folder, and specify the list of wallets and its corresponding amount:
```json
{
  "0x950D2f4B82a254f59C63f408bde38b4aBfc5ccBf": "56bc75e2d63100000",
  "0x26EdD54ED26F92E0fDD76585b18f0D60849a0F53": "56bc75e2d63100000",
  "0x7f46bbcDF60c5DC89C122736e73D79c0a2A2FB27": "56bc75e2d63100000",
  "0xFB5b5f9a0876A19d7CFbFAf6a0fb7e3E2cF0CC27": "56bc75e2d63100000",
  "0xE36e7C9393AB7c62b06c12884C57F707EB7Bc0d2": "56bc75e2d63100000"
}
```
Run the command to create merkle tree using example.json
```bash
yarn generate-merkle-root:example
```
The output should be looking like this, "merkleRoot" from the output will later be used as one of the parameters to deploy merkle distributor contract:
```json
{
   "merkleRoot":"0xca9846af24d5be1879a94dfa272c3c56e9515bf144109297881d57dad0925e01",
   "tokenTotal":"0x1b1ae4d6e2ef500000",
   "claims":{
      "0x26EdD54ED26F92E0fDD76585b18f0D60849a0F53":{
         "index":0,
         "amount":"0x056bc75e2d63100000",
         "proof":[
            "0x2b60ed3ad81a1ef4de9f2aece81cbc51e50223887c0268ddf37b57ce10439553"
         ]
      },
      "0x7f46bbcDF60c5DC89C122736e73D79c0a2A2FB27":{
         "index":1,
         "amount":"0x056bc75e2d63100000",
         "proof":[
            "0x1934e0221f06fae15d92d69bf511604f8fb348f337ef2ffc726611c900ad598a",
            "0x9de7a6af206b33659bbc78fd6f45b4647bb6c28e34a297fb4f9c749057cb89ae",
            "0xb5bc0314f161119da1e776dc94336bb2a5a2d4464c44e63f99799f557399c909"
         ]
      },
      "0x950D2f4B82a254f59C63f408bde38b4aBfc5ccBf":{
         "index":2,
         "amount":"0x056bc75e2d63100000",
         "proof":[
            "0xab57a934e01dc8b79cc166b41639fd25d3e29bf5a1d82f63b69358c190292e0c",
            "0x07346f1c7d6808782babd6e02a4122b03c58fedbaecdb02d8532ccfc061b547e",
            "0xb5bc0314f161119da1e776dc94336bb2a5a2d4464c44e63f99799f557399c909"
         ]
      },
      "0xE36e7C9393AB7c62b06c12884C57F707EB7Bc0d2":{
         "index":3,
         "amount":"0x056bc75e2d63100000",
         "proof":[
            "0x7a5fba0e0bf6cf6511d3a0286006926947925e532b5a4243ec7774571afcc1a5",
            "0x9de7a6af206b33659bbc78fd6f45b4647bb6c28e34a297fb4f9c749057cb89ae",
            "0xb5bc0314f161119da1e776dc94336bb2a5a2d4464c44e63f99799f557399c909"
         ]
      },
      "0xFB5b5f9a0876A19d7CFbFAf6a0fb7e3E2cF0CC27":{
         "index":4,
         "amount":"0x056bc75e2d63100000",
         "proof":[
            "0xa9c5b86868b4c7d12c83c4195770aa96817d0088c40ca9168c65b9aa32aa4a02",
            "0x07346f1c7d6808782babd6e02a4122b03c58fedbaecdb02d8532ccfc061b547e",
            "0xb5bc0314f161119da1e776dc94336bb2a5a2d4464c44e63f99799f557399c909"
         ]
      }
   }
}

```
### 2. Use truffle to deploy merkle distributor smart contract
Command line to init truffle project inside of the current directory (enter no to all the prompts to avoid overwriting the  existing smart contracts):
```bash
truffle init
```
 Install HDWalletProvider:
```bash
yarn add truffle-hdwallet-provider
```
Edit truffle-config.js to set up the truffle-hdwaller-provider and the connection to the Rinkeby network:
```javascript
var HDWalletProvider = require("truffle-hdwallet-provider");
var mnemonic = "orange apple banana ... ";
module.exports = {
 networks: {
  development: {
   host: "127.0.0.1",
   port: 8545,
   network_id: "*"
  },
  rinkeby: {
      provider: function() { 
       return new HDWalletProvider(mnemonic, "https://rinkeby.infura.io/v3/<INFURA_Access_Token>");
      },
      network_id: 4,
      gas: 4500000,
      gasPrice: 10000000000,
  }
 }
};
```
Create a javascript file inside of migrations folder, name it "2_deploy_contracts.js", add deploy contract function inside of the file:
```javascript
var MerkleDistributor = artifacts.require('MerkleDistributor');
//token address should be your custom token address
const tokenAddress = '0x6914c4c0e08016ad9d3381ae8d03560df670e5c1' 
//merkleRoot from merkle tree output
const tree = '0xca9846af24d5be1879a94dfa272c3c56e9515bf144109297881d57dad0925e01' 
module.exports = function (deployer) {
  deployer.deploy(MerkleDistributor, tokenAddress, tree);
};
```
Deploy merkle distributor smart contract on rinkeby testnet:
```bash
truffle migrate -f 2 --network rinkeby
```
Output:
![alt deployOutput](https://github.com/Zilan-Ouyang/merkle_distributor_airdrop_front_end/blob/main/screenshots/deployOutput.png)

### 3. Integrate the smart contract into your front end
#### 1. Before we start the integration, make sure you fund the generated contract address with your custom tokens first
![alt deployOutput](https://github.com/Zilan-Ouyang/merkle_distributor_airdrop_front_end/blob/main/screenshots/fundingContract.png)
#### 2. Add merkle tree output to a json file, name it "merkleTree.json":
![alt deployOutput](https://github.com/Zilan-Ouyang/merkle_distributor_airdrop_front_end/blob/main/screenshots/merkleTreejson.png)

#### 3. Integrate the contract functions to your javascript front end codebase
```javascript
import Web3 from 'web3';
import MerkleDistributor from '../merkle-distributor/build/contracts/MerkleDistributor.json' //generated by truffle
import tree from './merkleTree.json'
export default class MerkleDistributorClient {
    constructor(){
        window.web3 = new Web3(window.ethereum);
        let abtract = MerkleDistributor.abi
        this.distributorInstance = new window.web3.eth.Contract(abtract, '0x76F4720705010dfBCB0C2C6a9ed133faF0c2D2AD')
        this.tree = tree
    }
    
    async claimToken(userAddress){
        
        const claimAccounts = Object.keys(tree.claims).map(e => e.toLowerCase())
        const claimAccountsArr = Object.keys(tree.claims).map(ele => {
            return {
                address: ele.toLowerCase(),
                index: tree.claims[ele]['index'],
                amount: tree.claims[ele]['amount'],
                proof: tree.claims[ele]['proof']
            }
        })
        if (claimAccounts.includes(userAddress)) { //check if the input address is in the tree
            const proofOfAddress = claimAccountsArr[claimAccounts.indexOf(userAddress)].proof //get the proof
            const indexOfAddress = claimAccountsArr[claimAccounts.indexOf(userAddress)].index //get the index
            const amountOfAddress = claimAccountsArr[claimAccounts.indexOf(userAddress)].amount //get the airdrop amount
            let txHash = await this.distributorInstance.methods.claim(indexOfAddress, userAddress, amountOfAddress, proofOfAddress)
            .send({from: userAddress}, function(error, transactionHash){
                return transactionHash.hash
            })
            return txHash;
        }
        else{
            return false
        }
    }
}
```
### 4. Result
#### Claiming token:
![alt deployOutput](https://github.com/Zilan-Ouyang/merkle_distributor_airdrop_front_end/blob/main/screenshots/claimingToken.png)

#### Successfully claimed token:
![alt deployOutput](https://github.com/Zilan-Ouyang/merkle_distributor_airdrop_front_end/blob/main/screenshots/result.png)

## License
[MIT](https://choosealicense.com/licenses/mit/)