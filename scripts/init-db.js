const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./src/database/todo.db", (err) => {
	if (err) {
		return console.error(err.message);
	}
	console.log("Connected to the SQLite database.");
});

db.serialize(() => {
	db.run(
		`CREATE TABLE IF NOT EXISTS todos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    completed BOOLEAN NOT NULL DEFAULT 0
  )`,
		[],
		(err) => {
			if (err) {
				return console.error(err.message);
			}
			console.log("Table is created or already exists.");
		},
	);
});

db.close((err) => {
	if (err) {
		return console.error(err.message);
	}
	console.log("Close the database connection.");
});
