const express = require("express");
const bcrypt = require("bcrypt");
const { UserModel, validUser, validLogin, createToken } = require("../models/userModel");
const { auth, authadmin } = require("../middleWares/auth");
const router = express.Router();

// http://localhost:3000/users/myInfo
router.get("/myInfo", auth, async (req, res) => {
 
  try {
    let userInfo = await UserModel.findOne({ _id: req.tokenData._id }, { password: 0 });
    res.json(userInfo);
  }
  catch (err) {
    console.log(err)
    res.status(500).json({ msg: "err", err })
  }
})

// http://localhost:3000/users/usersList   -> send token admin
router.get("/usersList", authadmin, async (req, res) => {
  
  try {
    let data = await UserModel.find({}, { password: 0 });
    res.json(data)
  }
  catch (err) {
    console.log(err)
    res.status(500).json({ msg: "err", err })
  }
})

// http://localhost:3000/users
router.post("/", async (req, res) => {
  let validBody = validUser(req.body);

  if (validBody.error) {
    return res.status(400).json(validBody.error.details);
  }
  try {
    let user = new UserModel(req.body);
    user.password = await bcrypt.hash(user.password, 10);

    await user.save();
    user.password = "******";
    res.status(201).json(user);
  }
  catch (err) {
    if (err.code == 11000) {
      return res.status(500).json({ msg: "Email already in system, try log in", code: 11000 })

    }
    console.log(err);
    res.status(500).json({ msg: "err", err })
  }
})

// http://localhost:3000/users/login
router.post("/login", async (req, res) => {

  let validBody = validLogin(req.body);
  if (validBody.error) {
    return res.status(400).json(validBody.error.details);
  }
  try {
    let user = await UserModel.findOne({ email: req.body.email })
    if (!user) {
      return res.status(401).json({ msg: "Password or email is worng ,code:2" })
    }

    let authPassword = await bcrypt.compare(req.body.password, user.password);
    if (!authPassword) {
      return res.status(401).json({ msg: "Password or email is worng ,code:1" });
    }

    let token = createToken(user._id, user.role);
    res.json({ token });
  }
  catch (err) {
    console.log(err)
    res.status(500).json({ msg: "err", err })
  }
})

// http://localhost:3000/users/:idDel     -> send token admin
router.delete("/:idDel", authadmin, async (req, res) => {
  try {

    let data = await UserModel.deleteOne({ _id: req.params.idDel });
    res.json(data);

  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Error", err });
  }
});

// http://localhost:3000/users/:idEdit     -> send token admin or user
router.put("/:editId", auth, async (req, res) => {
  let validBody = validUser(req.body);
  if (validBody.error) {
    return res.status(400).json(validBody.error.details);
  }
  try {
    let editId = req.params.editId;
    let data;
    if (req.body.password) {
      req.body.password = await bcrypt.hash(req.body.password, 10);
    }
    if (req.tokenData.role == "ADMIN") {
      data = await UserModel.updateOne({ _id: editId }, req.body)
    }
    else if (editId == req.tokenData._id) {
      data = await UserModel.updateOne({ _id: editId, user_id: req.tokenData._id }, req.body)
    }
    else {
      return res.status(401).json({ msg: "Sorry, you do not have permission to update" });
    }
    res.json(data)
  }

  catch (err) {
    console.log(err);
    res.status(500).json({ msg: "err", err })
  }
})

module.exports = router;