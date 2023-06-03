const express = require("express")
const { auth } = require("../middleWares/auth");
const { ToyModel, validateToy } = require("../models/toyModel")
const router = express.Router();


//http://localhost:3000/toys
router.get("/", async (req, res) => {

  let perPage = req.query.perPage || 10;
  let page = req.query.page || 1;
  let sort = req.query.sort || "_id";
  let reverse = req.query.reverse == "yes" ? -1 : 1;

  try {
    let data = await ToyModel
      .find({})
      .limit(perPage)
      .skip((page - 1) * perPage)
      .sort({ [sort]: reverse })
    res.json(data);
  }
  catch (err) {
    console.log(err)
    res.status(500).json({ msg: "err", err })
  }
})

// http://localhost:3000/toys/search/?s=plastic
router.get("/search", async (req, res) => {

  let perPage = req.query.perPage || 10;
  let page = req.query.page || 1;
  let sort = req.query.sort || "price";

  try {
    let queryS = req.query.s.toLowerCase();
    let searchReg = new RegExp(queryS, "i");

    let data = await ToyModel.find({
      $or: [
        { name: searchReg },
        { info: searchReg }
      ]
    })
      .limit(perPage)
      .skip((page - 1) * perPage)
      .sort({ [sort]: 1 });

    res.json(data);
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "There is an error, please try again later", err });
  }
});
// http://localhost:3000/toys/category/Doll
router.get("/category/:catname", async (req, res) => {

  let perPage = req.query.perPage || 10;
  let page = req.query.page || 1;
  let sort = req.query.sort || "price";

  try {
    let catname = req.params.catname.toLowerCase();
    let data = await ToyModel.find({ category: { $regex: new RegExp(catname, "i") } })
      .limit(perPage)
      .skip((page - 1) * perPage)
      .sort({ [sort]: 1 });

    res.json(data);
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "There is an error, please try again later", err });
  }

});

// http://localhost:3000/toys   -> send token
router.post("/", auth, async (req, res) => {

  let valdiateBody = validateToy(req.body);

  if (valdiateBody.error) {
    return res.status(400).json(valdiateBody.error.details)
  }

  try {
    let toy = new ToyModel(req.body);
    toy.user_id = req.tokenData._id;
    await toy.save();
    res.status(201).json(toy)
  }
  catch (err) {
    console.log(err)
    res.status(500).json({ msg: "err", err })
  }
})

// http://localhost:3000/toys/647a003290fa7f51e99114a4
router.put("/:idEdit", async (req, res) => {

  let valdiateBody = validateToy(req.body);

  if (valdiateBody.error) {
    return res.status(400).json(valdiateBody.error.details)
  }

  try {
    let idEdit = req.params.idEdit
    let data = await ToyModel.updateOne({ _id: idEdit }, req.body)
    res.json(data);
  }

  catch (err) {
    console.log(err)
    res.status(500).json({ msg: "err", err })
  }
})

// http://localhost:3000/toys/6479ffe5917eb621bb056aea
router.delete("/:idDel", auth, async (req, res) => {

  try {
    let idDel = req.params.idDel
    let data = await ToyModel.deleteOne({ _id: idDel, user_id: req.tokenData._id })
    res.json(data);
  }

  catch (err) {
    console.log(err)
    res.status(500).json({ msg: "err", err })
  }
})

// localhost:3000/toys/prices/?min=20&max=100
router.get("/prices", async (req, res) => {

  let min = req.query.min || 0;
  let max = req.query.max || Infinity;
  let perPage = req.query.perPage || 10;
  let page = req.query.page || 1;
  let reverse = req.query.reverse == "yes" ? -1 : 1;
  let sort = req.query.sort || "price";

  try {
    let data = await ToyModel
      .find({ price: { $gte: min, $lte: max } })
      .limit(perPage)
      .skip((page - 1) * perPage)
      .sort({ [sort]: reverse })

    res.json(data);
  }

  catch (err) {
    console.log(err)
    res.status(500).json({ msg: "err", err })
  }
})

// http://localhost:3000/toys/single/647a003290fa7f51e99114a4
router.get("/single/:id", async (req, res) => {

  try {
    let id = req.params.id;
    let data = await ToyModel.findById(id);
    res.json(data);
  }

  catch (err) {
    console.log(err);
    res.status(500).json({ msg: "There is an error, please try again later", err });
  }

})

module.exports = router;
