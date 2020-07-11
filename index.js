const express = require("express");

const shortid = require("shortid");

const server = express();

server.use(express.json());

let users = [];

//Get to test
server.get("/", (req, res) => {
	res.send("Hello");
});

// Post
server.post("/api/users", (req, res) => {
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
	} catch (err) {
		res.status(500).json({
			errorMessage: "There was an error while saving the user to the database",
			err,
		});
	}
});

// Get
server.get("/api/users", (req, res) => {
	try {
		res.status(200).json(users);
	} catch (err) {
		res.status(500).json({
			errorMessage: "The users information could not be retrieved.",
			err,
		});
	}
});

// Get ID
server.get("/api/users/:id/", (req, res) => {
	const { id } = req.params;
	const searched = users.find((user) => user.id === id);
	try {
		if (searched) {
			res.status(201).json(searched);
		} else {
			res.status(404).json({
				errorMessage: "The user with the specified ID does not exist.",
			});
		}
	} catch (err) {
		res.status(500).json({
			errorMessage: "The user information could not be retrieved.",
			err,
		});
	}
});

// Delete
server.delete("/api/users/:id", (req, res) => {
	const { id } = req.params;
	const deleted = users.find((user) => user.id === id);
	try {
		if (deleted) {
			users = users.filter((user) => user.id !== id);
			res.status(200).json(deleted);
		} else {
			res.status(404).json({
				errorMessage: "The user with the specified ID does not exist",
			});
		}
	} catch (err) {
		res
			.status(500)
			.json({ errorMessage: "The user could not be removed.", err });
	}
});

// Put
server.put("/api/users/:id", (req, res) => {
	const { id } = req.params;
	const updates = req.body;
	const index = users.findIndex((user) => user.id === id);
	try {
		if (index === -1) {
			res.status(404).json({
				errorMessage: "The user with the specified ID does not exist.",
			});
		} else if (!updates.name || !updates.bio) {
			res
				.status(400)
				.json({ errorMessage: "Please provide name and bio for the user." });
		} else {
			updates.id = id;
			users[index] = updates;
			res.status(200).json(users[index]);
		}
	} catch (err) {
		res.status(500).json({
			errorMessage: "The user information could not be modified.",
			err,
		});
	}
});

const PORT = 5000;
server.listen(PORT, () => {
	console.log(`listening on http://localhost:${PORT}`);
});
