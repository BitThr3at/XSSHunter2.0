'use strict';

const get_app_server = require('./app.js');
const database = require('./database.js');
const database_init = database.database_init;

(async () => {
	// Ensure database is initialized.
	await database_init();

	const app = await get_app_server();

	// Start HTTP server
	const port = process.env.PORT || 8082;
	app.listen(port, () => {
		console.log(`Server running on http://localhost:${port}`);
	});
})();
