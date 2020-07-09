const express = require("express");

const shortid = require("shortid");

const server = express();

server.use(express.json());

let users = [];


// Post
server.post("api/users", (req, res) => {
	const newUser = req.body;
	newUser.id = shortid.generate();
	try {
		if (!newUser.name || !newUser.bio) {
			res
				.status(400)
				.json({ errorMessage: "Please provide name and bio for the user" });
		} else {
			users.push(newUser);
			res.status(201).json(newUser);
		}
	} catch {
		res
			.status(500)
			.json({
				errorMessage:
					"There was an error while saving the user to the database",
			});
	}
});

const PORT = 5000;
server.listen(PORT, () => {
	console.log(`listening on http://localhost:${PORT}`);
});
