This project is a summary of this back-end trimester: authentication, NodeJS, MongoDB, Redis, pagination and background processing.

The objective is to build a simple platform to upload and view files:
    This project is a summary of this back-end trimester: authentication, NodeJS, MongoDB, Redis, pagination and background processing.

    User authentication via a token
    List all files
    Upload a new file
    Change permission of a file
    View a file
    Generate thumbnails for images



Here's a concise stucture of the repo:

/project-root
│
├── /controllers
│   ├── AppController.js         # Handles /status and /stats endpoints.
│   ├── AuthController.js        # Handles /connect, /disconnect, and /users/me endpoints.
│   ├── FilesController.js       # Handles /files (GET and POST), /files/:id (GET).
│   └── UsersController.js       # Handles /users (POST).
│
├── /routes
│   └── index.js                 # Routes definitions for the app (GET, POST).
│
├── /utils
│   ├── redis.js                 # RedisClient class for Redis interactions.
│   └── db.js                    # DBClient class for MongoDB interactions.
│
├── /uploads                     # Directory to store uploaded files (can be configured).
│
├── .env                         # Store environment variables (e.g., DB_HOST, DB_PORT, FOLDER_PATH).
├── server.js                    # Main entry point for the server (creates Express app).
├── package.json                 # Node.js project dependencies and scripts.
└── README.md                    # Documentation on how to use the project.

    User authentication via a token
    List all files
    Upload a new file
    Change permission of a file
    View a file
    Generate thumbnails for images
