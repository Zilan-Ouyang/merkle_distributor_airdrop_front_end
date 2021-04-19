import logo from './logo.svg';
import './App.css';
import MetaMaskModal from './components/MetaMaskModal'
import Home from './components/Home'
function App() {
  let provider = window.web3 && window.web3.currentProvider.isMetaMask;
  return (
    <>
      {window.web3 === undefined ? (
        <MetaMaskModal />
      ) : (<Home />)
      }
    </>
  );
}

export default App;
