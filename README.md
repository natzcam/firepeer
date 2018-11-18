
firepeer
========

secure signalling and authentication for [simple-peer](https://github.com/feross/simple-peer) using [firebase realtime database](https://firebase.google.com/docs/database/).

## setup firebase

Follow the instructions here:
1. https://firebase.google.com/docs/web/setup
2. https://firebase.google.com/docs/database/web/start.

Basically, you'll need to create a firebase project and setup the JS client SDK:
```javascript
  firebase.initializeApp({
      //values from firebase console
  });
```

You will also need to add these in your [security rules](https://firebase.google.com/docs/database/security) through the [console](https://console.firebase.google.com).  

```javascript
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

## install firepeer
```sh
npm install firepeer
```
or
```html
<script src="https://cdn.jsdelivr.net/npm/firepeer@0.0.7/build/lib/firepeer.min.js"></script>
```

## use firepeer
```javascript
//alice side

const cred = await firebase.auth().signInWith**() //sign in with any method as alice;

const firepeer = new FirePeer({
  user: cred.user,
  ref: firebase.database().ref(`/users/${cred.user.uid}`)
});

// initiate connection
const connection = await alice.connect(firebase.database.ref('users/<uid of bob>'));

// send a mesage to bob
connection.send('hello')
```
```javascript
// bob side

// create a receiver
const cred = await firebase.auth().signInWith**() //sign in with any method as bob;

const firepeer = new FirePeer({
  user: cred.user,
  ref: firebase.database().ref(`/users/${cred.user.uid}`)
});

// wait for connection and receive message
receiver.on('connection', (connection)=>{
    connection.on('data', (data)=>{
        console.log(data) //hello
    })
})
```
## how this works?
When a reference is passed through `new FirePeer()`, firepeer will create a child name `offers` under that reference and listen to any child_added event on that node. When a reference is passed through `.connect()`, firepeer will create a new child under `offers`.

The rules ensure that only user with $uid, will read and write access

Use firepeer to establish a p2p connection:


> Connections are just instances of [SimplePeer](https://github.com/feross/simple-peer#api) already connected!

