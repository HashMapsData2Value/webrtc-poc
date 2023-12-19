# webrtc-poc

POC of WebRTC for bidirectional message passing.

## Two web clients

- 1. Start up the Peer Server.
- 2. Start up the Web Client server.

The URL for the web client can be opened up in two tabs - these two tabs will constitute two peers communicating with each other.

Provided that you are running the peer server that is part of this project you should be fine with connecting to that server with the default values. However, if you want to try to connect to the cloud-hosted peer server the creators of PeerJs run, empty the input values and then try to connect.

Once you have a UUIDv4 peer identification string in one view, copy+paste it over to the other view and input it into the correct field before pressing connect. Repeat this process vice-versa with the other tab.

If everything went well you will be able to send the counterpart in the other tab a message, and see the messages sent from the counterpart in the receive field.

**Bonus**: Try killing the peer server and see if you can continue to send messages? :-)
