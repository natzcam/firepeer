# firepeer

secure signalling and authentication for [simple-peer](https://github.com/feross/simple-peer) using [firebase realtime database](https://firebase.google.com/docs/database/).

## Getting Started

### setup firebase

Create a firebase project and setup the JS client SDK.

- https://firebase.google.com/docs/web/setup
- https://firebase.google.com/docs/database/web/start

### configure security rules

> If you are not yet familiar with firebase security rules, head over to https://firebase.google.com/docs/database/security.

Add these security rules in the firebase console to secure the signalling data.

```json
{
  "rules": {
    "peers": {
      "$uid": {
        "$id": {
          "offers": {
            ".read": "auth != null && auth.uid == $uid",
            ".write": "auth != null && auth.uid == $uid",
            "$offerId": {
              ".read": "auth != null && data.child('uid').val() == auth.uid",
              ".write": "auth != null && !data.exists() && newData.child('uid').val() == auth.uid"
            }
          }
        }
      }
    }
  }
}
```

> `$uid` - variable containing user id
> `$id` - variable containing client id, users can have multiple clients

```json
// Ensures that user `$uid` is the only one who has read access to the offers received
// and write access to send an answer on `/peers/$uid/$id/offers/$offerId/answer`
"/peers/$uid/$id/offers":
    ".read": "auth != null && auth.uid == $uid",
    ".write": "auth != null && auth.uid == $uid"
```


```json
// Ensures that the user who sent an offer only has read and one-time write access to that specific offer. 
// Also guarantees that `/peers/$uid/$id/offers/$offerId/uid` is the uid of the user who sent that offer. 
// Crucial in authenticating the other peer.
"/peers/$uid/$id/offers/$offerId":
    ".read": "auth != null && data.child('uid').val() == auth.uid",
    ".write": "auth != null && !data.exists() && newData.child('uid').val() == auth.uid"
```



### enable sign-in method

By default, firebase does not enable any sign-in method. You will have to enable one in the firebase console. Right now, firebase supports Email/Password, Phone, Google, Facebook, Twitter, Github, or Anonymous sign-in methods.

Shortcut:
`https://console.firebase.google.com/u/0/project/<YOUR_PROJECT_ID>/authentication/providers`

- https://firebase.google.com/docs/auth/web/start

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
const connection = await alice.connect(<uid of bob>, <client id>);

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

- firebase - firebase instance
- options
  ```javascript
  interface FirePeerOptions {
    id?: string
    spOpts?: SimplePeer.Options;
    allowOffer?: (offer: Signal) => boolean;
  }
  ```
  - **id** - the client id. If not specified,then a client id will be generated
  - **spOpts** - [SimplePeer](https://github.com/feross/simple-peer#api) options
  - **allowOffer** - tests whether to allow an offer to proceed
  ```javascript
    allowOffer: function(offer) {
      return window.confirm(offer.id + " would like to connect.");
    }
  ```

### `firepeer.on('connection', (peer: SimplePeer.Instance) => void): this`

Fired when a new connection is established.

> `peer` is an instance of SimplePeer with a additional fields:
> `peer.uid` - the uid of the other peer
> `peer.id` - the client id of the other peer

### `firepeer.connect(uid: string, id: string): Promise<SimplePeer.Instance>`

Establish a new connection with a client identified by a user `uid` and client id `id`
Returns a Promise that resolves a SimplePeer instance.

## Demo

P2P chat made with firepeer in 100 lines of JS, more or less. :D

- https://firepeer-demo.firebaseapp.com
- https://github.com/natzcam/firepeer-demo
