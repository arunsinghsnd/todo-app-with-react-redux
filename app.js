const express = require("express");
const app = express();
const mongoose = require("mongoose");
const PORT = 5000;
const User = require("./models/user");
const Todo = require("./models/todo");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { JWT_SECRET, MOGOURI } = require("./config/keys");

/** ===============Mongodb Conection logic start================*/

mongoose.connect(MOGOURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on("connected", () => {
  console.log("Connected to MongooDB");
});

mongoose.connection.on("error", error => {
  console.log("Error ", error);
});

/** ===============Mongodb Conection logic end================*/

/** ===============Routes logic end================*/

// app.get("/", (req, res) => {
//   res.json({ message: "Hello Wolrd" });
// });

app.use(express.json());

/** ===============Middleware================*/

const requireLogin = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).json({ error: "You Must Be logged in" });
  }
  try {
    const { userId } = jwt.verify(authorization, JWT_SECRET);
    req.user = userId;
    next();
  } catch (err) {
    return res.status(401).json({ error: "You Must Be logged in" });
  }
};

app.get("/test", requireLogin, (req, res) => {
  res.json({ message: req.user });
});

/** ===============Signup API================*/

app.post("/signup", async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(422).json({ error: "please add all the fields" });
    }
    const user = await User.findOne({ email });
    if (user) {
      return res
        .status(422)
        .json({ error: "User already exists with that email" });
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    new User({
      email,
      password: hashedPassword,
    }).save();
    res.status(200).json({ message: "Signup Successfully you can login now" });
  } catch (error) {
    console.log(error);
  }
});

/** ===============Signin API================*/
app.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(422).json({ error: "please add all the fields" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ error: "User doesn't exist with that email" });
    }
    const doMatch = await bcrypt.compare(password, user.password);
    if (doMatch) {
      const token = jwt.sign({ userId: user._id }, JWT_SECRET);
      res.status(201).json({ token });
    } else {
      return res.status(401).json({ error: "Email or Password is Invaild" });
    }
  } catch (error) {
    console.log(error);
  }
});

/** ===============TODO API================*/
app.post("/createtodo", requireLogin, async (req, res) => {
  const data = await new Todo({
    todo: req.body.todo,
    todoBy: req.user,
  }).save();
  res.status(201).json({ message: data });
});

// getting all todo list
app.get("/gettodos", requireLogin, async (req, res) => {
  const data = await Todo.find({
    todoBy: req.user,
  });
  res.status(201).json({ message: data });
});

// deleting todo list
app.delete("/remove/:id", requireLogin, async (req, res) => {
  const removedTodo = await Todo.findOneAndRemove({
    _id: req.params.id,
  });
  res.status(200).json({ message: removedTodo });
});

if (process.env.NODE_ENV === "production") {
  const path = require("path");
  app.get("/", (req, res) => {
    app.use(express.static(path.resolve(__dirname, "client", "build")));
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

app.listen(PORT, () => {
  console.log("Server is running on ", PORT);
});
