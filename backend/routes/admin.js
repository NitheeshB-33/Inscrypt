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





router.post('/regret', (req, res) => {
  // expects req.body = { regret: "...", userId: "..." }
  adminHelper.storeRegret(req.body)
    .then((result) => {
      return res.json({
        status: true,
        analysis: result.analysis,
        recommendedRegret: result.recommendedRegret
      });
    })
    .catch((err) => {
      console.error('/regret error:', err);
      return res.status(500).json({ status: false, message: 'Something went wrong' });
    });
});











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



module.exports = router;
