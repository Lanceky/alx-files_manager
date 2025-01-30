import express from 'express';
import bodyParser from 'body-parser';
import routes from './routes';
import { dbClient } from './utils/db';  // Assuming DBClient export in utils/db.js

const app = express();

// Middlewares
app.use(bodyParser.json());

// Load routes
app.use(routes);

// Starting the server
const port = process.env.PORT || 5000;
app.listen(port, async () => {
    // Check if DB is alive when the server starts
    if (await dbClient.isAlive()) {
        console.log(`Server running on port ${port}`);
    } else {
        console.log('Database connection failed');
        process.exit(1);
    }
});
