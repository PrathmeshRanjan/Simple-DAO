import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import abi from "./contracts/MyDAO.json";
import './App.css';

const contractAddress = '0x45D7A88E5A6d0f38eD3E1d5DE741dE265BF01E08';

const networkId = 80001;

function App() {
  const [connected, setConnected] = useState(false);
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);

  useEffect(() => {
    // Check if the browser has an Ethereum provider
    if (typeof window.ethereum !== 'undefined') {
      connect();
    }
  }, []);

  async function connect() {
    try {
      // Request access to the user's MetaMask account
      await window.ethereum.request({ method: 'eth_requestAccounts' });

      // Create a new ethers provider using the current provider from MetaMask
      const provider = new ethers.providers.Web3Provider(window.ethereum);

      // Check if the current network is compatible with the contract
      const network = await provider.getNetwork();
      if (network.chainId !== networkId) {
        alert('Please switch to the correct network to use this dApp.');
        return;
      }

      // Set the account and contract state variables
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, abi.abi, signer);
      setAccount(await signer.getAddress());
      setContract(contract);
      setConnected(true);
    } catch (error) {
      console.error(error);
    }
  }

  async function applyForMembership() {
    try {
      await contract.applyForMembership();
      alert('Membership application submitted successfully.');
    } catch (error) {
      console.error(error);
    }
  }

  async function approveMembership(address) {
    try {
      await contract.approveMembership(address);
      alert('Membership approved successfully.');
    } catch (error) {
      console.error(error);
    }
  }

  async function createProposal(description) {
    try {
      await contract.createProposal(description);
      alert('Proposal created successfully.');
    } catch (error) {
      console.error(error);
    }
  }

  async function voteOnProposal(proposalId) {
    try {
      await contract.voteOnProposal(proposalId, true);
      alert('Vote submitted successfully.');
    } catch (error) {
      console.error(error);
    }
  }

  async function voteAgainstProposal(proposalId) {
    try {
      await contract.voteAgainstProposal(proposalId, false);
      alert('Vote submitted successfully.');
    } catch (error) {
      console.error(error);
    }
  }

  async function closeVoting(proposalId) {
    try {
      await contract.closeVoting(proposalId);
      alert('Voting closed successfully.');
    } catch (error) {
      console.error(error);
    }
  }

  if (!connected) {
    return (
      <div>
        <button onClick={connect}>Connect to MetaMask</button>
      </div>
    );
  }

  return (
    <div className='App'>
      <h1>My Polygon DAO</h1>
      <p className="account">Connected account: {account}</p>
      <button className="btn" onClick={applyForMembership}>Apply for Membership</button>
      <div>
        <h2>Membership Approval</h2>
        <p>Enter address to approve:</p>
        <input type="text" id="approval-address" />
        <button onClick={() => approveMembership(document.getElementById('approval-address').value)}>Approve Membership</button>
      </div>
      <div className="form">
        <h2>Proposal Creation</h2>
        <p>Enter proposal description:</p>
        <input type="text" id="proposal-description" />
        <button onClick={() => createProposal(document.getElementById('proposal-description').value)}>Create Proposal</button>
      </div>
    </div>
  );
}

export default App;