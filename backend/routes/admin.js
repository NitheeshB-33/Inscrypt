var express = require('express');
var router = express.Router();
var adminHelper=require('../helpers/admin-helpers.js');
const { response } = require('../app');


router.get('/', function(req, res, next) {
   res.json({ message: "Admin API working 🚀" });
});

// router.post('/regret',(req,res)=>{
//   console.log(req.body);
  
//   adminHelper.storeRegret(req.body).then((response)=>{
//     res.json(response)
//   })
// })




//ml implementation
// router.post('/regret', (req, res) => {
//   // expects req.body = { regret: "...", userId: "..." }
//   adminHelper.storeRegret(req.body)
//     .then((result) => {
//       return res.json({
//         status: true,
//         analysis: result.analysis,
//         recommendedRegret: result.recommendedRegret
//       });
//     })
//     .catch((err) => {
//       console.error('/regret error:', err);
//       return res.status(500).json({ status: false, message: 'Something went wrong' });
//     });
// });
router.post('/regret', async (req, res) => {
  try {
    const result = await adminHelper.storeRegret(req.body);

    // 🚨 REQUIRED CHECK (Feature 3)
    if (result.blocked) {
      return res.json({
        status: false,
        blocked: true,
        message: "Your message contains harmful or inappropriate content. Please rephrase and try again."
      });
    }

    // ✅ Normal successful flow
    return res.json({
      status: true,
      analysis: result.analysis,
      recommendedRegret: result.recommendedRegret,
      supportiveTip: result.supportiveTip,
      highDistress: result.highDistress,
      therapySuggestion: result.therapySuggestion
    });

  } catch (err) {
    console.error('/regret error:', err);
    return res.status(500).json({
      status: false,
      message: 'Something went wrong'
    });
  }
});



router.get('/therapists', async (req, res) => {
  try {
    const therapists = await adminHelper.getActiveTherapists();
    res.json({ status: true, therapists });
  } catch (err) {
    res.status(500).json({ status: false });
  }
});





//ml implementation










router.post('/signup',(req,res)=>{
  adminHelper.doUserSignup(req.body).then((response)=>{
    if(response.status){
    // res.json({message:"user registered",username:response.userData.username})
    res.json(response)
    console.log(response);
    
    console.log("successfully registered");
    }else{
      res.status(400).json({ error: "Email already exists",user:response.userData });
    }
  }).catch(err => res.status(500).json({ error: err.message }))
})

router.post('/login',(req,res)=>{
  adminHelper.doUserLogin(req.body).then((response)=>{
    if(response.status){
      // res.json({message:"user logged",username:response.username})
      res.json(response)
      console.log("successfully looged"+response.username);
      console.log(response);
      
      
    }else{
      res.status(400).json({ error: "invalid loggin",user:response.userData });
    }
  }).catch(err => res.status(500).json({ error: err.message }))
})

router.post('/favourite',(req,res)=>{
  // console.log("favourite"+req.body);
  console.log("favourite payload:\n", JSON.stringify(req.body, null, 2));
  
  adminHelper.addFavourite(req.body).then((response)=>{
    res.json({message:"added successfully"})
  })
})

router.post('/list', (req, res) => {
  console.log("list user id", JSON.stringify(req.body, null, 2));
  adminHelper.returnFavourites(req.body).then((response) => {
    if (response && response.length > 0) {
      const formatted = response.map((doc) => ({
        regret: doc.returnregret.regret,
        regretId: doc.returnregret._id
      }));
      res.json({ regrets: formatted });
    } else {
      res.json({ regrets: [], message: "No regrets found for this user." });
    }
  }).catch(err => res.status(500).json({ error: err.message }));
});

router.post('/delete', (req, res) => {
  console.log("delete item", JSON.stringify(req.body, null, 2));
  adminHelper.deleteItem(req.body)
    .then((response) => {
      res.status(200).json({ success: true, message: "Regret deleted", result: response });
    })
    .catch((err) => {
      res.status(500).json({ success: false, message: "Deletion failed", error: err });
    });
});













//admin part
router.post('/adminLogin',(req,res)=>{
  adminHelper.doAdminLogin(req.body).then((response)=>{
    if(response.status){
      res.json({message:"admin logged"})
      console.log("successfully looged");
      
    }else{
      res.status(400).json({ error: "invalid loggin"});
    }
  }).catch(err => res.status(500).json({ error: err.message }))
})










// Get all therapists
router.get('/admin/therapists', async (req, res) => {
  const therapists = await adminHelper.getAllTherapists();
  res.json(therapists);
});

// Enable / Disable therapist
router.post('/admin/therapist-status', async (req, res) => {
  const { therapistId, isActive } = req.body;
  await adminHelper.toggleTherapistStatus(therapistId, isActive);
  res.json({ status: true });
});

// Add therapist
router.post('/admin/add-therapist', async (req, res) => {
  await adminHelper.addTherapist(req.body);
  res.json({ status: true });
});






// router.get('/all-users',(req,res)=>{
//   adminHelper.getAllUsers().then((response)=>{
//     res.json(response)
//   })
// })
router.get('/all-users', async (req, res) => {
  try {
    const users = await adminHelper.getAllUsersWithFlagCount();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
});


router.post('/deleteUser',(req,res)=>{
   const { userId } = req.body;
  adminHelper.deleteUser(userId).then((response)=>{
    res.json(response)
  })
})


router.get('/admin-dashboard', async (req, res) => {
  try {
    const data = await adminHelper.getAdminAnalytics();
    res.json({ status: true, data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: false });
  }
});

router.get('/all-flagged', async (req, res) => {
  try {
    const flagged = await adminHelper.getAllFlaggedRegrets();
    res.json(flagged);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch flagged regrets" });
  }
});





module.exports = router;
