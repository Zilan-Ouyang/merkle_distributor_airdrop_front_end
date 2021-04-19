import Web3 from 'web3';
import MerkleDistributor from '../merkle-distributor/build/contracts/MerkleDistributor.json'
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
        if (claimAccounts.includes(userAddress)) {
            const proofOfAddress = claimAccountsArr[claimAccounts.indexOf(userAddress)].proof
            const indexOfAddress = claimAccountsArr[claimAccounts.indexOf(userAddress)].index
            const amountOfAddress = claimAccountsArr[claimAccounts.indexOf(userAddress)].amount 
            let txHash = await this.distributorInstance.methods.claim(indexOfAddress, userAddress, amountOfAddress, proofOfAddress)
            .send({from: userAddress}, function(error, transactionHash){
                if(error){
                    console.log(error)
                    return false
                }
                return transactionHash.hash
            })
            return txHash;
        }
        else{
            return false
        }
    }
}