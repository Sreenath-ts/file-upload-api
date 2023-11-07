const express = require("express");
const mongoose = require("mongoose");
const env = require("dotenv");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const adminRoutes = require('./routes/admin');
const filesRoutes = require('./routes/files')
// Create Express app
const app = express();
//Configs
env.config();

// Connect to MongoDB
mongoose
  .connect(process.env.dbBase)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

  // Middleware
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(morgan("dev"));
const corsOptions = {
    origin: Object.values(JSON.parse(process.env.CORS_ALLOWED_URLS)),
    methods: "GET, POST, PUT, DELETE, PATCH",
    allowedHeaders: "Content-Type, Authorization",
    credentials: true,
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  };
  
  app.use(cors(corsOptions));
  app.disable("x-powered-by");
  // Routes
app.use("/auth", authRoutes);
app.use("/account", userRoutes);
app.use('/admin',adminRoutes)
app.use("/files",filesRoutes)
// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});