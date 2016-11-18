## LocalRecord
an ORM for localStorage that works like ActiveRecord

## Getting Started
I did my best to replicate the way ActiveRecord works with these functions,
so that those familiar with the popular ORM can pick up this module right away.

#### .create
When called, the `.create` function takes an argument that is the object that you want to create, it passed anything other than an object - an error will be thrown.
```javascript
localRecord = new LocalRecord()
localRecord.create({ wow: 'cool' }) // <= fine

localRecord.create('myRecord') // <= throws ArgumentError
```

#### referencing records

The `.create` function returns a curried function. So the object isn't written into localStorage until second function is called.

If you'd like to be able to easily reference this object later down the line, you can pass an optional argument to the second function call which would serve as the object's id. Otherwise, a random ID will be dynamically generated.

```javascript
localRecord.create({ wow: 'cool' })('myRecord')

// now this object can be referenced later using .find()
const record = localRecord.find('myRecord') // <= { wow: 'cool' }
```

If you choose to let LocalRecord generate your id, you can retrieve it by searching for its props using `.findBy()`

```javascript
localRecord.create({ wow: 'cool' })() // <= ID is auto-generated

// reference object by querying for its props
const record = localRecord.findBy({ wow: 'cool' }) // <= { wow: 'cool' }
```

...and of course you can query by collection using `.where()`
```javascript
localRecord.create({ height: 'tall', eyes: 'brown' })()
localRecord.create({ height: 'tall', eyes: 'green' })()
localRecord.create({ height: 'tall', eyes: 'blue' })()

const records = localRecord.where({ height: 'tall' })
/* returns [{ height: 'tall', eyes: 'brown'},
            { height: 'tall', eyes: 'green'},
            { height: 'tall', eyes: 'blue'}] */
```

##### Warning
Similar to create, `.findBy()`, and `.where()` will throw an error if passed anything other than an object.
```javascript
localRecord.create({ height: 'tall', eyes: 'brown' })()

const record = localRecord.where('tall')
// throws InvalidArgumentError
```

#### Validations
The reason `.create()` returns a curried function is so that LocalRecord can simulate the `.new` and `.create` validation flow that gives ActiveRecord its reliable flexibility.
```javascript
const newRecord = localRecord.create({ wow: 'neat' })
if (newRecord()) {
  // success control flow
}
else {
  // failure control flow
}
```
The second function call will return false under two conditions:
 - An exact copy of the object already exists in localStorage
 ```javascript
 localRecord.create({ wow: 'cool' })()
 const newRecord = localRecord.create({ wow: 'cool' })

 newRecord() // will return false
 ```
 - The ID parameter that the user passed is already taken
 ```javascript
 localRecord.create({ wow: 'cool' })('myRecord')
 const newRecord = localRecord.create({ ok: 'neat'})

 newRecord('myRecord') // will return false
 ```

If creation was a success, the second function call should return the object that was saved:
```javascript
const newRecord = localRecord.create({ wow: 'neat'})

const mySavedRecord = newRecord()

mySavedRecord // returns { wow: 'neat' }
```
