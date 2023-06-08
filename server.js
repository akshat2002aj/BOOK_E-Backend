const app = require('./app');
const dotenv = require('dotenv');
const colors = require('colors');
const connectDb = require('./config/db');
const cloudinary = require('cloudinary');

// Handle Uncaught exception
process.on('uncaughtException', (err, promise) => {
  console.log(`Error : ${err.message}`.red);
  // Close server
  server.close(() => {
    process.exit(1);
  });
});

// Config Dotenv
dotenv.config({ path: './config/config.env' });

console.log(1234567890);
// Connect Database
connectDb();

const PORT = process.env.PORT || 4000;

app.get('/', (req, res) => {
  res.send('Welcome');
});

const server = app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`.blue.bold);
});

// Handle Unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error : ${err.message}`.red.bold);
  // Close server
  server.close(() => {
    process.exit(1);
  });
});
