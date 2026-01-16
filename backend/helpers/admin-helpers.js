var db=require('../Config/connection')
var collection=require('../Config/collections')
const { response } = require('../app')
var ObjectId=require('mongodb').ObjectId
const axios = require('axios');//ml implementation
const bcrypt=require('bcrypt')






//ml implementation
// --- ML service caller ---
async function analyzeRegretWithML(text) {
  try {
    const res = await axios.post('http://127.0.0.1:5000/analyze', { text }, { timeout: 30000 });
    // expected: { sentimentScore, sentimentLabel, emotionLabel, category, analyzedAt }
    return res.data;
  } catch (err) {
    console.error('ML service error:', err.message || err);
    // Fallback defaults so app continues to work if ML is down
    return {
      safe: true,
      sentimentScore: 0,
      sentimentLabel: 'Neutral',
      emotionLabel: 'Unknown',
      category: 'Personal choices',
      analyzedAt: new Date().toISOString()
    };
  }
}

// --- Find similar regret based on analysis metadata ---
async function getSimilarRegret(regretsCollection, currentId, analysis) {
  const emotionLabel = analysis.emotionLabel;
  const category = analysis.category;
  const sentimentLabel = analysis.sentimentLabel;

  // 1) strict: same emotion + category + sentiment
  let docs = await regretsCollection.aggregate([
    { $match: { _id: { $ne: currentId }, emotionLabel: emotionLabel, category: category, sentimentLabel: sentimentLabel } },
    { $sample: { size: 1 } }
  ]).toArray();
  if (docs.length > 0) return docs[0];

  // 2) same emotion + category
  docs = await regretsCollection.aggregate([
    { $match: { _id: { $ne: currentId }, emotionLabel: emotionLabel, category: category } },
    { $sample: { size: 1 } }
  ]).toArray();
  if (docs.length > 0) return docs[0];

  // 3) same emotion only
  docs = await regretsCollection.aggregate([
    { $match: { _id: { $ne: currentId }, emotionLabel: emotionLabel } },
    { $sample: { size: 1 } }
  ]).toArray();
  if (docs.length > 0) return docs[0];

  // 4) fallback: any other regret
  docs = await regretsCollection.aggregate([
    { $match: { _id: { $ne: currentId } } },
    { $sample: { size: 1 } }
  ]).toArray();
  if (docs.length > 0) return docs[0];

  // 5) nothing found
  return null;
}
//ml implementation




function generateSupportiveTip(analysis) {
  const { emotionLabel, sentimentLabel, category, sentimentScore } = analysis;

  // Strongly negative
  if (sentimentScore <= -0.7) {
    return "It seems you are going through a very difficult time. Talking to someone you trust or taking a small break may help you feel better.";
  }

  // Emotion-based tips
  if (emotionLabel === "Sadness") {
    return "Feeling sad is natural. Try doing something kind for yourself today or reach out to someone who cares about you.";
  }

  if (emotionLabel === "Fear") {
    return "It looks like you are feeling anxious. Taking slow breaths and focusing on what you can control may help.";
  }

  if (emotionLabel === "Anger") {
    return "Anger can be intense. Pausing for a moment and calming your mind may help you think more clearly.";
  }

  if (emotionLabel === "Guilt") {
    return "Everyone makes mistakes. Learning from them and forgiving yourself is an important step forward.";
  }

  // Category-based fallback
  if (category === "Education") {
    return "Learning is a journey. Even small improvements today can lead to better results tomorrow.";
  }

  if (category === "Career") {
    return "Career setbacks happen to many people. Reflecting on what you learned can help you grow.";
  }

  if (category === "Relationship") {
    return "Relationships are complex. Honest communication and patience often help heal misunderstandings.";
  }

  // Default
  return "Thank you for sharing. Writing down your feelings is a positive step toward understanding yourself better.";
}

//ml implementation





