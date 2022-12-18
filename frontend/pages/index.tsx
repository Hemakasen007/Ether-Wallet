import Head from "next/head";
import Image from "next/image";
import { MutableRefObject, useEffect, useRef, useState } from "react";
import { Contract,providers, Signer, BigNumber, utils } from "ethers";
import styles from "../styles/Home.module.css";
import Web3Modal from "web3modal";

import {ETHER_WALLET_CONTRACT_ADDRESS, ETHER_WALLET_ABI} from '../constants';

import Modal from "../components/Modal";
import { connect } from "http2";

//Wallet Contract deployed at address 0x884948A562b9788DB4C14C11F530deAf1DB2aF55
export default function Home() {
  const name = "User";

  const [walletConnected, setWalletConnected] = useState(false);

  const [balance, setBalance] = useState<string>();

  const [isOpen, setIsOpen] = useState(false);

  const [isDeposit, setIsDeposit] = useState(true);

  const [transAmount, setTransAmount] = useState<any | null>(0.01);

  const web3ModalRef: MutableRefObject<any> = useRef();

  

  function connectWalletOnClick() {
    setWalletConnected(true);
  }

  useEffect(() => {
    if (!walletConnected) {
      web3ModalRef.current = new Web3Modal({
        network: "goerli",
        providerOptions: {},
        disableInjectedProvider: false,
      });

      connectWallet();
       getWalletBalance();

    }
  });
  const getProviderOrSigner = async (needSigner = false) => {
    const provider = await web3ModalRef.current.connect();
    const web3Provider = new providers.Web3Provider(provider);

    const { chainId } = await web3Provider.getNetwork();
    if (chainId !== 5) {
      window.alert("Please switch the network to goerli");
      throw new Error("Please switch the network to goerli");
    }

    if (needSigner) {
      return web3Provider.getSigner();
    }
    return web3Provider;
  };

  const connectWallet = async () => {
    try {
      await getProviderOrSigner();
      setWalletConnected(true);
    } catch (error) {
      console.error(error);
    }
  };

  const getWalletBalance = async () => {
    try {
      const provider = await getProviderOrSigner();
      const contract = getEtherWalletContractInstance(provider);
      const balance = await contract.getBalance();
      console.log(utils.formatEther(balance));
      setBalance(utils.formatEther(balance));      
    } catch (error) {
      console.error(error);
    }
  }
  

  const getEtherWalletContractInstance = (providerOrSigner: Signer | providers.Provider ) => {
    return new Contract(
      ETHER_WALLET_CONTRACT_ADDRESS,
      ETHER_WALLET_ABI,
      providerOrSigner
    );
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      let amount = parseFloat(transAmount);
      console.log(amount);
      setTransAmount(amount);
      

    } catch (error) {
      console.error(error);
    }
    
  }


  const renderActionButtons = () => {
    if (walletConnected) {
      return (
        <>
          <div className="flex justify-around flex-col border-gray-50 border-solid border-2 w-4/5
           max-h-48  text-slate-200 rounded-md">
            <div className="flex flex-row gap-3 justify-end p-2 text-xs">
              <div
                className={
                  isDeposit ? "bg-white text-black p-1 rounded-xl" : "p-1"
                }
                onClick={() => setIsDeposit(true)}
              >
                deposit
              </div>
              
              <div
                className={
                  !isDeposit ? "bg-white text-black p-1 rounded-xl" : "p-1"
                }
                onClick={() => setIsDeposit(false)}
              >
                withdraw
              </div>
            </div>
            {isDeposit && 
              <div className="text-white ">
                Send ETH to <i className="text-xs">{ETHER_WALLET_CONTRACT_ADDRESS}</i>
              </div>}
            {!isDeposit && 
              <form className="text-white" onSubmit={handleSubmit}>
                <label htmlFor="enter-eth" className="text-white ml-1 mt-4">Enter the amount in ETH</label>
                <input type="text" id="enter-eth" className="min-w-max h-6 rounded-md ml-1 mt-1 text-black p-1 focus:border-none" placeholder="0.0001" onChange={e => setTransAmount(e.target.value)} />
                <button className="bg-white text-black cursor-pointer flex rounded-md min-w-5 p-2 mt-4 ml-1 mb-5 lg:h-20 text-center justify-center items-center"> Withdraw </button>
              </form>}

            
            
          </div>
          {/* <div className="flex justify-around w-2/3 lg:flex-row flex-col">
            <div
              className="bg-white cursor-pointer flex rounded-md w-max px-10 lg:h-20 text-center justify-center items-center"
              onClick={() => setIsOpen(true)}
            >
              {" "}
              Withdraw{" "}
            </div>
            {isOpen && <Modal setIsOpen={setIsOpen} />}
            <div className="bg-white cursor-pointer w-max px-10 lg:h-20">
              lol{" "}
            </div>
          </div> */}
        </>
      );
    } else {
      return (
        <div className="flex justify-around w-1/3 ">
          <div
            className="bg-blue-200 cursor-pointer flex rounded-md w-max px-10 lg:h-20 text-center justify-center items-center"
            onClick={() => connectWalletOnClick()}
          >
            {" "}
            Connect Wallet{" "}
          </div>
          <div>lol </div>
        </div>
      );
    }
  };

  // const settingDeposit = (isDeposit: boolean) =>{
  //   setIsDeposit(isDeposit);
  //   if(isDeposit){
  //     return
  //   }

  // }
  //REMOVE
  // const renderDepoWithFlags = () => {
  //   if (isDeposit) {
  //     return (
  //       <div className="flex flex-row gap-3 justify-end p-2 text-xs">
  //         <div className="bg-white text-black p-1 rounded-xl">deposit</div>
  //         <div onClick={() => setIsDeposit(false)}>withdraw</div>
  //       </div>
  //     );
  //   }
  //   return (
  //     <div className="flex flex-row gap-3 justify-end p-2 text-xs">
  //       <div onClick={() => setIsDeposit(false)}>deposit</div>
  //       <div className="bg-white text-black p-1 rounded-xl">withdraw</div>
  //     </div>
  //   );
  // };

  return (
    <div className="bg-black min-h-screen">
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Comfortaa&family=Montserrat:wght@500;800;900&family=Open+Sans:ital,wght@1,300&family=Poppins:wght@300&family=Roboto:wght@300;400;900&display=swap"
          rel="stylesheet"
        ></link>
      </Head>

      <div className="flex flex-col justify-center items-center mx-auto">
        <h1 className="text-3xl mt-10 mb-5 text-slate-200">
          {" "}
          Welcome {name} !
        </h1>
        <div className="text-left w-2/3 text-white rounded-md shadow-sm shadow-slate-200 my-4 py-4 px-4 leading-5 bg-gradient-to-r from-miaka-red to-miaka-green">
          <p className="text-sm">balance is: </p>
          <div className="mt-4 text-4xl font-mono mb-8">{/*(Math.round(balance * 100) / 100).toFixed(2)*/balance} ETH</div>
        </div>

        {renderActionButtons()}

        {/* <div className="flex justify-around w-2/3 ">
          <div className="bg-white cursor-pointer flex rounded-md w-max px-10 lg:h-20 text-center justify-center items-center"> Withdraw </div>
          <div>lol </div>
        </div> */}
      </div>
    </div>
  );
}
