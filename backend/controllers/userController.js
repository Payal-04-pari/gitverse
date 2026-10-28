 
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const {MongoClient} = require("mongodb");
const dotenv = require("dotenv");
var ObjectId = require("mongodb").ObjectId;
dotenv.config();
const uri = process.env.MONGODB_URI;

let client;
async function connectClient() {
    if (!client) {
        // Simply pass 'uri' without any second options object
        client = new MongoClient(uri);
        await client.connect();
    }
}

async function getAllusers(req,res){
    try{
           await connectClient();
        const db=client.db("githubclone");
        const usersCollection=db.collection("users");
        const existingUser=await usersCollection.find({}).toArray();
        res.json(existingUser);
    }catch(err){    
     console.error("Error during fetching users:",err.message);
   res.status(500).send("Internal Server Error");
    }
};

async function signup(req,res){
    const {username,email,password}=req.body;
    try{
        await connectClient();
        const db=client.db("githubclone");
        const usersCollection=db.collection("users");
        const existingUser=await usersCollection.findOne({email});
        if(existingUser){
            return res.status(400).json({message:"User already exists"});
        }
        const salt=await bcrypt.genSalt(10);
        const hashedPassword=await bcrypt.hash(password,salt);
        const newUser={
            username,
            password:hashedPassword,
            email,
            repositories:[],
            followers:[],
            starRepos:[],
        };
        const result=await usersCollection.insertOne(newUser);
        const token=jwt.sign({id:result.insertedId},process.env.JWT_SECRET_KEY,{expiresIn:"1h"});
        res.json({token,userId:result.insertedId});
    }catch(err){
        console.error("Error during signup:",err.message);
        res.status(500).send("Internal Server Error");
    }
};

async function login(req,res){
   const {email,password}=req.body;
   try{
    await connectClient();
     const db=client.db("githubclone");
        const usersCollection=db.collection("users");
        const existingUser=await usersCollection.findOne({email});
        if(!existingUser){
            return res.status(400).json({message:"Invalid credentials"});
        }
        const isMatch=await bcrypt.compare(password,existingUser.password);
        if(!isMatch){
            return res.status(400).json({message:"Invalid credentials"});
        }
        const token=jwt.sign({id:existingUser._id},process.env.JWT_SECRET_KEY,{expiresIn:"1h"});
        res.json({token,userId:existingUser._id});

   }catch(err){
    console.error("Error during login:",err.message);
    res.status(500).send("Internal Server Error");
   }

};
async function  getUserProfile(req,res){
    const { id } = req.params;
     try{
         await connectClient();
        const db=client.db("githubclone");
        const usersCollection=db.collection("users");
        const user=await usersCollection.findOne({_id:new ObjectId(id)});
        if(!user){
            return res.status(404).json({message:"User not found"});
        }
        res.json(user);
     }catch(err){
        console.error("Error during fetching user profile:",err.message);
        res.status(500).send("Internal Server Error");
     }

};

async function updateUserProfile(req,res){
    const { id } = req.body;
    const { email,password } = req.body;
   
   try{
     await connectClient();
     const db=client.db("githubclone");
        const usersCollection=db.collection("users");
 let updateFields = {email};
    if(password){
        const salt=await bcrypt.genSalt(10);
        const hashedPassword=await bcrypt.hash(password,salt);
        updateFields.password=hashedPassword;
    }
    const result=await usersCollection.findOneAndUpdate({_id:new ObjectId(id)},{$set:updateFields},{returnDocument:"after"});
    if(!result.value){
        return res.status(404).json({message:"User not found"});
    }
    res.send(result.value);
   }catch(err){
    console.error("Error during updating user profile:",err.message);
    res.status(500).send("Internal Server Error");
   }
};
async function deleteUserProfile(req,res){
    const { id } = req.body;
    try{
        
        await connectClient();
     const db=client.db("githubclone");
        const usersCollection=db.collection("users");

        const result=await usersCollection.deleteOne({_id:new ObjectId(id)});
        if(result.deletedCount===0){
            return res.status(404).json({message:"User not found"});
        }
        res.json({message:"User deleted successfully"});
    }catch(err){
        console.error("Error during deleting user profile:",err.message);
        res.status(500).send("Internal Server Error");
    }
};
module.exports={
    getAllusers,
    signup,
    login,
    getUserProfile,
    updateUserProfile,
    deleteUserProfile,
}
