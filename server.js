/** 
 * Simple CRUD server
 * Written using ES6 syntax
 * Adapted from: https://github.com/zellwk/crud-express-mongo/blob/master/server.js#L31
 * Uses: http://mlabs.com MongoDB free sandbox service.
 */


/** 
 * Specify the port our app will run at. This needs to be the 
 * same as that specified in package.json in the "npm start" script.
 *
 * Load libraries required for the server to work.
 * - 'express'       : NodeJS based web server
 * - 'path'          : simple join of file paths (so we don't have to include  the 
 *                     filesystem path of our local computer)
 * - 'serve-favicon' : find the favicon and use it
 * - 'body-parser'   : adds the ability to process form (POST) requests to the server.
 * - 'mongodb'       : a MongoDB client. This just accesses an existing MongoDB database, 
 *                     and it is still necessary to create or link to a MongoDB database. 
 *                     This demo uses a "sandbox" (free) database account at http://mlabs.com
 */
const port = 9000;
const path = require('path');
const bodyParser= require('body-parser');

// Express 4.x server.
const express = require('express');
const app = express();
const fs = require('fs');

// favicon /public.

// Make /public directory accessible by default.
/** 
 * NOTE: if you make this static, you can't use files in dynamic 
 * app.get and app.post routes - they won't work properly. In other 
 * words, if you put index.html into /public and use the express.static(...) 
 * below, the home page may work, but redirects will NOT work!
 */
app.use(express.static(path.join(__dirname, 'public')));

// Tell Express to use body-parser grab form data and add to the 'req' object.
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());


// Set the view engine
app.set('view engine', 'ejs');

// MongoDB database server.
const MongoClient = require('mongodb').MongoClient;

// Declare MongoDB database reference.
var db;

// MongoDB cloud service (http://mlabs.com)

MongoClient.connect('mongodb://thudley:slapswell@ds029595.mlab.com:29595/lame-quotes', (err, database) => {
	console.log('MongoClient.connect');

	if(err) {
		return console.log(err);
	}
	
	db = database;
	app.listen(process.env.PORT || port, () => {
		console.log('Express listening activated in MongoClient,connect listening on:' + port);
	});

});


// Set up Routes.

// Default GET routes.

// Get index.html from /public folder.
app.get('/read', (req, res) => {

	//res.send('hello, world');
	console.log('rendering index.html');
	fs.readFile('data.json', (err, data) => {  
		if (err) throw err;
		let student = JSON.parse(data);
		console.log(student);
		res.send(student);
		
	});
});


app.post('/quotes', (req, res, next) => {
	console.log('in post');
	var currentSearchResult=req.body;
		


	
	fs.readFile('data.json', function (err, data) {
		var json = JSON.parse(data);
		json.push(currentSearchResult);    
		fs.writeFile("data.json", JSON.stringify(json), function(err){
		  if (err) throw err;
		  console.log('The "data to append" was appended to file!');
		});
	})

});


app.get('/quotes/:id', (req, res) => {
	var result=[];
	fs.readFile('data.json', (err, data) => {  
		if (err) throw err;
		let student = JSON.parse(data);
		console.log(student);
		for(var i=0;i<student.length;i++){
			if(student[i].id==req.params.id){
result.push(student[i]);
			}
		}
		res.send(result);
		
	});
})


