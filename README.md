## LocalRecord
an object relational mapper for localStorage that works like ActiveRecord, the popular ORM from the Rails framework. I did my best to replicate the way ActiveRecord works with these functions,
so that those coming from Rails can pick this up right away.

### Table of Contents
- [All](https://github.com/pwentz/localRecord#all)
- [Create](https://github.com/pwentz/localRecord#create)
- [Find](https://github.com/pwentz/localRecord#find)
- [FindBy](https://github.com/pwentz/localRecord#findBy)
- [Where](https://github.com/pwentz/localRecord#where)
- [Validations](https://github.com/pwentz/localRecord#validations)
- [Update](https://github.com/pwentz/localRecord#update)
- [CreateProperty](https://github.com/pwentz/localRecord#createProperty)
- [Destroy](https://github.com/pwentz/localRecord#destroy)
- [DestroyAll](https://github.com/pwentz/localRecord#destroyAll)


## Getting Started


## .all()
To retrieve all the objects you have in localStorage, simply use `.all()`
```javascript
// pretend the following items are already in localStorage

// { wow: 'cool'}
// { ok: 'neat' }
// { super: 'awesome' }

const localRecord = new LocalRecord()

console.log(localRecord.all())
// [{ wow: 'cool' }, { ok: 'super' }, { super: 'awesome' }]
```

## .create()
When called, the `.create` function takes an argument that is the object that you want to create, it passed anything other than an object - an error will be thrown.
```javascript
localRecord = new LocalRecord()
localRecord.create({ wow: 'cool' }) // <= fine

localRecord.create('myRecord') // <= throws ArgumentError
```

### .find()

The `.create` function returns a curried function. So the object isn't written into localStorage until second function is called.

If you'd like to be able to easily reference this object later down the line, you can pass an optional argument to the second function call which would serve as the object's id. Otherwise, a random ID will be dynamically generated.

```javascript
localRecord.create({ wow: 'cool' })('myRecord')

// now the object can be referenced later using .find()

const record = localRecord.find('myRecord')

console.log(record)
// { wow: 'cool' }
```

### .findBy()
If you choose to let LocalRecord generate your id, you can retrieve it by searching for its props using `.findBy()`

```javascript
const newRecord = { wow: 'cool', awesome: 'neat' }
localRecord.create(newRecord)() // <= ID is auto-generated

// reference object by querying for its props

const record = localRecord.findBy({ wow: 'cool' })

console.log(record)
{ wow: 'cool', awesome: 'neat' }
```
### .where()
...and of course you can query by collection using `.where()`

```javascript
localRecord.create({ height: 'tall', eyes: 'brown' })()
localRecord.create({ height: 'tall', eyes: 'green' })()
localRecord.create({ height: 'tall', eyes: 'blue' })()

const records = localRecord.where({ height: 'tall' })

console.log(records)
/* [{ height: 'tall', eyes: 'brown'},
    { height: 'tall', eyes: 'green'},
    { height: 'tall', eyes: 'blue'}] */
```

##### Warning
Similar to `.create()`, `.findBy()`, and `.where()` will throw an error if passed anything other than an object.
```javascript
localRecord.create({ height: 'tall', eyes: 'brown' })()

const record = localRecord.where('tall')
// throws InvalidArgumentError
```

## Validations
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
```javascript
// this is useful for memoizing your variables if your jumbling a lot of manual references
const newRecord = localRecord.create({ wow: 'neat' })

const savedRecord = newRecord('mightBeTaken') || newRecord()

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

console.log(mySavedRecord)
// { wow: 'neat' }
```

## .update()
Similar to ActiveRecord's update methods, `.update()` is a slightly more rigid than `.create()` with what it allows.
```javascript
const existingObject = { wow: 'cool',
                         neat: 'okay'}

localRecord.create(existingObject)()

// first argument MUST be the object
// second argument are the changes to be made

const updatedRecord = localRecord.update(existingObject, { wow: 'lets go' })

console.log(updatedRecord)
// { wow: 'lets go', neat: 'okay' }
```
```javascript
localRecord.create({ wow: 'cool' })()

localRecord.update('myObject', { wow: 'ok' })

// throws an InvalidArgumentError first if it doesn't receive an object
```
```javascript
// this record is not saved

const nonExistentRecord = { wow: 'cool' }

localRecord.update(nonExistentRecord, { wow: 'ok' })

// throws a ReferenceError if object does not exist in storage
```

Also, similar to ActiveRecord, you cannot update properties that don't exist on the object
```javascript
const existingObject = { wow: 'cool' }
localRecord.create(existingObject)()

localRecord.update(existingObject, { ok: 'neat' })

// throws an UnknownPropertyError because 'ok' is not a property on existing object
```

If you want to add a property to an existing object, you must use the improvised...

## .createProperty()

`.createProperty()` does not exist on ActiveRecord, but is included to allow users
to further update an existing object in storage.
```javascript
const existingObject = { wow: 'cool' }
localRecord.create(existingObject)()

// first argument is existing object
// second argument is properties you wish to add (can be more than 1)

const newObject = localRecord.createProperty(existingObject, { ok: 'neat', super: 'awesome' })

console.log(newObject)
// { wow: 'cool', ok: 'neat', super: 'awesome' }
```

## .destroy()
`.destroy()` works exactly like you would expect:
```javascript
const existingRecord = { wow: 'ok' }
localRecord.create(existingRecord)()

localRecord.destroy(existingRecord)
// returns { wow: 'ok' }
```
```javascript
const nonExistentRecord = { wow: 'ok' }

localRecord.destroy(nonExistentRecord)
// throws a ReferenceError if record is not in storage
```

## .destroyAll()
`.destroyAll()` also operates much like ActiveRecord's `destroy_all`
```javascript
const firstRecord = { wow: 'ok' }
const secondRecord = { ok: 'neat' }
const thirdRecord = { super: 'awesome' }

localRecord.create(firstRecord)()
localRecord.create(secondRecord)()
localRecord.create(thirdRecord)()

localRecord.destroyAll()
// returns [ { wow: 'ok' }, { ok: 'neat' }, { super: 'awesome' }]
```
