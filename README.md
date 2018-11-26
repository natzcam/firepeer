# firepeer

secure signalling and authentication for [simple-peer](https://github.com/feross/simple-peer) using [firebase realtime database](https://firebase.google.com/docs/database/).

## Getting Started

### setup firebase

Create a firebase project and setup the JS client SDK.
* https://firebase.google.com/docs/web/setup
* https://firebase.google.com/docs/database/web/start

### configure security rules

Add these security rules in the firebase console to secure the signalling data.

```json
{
  "rules": {
    "peers": {
      "$uid": {
        "offers": {
          ".read": "auth != null && auth.uid == $uid",
          ".write": "auth != null && auth.uid == $uid",
          "$offerId": {
            ".read": "auth != null && data.child('uid').val() == auth.uid",
            ".write": "auth != null && !data.exists() && newData.child('uid').val() == auth.uid",
          }
        }
      }
    }
  }
}
```
```json
"/peers/$uid/offers":
    ".read": "auth != null && auth.uid == $uid",
    ".write": "auth != null && auth.uid == $uid"      
```
Ensures that offers are private to a user and can't be read or written by anyone else. Also, provides the user the ability to write an answer to an offer at `/peers/$uid/offers/$offerId/answer`.

```json
"/peers/$uid/offers/$offerId":
    ".read": "auth != null && data.child('uid').val() == auth.uid",
    ".write": "auth != null && !data.exists() && newData.child('uid').val() == auth.uid"
```
Ensures that only the user who sent the offer has read and one-time write access to that specific offer. Also guarantees that `/peers/$uid/offers/$offerId/uid` is the uid of the user who sent that offer. Crucial in authenticating the other peer.

* https://firebase.google.com/docs/database/security

### enable sign-in method
By default, firebase does not enable any sign-in method. You will have to enable one in the firebase console. Right now, firebase supports Email/Password, Phone, Google, Facebook, Twitter, Github, or Anonymous sign-in methods.

Shortcut:
`https://console.firebase.google.com/u/0/project/<YOUR_PROJECT_ID>/authentication/providers`


* https://firebase.google.com/docs/auth/web/start

### install
```html
npm install --save firepeer

-or-

<script src="https://cdn.jsdelivr.net/npm/firepeer@<FIREPEER_VERSION>/build/lib/firepeer.min.js"></script>
```

### use firepeer

```javascript
//alice side

firebase.initializeApp({
  //values from firebase console
});

const alice = new FirePeer(firebase);

//authenticate with the sign-in method you enabled in the console
await firebase.auth().signInWith*() 

// wait for connection
const connection = await alice.connect(***<uid of bob>***);

// send a mesage to bob
connection.send('hello')
```

```javascript
// bob side

firebase.initializeApp({
  //values from firebase console
});

const bob = new FirePeer(firebase);

//authenticate
await firebase.auth().signInWith*()

// wait for connection and receive message
bob.on('connection', (connection)=>{
    connection.on('data', (data)=>{
        console.log(data) //hello
    })
})
```

> **Connections are just instances of [SimplePeer](https://github.com/feross/simple-peer#api) already connected!**

## API
### `firepeer = new FirePeer(firebase, options?: FirePeerOptions)`
* firebase - firebase instance
* options
    ```javascript
    interface FirePeerOptions {
      spOpts?: SimplePeer.Options;
      peersPath?: string;
      offersPath?: string;
      answerPath?: string;
      uidPath?: string;
      allowOffer?: (offer: Signal) => boolean;
    }
    ```
    * spOpts - [SimplePeer](https://github.com/feross/simple-peer#api) constructor options.
    * *path parameters -
    `/{peersPath}/$uid/{offersPath}/$offerId/{uidPath}`
    `/{peersPath}/$uid/{offersPath}/$offerId/{answerPath}`
    * allowOffer - tests whether to allow an offer to proceed
    ```javascript
      allowOffer: function(offer) {
        return window.confirm(offer.uid + " would like to connect.");
      }
    ```
### `firepeer.on('connection', (peer: SimplePeer.Instance) => void): this`
Fired when a new connection is established.
`peer` - is an instance of SimplePeer with an additional field `uid`, the uid of the other peer.

### `firepeer.connect(uid: string): Promise<SimplePeer.Instance>`
Establish a new connection with a user identified by `uid`.
Returns a Promise that resolves a SimplePeer instance.

## Demo

P2P chat made with firepeer in 100 lines of JS, more or less. :D

* https://firepeer-demo.firebaseapp.com
* https://github.com/natzcam/firepeer-demo

