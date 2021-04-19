import React, {useState, useEffect} from 'react';
import {Navbar, Nav, Button} from 'react-bootstrap'
import Typography from '@material-ui/core/Typography';
import Web3 from 'web3';
import Chip from '@material-ui/core/Chip';
import FaceIcon from '@material-ui/icons/Face';
import DoneIcon from '@material-ui/icons/Done';
import TestERC20 from '../merkle-distributor/build/contracts/TestERC20.json'
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import MerkleDistributorClient from '../blockchainUtils'
const merkleDistributor = new MerkleDistributorClient();

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});
const useStyles = makeStyles({
    root: {
        width: '40%',
        margin: 'auto',
        marginTop: 30
    },
    bullet: {
        display: 'inline-block',
        margin: '0 2px',
        transform: 'scale(0.8)',
    },
    title: {
        fontSize: 14,
    },
    pos: {
        marginBottom: 12,
    },
    addressTextField: {
        width: '100%'
    },
    claimButton: {
        width: '90%',
        margin: 'auto'
    }
});

// '../build/contracts/TestERC20.json'
export default function Home(props) {
    const classes = useStyles();
    var ethereum = window.ethereum
    const [address, setAddress] = useState('')
    const [network, setNetwork] = useState('')
    const [connected, setConnected] = useState(false)
    const [ethBalance, setEthBalance] = useState("")
    const [tokenBalance, setTokenBalance] = useState("")
    const [recipient, setRecipient] = useState("")
    const [openAccount, setOpenAccount] = useState(false)
    const [updateBal, setUpdateBal] = useState(false)
    const getAccount = async() => {
        const networkNameLookup = {
            '0x1': 'mainnet',
            '0x3': 'ropsten',
            '0x4': 'rinkeby',
            '0x5': 'goerli',
            '0x2a': 'kovan',
        };
        console.log(ethereum);
        console.log(ethereum.isConnected());
        if (!!ethereum&&ethereum.isConnected()&&!!address ==false) {
            try {
                const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
                const address = accounts[0];
                getCustomTokenBalance(address)
                //let address = window.web3.eth.accounts[0] ? window.web3.eth.accounts[0].toLowerCase() : null;
                let networkId = await ethereum.request({ method: 'eth_chainId' });
                let networkName = networkNameLookup[networkId] || `unknown(${networkId})`;
                let ethBalance = await ethereum.request({ method: 'eth_getBalance', params: [
                    address,
                    'latest'
                ] });
                let result = parseInt(ethBalance, 16)
                let balance = (result/1e18).toFixed(2)
                console.log(balance)
                console.log({Address: address, netWorkId:networkId, network: networkName, ethBalance: balance})
                setAddress(address)
                setNetwork(network)
                setEthBalance(balance)
                setRecipient(address)
            // Acccounts now exposed
            } catch (error) {
            // User denied account access...
            }
        }
        // Non-dapp browsers...
        else {
            console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
        }  
    }
    
    const getCustomTokenBalance = async(userAddress) => {
        window.web3 = new Web3(window.ethereum);
        let abtract = TestERC20.abi
        let tokenInstance = await new window.web3.eth.Contract(abtract, '0x6914c4c0e08016ad9d3381ae8d03560df670e5c1')
        let balance = await tokenInstance.methods.balanceOf(userAddress).call()
        let tokenBal = (balance/1e18).toFixed(2)
        setTokenBalance(tokenBal)
        
    }
    useEffect(() => {
        if(ethereum.isConnected()){
            setConnected(true)
        }
        else{
            setConnected(false)
        }
    },[address])
    useEffect(()=>{
        ethereum.on('accountsChanged', function (accounts) {
            getAccount()
        })
        // ethereum.on('disconnect', function () {
        //     setConnected(false)
        // })
    })
    useEffect(()=>{
        getAccount()
    },[updateBal])
    const handleChange = (event) => {
        setRecipient(event.target.value);
    };
    const handleAccountClick = (event) => {
        setOpenAccount(true)
    }
    const handleAccountDisconnect = async(event) => {
        event.preventDefault()
        
    }
    const handleClaimToken = async(event) => {
        let res = await merkleDistributor.claimToken(recipient)
        console.log(res)
        if(!!res){
            setUpdateBal(true)
            window.alert("Token claimed successfully!")
        }
        else{
            window.alert("Token claimed failed!")
        }
    }
    return (
        <div>
            <Navbar bg="light" variant="light">
                <Navbar.Brand href="#home">
                    <Typography variant="h5" gutterBottom>
                        AirDrop Example.
                    </Typography>
                </Navbar.Brand>
                <Nav className="ml-auto">
                {connected&&address != "" ? ( //ethBalance
                    <>
                        <Chip
                            label={tokenBalance + " ZTT"}
                            color="primary"
                            variant="outlined"
                        />
                        <Chip
                            icon={<FaceIcon />}
                            label={address}
                            clickable
                            color="primary"
                            deleteIcon={<DoneIcon />}
                            variant="outlined"
                            onClick={handleAccountClick}
                        />
                        <Chip
                            label={ethBalance + " ETH"}
                            color="primary"
                            variant="outlined"
                        />
                    </>
                )
                :<Button onClick={() => getAccount()}>Connect to Metamask</Button>}
                {/* <Nav.Link href="#features">Features</Nav.Link>
                <Nav.Link href="#pricing">Pricing</Nav.Link> */}
                </Nav>
            </Navbar>
            
            <Card className={classes.root}>
                <CardContent>
                    <Typography className={classes.title} color="textSecondary" gutterBottom>
                        Claim Test Token
                    </Typography>
                    <Typography variant="h5" component="h2">
                        100 ZTT
                    </Typography>
                    <Typography className={classes.pos} color="textSecondary">
                        Enter an address to trigger a token claim. If the address has any claimable token it will be sent to them on submission.
                    </Typography>
                    <TextField
                        className={classes.addressTextField}
                        label="Recipient Address"
                        id="outlined-start-adornment"
                        variant="outlined"
                        placeholder="Recipient's Wallet address"
                        onChange={handleChange}
                        value={address}
                    />
                </CardContent>
                <CardActions>
                    <Button className={classes.claimButton} onClick={handleClaimToken}>Claim</Button>
                </CardActions>
            </Card>
            
            <Dialog
                open={openAccount}
                TransitionComponent={Transition}
                keepMounted
                onClose={() => setOpenAccount(false)}
                aria-labelledby="alert-dialog-slide-title"
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle id="alert-dialog-slide-title">{"Use Google's location service?"}</DialogTitle>
                <DialogContent>
                <DialogContentText id="alert-dialog-slide-description">
                    Let Google help apps determine location. This means sending anonymous location data to
                    Google, even when no apps are running.
                </DialogContentText>
                </DialogContent>
                <DialogActions>
                <Button onClick={handleAccountDisconnect} color="primary">
                    Disconnect Account
                </Button>
                <Button onClick={() => setOpenAccount(false)} color="primary">
                    Cancel
                </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
