var http = require('http');

//create a server object:
http.createServer(function(req, res) {
    const { method, url } = req;
    const MongoClient = require('mongodb').MongoClient;

    const MONGO_URL = 'mongodb://user:****@ds*******.mlab.com:***/mydb';



    if (req.method === 'POST' && req.url === '/book') {
        let body = [];
        req.on('data', (chunk) => {
            body.push(chunk);
        }).on('end', () => {
            body = Buffer.concat(body).toString();
            const res_data = JSON.parse(body);
            MongoClient.connect(MONGO_URL, (err, db) => {
                if (err) {
                    return console.log(err);
                }
                var collections = db.collection('books');

                // Do something with db here, like inserting a record
                collections.insertOne({
                        title: res_data.title,
                        author: res_data.author,
                        gen: res_data.gen
                    },
                    function(err, res) {
                        if (err) {
                            res.write("err");
                            res.end();
                            db.close();
                            return console.log(err);
                        }
                        // Success
                        db.close();
                    }
                )
            });
            res.write("Posted")
            res.end();
        }).on('error', () => {
            res.write("Error")
            res.end();
        });
    } else {
        if (req.method === 'GET' && req.url === '/listBooks') {
            MongoClient.connect(MONGO_URL, (err, db) => {
                if (err) {
                    res.write("err");
                    res.end();
                }
                var collections = db.collection('books');

                var result = collections.find({}).toArray(function(err, result) {
                    if (err) throw err;
                    res.write(JSON.stringify(result));
                    res.end();
                    console.log(JSON.stringify(result));
                    db.close();
                });

                // Do something with db here, like inserting a record
            });
        } else {
            if (req.method === 'PUT' && req.url === '/update') {
                let body = [];
                req.on('data', (chunk) => {
                    body.push(chunk);
                }).on('end', () => {
                    body = Buffer.concat(body).toString();
                    const res_data = JSON.parse(body);
                    MongoClient.connect(MONGO_URL, function(err, db) {
                        if (err) throw err;
                        var myquery = { title: res_data.old_title };
                        var newvalues = { $set: { title: res_data.new_title, author: res_data.new_author } };
                        db.collection("books").updateOne(myquery, newvalues, function(err, res) {
                            if (err) throw err;
                            console.log("1 document updated");
                            db.close();
                        });
                    });
                    res.write("Updated")
                    res.end();
                }).on('error', () => {
                    res.write("Error")
                    res.end();
                });
            } else {
                if (req.method === 'DELETE' && req.url === '/delete') {
                    let body = [];
                    req.on('data', (chunk) => {
                        body.push(chunk);
                    }).on('end', () => {
                        body = Buffer.concat(body).toString();
                        const res_data = JSON.parse(body);
                        MongoClient.connect(MONGO_URL, function(err, db) {
                            if (err) {
                            	res.write("err");
                            	res.end();
                            }
                            var myquery = { title: res_data.title };
                            db.collection("books").deleteOne(myquery, function(err, obj) {
                                if (err) {
                                    res.write(err);
                                    res.end();
                                }
                                console.log("1 document deleted");
                                db.close();
                            });
                        });
                        res.write("Deleted")
                        res.end();
                    }).on('error', () => {
                        res.write("Error")
                        res.end();
                    });

                } else {
                    res.write("404 not found");
                    res.end();
                }
            }
        }
    }

    //console.log(url);
    //res.write(url); //write a response to the client
    //res.end(); //end the response



}).listen(8080); //the server object listens on port 8080