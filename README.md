# firepeer

secure signalling and authentication for [simple-peer](https://github.com/feross/simple-peer) using [firebase realtime database](https://firebase.google.com/docs/database/).

## Getting Started

### setup firebase

Create a firebase project and setup the JS client SDK.

- https://firebase.google.com/docs/web/setup
- https://firebase.google.com/docs/database/web/start

### configure security rules

Add these security rules in the firebase console to secure the signalling data.

```json
{
  "rules": {
    "peers": {
      "$uid": {
        "$id": {
          ".read": "auth != null && auth.uid == $uid",
          ".write": "auth != null && auth.uid == $uid",
          "$otherUid": {
            "$otherId": {
              ".read": "auth != null && auth.uid == $otherUid",
              ".write": "auth != null && auth.uid == $otherUid",
              ".validate": "newData.hasChildren(['sdp', 'type']) || newData.hasChildren(['type', 'error'])",
              "sdp": {
                ".validate": "newData.isString() && newData.val().length < 4000"
              },
              "error": {
                ".validate": "newData.isString() && newData.val().length < 1000"
              },
              "type": {
                ".validate": "newData.val() == 'offer' || newData.val() == 'answer'"
              }
            }
          }
        }
      }
    }
  }
}
```

Signaling data is exchanged in `/peers/$uid/$id/$otherUid/$otherId`.

Security rules ensure that only the intended users can exchange signalling data and the signals are valid.

- https://firebase.google.com/docs/database/security

### enable sign-in method

By default, firebase does not enable any sign-in method. You will have to enable one in the firebase console. Right now, firebase supports Email/Password, Phone, Google, Facebook, Twitter, Github. 

Firepeer requires authentication so at the very least you have to select [Anonymous authentication](https://firebase.google.com/docs/auth/web/anonymous-auth).

- https://firebase.google.com/docs/auth/web/start

### install
```js
npm install --save firepeer
```
```html
<script src="https://cdn.jsdelivr.net/npm/firepeer@<FIREPEER_VERSION>/lib/firepeer.min.js"></script>
```

### use firepeer

```javascript
//alice side

firebase.initializeApp({
  //values from firebase console
});

const alice = new FirePeer(firebase);

console.log(alice.id) // client id of alice

//authenticate with the sign-in method you enabled in the console
await firebase.auth().signInWith*()

console.log(alice.uid) // uid of alice

// connect
const connection = await alice.connect(BOB_UID, BOB_ID);

// send a mesage to bob
connection.send('hello')
```

```javascript
// bob side

firebase.initializeApp({
  //values from firebase console
});

const bob = new FirePeer({
  app: firebase.app()
});

console.log(bob.id) // client id of bob

//authenticate
await firebase.auth().signInWith*()

console.log(bob.uid) // uid of bob

// wait for connection and receive message
bob.on('connection', (connection)=>{
    connection.on('data', (data)=>{
        console.log(data) //hello
    })
})
```

Connections are just instances of [SimplePeer](https://github.com/feross/simple-peer#api) already connected!

## API Reference

https://natzcam.github.io/firepeer

## Demo

- https://firepeer-demo.firebaseapp.com
- https://github.com/natzcam/firepeer-demo
