import { ConnectWallet, useAddress, useContract, useToken, useTokenBalance } from "@thirdweb-dev/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { vendorABI } from "../contracts";
import Web3 from "web3";

const Exchange = () => {
    const [tokens, setTokens] = useState("");
    const [matic, setMatic] = useState(0);
    const [transact, setTransact] = useState(false);
    const myToken = useContract(process.env.NEXT_PUBLIC_TOKEN_CONTRACT_ADDRESS).data;
    const address = useAddress();
    const router = useRouter();
    const balance = useTokenBalance(myToken, address);
    const web3 = new Web3(Web3.givenProvider);

    const purchase = async () => {
        setTransact(true);
        try {
            const accounts = await web3.eth.getAccounts();
            const vendor = new web3.eth.Contract(
                vendorABI,
                process.env.NEXT_PUBLIC_VENDOR_CONTRACT_ADDRESS
            );
            const request = await vendor.methods.buyTokens().send({
                from: accounts[0],
                value: web3.utils.toWei(matic.toString(), "ether"),
            });
            alert("You have successfully purchased ATH tokens");
        } catch (error) {
            console.error(error);
            alert("Error selling tokens");
        }
        setTransact(false);
    };

    const sell = async () => {
        setTransact(true);
        try {
            const accounts = await web3.eth.getAccounts();
            const vendor = new web3.eth.Contract(
                vendorABI,
                process.env.NEXT_PUBLIC_VENDOR_CONTRACT_ADDRESS
            );
            await myToken.setAllowance(
                process.env.NEXT_PUBLIC_VENDOR_CONTRACT_ADDRESS,
                tokens
            );
            const request = await vendor.methods
                .sellTokens(web3.utils.toWei(tokens, "ether"))
                .send({ from: accounts[0] });
            alert("You have successfully sold ATH tokens");
        } catch (error) {
            console.error(error);
            alert("Error purchasing tokens");
        }
        setTransact(false);
    };

    useEffect(() => {
        setMatic(tokens / 100);
    }, [tokens]);

    useEffect(() => {
        if (!address) router.replace("/");
    }, [address]);
    return (
        <div className="flex flex-col justify-center items-center p-32">

            <div className="text-4xl font-bold mb-4">PJC Token Exchange</div>
            <h1 className="m-4 text-lg">Purchase or Sell PJC ERC20 Tokens</h1>
            <div className="my-3"><ConnectWallet /></div>
            {/* <div className="my-2 text-xl font-semibold"> Wallet PJC Balance : {tokkenB}</div> */}
            <div className="m-3 text-xl font-semibold"> PJC Tokens : {balance.isLoading ? "Loading Balance..." : balance.data.displayValue}</div>
            <div className="p-4 ">
                <input
                    type="number"
                    placeholder="Amount of tokens"
                    className="exchange__textBox"
                    value={tokens}
                    onChange={(e) => setTokens(e.target.value)}
                />
            </div>
            <div className="mb-3 text-lg">MATIC equivalent: {matic}</div>
            <div className="flex justify-center font-semibold">
                <button className="text-white bg-pink-700 shadow rounded p-3 m-3 border w-32" onClick={purchase}>Purchase</button>
                <button className="text-white bg-pink-700 shadow rounded p-3 m-3 border w-32" onClick={sell}>Sell</button>
            </div>
            <div className="my-2">{transact ? <div className="my-2 text-lg p-3 bg-amber-200">Processing Transaction</div> : <div></div>}</div>
        </div>
    );
};
export default Exchange;