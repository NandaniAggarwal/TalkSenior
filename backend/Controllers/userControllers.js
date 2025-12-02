const asyncHandler=require('express-async-handler');
const User=require('../Models/userModel')
const generateToken=require('../config/generateToken')

const allUsers = asyncHandler(async (req, res) => {
  console.log("🔍 Backend Received Search Query:", req.query.search);
  console.log("🛠 Authenticated User:", req.user);

  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } }, // Case insensitive
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};

  console.log("📡 Searching Users in DB with:", JSON.stringify(keyword));

  try {
      const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
      console.log("✅ Users Found:", users);
      res.send(users);
  } catch (error) {
      console.error("❌ Error Searching Users:", error);
      res.status(500).json({ message: "Error fetching users" });
  }
});

const registeredUser=asyncHandler(async (req,res)=>{
      const {name,email,password,pic,branch,year,canGuide}=req.body;
      if (!name || !email || !password || !branch || !year) {
          res.status(400);
          throw new Error("Please Enter all the Feilds");
      }
      const userExists=await User.findOne({email});
      if (userExists) {
          res.status(400);
          throw new Error("User already exists");
      }
      const user = await User.create({name,email,password,pic,branch,year,canGuide});
      if (user) {
        const token = generateToken(user._id);
          res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            pic: user.pic,
            branch:user.branch,
            year:user.year,
            canGuide:user.canGuide,
            token:token
          });
        } else {
          res.status(400);
          throw new Error("User not found");
        }
});
  
const authUser = asyncHandler(async (req, res) => {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (user && (await user.matchPassword(password))) {
        res.json({
          _id: user._id,
          name: user.name,
          email: user.email,
          pic: user.pic,
          branch: user.branch,
          year: user.year,
          canGuide:user.canGuide,
          token: generateToken(user._id)
        });
      } else {
        res.status(401);
        throw new Error("Invalid Email or Password");
      }
});

const getRecommendedSeniors = asyncHandler(async (req, res) => {
  const { year, topic } = req.query;

  if (!year || !topic) {
    res.status(400);
    throw new Error("Please provide year and topic");
  }

  // 🟣 Normalize case
  const normalizedTopic = topic.toUpperCase();
  const normalizedYear = year.toLowerCase(); // (optional, if your DB stores lower case)

  // 🟣 Fetch seniors (case-insensitive match)
  const seniors = await User.find({
    canGuide: { $in: [normalizedTopic] }   // both sides upper-case now
  }).select("-password");

  // 🟣 Score & sort
  const sorted = seniors.sort((a, b) => {
    let scoreA = 2;
    let scoreB = 2;

    if (a.year.toLowerCase() === normalizedYear) scoreA += 3;
    if (b.year.toLowerCase() === normalizedYear) scoreB += 3;

    return scoreB - scoreA;
  });

  // 🟣 Return top 3
  res.json(sorted.slice(0, 3));
});


module.exports={registeredUser,authUser,allUsers,getRecommendedSeniors};