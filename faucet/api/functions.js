import {ethers} from 'ethers'
import axios from 'axios';
import bigInt from "big-integer";

const apiUrl = 'https://pls-faucet-api.starter.xyz/requestTokens';
const faucetAddress = '0xA73C0Cdf9E6D1b6CA849a11d1E98255f953DD646';

export const Drip = async () => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const wallet = await signer.getAddress();
    const result = await axios.post(`${apiUrl}`, {walletUser: wallet});
    return result.data;
}

export const GetUser = async () => {
    const provider = new ethers.BrowserProvider(window.ethereum);

    const response = await fetch("/abis/faucet.json");
    const abi = await response.json();

    const faucet = new ethers.Contract(faucetAddress, abi, provider)
    const signer = await provider.getSigner();
    const wallet = await signer.getAddress();
    const userNextQualifyTime = await faucet.userNextQualifyTime(wallet);
    const nextRequestTime = await faucet.nextRequestTime();
    return { 
        userNextQualifyTime: bigInt(userNextQualifyTime).toString(),
        nextRequestTime: bigInt(nextRequestTime).toString()
    }
}

export const GetFaucetUserCount = async () => {
    return {amount: 0};
}

export const GetDripAmount = async () => {
    const provider = new ethers.BrowserProvider(window.ethereum);

    const response = await fetch("/abis/faucet.json");
    const abi = await response.json();

    const faucet = new ethers.Contract(faucetAddress, abi, provider)

    const faucetGrantAmount = await faucet.faucetGrantAmount();
    return { 
        faucetGrantAmount: bigInt(faucetGrantAmount).toJSNumber()
    }
}