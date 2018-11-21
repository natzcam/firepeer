[firepeer](../README.md) > [FirePeer](../classes/firepeer.md)

# Class: FirePeer

## Hierarchy

 `EventEmitter`

**↳ FirePeer**

## Index

### Constructors

* [constructor](firepeer.md#constructor)

### Properties

* [defaultMaxListeners](firepeer.md#defaultmaxlisteners)

### Methods

* [addListener](firepeer.md#addlistener)
* [connect](firepeer.md#connect)
* [emit](firepeer.md#emit)
* [eventNames](firepeer.md#eventnames)
* [getMaxListeners](firepeer.md#getmaxlisteners)
* [listenerCount](firepeer.md#listenercount)
* [listeners](firepeer.md#listeners)
* [off](firepeer.md#off)
* [on](firepeer.md#on)
* [once](firepeer.md#once)
* [prependListener](firepeer.md#prependlistener)
* [prependOnceListener](firepeer.md#prependoncelistener)
* [rawListeners](firepeer.md#rawlisteners)
* [removeAllListeners](firepeer.md#removealllisteners)
* [removeListener](firepeer.md#removelistener)
* [setMaxListeners](firepeer.md#setmaxlisteners)
* [listenerCount](firepeer.md#listenercount-1)

---

## Constructors

<a id="constructor"></a>

###  constructor

⊕ **new FirePeer**(fb: *`firebase`*, options?: *[FirePeerOptions](../interfaces/firepeeroptions.md)*): [FirePeer](firepeer.md)

*Defined in [firepeer.ts:32](https://github.com/natzcam/firepeer/blob/06dbb88/src/firepeer.ts#L32)*

**Parameters:**

| Param | Type |
| ------ | ------ |
| fb | `firebase` |
| `Optional` options | [FirePeerOptions](../interfaces/firepeeroptions.md) |

**Returns:** [FirePeer](firepeer.md)

___

## Properties

<a id="defaultmaxlisteners"></a>

### `<Static>` defaultMaxListeners

**● defaultMaxListeners**: *`number`*

*Inherited from EventEmitter.defaultMaxListeners*

*Defined in C:/Users/LMPH-Cam/dev/firepeer/node_modules/@types/node/index.d.ts:1079*

___

## Methods

<a id="addlistener"></a>

###  addListener

▸ **addListener**(event: * `string` &#124; `symbol`*, listener: *`function`*): `this`

*Inherited from EventEmitter.addListener*

*Overrides EventEmitter.addListener*

*Defined in C:/Users/LMPH-Cam/dev/firepeer/node_modules/@types/node/index.d.ts:1081*

**Parameters:**

| Param | Type |
| ------ | ------ |
| event |  `string` &#124; `symbol`|
| listener | `function` |

**Returns:** `this`

___
<a id="connect"></a>

###  connect

▸ **connect**(id: *`string`*): `Promise`<`Instance`>

*Defined in [firepeer.ts:48](https://github.com/natzcam/firepeer/blob/06dbb88/src/firepeer.ts#L48)*

**Parameters:**

| Param | Type |
| ------ | ------ |
| id | `string` |

**Returns:** `Promise`<`Instance`>

___
<a id="emit"></a>

###  emit

▸ **emit**(event: * `string` &#124; `symbol`*, ...args: *`any`[]*): `boolean`

*Inherited from EventEmitter.emit*

*Overrides EventEmitter.emit*

*Defined in C:/Users/LMPH-Cam/dev/firepeer/node_modules/@types/node/index.d.ts:1093*

**Parameters:**

| Param | Type |
| ------ | ------ |
| event |  `string` &#124; `symbol`|
| `Rest` args | `any`[] |

**Returns:** `boolean`

___
<a id="eventnames"></a>

###  eventNames

▸ **eventNames**(): `Array`< `string` &#124; `symbol`>

*Inherited from EventEmitter.eventNames*

*Overrides EventEmitter.eventNames*

*Defined in C:/Users/LMPH-Cam/dev/firepeer/node_modules/@types/node/index.d.ts:1094*

**Returns:** `Array`< `string` &#124; `symbol`>

___
<a id="getmaxlisteners"></a>

###  getMaxListeners

▸ **getMaxListeners**(): `number`

*Inherited from EventEmitter.getMaxListeners*

*Overrides EventEmitter.getMaxListeners*

*Defined in C:/Users/LMPH-Cam/dev/firepeer/node_modules/@types/node/index.d.ts:1090*

**Returns:** `number`

___
<a id="listenercount"></a>

###  listenerCount

▸ **listenerCount**(type: * `string` &#124; `symbol`*): `number`

*Inherited from EventEmitter.listenerCount*

*Overrides EventEmitter.listenerCount*

*Defined in C:/Users/LMPH-Cam/dev/firepeer/node_modules/@types/node/index.d.ts:1095*

**Parameters:**

| Param | Type |
| ------ | ------ |
| type |  `string` &#124; `symbol`|

**Returns:** `number`

___
<a id="listeners"></a>

###  listeners

▸ **listeners**(event: * `string` &#124; `symbol`*): `Function`[]

*Inherited from EventEmitter.listeners*

*Overrides EventEmitter.listeners*

*Defined in C:/Users/LMPH-Cam/dev/firepeer/node_modules/@types/node/index.d.ts:1091*

**Parameters:**

| Param | Type |
| ------ | ------ |
| event |  `string` &#124; `symbol`|

**Returns:** `Function`[]

___
<a id="off"></a>

###  off

▸ **off**(event: * `string` &#124; `symbol`*, listener: *`function`*): `this`

*Inherited from EventEmitter.off*

*Overrides EventEmitter.off*

*Defined in C:/Users/LMPH-Cam/dev/firepeer/node_modules/@types/node/index.d.ts:1087*

**Parameters:**

| Param | Type |
| ------ | ------ |
| event |  `string` &#124; `symbol`|
| listener | `function` |

**Returns:** `this`

___
<a id="on"></a>

###  on

▸ **on**(event: *"connection"*, listener: *`function`*): `this`

*Overrides EventEmitter.on*

*Defined in [firepeer.ts:7](https://github.com/natzcam/firepeer/blob/06dbb88/src/firepeer.ts#L7)*

**Parameters:**

| Param | Type |
| ------ | ------ |
| event | "connection" |
| listener | `function` |

**Returns:** `this`

___
<a id="once"></a>

###  once

▸ **once**(event: * `string` &#124; `symbol`*, listener: *`function`*): `this`

*Inherited from EventEmitter.once*

*Overrides EventEmitter.once*

*Defined in C:/Users/LMPH-Cam/dev/firepeer/node_modules/@types/node/index.d.ts:1083*

**Parameters:**

| Param | Type |
| ------ | ------ |
| event |  `string` &#124; `symbol`|
| listener | `function` |

**Returns:** `this`

___
<a id="prependlistener"></a>

###  prependListener

▸ **prependListener**(event: * `string` &#124; `symbol`*, listener: *`function`*): `this`

*Inherited from EventEmitter.prependListener*

*Overrides EventEmitter.prependListener*

*Defined in C:/Users/LMPH-Cam/dev/firepeer/node_modules/@types/node/index.d.ts:1084*

**Parameters:**

| Param | Type |
| ------ | ------ |
| event |  `string` &#124; `symbol`|
| listener | `function` |

**Returns:** `this`

___
<a id="prependoncelistener"></a>

###  prependOnceListener

▸ **prependOnceListener**(event: * `string` &#124; `symbol`*, listener: *`function`*): `this`

*Inherited from EventEmitter.prependOnceListener*

*Overrides EventEmitter.prependOnceListener*

*Defined in C:/Users/LMPH-Cam/dev/firepeer/node_modules/@types/node/index.d.ts:1085*

**Parameters:**

| Param | Type |
| ------ | ------ |
| event |  `string` &#124; `symbol`|
| listener | `function` |

**Returns:** `this`

___
<a id="rawlisteners"></a>

###  rawListeners

▸ **rawListeners**(event: * `string` &#124; `symbol`*): `Function`[]

*Inherited from EventEmitter.rawListeners*

*Overrides EventEmitter.rawListeners*

*Defined in C:/Users/LMPH-Cam/dev/firepeer/node_modules/@types/node/index.d.ts:1092*

**Parameters:**

| Param | Type |
| ------ | ------ |
| event |  `string` &#124; `symbol`|

**Returns:** `Function`[]

___
<a id="removealllisteners"></a>

###  removeAllListeners

▸ **removeAllListeners**(event?: * `string` &#124; `symbol`*): `this`

*Inherited from EventEmitter.removeAllListeners*

*Overrides EventEmitter.removeAllListeners*

*Defined in C:/Users/LMPH-Cam/dev/firepeer/node_modules/@types/node/index.d.ts:1088*

**Parameters:**

| Param | Type |
| ------ | ------ |
| `Optional` event |  `string` &#124; `symbol`|

**Returns:** `this`

___
<a id="removelistener"></a>

###  removeListener

▸ **removeListener**(event: * `string` &#124; `symbol`*, listener: *`function`*): `this`

*Inherited from EventEmitter.removeListener*

*Overrides EventEmitter.removeListener*

*Defined in C:/Users/LMPH-Cam/dev/firepeer/node_modules/@types/node/index.d.ts:1086*

**Parameters:**

| Param | Type |
| ------ | ------ |
| event |  `string` &#124; `symbol`|
| listener | `function` |

**Returns:** `this`

___
<a id="setmaxlisteners"></a>

###  setMaxListeners

▸ **setMaxListeners**(n: *`number`*): `this`

*Inherited from EventEmitter.setMaxListeners*

*Overrides EventEmitter.setMaxListeners*

*Defined in C:/Users/LMPH-Cam/dev/firepeer/node_modules/@types/node/index.d.ts:1089*

**Parameters:**

| Param | Type |
| ------ | ------ |
| n | `number` |

**Returns:** `this`

___
<a id="listenercount-1"></a>

### `<Static>` listenerCount

▸ **listenerCount**(emitter: *`EventEmitter`*, event: * `string` &#124; `symbol`*): `number`

*Inherited from EventEmitter.listenerCount*

*Defined in C:/Users/LMPH-Cam/dev/firepeer/node_modules/@types/node/index.d.ts:1078*

*__deprecated__*: since v4.0.0

**Parameters:**

| Param | Type |
| ------ | ------ |
| emitter | `EventEmitter` |
| event |  `string` &#124; `symbol`|

**Returns:** `number`

___

