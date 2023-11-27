import { useState, useEffect } from 'react'
import {ethers} from 'ethers'
import moment from 'moment';
import { ToastContainer, toast } from 'react-toastify';
import { Drip, GetUser, GetFaucetUserCount, GetDripAmount } from '../api/functions';
import 'react-toastify/dist/ReactToastify.css';
import './App.css'

let provider, signer = null;

function App() {
  const [userAddress, setUserAddress] = useState(null);
  const [authUrl, setAuthUrl] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [userNextQualifyTime, setUserNextQualifyTime] = useState(null);
  const [nextEligibleDate, setNextEligibleDate] = useState(null);
  const [nextEligibleDateString, setNextEligibleDateString] = useState(null);
  const [nextEligibleSystemDate, setNextEligibleSystemDate] = useState(null);
  const [nextEligibleSystemDateString, setNextEligibleSystemDateString] = useState(null);
  const [message, setMessage] = useState('Connect Wallet');
  const [copy, setCopy] = useState('Hello there. This faucet helps you easily get started on PulseChain. You may request some emergency Drip for free using this service. Connect your wallet below to get started.')
  const [userCount, setUserCount] = useState(null);
  const [dripAmount, setDripAmount] = useState(null)

  async function getUserCount() {
    const users = await GetFaucetUserCount();
    setUserCount(users.users);
  }

  async function getDripAmount() {
    const data = await GetDripAmount();
    setDripAmount(Math.round(parseFloat(data.faucetGrantAmount) / (10 ** 18)))
  }

  useEffect(() => {
    getDripAmount()
  }, []);

  const tweetText = `Got free $PLS from the mainnet faucet @marlonwilliams created on behalf of the PulseChain Foundation! Give them a follow @PulseChainFDN`;
  const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;
  async function init() {
    if(userAddress !== null) return;

    if (window.ethereum == null) {
      toast.error("MetaMask not installed");
    } else {
      provider = new ethers.BrowserProvider(window.ethereum);
      const nw = await provider.getNetwork();
      signer = await provider.getSigner();

      // Check if the network is correct, if not, change it
      if (Number(nw.chainId) !== 369) {
        toast.warn('Switching Networks')
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0x171' }],
          })
          // window.location.reload();
          provider = new ethers.BrowserProvider(window.ethereum);

        } catch (switchError) {
          console.log({ switchError })
          if (switchError.code === 4902) {
            toast.warn('Adding PulseChain Mainnet to your MetaMask');
            try {
              await window.ethereum.request({
                method: 'wallet_addEthereumChain',
                params: [{ 
                  chainId: '0x171',
                  chainName: 'PulseChain Mainnet',
                  nativeCurrency: {
                    name: 'Pulse',
                    symbol: 'PLS',
                    decimals: 18
                  },
                  rpcUrls: ['https://rpc.pulsechain.com'],
                  blockExplorerUrls: ['https://otter.pulsechain.com']
                }],
              });
              init();
            } catch (addError) {
              toast.error('There was an error adding the network, please refresh and try again.');
              console.error(addError);
            }
          }
        }
      }

      signer = await provider.getSigner();
      setUserAddress(await signer.getAddress());
      toast.success("Wallet Connected!");

      setCopy(`We are now checking your eligibility for some Drip. Please hold...`);

      const user = await GetUser();
      let nextEligibleTs = (new Date(user.userNextQualifyTime * 1000));
      let nextEligibleSystemTs = (new Date(user.nextRequestTime * 1000));
      let timeDiff = (nextEligibleTs.getTime() - (new Date).getTime()) / 1000;
      
      if (timeDiff <= 0)
        setCopy(`Congrats! Click the Drip button below and you'll have some PLS sent to your wallet in no time.`);
      else 
        setCopy(`You have already received some Drip in the timeframe alloted. Come back again after the time specified below to try again.`);

      setTimeRemaining(timeDiff);
      setUserNextQualifyTime(user.userNextQualifyTime);
      setNextEligibleDate(nextEligibleTs.toString());
      setNextEligibleDateString(moment(nextEligibleTs).fromNow().toString());

      setNextEligibleSystemDate(nextEligibleSystemTs.toString());
      setNextEligibleSystemDateString(moment(nextEligibleSystemTs).fromNow().toString());

      console.log('user', user, nextEligibleTs)
      console.log('timeDiff',timeDiff)
    }
  }

  async function drip() {
    const tx = await Drip();

    if(tx.error) {
      if(tx.error.reason) {
        toast.error(tx.error.reason);
        if(tx.error.reason.includes('Not allowed') && timeRemaining >= 0) {
          setCopy(`Whoa there, looks like you've had your fill for today. Come back again tomorrow.`)
        } else if(tx.error.reason.includes('Not allowed') && timeRemaining <= 0) {
          setCopy(`We are busy topping up some other Pulsicans at the moment. Come back again after the 5 minute cool down period has elapsed.`)
        }
        return;
      }
      toast.error(tx.error.reason);
      return;
    }

    setTimeRemaining(86400);
    toast.success('Your PLS was delivered!')
    setCopy(`Your PLS has been delivered. Happy transacting and come back tomorrow if you need some more!`)
  }

  return (
    <>
    <div style={{alignItems: 'center', marginTop: '5%', marginBottom: "10%"}}>
      <img src='/images/pls.png' style={{width: '20em'}}/>
      <strong style={{width: '10em',padding: '5px', color: 'white' }}>Faucet</strong>
    </div>
      <div style={{ justifyContent: 'center', alignItems: 'center', marginBottom: "5%" }}>
        <div style={{ background: 'var(--logoGradient)', width: '400px', height: '400px', borderRadius: '2%', border: '1px solid black', padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between'}}>
          <span style={{display: userAddress == null ? 'none' : ''}}>
            Last drip requested (system): <u>{nextEligibleSystemDateString}</u><br />
            Last drip requested (by you): <u>{nextEligibleDateString}</u></span>
          <h2 style={{color: 'white', textDecoration:'underline'}}>{dripAmount} FREE PLS</h2>
          <strong style={{display: authUrl == null ? '' : 'none' ,fontFamily: 'Poppins, monospace', color: 'white', marginTop: '5%', fontSize: "14pt"}}>{copy}</strong>
          <button onClick={() => userAddress == null ? init() : ''} style={{fontFamily: 'Courier New, monospace', display: userAddress == null ? '' : 'none'}}>
            {message}
          </button>
          <div style={{fontSize:"8pt", padding:"5px", overflowWrap:"word-break"}}>
          To minimize abuse, free PLS are given out just once every 5 minutes. Use the <b>Last drip requested (system)</b> indicator to know when is a good time to try.
          </div>
          <strong style={{
            display: timeRemaining > 0 ? '' : 'none' ,
            fontFamily: 'Poppins, monospace', 
            color: 'white', 
            marginTop: '-5%', 
            fontSize: "10pt"
            }}>
            Your Next Available Drip Time is: <u>{nextEligibleDateString}</u><br />
            <span style={{fontSize:"8pt"}}>{nextEligibleDate}</span>
          </strong>
          <button style={{
            fontFamily: 'Courier New, monospace', 
            display: userAddress !== null ? '' : 'none', 
            visibility: timeRemaining <= 0 ? 'visible' : 'hidden'}} 
            onClick={() => drip()}>Drip Some PLS</button>
        </div>
      </div>

      <div style={{width:"60%", float:"left", borderRadius: '2%', padding: '5px', borderRadius: '15%', background: 'var(--logoGradient)',bottom: '2%', left: '50%', fontFamily: 'Courier New, monospace'}}>
        <a href="https://PulseChainFoundation.org" target="_blank" rel="noopener noreferrer" style={{color: 'white', textDecoration: 'none', fontWeight: "bold"}}>PulseChain Foundation</a>
      </div>
      <div style={{width:"30%", float:"right", borderRadius: '2%', padding: '5px', borderRadius: '15%', background: 'var(--logoGradient)',bottom: '2%', right: '2%', fontFamily: 'Courier New, monospace'}}>
        <a style={{color: "white", fontWeight: "bold"}} href={url} target="_blank" rel="noopener noreferrer">Share This!</a>
      </div>
      
      <div style={{display: userCount == null ? 'none' : 'flex', justifyContent: 'center', alignItems: 'center'}}>
        <strong style={{borderRadius: '2%', padding: '5px', color: 'black', background: 'var(--logoGradient)',position: 'fixed', bottom: '2%', fontFamily: 'Courier New, monospace'}}>Fed {userCount} users on PulseChain 💪</strong>
      </div>
      
      <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
        <strong style={{borderRadius: '2%', padding: '5px', color: 'black',position: 'fixed', bottom: '2%', fontFamily: 'Courier New, monospace'}}>
          <a href="https://x.com/marlonwilliams" target="_blank" rel="noopener noreferrer" style={{marginLeft:"-100%", color: 'white', textDecoration: 'none', fontWeight: "bold"}}>by BarChef 👨‍🍳</a>
        </strong>
      </div>

      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />  
    </>
  )
}

export default App