import "./App.css";
import { Contract, ethers } from "ethers";
import { useEffect, useState } from "react";
import contractABI from "./contractABI.json";

const contractAddress = "0x9Ab6d83E95F7064F9B63eb19bE2e0416bAB61009";

function App() {
  const [account, setAccount] = useState(null);
  const [isWalletInstalled, setIsWalletInstalled] = useState(false);
  const [NFTContract, setNFTContract] = useState(null);
  // state for whether app is minting or not.
  const [isMinting, setIsMinting] = useState(false);
  const [isCorrectNetwork, setIsCorrectNetwork] = useState(false); // Added state for network check

  const ethers = require("ethers") 

  // Check if the current network is the correct network
  useEffect(() => {
    async function checkNetwork() {
      if (window.ethereum) {
        const chainId = await window.ethereum.request({ method: "eth_chainId" });
        setIsCorrectNetwork(chainId === "0x13881"); // Change to the correct chain ID
      }
    }
    //check for initial network
    checkNetwork();

    //Check for network change
    window.ethereum.on("chainChanged", (newChainId) => {
      setIsCorrectNetwork(newChainId === "0x13881"); // Change to the correct chain ID
    },[]);
  }, []);

  useEffect(() => {
    if (window.ethereum) {
      setIsWalletInstalled(true);
    }
  }, []);

  useEffect(() => {
    function initNFTContract() {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      setNFTContract(new Contract(contractAddress, contractABI.abi, signer));
    }
    initNFTContract();
  }, [account]);

  async function connectWallet() {
    window.ethereum
      .request({
        method: "eth_requestAccounts",
      })
      .then((accounts) => {
        setAccount(accounts[0]);
      })
      .catch((error) => {
        alert("Something went wrong");
      });

  }

  async function disconnectWallet() {
    if (window.ethereum) {
      try {
        setAccount(null);
      } catch (error) {
        console.error("An error occurred while disconnecting the wallet:", error);
      }
    }
  }

  const data = [
    {
      url: "./assets/images/1.png",
      param: "handleMint('https://brown-impossible-snake-141.mypinata.cloud/ipfs/QmWXSsq4o9U92oXgoN3LX9yshfLSH1jLXvpBL3AfGgafix/1.png')",
    },
    {
      url: "./assets/images/2.png",
      param: "handleMint('https://brown-impossible-snake-141.mypinata.cloud/ipfs/QmWXSsq4o9U92oXgoN3LX9yshfLSH1jLXvpBL3AfGgafix/2%20%281%29.png')",
    },
    {
      url: "./assets/images/3.png",
      param: "handleMint('https://brown-impossible-snake-141.mypinata.cloud/ipfs/QmWXSsq4o9U92oXgoN3LX9yshfLSH1jLXvpBL3AfGgafix/3.png')",
    },
    {
      url: "./assets/images/4.png",
      param: "handleMint('https://brown-impossible-snake-141.mypinata.cloud/ipfs/QmWXSsq4o9U92oXgoN3LX9yshfLSH1jLXvpBL3AfGgafix/4.png')",
    },
    {
      url: "./assets/images/5.png",
      param: "handleMint('https://brown-impossible-snake-141.mypinata.cloud/ipfs/QmWXSsq4o9U92oXgoN3LX9yshfLSH1jLXvpBL3AfGgafix/5.png')",
    },
  ];

  async function withdrawMoney() {
    try {
      const response = await NFTContract.withdrawMoney();
      console.log("Received: ", response);
    } catch (err) {
      alert(err);
    }
  }

  if (!isCorrectNetwork) {
    return (
      <div className="container">
        <br />
        <h1>🔮 Sohail Ahmed Laghari</h1>
        <h2>Switch to the Polygon Mumbai Network</h2>
        <p>Please switch to the Polygon Mumbai network to use this app.</p>
      </div>
    );
  }

  async function handleMint(tokenURI) {
    setIsMinting(true);
    try {
      const options = { value: ethers.utils.parseEther("0.01") };
      const response = await NFTContract.mintNFT(tokenURI, options);
      console.log("Received: ", response);
    } catch (err) {
      alert(err);
    } finally {
      setIsMinting(false);
    }
  }

  if (account === null) {
      return (
        <>
          <div className="connect-container">
            <br />
            <h1>🔮 Sohail Ahmed Laghari</h1>
            <h2>NFT Marketplace</h2>
            <p>Buy an NFT from our marketplace.</p>

            {isWalletInstalled ? (
              <button className="connect-button" onClick={connectWallet}>Connect Wallet</button>
            ) : (
              <p>Install Metamask wallet</p>
            )}
          </div>
        </>
    );
  
}

  return (
    <div className="bg">
    <>
      <div className="container">
        <br />

        <h1>NFT Marketplace</h1>
        <p>A NFT Marketplace to view and mint your NFT</p>
        <p class="footer">Powered by <a class="ref-link" href="https://www.linkedin.com/in/sohail-ahmed-b40b66215/" target="_blank" rel="noopener noreferrer">Sohail Ahmed</a>🔮</p>
        {data.map((item, index) => (
          <div className="imgDiv">
            <img
              src={item.url}
              key={index}
              alt="images"
              width={250}
              height={250}
              border={2}
            />
            <button className="mint_btn"
              isLoading={isMinting}
              onClick={() => {
                handleMint(item.param);
              }}
            >
              Mint - 0.01 MATIC
            </button>
          </div>
        ))}
        <div className="withdraw_container">
        <button className="withdraw_btn"
          onClick={() => {
            withdrawMoney();
          }}
        >
          Withdraw Money from Contract
        </button>
        </div>
        <button className="disconnect-button" onClick={disconnectWallet}>Disconnect Wallet</button>
      </div>
    </>
    
    </div>
    
  );
}

export default App;
