// router.get("/", async (req, res) => {
//   let perPage = Math.min(req.query.perPage, 20) || 4;
//   let page = req.query.page || 1;
//   let sort = req.query.sort || "_id";
//   let reverse = req.query.reverse == "yes" ? -1 : 1;

//   try {
//     let data = await UserModel
//       .find({})
//       .limit(perPage)
//       .skip((page - 1) * perPage)
//       .sort({ [sort]: reverse })
//     res.json(data);
//   }
//   catch (err) {

//     console.log(err)
//     res.status(500).json({ msg: "err", err })
//   }
// })

// router.put("/:idEdit", async (req, res) => {
//   let validBody = validUser(req.body);
//   if (validBody.error) {
//     return res.status(400).json(validBody.error.details);
//   }

//   try {
//     let idEdit = req.params.idEdit;

//     if (req.body.password) {
//       req.body.password = await bcrypt.hash(req.body.password, 10);
//     }

//     let data = await UserModel.updateOne({ _id: idEdit }, req.body);
//     res.json(data);
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ msg: "err", err });
//   }
// });

// אזור שמחזיר למשתמש את הפרטים שלו לפי הטוקן שהוא שולח
// router.get("/myInfo", auth, async (req, res) => {
//   try {
//     let userInfo = await UserModel.findOne({ _id: req.tokenData._id }, { password: 0 });
//     res.json(userInfo);
//   }
//   catch (err) {
//     console.log(err)
//     res.status(500).json({ msg: "err", err })
//   }
// })