/**
 * Methods pertaining to various mongodb operations.
 */
var ObjectId = require('mongodb').ObjectID
var MongoClient = require('mongodb').MongoClient
var assert = require('assert')

module.exports = {

    searchDocuments: function (connection, collection_name, search) {

        var url = this._reformUri(connection.uri, connection.username, connection.password)

        return new Promise((resolve, reject) => {

            MongoClient.connect(url, (err, db) => {
                var collection = db.collection(collection_name)

                collection.find(search).toArray(function (err, docs) {
                    if (err) {
                        console.log('Error while searching document ' + search + ' in ' + collection_name + '.\n' + err)
                        reject(err)
                    }
                    db.close()
                    resolve(docs)
                })
            })
        })
    },

    getDocumentById: async function (connection, collection_name, id) {
        var result = await this.searchDocuments(connection, collection_name, {
            _id: ObjectId(id)
        })

        return result[0]
    },


    getAllDocuments: function (connection, collection_name) {

        var url = this._reformUri(connection.uri, connection.username, connection.password)

        return new Promise((resolve, reject) => {

            MongoClient.connect(url, (err, db) => {
                var collection = db.collection(collection_name)

                collection.find({}).toArray(function (err, docs) {
                    if (err) {
                        console.log(err)
                        reject(err)
                    }
                    db.close()
                    resolve(docs)
                })
            })
        })
    },

    insertDocuments: function (connection, collection_name, documents) {

        var url = this._reformUri(connection.uri, connection.username, connection.password)

        return new Promise((resolve, reject) => {

            MongoClient.connect(url, (err, db) => {
                var collection = db.collection(collection_name)

                collection.insertMany(documents, function (err, result) {
                    if (err) {
                        console.log(err)
                        reject(err)
                    }

                    assert.equal(documents.length, result.result.n)
                    assert.equal(documents.length, result.ops.length)

                    console.log('Inserted ' + documents.length + ' documents into \"' + collection_name + '\" document collection')
                    db.close()
                    resolve(documents)
                })
            })
        })
    },

    createCollection: function (connection, collection_name) {

        var url = this._reformUri(connection.uri, connection.username, connection.password)

        return new Promise((resolve, reject) => {

            MongoClient.connect(url, (err, db) => {
                db.createCollection(collection_name, {}, function (err, result) {
                    if (err) {
                        console.log('Error while creating collection ' + collection_name + '.\n' + err)
                        reject(err)
                    }

                    db.listCollections({
                        name: collection_name
                    }).toArray(function (err, names) {
                        assert.equal(1, names.length, 'Failed creating collection ' + collection_name)
                        db.close()
                        resolve()
                    })
                })
            })
        })

    },

    dropCollection: function (connection, collection_name) {

        var url = this._reformUri(connection.uri, connection.username, connection.password)

        return new Promise((resolve, reject) => {

            MongoClient.connect(url, (err, db) => {
                db.dropCollection(collection_name, {}, function (err, result) {
                    if (err) {
                        console.log('Error while dropping collection ' + collection_name + '.\n' + err)
                        reject(err)
                    }

                    db.listCollections({
                        name: collection_name
                    }).toArray(function (err, names) {
                        assert.equal(0, names.length, 'Failed dropping collection ' + collection_name)
                        db.close()
                        resolve()
                    })
                })
            })
        })

    },

    addUser: function (connection, username, password, roles) {

        var url = this._reformUri(connection.uri, connection.username, connection.password)

        return new Promise((resolve, reject) => {

            MongoClient.connect(url, (err, db) => {
                if (err) {
                    console.log('Error while adding user ' + username + '.\n' + err)
                    reject(err)
                }

                db.addUser(username, password, {
                    roles: roles
                })

                db.close()
                resolve()
            })
        })

    },

    addAdmin: function (connection, username, password) {

        var url = this._reformUri(connection.uri, connection.username, connection.password)

        return new Promise((resolve, reject) => {

            MongoClient.connect(url, (err, db) => {
                if (err) {
                    console.log('Error while adding admin.\n' + err)
                    reject(err)
                }

                db.addUser(username, password, {
                    roles: [{
                        role: "root",
                        db: "admin"
                    }]
                })

                db.close()
                resolve()
            })
        })

    },

    removeUser: function (connection, username) {

        var url = this._reformUri(connection.uri, connection.username, connection.password)
        console.log(uri)

        return new Promise((resolve, reject) => {

            MongoClient.connect(url, (err, db) => {
                if (err) {
                    console.log('Error while removing user ' + username + '.\n' + err)
                    reject(err)
                }

                db.removeUser(username)

                db.close()
                resolve()
            })
        })

    },

    _reformUri(uri, username, password) {

        assert(uri, 'Connection URI must be not null.')

        if (username && password)
            return 'mongodb://' + username + ':' + password + '@' + uri + '/?authMechanism=SCRAM-SHA-1&authSource=admin'

        return 'mongodb://' + uri
    }
}