# mongodb-simple
Bare to the bone promise-based module for working with MongoDB suited for the simplest projects.


##Usage Examples


### Create a collection.
```
var mongosi = require('mongodb-simple');
mongosi.createCollection('collection_test', 'mongodb://localhost:27017/test');
```

### Drop a collection.
```
var mongosi = require('mongodb-simple');
mongosi.dropCollection('collection_test', 'mongodb://localhost:27017/test');
```

### Search documents from a collection.
```
var mongosi = require('mongodb-simple');

mongosi.searchDocuments(
    { name: "text" },
    'collection_name',
    'mongodb://localhost:27017/test'
).then((result) => {
    console.log(result)
}, (error) => {
    console.log(error)
});
```

### Get all documents from a collection.
```
var mongosi = require('mongodb-simple');

mongosi.getAllDocuments(
    'collection_name',
    'mongodb://localhost:27017/test'
).then((result) => {
    console.log(result)
}, (error) => {
    console.log(error)
});
```

### Insert documents into a collection.
```
var mongosi = require('mongodb-simple');
var documents = [{name: "Nathan Lee", age: 25}, {name: "Yuqing Zhu", age: 21}];

mongosi.insertDocuments(
    documents,  // array of documents
    'collection_name',
    'mongodb://localhost:27017/test'
).then((result) => {
    // returns the inserted documents on success
    console.log(result)
}, (error) => {
    console.log(error)
});
```


##Updates

