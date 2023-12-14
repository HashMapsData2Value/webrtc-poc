import { useState, useEffect } from "react";
import { Peer, DataConnection } from "peerjs";

function App() {
  const [connectedToServer, hasConnectedToServer] = useState(false);
  const [host, setHost] = useState("localhost");
  const [port, setPort] = useState("9000");
  const [path, setPath] = useState("/peerjs");
  const [peer, setPeer] = useState<Peer | null>(null);
  const [counterpartId, setCounterpartId] = useState("");
  const [connectedToCounterpart, setConnectedToCounterpart] = useState(false);
  const [counterpartConnection, setCounterpartConnection] = useState<DataConnection | null>(null);

  const handleServerConnect = () => {
    if (peer) {
      peer.destroy();
    }
    const newPeer = new Peer(undefined, {
      host: host,
      port: Number(port),
      path: path,
      secure: false,
    });

    newPeer.on("open", () => {
      setPeer(newPeer);
      hasConnectedToServer(true);
    });
  };

  const handleServerDisconnect = () => {
    peer?.destroy();
    setPeer(null);
    hasConnectedToServer(false);
  };


  const handleConnectToCounterpart = () => {
    if (peer) {
      if (counterpartConnection) {
        counterpartConnection.close();
      }

      const conn = peer.connect(counterpartId);
      
      if (!conn) {
        console.log("Failed to connect to counterpart!")
        return;
      
      }
      setCounterpartConnection(conn);
      counterpartConnection?.on("open", () => {
        counterpartConnection.send("hi!");
      });
      
      setConnectedToCounterpart(true);
    }
  }

  return (
    <>
      <h1>WebRTC Experiment Webclient</h1>
      <h3>Connect to Server</h3>
      <input
        type="text"
        value={host}
        onChange={(e) => setHost(e.target.value)}
        placeholder="Host"
      />
      <input
        type="text"
        value={port}
        onChange={(e) => setPort(e.target.value)}
        placeholder="Port"
      />
      <input
        type="text"
        value={path}
        onChange={(e) => setPath(e.target.value)}
        placeholder="Path"
      />
      <button onClick={handleServerConnect}>Connect</button>

      <hr />

      {connectedToServer && (
        <>
          <h3>You connected to server!</h3>
          <p>My ID: {peer?.id}</p>
        </>
      )}
      {connectedToServer && (
        <>
          <button onClick={handleServerDisconnect}>Disconnect from Server</button>
        </>
      )}

      <hr />
      {connectedToServer && (
        <>
      <input
        type="text"
        value={counterpartId}
        onChange={(e) => setCounterpartId(e.target.value)}
        placeholder="Input counterpart's ID!"
        />
      <button onClick={handleConnectToCounterpart}>Connect</button>
        </>
      
      )}
      </>
  );
}

export default App;
