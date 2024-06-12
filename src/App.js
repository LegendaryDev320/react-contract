import "./App.css";
import {
  useWeb3ModalProvider,
  useWeb3ModalAccount,
} from "@web3modal/ethers/react";
import WalletConnect from "./components/WalletConnect";
import { BrowserProvider, Contract, formatUnits } from "ethers";
import abi from "./config/abi.json";
import { useEffect, useState } from "react";
import Spinner from "./components/spinner";
import LeftGroup from "./components/LeftGroup";
const ContractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;

// The ERC-20 Contract ABI, which is a common contract interface
// for tokens (this is the Human-Readable ABI format)

function App() {
  const { address, chainId, isConnected } = useWeb3ModalAccount();
  const { walletProvider } = useWeb3ModalProvider();
  const [loading, setLoading] = useState(false);
  const [loading1, setLoading1] = useState(false);
  const [targetAddress, setTargetAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [balance, setBalance] = useState("");
  const [balanceAddress, setBalanceAddress] = useState("");
  const [signer, setSigner] = useState("");
  const [signerBalance, setSignerBalance] = useState("");
  const [ethersProvider, setEthersProvider] = useState(null);
  const [smartContract, setSmartContract] = useState(null);
  useEffect(() => {
    if (isConnected) {
      init();
    }
  }, [isConnected]);
  const changeNetwork = async () => {
    return new Promise(async (resolve, reject) => {
      if (chainId != 11155111) {
        try {
          await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: "0xAA36A7" }],
          });
          return resolve();
        } catch (err) {
          // This error code indicates that the chain has not been added to MetaMask
          return reject("Please add the Sepolia Testnet to your wallet");
        }
      } else {
        return resolve();
      }
    });
  };
  const init = async () => {
    try {
      await changeNetwork();
      const provider = new BrowserProvider(walletProvider);
      const s = await provider.getSigner();
      const contract = new Contract(ContractAddress, abi, s);
      setSigner(s);
      setEthersProvider(provider);
      setSmartContract(contract);
      const currentBalance = await contract.balanceOf(s);
      setSignerBalance(formatUnits(currentBalance, 8));
    } catch (err) {
      alert(err);
    }
  };
  const getBalance = async () => {
    try {
      if (!isConnected) {
        alert("Connect your wallet");
        throw Error("User disconnected");
      }
      // The Contract object
      const balance = await smartContract.balanceOf(balanceAddress);
      setBalance(formatUnits(balance, 8));
      // console.log(formatUnits(balance, 8));
    } catch (err) {
      console.log(err);
    }
  };
  const transfer = async () => {
    try {
      if (!isConnected) {
        alert("Connect your wallet");
        throw Error("User disconnected");
      }
      // The Contract object

      // const transfer = await smartContract.transfer(targetAddress, formatUnits(amount, 8));
      const transfer = await smartContract.transfer(targetAddress, amount);
      await transfer.wait();
      console.log(transfer);
    } catch (err) {
      console.log(err);
    }
  };
  const handleTransferClick = async () => {
    setLoading(true);
    await transfer();
    setLoading(false);
  };
  const handleBalanceOfClick = async () => {
    setLoading1(true);
    await getBalance();
    setLoading1(false);
  };
  return (
    <div className="App">
      <div className="flex items-center ">
        <WalletConnect />
        <p className="text-md">
          <span className="font-[600] text-[24px] text-sky-700">
            {signerBalance}
          </span>
          CTK
        </p>
      </div>
      <div className="flex px-10">
        <div className="mr-10">
          <LeftGroup />
        </div>
        <div>
          <div className="flex items-center justify-center p-3 mx-3 border-2 border-gray-300 rounded-md">
            <input
              className="border-2 border-gray-300 rounded-md p-1 text-sm w-[500px]"
              type="text"
              placeholder="Enter to address"
              value={targetAddress}
              onChange={(e) => setTargetAddress(e.target.value)}
            />
            <input
              className="border-2 border-gray-300 rounded-md p-1 text-sm w-[500px]"
              type="text"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <button
              disabled={loading}
              className="bg-[#0784c3] hover:bg-[#53a8d2] disabled:bg-slate-50 text-white font-bold py-1 px-4 rounded"
              onClick={handleTransferClick}
            >
              <div className="flex items-center">
                {loading && <Spinner />} Transfer
              </div>
            </button>
          </div>
          <div className="flex items-center justify-center p-3 mx-3 border-2 border-gray-300 rounded-md">
            <input
              className="border-2 border-gray-300 rounded-md p-1 text-sm w-[500px]"
              type="text"
              placeholder="Enter to address"
              value={balanceAddress}
              onChange={(e) => setBalanceAddress(e.target.value)}
            />
            <input
              className="border-2 border-gray-300 rounded-md p-1 text-sm w-[500px]"
              type="text"
              placeholder="balance"
              readOnly
              value={balance}
            />
            <button
              disabled={loading}
              className="bg-[#0784c3] hover:bg-[#53a8d2] disabled:bg-slate-50 text-white font-bold py-1 px-4 rounded"
              onClick={handleBalanceOfClick}
            >
              <div className="flex items-center">
                {loading1 && <Spinner />} BalanceOf
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
