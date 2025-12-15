const asyncHandler=require('express-async-handler');
const User=require('../Models/userModel')
const generateToken=require('../config/generateToken')

const topicSynonyms = {
  dsa: ["dsa", "data structure", "data structures", "algorithms", "problem solving"],
  "data structure": ["dsa", "data structure", "data structures", "algorithms"],
  "data structures": ["dsa", "data structure", "data structures", "algorithms"],
  algorithms: ["dsa", "data structure", "data structures", "algorithms"],  // <-- ADD THIS

  ml: ["ml", "machine learning", "ai", "deep learning", "neural networks"],
  "machine learning": ["ml", "machine learning", "ai", "deep learning"],

  cp: ["cp", "competitive programming", "coding", "contests", "codeforces"],
  "competitive programming": ["cp", "competitive programming", "coding"],

  iot: ["internet of things", "hardware", "sensors"],
};


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

  console.log(" Searching Users in DB with:", JSON.stringify(keyword));

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
    return res.status(400).json({ message: "Please provide year and topic" });
  }
  const query = topic.toLowerCase();
  const expandedQueries = topicSynonyms[query] || [query];

  try {
    const seniors = await User.aggregate([
      {
        $search: {
          index: "default",
          text: {
            query: expandedQueries,
            path: ["canGuide", "name", "branch"]
          }
        }
      },
      {
        $project: {
          name: 1,
          email: 1,
          branch: 1,
          year: 1,
          pic: 1,
          canGuide: 1,
          score: { $meta: "searchScore" }
        }
      },
      { $sort: { score: -1 } },
      { $limit: 3 }
    ]);

    res.json(seniors);
  } catch (error) {
    console.error("🔍 Search Error:", error);
    res.status(500).json({ message: "Error fetching seniors" });
  }
});


module.exports={registeredUser,authUser,allUsers,getRecommendedSeniors};