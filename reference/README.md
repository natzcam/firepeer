
firepeer
========

secure signalling and authentication for [simple-peer](https://github.com/feross/simple-peer) using [firebase realtime database](https://firebase.google.com/docs/database/).

Getting Started
---------------

### setup firebase

[https://firebase.google.com/docs/web/setup](https://firebase.google.com/docs/web/setup) [https://firebase.google.com/docs/database/web/start](https://firebase.google.com/docs/database/web/start)

Basically, you'll need to create a firebase project and setup the JS client SDK:

```javascript
firebase.initializeApp({
  //values from firebase console
});
```

### configure security rules

You need to configure your [security rules](https://firebase.google.com/docs/database/security) in the [console](https://console.firebase.google.com) like below to secure the signalling data. What this means is only the user with uid of `$uid` can access offers sent by peers (`/peers/$uid/offers`) and only the peer who sent the offer can access the offer (`/peers/$uid/offers/$offerId`) and the corresponding answer (`/peers/$uid/offers/$offerId/answer`). This also guarantees that `/peers/$uid/offers/$offerId/uid` is the uid of the user that sent the offer.

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

### configure authentication method

You will also need to configure your preferred authentication method: `https://console.firebase.google.com/u/0/project/<YOUR PROJECT ID>/authentication/providers`

Right now, firebase supports Email/Password, Phone, Google, Facebook, Twitter, Github, or Anonymous sign-in methods.

More details here: [https://firebase.google.com/docs/auth/web/start](https://firebase.google.com/docs/auth/web/start)

### install firepeer

```sh
npm install firepeer
```

or

```html
<script src="https://cdn.jsdelivr.net/npm/firepeer@0.0.7/build/lib/firepeer.min.js"></script>
```

### use firepeer

```javascript
//alice side
const alice = new FirePeer(firebase);

//authenticate
await firebase.auth().signInWith**() 

// wait for connection
const connection = await alice.connect(<uid of bob>);

// send a mesage to bob
connection.send('hello')
```

```javascript
// bob side
const bob = new FirePeer(firebase);

//authenticate
await firebase.auth().signInWith**()

// wait for connection and receive message
bob.on('connection', (connection)=>{
    connection.on('data', (data)=>{
        console.log(data) //hello
    })
})
```

> Connections are just instances of [SimplePeer](https://github.com/feross/simple-peer#api) already connected!

API
---

## Index

### Classes

* [FirePeer](classes/firepeer.md)

### Interfaces

* [FirePeerOptions](interfaces/firepeeroptions.md)
* [Signal](interfaces/signal.md)

### Functions

* [waitConn](#waitconn)
* [waitData](#waitdata)

---

## Functions

<a id="waitconn"></a>

### `<Const>` waitConn

▸ **waitConn**(firePeer: *[FirePeer](classes/firepeer.md)*): `Promise`<`Instance`>

*Defined in [test/utils.ts:4](https://github.com/natzcam/firepeer/blob/06dbb88/src/test/utils.ts#L4)*

**Parameters:**

| Param | Type |
| ------ | ------ |
| firePeer | [FirePeer](classes/firepeer.md) |

**Returns:** `Promise`<`Instance`>

___
<a id="waitdata"></a>

### `<Const>` waitData

▸ **waitData**(connection: *`Instance`*): `Promise`<`any`>

*Defined in [test/utils.ts:12](https://github.com/natzcam/firepeer/blob/06dbb88/src/test/utils.ts#L12)*

**Parameters:**

| Param | Type |
| ------ | ------ |
| connection | `Instance` |

**Returns:** `Promise`<`any`>

___

