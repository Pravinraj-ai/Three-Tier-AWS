import { MongoClient, ServerApiVersion } from "mongodb";

import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";

import express from "express";
import cors from "cors";
import session from "express-session";
import bodyParser from "body-parser";

import LoginController from './controllers/controllers_login/login_auth.js';
import AdminController from './controllers/controllers_admin/admin_functions.js';
import UserController from "./controllers/controllers_user/user_functions.js";
import ProfessionalsController from "./controllers/controllers_professionals/professionals_functions.js";

const server_PORT = 4000;
const frontend_URL = "http://localhost:3000";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json()); 
app.use(cors({
    origin: [frontend_URL],
    method: ["GET", "POST"],
    credentials: true,
}));

app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: false,
    maxAge: 1000 * 60 * 60 * 24 * 1,
  }
}));

const db_uri = "mongodb+srv://sabharish:sabharish@sde.4qdjtj6.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(db_uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

// const db_uri = "mongodb://localhost:27017/";
// const client = new MongoClient(db_uri);

async function connectDB() {
  try {
    console.log("[INFO][Database connrction started]");
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("[INFO][Successfully connected to MongoDB]");
  }
  catch (err){
    console.dir
    console.log("[ERROR][Error connecting to MongoDB]");
    console.log(err);
  }
}
connectDB()


LoginController(app, client, jwt);
AdminController(app, client, jwt); 
UserController(app, client, jwt);
ProfessionalsController(app, client, jwt);

console.log("[INFO][Server started]")
app.listen(server_PORT, () => 
    console.log(`[INFO][Server running on port ${server_PORT}]`)
);