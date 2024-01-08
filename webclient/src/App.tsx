import { useState, useEffect } from 'react';
import { Peer, DataConnection } from 'peerjs';

function App() {
  const [connectedToServer, hasConnectedToServer] = useState(false);
  const [host, setHost] = useState('localhost');
  const [port, setPort] = useState('9000');
  const [path, setPath] = useState('/peerjs');
  const [peer, setPeer] = useState<Peer | null>(null);
  const [useTurn, setUseTurn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [counterpartId, setCounterpartId] = useState('');
  const [connectedToCounterpart, setConnectedToCounterpart] = useState(false);
  const [counterpartConnection, setCounterpartConnection] =
    useState<DataConnection | null>(null);
  const [messageToSend, setMessageToSend] = useState('');
  const [receivedMessage, setReceivedMessage] = useState('');

  // Server Connection stuff
  const handleServerConnect = () => {
    const turnConfig = {
      config: {
        iceServers: [
          {
            urls: 'stun:stun.relay.metered.ca:80'
          },
          {
            urls: 'turn:standard.relay.metered.ca:80',
            username: username,
            credential: password
          },
          {
            urls: 'turn:standard.relay.metered.ca:80?transport=tcp',
            username: username,
            credential: password
          },
          {
            urls: 'turn:standard.relay.metered.ca:443',
            username: username,
            credential: password
          },
          {
            urls: 'turn:standard.relay.metered.ca:443?transport=tcp',
            username: username,
            credential: password
          }
        ]
      }
    };

    if (peer) {
      peer.destroy();
      console.log('Destroying previous peer object.');
    }
    let newPeer: Peer;
    if (host === '' && port === '' && path === '') {
      console.log('Defaulting to PeerJS cloud server!');
      newPeer = useTurn ? new Peer('', turnConfig) : new Peer('', {});
      console.log(useTurn);
    } else {
      const options = {
        host: host,
        port: Number(port),
        path: path,
        secure: false
      };
      newPeer = useTurn
        ? new Peer('', Object.assign({}, options, turnConfig))
        : new Peer('', options);
    }
    newPeer.on('open', () => {
      setPeer(newPeer);
      hasConnectedToServer(true);
      console.log('Has connected to server.');
    });
  };

  // Set up to be able to receive connections and messages from counterpart
  useEffect(() => {
    if (peer) {
      peer.on('connection', (conn) => {
        console.log('Received connection from counterpart!');
        conn.on('data', (data) => {
          console.log('Received data from counterpart: ', data);
          setReceivedMessage(data as string);
        });
      });
    }
  }, [peer]);

  const handleServerDisconnect = () => {
    peer?.destroy();
    setPeer(null);
    hasConnectedToServer(false);
    console.log('Has disconnected to server.');
  };

  // Counterpart Connection stuff

  const handleConnectToCounterpart = () => {
    console.log('Entered handle func for connecting to counterpart...');
    if (peer) {
      console.log('Peer exists!');
      if (counterpartConnection) {
        counterpartConnection.close();
        setCounterpartConnection(null);
        setConnectedToCounterpart(false);
        console.log('Closed previous connection to counterpart.');
      }

      const conn = peer.connect(counterpartId);
      console.log('Connecting to counterpart...');
      if (!conn) {
        console.log('Failed to connect to counterpart!');
        return;
      }

      conn.on('error', (err) => {
        console.error('Error occurred:', err);
        setConnectedToCounterpart(false);
      });

      setCounterpartConnection(conn);
      setConnectedToCounterpart(true);
    }
  };

  useEffect(() => {
    if (counterpartConnection) {
      counterpartConnection.on('open', () => {
        console.log('Tentatively connected to counterpart!');

        counterpartConnection.send(
          'Initial greeting from peer id: ' + peer?.id
        );
        console.log('Sent intial greeting!');
      });

      counterpartConnection.on('close', () => {
        console.log('Connection to counterpart closed!');
        setConnectedToCounterpart(false);
      });
    }
  }, [counterpartConnection, peer?.id]);

  // Message stuff
  const handleSendMessage = () => {
    if (counterpartConnection && messageToSend) {
      console.log('Sending message to counterpart: ', messageToSend);
      if (counterpartConnection.open) {
        counterpartConnection.send(messageToSend);
        setMessageToSend('');
      }
    }
  };

  return (
    <>
      <h1>WebRTC Experiment Webclient</h1>
      <h3>Connect to Server</h3>
      <input
        type="text"
        value={host}
        onChange={(e) => setHost(e.target.value.trim())}
        placeholder="Host"
      />
      <input
        type="text"
        value={port}
        onChange={(e) => setPort(e.target.value.trim())}
        placeholder="Port"
      />
      <input
        type="text"
        value={path}
        onChange={(e) => setPath(e.target.value)}
        placeholder="Path"
      />
      <button onClick={handleServerConnect}>Connect</button>

      <h4>Use TURN Server? (Currently hardcoded to use Metered Relay) </h4>
      <label className="switch">
        <input
          type="checkbox"
          checked={useTurn}
          onChange={(e) => setUseTurn(e.target.checked)}
        />
      </label>

      {useTurn && (
        <div>
          <label htmlFor="username">Username:</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <label htmlFor="password">Credential:</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
      )}

      <hr />
      {connectedToServer && (
        <>
          <h3>You connected to server!</h3>
          <p>My ID: {peer?.id}</p>
        </>
      )}
      {connectedToServer && (
        <>
          <button onClick={handleServerDisconnect}>
            Disconnect from Server
          </button>
        </>
      )}

      <hr />
      {connectedToServer && (
        <>
          <input
            type="text"
            value={counterpartId}
            onChange={(e) => setCounterpartId(e.target.value.trim())}
            placeholder="Input counterpart's ID!"
          />
          <button onClick={handleConnectToCounterpart}>Connect</button>
        </>
      )}

      {connectedToCounterpart && (
        <>
          <h3>Send Message</h3>
          <input
            type="text"
            value={messageToSend}
            onChange={(e) => setMessageToSend(e.target.value)}
            placeholder="Message to send"
          />
          <button onClick={handleSendMessage}>Send</button>
          <h3>Received Message</h3>
          <textarea disabled value={receivedMessage} />
        </>
      )}
    </>
  );
}

export default App;
