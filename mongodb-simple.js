/**
 * Methods pertaining to various mongodb operations.
 */
var ObjectId = require('mongodb').ObjectID
var MongoClient = require('mongodb').MongoClient
var assert = require('assert')

module.exports = {

    searchDocuments: function (connection, collection_name, search) {

        let url = this._reformUrl(connection.url, connection.username, connection.password)

        return new Promise((resolve, reject) => {

            MongoClient.connect(url, (err, db) => {
                let collection = db.collection(collection_name)

                collection.find(search).toArray(function (err, docs) {
                    if (err) {
                        console.log('Error while searching document ' + search + ' in ' + collection_name + '.\n' + err)
                        db.close()
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

    deleteDocumentsByIds: async function (connection, collection_name, ids) {

        let url = this._reformUrl(connection.url, connection.username, connection.password)

        return new Promise((resolve, reject) => {

            MongoClient.connect(url, (err, db) => {
                let collection = db.collection(collection_name)
                let count = ids.length

                collection.deleteMany({
                    _id: {
                        $in: ids.map((id) => {
                            return ObjectId(id)
                        })
                    }
                }, (err, result) => {
                    db.close()
                    resolve(result)
                })

            })
        })

    },

    getAllDocuments: function (connection, collection_name) {

        let url = this._reformUrl(connection.url, connection.username, connection.password)

        return new Promise((resolve, reject) => {

            MongoClient.connect(url, (err, db) => {
                let collection = db.collection(collection_name)

                collection.find({}).toArray(function (err, docs) {
                    if (err) {
                        console.log(err)
                        db.close()
                        reject(err)
                    }
                    db.close()
                    resolve(docs)
                })
            })
        })
    },

    insertDocuments: function (connection, collection_name, documents) {

        let url = this._reformUrl(connection.url, connection.username, connection.password)

        return new Promise((resolve, reject) => {

            MongoClient.connect(url, (err, db) => {
                let collection = db.collection(collection_name)

                var result = collection.insertMany(documents, function (err, result) {
                    if (err) {
                        console.log(err)
                        db.close()
                        reject(err)
                    }

                    assert.equal(documents.length, result.result.n)
                    assert.equal(documents.length, result.ops.length)

                    console.log('Inserted ' + documents.length + ' documents into \"' + collection_name + '\" document collection')
                    db.close()
                    resolve(result)
                })
            })
        })
    },

    createCollection: function (connection, collection_name) {

        let url = this._reformUrl(connection.url, connection.username, connection.password)

        return new Promise((resolve, reject) => {

            MongoClient.connect(url, (err, db) => {
                db.createCollection(collection_name, {}, function (err, result) {
                    if (err) {
                        console.log('Error while creating collection ' + collection_name + '.\n' + err)
                        db.close()
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

        let url = this._reformUrl(connection.url, connection.username, connection.password)

        return new Promise((resolve, reject) => {

            MongoClient.connect(url, (err, db) => {
                let collection = db.collection(collection_name)

                collection.drop((err, reply) => {
                    if (err) {
                        if (err) {
                            console.log('Error while dropping collection: ' + err)
                            db.close()
                            reject(err)
                        }
                    }
                    console.log('Successfully dropped collection \"' + collection_name + '\"')
                    db.close()
                    resolve(reply)
                })
            })
        })

    },

    addUser: function (connection, username, password, roles) {

        let url = this._reformUrl(connection.url, connection.username, connection.password)

        return new Promise((resolve, reject) => {

            MongoClient.connect(url, (err, db) => {
                if (err) {
                    console.log('Error while adding user ' + username + '.\n' + err)
                    db.close()
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

        let url = this._reformUrl(connection.url, connection.username, connection.password)

        return new Promise((resolve, reject) => {

            MongoClient.connect(url, (err, db) => {
                if (err) {
                    console.log('Error while adding admin.\n' + err)
                    db.close()
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

        let url = this._reformUrl(connection.url, connection.username, connection.password)

        return new Promise((resolve, reject) => {

            MongoClient.connect(url, (err, db) => {
                if (err) {
                    console.log('Error while removing user ' + username + '.\n' + err)
                    db.close()
                    reject(err)
                }

                db.removeUser(username)

                db.close()
                resolve()
            })
        })

    },

    _reformUrl(url, username, password) {

        assert(url, 'Connection URL must be not null.')

        if (username && password)
            return 'mongodb://' + username + ':' + password + '@' + url + '/?authMechanism=SCRAM-SHA-1&authSource=admin'

        return 'mongodb://' + url
    }
}