const dotenv = require('dotenv');
dotenv.config();

const { connectDB } = require('./config/db');
const app = require('./app');

const PORT = process.env.PORT || 3000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`API running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('DB connection failed:', err?.message || err);
    process.exit(1);
  });
