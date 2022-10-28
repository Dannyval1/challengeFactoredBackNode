import express from "express";
import mongoose from "mongoose";
import userDetails from "./userDetails.js";
import cors from "cors";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

const app = express();
app.use(cors());

const JWT_SECRET =
  "hwqproy6ert72839289()aiyg8t87qt72000883uhefiuh78ttq3ifi78272jbkj?[]]pou89ywe";

const mongoUrl =
  "mongodb+srv://dannyvalencia:dannyvalencia@cluster0.tylx68r.mongodb.net/?retryWrites=true&w=majority";

mongoose
  .connect(mongoUrl, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("Connected to database");
  })
  .catch((e) => console.log(e));

app.use(express.json());

const User = mongoose.model("User");

app.post("/register", async (req, res) => {
  const { name, lastname, email, password, position, skills } = req.body;
  const encrypotedPassword = await bcryptjs.hash(password, 10);
  try {
    const oldUser = await User.findOne({ email });
    if (oldUser) {
      return res.send({ error: "User Exists" });
    }
    await User.create({
      name,
      lastname,
      email,
      password: encrypotedPassword,
      position,
      skills,
    });
    res.send({ status: "OK" });
  } catch (error) {
    res.send({ status: "Something went wrong. Try it again!" });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return res.send({ error: "User Not Found" });
  }

  if (await bcryptjs.compare(password, user.password)) {
    const token = jwt.sign({ email: user.email }, JWT_SECRET);

    if (res.status(201)) {
      return res.json({ status: "ok", data: token });
    } else {
      return res.json({ error: "Error" });
    }
  }
  res.json({ status: "error", error: "Invalid Password" });
});

app.post("/profile", async (req, res) => {
  const { token } = req.body;
  try {
    const user = jwt.verify(token, JWT_SECRET);
    const userEmail = user.email;
    User.findOne({ email: userEmail })
      .then((data) => res.send({ status: "ok", data: data }))
      .catch((error) => res.send({ status: "error", data: error }));
  } catch (error) {
    res.send({ status: "error", data: error });
  }
});

app.listen(8080, () => {
  console.log("Server started");
});
