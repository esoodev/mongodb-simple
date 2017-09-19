# mongodb-simple
Bare to the bone promise-based module for working with MongoDB suited for the simplest projects.


##Usage Examples


### Connection string
```
const connection = {
    uri: "localhost:27017",
    username: "nathan",
    password: "yqz992022"
}
```

### Create a collection.
```
var mongosi = require('mongodb-simple')
mongosi.createCollection(connection, 'users')
```

### Drop a collection.
```
var mongosi = require('mongodb-simple')
mongosi.dropCollection(connection, 'users')
```

### Search documents from a collection.
```
var mongosi = require('mongodb-simple')

mongosi.searchDocuments(connection, 'users', {
    lastname: 'Lee'
}).then((result) => {
    console.log(result)
}, (error) => {
    console.log(error)
})
```

### Find a document by its ID from a collection.
```
var mongosi = require('mongodb-simple')

mongosi.getDocumentById(connection, 'users', "59bf5b06705d282d3072effb"
).then((result) => {
    console.log(result)
}, (error) => {
    console.log(error)
})
```

### Get all documents from a collection.
```
var mongosi = require('mongodb-simple')

mongosi.getAllDocuments(connection, 'users'
).then((result) => {
    console.log(result)
}, (error) => {
    console.log(error)
})
```

### Insert documents into a collection.
```
var mongosi = require('mongodb-simple')
var users = [{name: "Nathan Lee", age: 25}, {name: "Yuqing Zhu", age: 21}]

mongosi.insertDocuments(connection, 'users', users)
.then((result) => {
    // returns the inserted documents on success
    console.log(result)
}, (error) => {
    console.log(error)
})
```

### Add a user.
```
var mongosi = require('mongodb-simple')
var roles = 
{
    roles: [{
        role: "root",
        db: "admin"
    }]
}

mongosi.addUser(connection, 'nathan', 'password', roles)
```

### Add an admin.
```
var mongosi = require('mongodb-simple')

mongosi.addAdmin(connection, 'nathan', 'password')
```

### Remove an user.
```
var mongosi = require('mongodb-simple')

mongosi.removeUser(connection, 'nathan')
```



##Updates
###1.1.0
Added authentication. Additional functionalities.
Now uses connection string.

