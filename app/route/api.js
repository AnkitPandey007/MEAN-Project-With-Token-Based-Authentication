// Now we are going manipulate theuser schema
var User = require("../model/user.js");

var Story = require("../model/story.js"); // .js extension is always optional here

var config = require("../../config"); // [.. mean in parent folder ] 

var secretKey  = config.secretKey;

console.log(secretKey);

var jsonwebtoken = require("jsonwebtoken");

// After imporing jsonwebtoken we need to define a function and make sure this should be outside the module.exports
function createToken(user){
	var token = jsonwebtoken.sign({
		id: user._id,
		name: user.name,
		username: user.username,
	}, secretKey, {
		//expiresInMinutes: 1440
		expiresIn : 60*60*24
	});

	return token;
}

module.exports = function(app, express, io){

	var api = express.Router();

	api.get("/all_stories", function(req, res) {
		Story.find({}, function(err, stories) {
			if (err) {
				res.send(err);
			}
			res.json(stories);
		})
	})
	api.post("/signup", function(req, res){

		var user = new User({

			name: req.body.name, // body is basically body-parser
			username: req.body.username,
			password: req.body.password
		});
		var token = createToken(user);
		
		user.save(function(err){
			if(err){
				res.send(err);
			}

			res.json({ 
				success: true,
				message: "User has been creted",
				token: token
			});
		});
	});


	// Getting all the user
	api.get("/users", function(req, res){
		User.find({}, function(err, users){
			if (err){
				res.send(err);
			}
			res.json(users);
		})
	});

	//Again posting the value to the server
	api.post("/login", function(req, res){
		User.findOne({ // findOne - this method is used to find the specific user or we can say any particular object
			username: req.body.username
		}).select("name username password").exec(function(err, user){
			if (err){
				res.send(err);
			}
			if(!user){
				res.send({ message: "User Does Not Exit"} );
			}else if(user){
				var vlidPassword = user.comparePassword(req.body.password);
				if(!vlidPassword){
					res.send({ message: "Password Does Not Match"});
				} else{
					//// Token
					var token = createToken(user);

					res.json({
						success: true,
						message: "Successfully login!",
						token: token
					});
				}
			}
		});
	});

	// Middleware - if we put this above then code written after the middleware will always be in destination B
	api.use(function(req, res, next){ // Here should be always api.use not the aoo.use(id app.use then it will be the global middile-ware not the api middileware )
		console.log("Somebody just came to our app")
		var token = req.body.token || req.param("token") || req.headers["x-access-token"];

		//check if token exist or not
		if(token) {
			jsonwebtoken.verify(token, secretKey, function(err, decoded){
				if(err) {
					res.status(403).send({ success: false, message: "Faild to authenticate user" });
				} else {
					console.log("The Decoded object is : " + JSON.stringify(decoded));
					req.decoded = decoded;
					next(); // This means go to the next route
				}
			});
		} else {
			res.status(403).send({ success: false, message: "No tojen provided"});
		}
	});

	// Destinaatin B (after middilewre) // provide a legimtimate token
	/*api.get("/", function(req, res) {

		res.send("Hello World");
	});*/

	// Now we going to start method chaining it mean the url will remain same but the http method will keep changing like- POST, GET, PUT etc
	api.route("/")
		.post(function(req,res) {
			console.log("Story text is - " + req.body.content)
			var story = new Story({
				creator: req.decoded.id, // (This is because in req.decoded all three value- id, username, name has been stored(This is the value of the token))
				content: req.body.content
			})
			// Now going to save the story
			story.save(function(err, newStory) {
				if (err) {
					res.send(err);
					return;
				}
				io.emit('story', newStory);
				res.json({ messge: "New Story Created" })
			})
		})
		.get(function(req, res) {
			console.log("inside server API");
			Story.find({ creator: req.decoded.id }, function(err, story) {
				if(err) {
					res.send(err);
					return;
				}
				console.log(" Story --" + story)
				res.json(story);
			})
		})

		// Another API to get the data of middileware function

	api.get("/me", function(req, res) {
		res.json(req.decoded);
	})
	return api;
	
	//  Note -> for log-in functionlity there are two approach (Cookie Based Approach(Old) and Token Based Aunthetication(Modern))

	// Token bsed approach is more scalable than the cookies based bca it not creting session with every request
}