module.exports={


    // storeRegret:(msg)=>{
    //     return new Promise((resolve,reject)=>{
    //         db.get().collection(collection.MESSAGES).insertOne(msg).then(()=>{
    //             db.get().collection(collection.MESSAGES).
    //             aggregate([
    //                 {$match:{regret :{$ne :msg.regret}}},
    //                 {$sample:{size:1}}
    //             ]).toArray().then((response)=>{
    //                 resolve(response[0]);
    //             })
                
    //         })
    //     })
    // },



//ml implementation
      storeRegret: (msg) => {
  return new Promise(async (resolve, reject) => {
    try {
      const dbInstance = db.get();
      const regretsCollection = dbInstance.collection(collection.MESSAGES);
      const flaggedCollection = dbInstance.collection("flagged_regrets");

      const regretText = msg.regret;
      const userId = msg.userId;
     

      // ✅ STEP 1: CALL ML FIRST (toxicity + emotion)
      const analysis = await analyzeRegretWithML(regretText);
       const tip = generateSupportiveTip(analysis);
      // 🚨 STEP 2: BLOCK TOXIC CONTENT
      if (analysis.safe === false) {

        // store flagged regret separately (admin use)
        await flaggedCollection.insertOne({
          userId: new ObjectId(userId),
          regretText: regretText,
          toxicityScore: analysis.toxicityScore,
          toxicityType: analysis.toxicityType,
          createdAt: new Date(),
          status: "Pending Review"
        });

        // stop everything here
        return resolve({
          blocked: true,
          reason: analysis.toxicityType
        });
      }

      // ✅ STEP 3: INSERT SAFE REGRET
      const insertResult = await regretsCollection.insertOne({
        userId: new ObjectId(userId),
        regret: regretText,
        createdAt: new Date()
      });

      const insertedId = insertResult.insertedId;

      // ✅ STEP 4: UPDATE ANALYSIS METADATA
      await regretsCollection.updateOne(
        { _id: insertedId },
        {
          $set: {
            sentimentScore: analysis.sentimentScore,
            sentimentLabel: analysis.sentimentLabel,
            emotionLabel: analysis.emotionLabel,
            category: analysis.category,
            analyzedAt: new Date(analysis.analyzedAt || Date.now())
          }
        }
      );

      // ✅ STEP 5: FIND SIMILAR REGRET
      const recommended = await getSimilarRegret(
        regretsCollection,
        insertedId,
        analysis
      );

      // ✅ STEP 6: RETURN RESULT
      resolve({
        insertedId: insertedId,
        analysis: analysis,
        recommendedRegret: recommended,
        supportiveTip: tip
      });

    } catch (err) {
      console.error("storeRegret error:", err);
      reject(err);
    }
  });
},

//ml implementation






    doUserSignup:(userData)=>{  
        return new Promise(async(resolve,reject)=>{
          let user=await db.get().collection(collection.USER_COLLECTION).findOne({email:userData.email})
            if(user){
              resolve({ status: false});
            }else{
              userData.password=await bcrypt.hash(userData.password,10)
              db.get().collection(collection.USER_COLLECTION).insertOne(userData).then((data)=>{
                userData._id=data.insertedId;
            resolve({userData,status:true})
            
            })
            }
            
        })
    },

    doUserLogin:(userData)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.USER_COLLECTION).findOne({email:userData.email}).then((response)=>{
                if(response){
                    bcrypt.compare(userData.password,response.password).then((status)=>{
                        if(status){
                            console.log("login suceess"+response);
                            response.status=true
                            resolve(response)
                        }else{
                             console.log("login failed");
                             resolve({status:false})
                        }
                    })
                }else{
                console.log("login failed not found");
                resolve({status:false})
            }
            })
        })
     },


     addFavourite:(data)=>{
        return new Promise((resolve,reject)=>{
            const favouritemsg=data.returnregret;
            const userId=data.user.userId;
            db.get().collection(collection.FAVOURITES_COLLECTION).insertOne(data).then((response)=>{
                resolve(response);
            })
        })
     },
     returnFavourites:(data)=>{
        const userId=data.userId;
        console.log(userId);
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.FAVOURITES_COLLECTION).find({"user.userId":userId}).toArray().then((response)=>{
                console.log("messages: " + JSON.stringify(response, null, 2));
                
                resolve(response);
            })
        })
     },

     deleteItem:(data)=>{
        const userId=data.userId;
        const regretId=data.regretId;
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.FAVOURITES_COLLECTION).deleteOne({"user.userId":userId, "returnregret._id": regretId}).then((result)=>{
                resolve(result)
            })
        })
     }




}