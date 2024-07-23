import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import DigitalObjectIdentifierContract from './DigitalObjectIdentifier.json';

function App() {
  const [web3, setWeb3] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [contract, setContract] = useState(null);
  const [objectId, setObjectId] = useState('');
  const [objectData, setObjectData] = useState('');
  const [retrievedData, setRetrievedData] = useState('');
  const [objectCount, setObjectCount] = useState(0);
  const [status, setStatus] = useState('');

  useEffect(() => {
    const init = async () => {
      try {
        const web3Instance = new Web3('http://localhost:7545');
        setWeb3(web3Instance);

        const accs = await web3Instance.eth.getAccounts();
        setAccounts(accs);

        const networkId = await web3Instance.eth.net.getId();
        const deployedNetwork = DigitalObjectIdentifierContract.networks[networkId];
        const instance = new web3Instance.eth.Contract(
          DigitalObjectIdentifierContract.abi,
          deployedNetwork && deployedNetwork.address,
        );
        setContract(instance);

        // Get initial object count
        const count = await instance.methods.getObjectCount().call();
        setObjectCount(parseInt(count));
      } catch (error) {
        console.error("Error initializing the app:", error);
        setStatus('Failed to load web3, accounts, or contract. Check console for details.');
      }
    };

    init();
  }, []);

  const registerObject = async () => {
    if (!contract) return;
    setStatus('Registering object...');
    try {
      const result = await contract.methods.registerObject(objectData).send({ from: accounts[0] });
      console.log('Transaction result:', result);

      // Get the updated object count
      const newCount = await contract.methods.getObjectCount().call();
      setObjectCount(parseInt(newCount));

      // The new object's ID is the new count
      setObjectId(newCount);
      setStatus(`Object registered successfully with ID: ${newCount}`);
      setObjectData('');
    } catch (error) {
      console.error("Error registering object:", error);
      setStatus('Error registering object. Check console for details.');
    }
  };

  const getObject = async () => {
    if (!contract) return;
    setStatus('Retrieving object...');
    try {
      const data = await contract.methods.getObject(objectId).call();
      setRetrievedData(data);
      setStatus('Object retrieved successfully');
    } catch (error) {
      console.error("Error retrieving object:", error);
      setStatus('Error: Invalid object ID or object not found');
      setRetrievedData('');
    }
  };

  if (!web3) {
    return <div>Loading Web3, accounts, and contract...</div>;
  }

  return (
    <div className="App">
      <h1>Digital Object Identifier</h1>
      <p>Total objects: {objectCount}</p>
      
      <h2>Register New Object</h2>
      <input 
        type="text" 
        value={objectData} 
        onChange={(e) => setObjectData(e.target.value)} 
        placeholder="Enter object data"
      />
      <button onClick={registerObject}>Register Object</button>

      <h2>Retrieve Object</h2>
      <input 
        type="number" 
        value={objectId} 
        onChange={(e) => {
          const value = parseInt(e.target.value);
          if (value > 0) {
            setObjectId(value);
          }
        }} 
        placeholder="Enter object ID"
        min="1"
      />
      <button onClick={getObject}>Get Object</button>
      
      <p>Status: {status}</p>
      {retrievedData && <p>Retrieved data: {retrievedData}</p>}
    </div>
  );
}

export default App;