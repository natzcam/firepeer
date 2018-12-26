# firepeer

Secure p2p signalling and authentication for [simple-peer](https://github.com/feross/simple-peer) using [firebase realtime database](https://firebase.google.com/docs/database/).

## Setup firebase

1. [Create a firebase project and setup the javascript client SDK](https://firebase.google.com/docs/database/web/start).

2. Add these security rules in the firebase console to secure the signalling data.

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
                  ".validate": "newData.hasChildren(['sdp', 'type'])",
                  "sdp": {
                    ".validate": "newData.isString() && newData.val().length < 4000"
                  },
                  "type": {
                    ".validate": "newData.val() == 'offer' || newData.val() == 'answer' || newData.val() == 'error'"
                  }
                }
              }
            }
          }
        }
      }
    }
    ```

    Signaling data is exchanged in `/peers/$uid/$id/$otherUid/$otherId`. Security rules ensure that only the intended users can access signalling data and the signals are valid.

    > Shortcut: `https://console.firebase.google.com/project/<YOUR_PROJECT_ID>/database/rules`


3. Enable your prefered sign-in method in the firebase console. Firepeer requires authentication so at the very least you have to select [anonymous authentication](https://firebase.google.com/docs/auth/web/anonymous-auth).

    > Shortcut: `https://console.firebase.google.com/project/<YOUR_PROJECT_ID>/authentication/providers`

### Install
```js
npm install --save firepeer
```
```html
<script src="https://cdn.jsdelivr.net/npm/firepeer@<FIREPEER_VERSION>/lib/firepeer.min.js"></script>
```

### Usage

```javascript
//alice side

firebase.initializeApp({
  //values from firebase console
});

const alice = new FirePeer(firebase);

console.log(alice.id) // peer id of alice

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

console.log(bob.id) // id

//authenticate
await firebase.auth().signInWith*()

console.log(bob.uid) // peer id of bob

// wait for connection and receive message
bob.on('connection', (connection)=>{
    connection.on('data', (data)=>{
        console.log(data) //hello
    })
})
```

Connections are just instances of [simple-peer](https://github.com/feross/simple-peer#api) already connected!

## [Reference](https://natzcam.github.io/firepeer)

## [Demo](https://firepeer-demo.firebaseapp.com)
