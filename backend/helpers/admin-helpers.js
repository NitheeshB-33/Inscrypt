var db=require('../Config/connection')
var collection=require('../Config/collections')
const { response } = require('../app')
var ObjectId=require('mongodb').ObjectId
const bcrypt=require('bcrypt')

module.exports={


    storeRegret:(msg)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.MESSAGES).insertOne(msg).then(()=>{
                db.get().collection(collection.MESSAGES).
                aggregate([
                    {$match:{regret :{$ne :msg.regret}}},
                    {$sample:{size:1}}
                ]).toArray().then((response)=>{
                    resolve(response[0]);
                })
                
            })
        })
    },

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