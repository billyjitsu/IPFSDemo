import './styles/App.css';
import { ethers } from 'ethers'
import twitterLogo from './assets/twitter-logo.svg';
import React, { useEffect, useState } from "react";
import testNFT from './utils/testNFT.json'


// Constants
const TWITTER_HANDLE = '1HiveOrg';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;
const OPENSEA_LINK = 'https://testnets.opensea.io/collection/1hive-pfp-nfts-v2';
const TOTAL_MINT_COUNT = 100;
const CONTRACT_ADDRESS = "0x36658597B547f4EaD7359AF6134256E38EC127a4";
const App = () => {

  
  const [currentAccount, setCurrentAccount] = useState("");
  const [chainId, setChainId] = useState(window.ethereum.request({ method: 'eth_chainId' }));
  const [mintTotal, setMintTotal] = useState(0);

  const checkIfWalletIsConnected = async () => {
    /*
    * First make sure we have access to window.ethereum
    */
    const { ethereum } = window;

    if (!ethereum) {
      console.log("Make sure you have metamask!");
      return;
    } else {
      console.log("We have the ethereum object", ethereum);
    }

    const accounts = await ethereum.request({ method: 'eth_accounts' });
    //check network?
    //find this chain id
    const chain = await window.ethereum.request({method: 'eth_chainId'});
    //chainId = chain;
    console.log("chain ID:", chain)
    console.log("global Chain Id:", chainId)



    /*
      * User can have multiple authorized accounts, we grab the first one if its there!
      */
    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log("Found an authorized account:", account);
      setCurrentAccount(account)
      // Setup listener! This is for the case where a user comes to our site
      // and ALREADY had their wallet connected + authorized.
      setupEventListener()
      mintsSoFar()
    } else {
      console.log("No authorized account found")
    }
  }

  /*
  * Implement your connectWallet method here
  */
  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      /*
      * Fancy method to request access to account.
      */
      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      /*
      * Boom! This should print out public address once we authorize Metamask.
      */
      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]); 
      // Setup listener! This is for the case where a user comes to our site
      // and connected their wallet for the first time.
      setupEventListener() 
    } catch (error) {
      console.log(error)
    }
  }

  // Setup our listener.
  const setupEventListener = async () => {
    // Most of this looks the same as our function askContractToMintNft
    try {
      const { ethereum } = window;

      if (ethereum) {
        // Same stuff again
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, testNFT.abi, signer);

      
        // This will essentially "capture" our event when our contract throws it.
        connectedContract.on("NewEpicNFTMinted", (from, tokenId) => {
          console.log(from, tokenId.toNumber())
          alert(`Hey there! We've minted your NFT and sent it to your wallet. It may be blank right now. It can take a max of 10 min to show up on OpenSea. Here's the link: https://testnets.opensea.io/assets/${CONTRACT_ADDRESS}/${tokenId.toNumber()}`)
        });

        console.log("Setup event listener!")

      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error)
    }
  }

  const askContractToMintNft = async () => {
    
      try {
        const { ethereum } = window;
  
        if (ethereum) {
          const provider = new ethers.providers.Web3Provider(ethereum);
          const signer = provider.getSigner();
          const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, testNFT.abi, signer);
  
          console.log("Going to pop wallet now to pay gas...")
          let nftTxn = await connectedContract.mint(1);
  
          console.log("Mining...please wait.")
          await nftTxn.wait();
          
          console.log(`Mined, see transaction: https://rinkeby.etherscan.io/tx/${nftTxn.hash}`);
  
        } else {
          console.log("Ethereum object doesn't exist!");
        }
      } catch (error) {
        console.log(error)
      }
  }

  const changeNetwork = async () => {

    const { ethereum } = window;

    try {
      await ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x4' }],
      });


    } catch (switchError) {
      // This error code indicates that the chain has not been added to MetaMask.
      if (switchError.code === 4902) {
        try {
          await ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{ chainId: '0x4', rpcUrl: 'https://rinkeby-light.eth.linkpool.io/' /* ... */ }],
          });
        } catch (addError) {
          // handle "add" error
        }
      }
      // handle other "switch" errors
    }
  }

  const mintsSoFar = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, testNFT.abi, signer);

        let totalMints = await connectedContract.totalSupply();
        setMintTotal(totalMints.toNumber());
        console.log('Mints so far:', totalMints.toNumber())
        
        

      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error)
    }

  }

  const revealNFT = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, testNFT.abi, signer);

        let totalMints = await connectedContract.reveal();
        
        console.log("NFT should reveal");
        
        

      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error)
    }

  }

  const revealTokenURI = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, testNFT.abi, signer);

        let totalMints = await connectedContract.tokenURI(1);
        
        console.log("TokenURI:", totalMints );
        
        

      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error)
    }

  }

  const setTokenURI = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, testNFT.abi, signer);

        let totalMints = await connectedContract.setBaseURI("ipfs://QmWXza1Wx4WAiuyuWKh4LjT3oGLveLxdAtaDnWbhyMDYzY/");
        
        console.log("TokenURI:", totalMints );
        
        

      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error)
    }

  }

  useEffect(() => {
    async function getChainId() {
      const ethChainId = await window.ethereum.request({ method: 'eth_chainId' })
      setChainId(ethChainId)
    }
  
    getChainId()
  }, [])
  /*
  * This runs our function when the page loads.
  */
  useEffect(() => {
    checkIfWalletIsConnected();
  }, [])

  // Render Methods
  const renderNotConnectedContainer = () => (
    <button onClick={ connectWallet } className="cta-button connect-wallet-button">
      Connect to Wallet
    </button>
  );

  /*
  * We want the "Connect to Wallet" button to dissapear if they've already connected their wallet!
  */
  const renderMintUI = () => (
    <button onClick={askContractToMintNft} className="cta-button connect-wallet-button">
      Mint NFT
    </button>
  );


  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">1Hive's Bee NFT Mint Shop</p>
          <p className="sub-text">
            A Collection of Bees. Each one unique.  Mint yours now.
          </p>
          <p className="sub-text">
            Total Mints: {mintTotal}/{TOTAL_MINT_COUNT}
          </p>
          {currentAccount === "" ? renderNotConnectedContainer() : renderMintUI()}
        </div>

        { chainId === '0x4' ? null :(  
          <div className="sub-text">
          <div>You are not connected to Rinkeby network.</div> 
          <div> Please change the network you are connected to in your wallet. </div>
            <div>
             <button className="cta-button connect-wallet-button" onClick={changeNetwork}>
             Change to Rinkeby
            </button>
            </div>
        </div>
        )}
          
        <div>
          <p className="sub-text">
          <a
      
            href={OPENSEA_LINK}
            target="_blank"
            rel="noreferrer"
          >{`🌊 View Collection on OpenSea`}</a></p>
        </div>

        <div>
             <button className="cta-button connect-wallet-button" onClick={revealNFT}>
             Reveal NFT - admin
            </button>
        </div>

        <div>
             <button className="cta-button connect-wallet-button" onClick={revealTokenURI}>
             tokenURI
            </button>
        </div>

        <div>
             <button className="cta-button connect-wallet-button" onClick={setTokenURI}>
             setTokenURI
            </button>
        </div>

        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built by the 1hive Community`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;
