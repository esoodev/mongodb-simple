/**
 * Methods pertaining to various mongodb operations.
 */

var MongoClient = require('mongodb').MongoClient
var assert = require('assert')

module.exports = {

    searchDocuments: function (search, collection_name, db_url) {
        return new Promise((resolve, reject) => {

            MongoClient.connect(db_url, (err, db) => {
                var collection = db.collection(collection_name);

                collection.find(search).toArray(function (err, docs) {
                    if (err) reject(err);
                    db.close();
                    resolve(docs);
                });
            });
        });
    },

    getAllDocuments: function (collection_name, db_url) {
        return new Promise((resolve, reject) => {

            MongoClient.connect(db_url, (err, db) => {
                var collection = db.collection(collection_name);

                collection.find({}).toArray(function (err, docs) {
                    if (err) reject(err);
                    db.close();
                    resolve(docs);
                });
            });
        });
    },

    insertDocuments: function (documents, collection_name, db_url) {
        return new Promise((resolve, reject) => {

            MongoClient.connect(db_url, (err, db) => {
                var collection = db.collection(collection_name);

                collection.insertMany(documents, function (err, result) {
                    if (err) reject(err);

                    assert.equal(documents.length, result.result.n);
                    assert.equal(documents.length, result.ops.length);

                    console.log('Inserted ' + documents.length + ' documents into \"' + collection_name + '\" document collection');
                    db.close();
                    resolve(documents);
                });
            });
        });
    },

    createCollection: function (name, db_url) {

        return new Promise((resolve, reject) => {

            MongoClient.connect(db_url, (err, db) => {
                db.createCollection(name, {}, function (err, result) {
                    if (err) reject(err);

                    db.listCollections({
                        name: name
                    }).toArray(function (err, names) {
                        assert.equal(1, names.length);
                        db.close();
                        resolve();
                    });
                });
            });
        });

    },

    dropCollection: function (name, db_url) {

        return new Promise((resolve, reject) => {

            MongoClient.connect(db_url, (err, db) => {
                db.dropCollection(name, {}, function (err, result) {
                    if (err) reject(err);

                    db.listCollections({
                        name: name
                    }).toArray(function (err, names) {
                        assert.equal(0, names.length);
                        db.close();
                        resolve();
                    });
                });
            });
        });
    }

}