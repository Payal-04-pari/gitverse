const mongoose = require('mongoose');
const Repository = require('../models/repoModel');
const User = require('../models/userModel');
const Issue = require('../models/issueModel');


async function  createRepository(req,res){
    const {owner,userId,repositoryName,name,issues, content,description,visibility}=req.body;
    const ownerId = owner || userId;
    const repoName = repositoryName || name;

    try{
        if(!repoName){
            return res.status(400).json({message:"Repository name is required"});
        }
        if(!mongoose.Types.ObjectId.isValid(ownerId)){
            return res.status(400).json({message:"Invalid user ID"});
        }
        //  if(!mongoose.Types.ObjectId.isValid(issues)){
        //     return res.status(400).json({message:"Invalid user ID"});
        // }
     const newRepository=new Repository({
        name:repoName,
        description:description, 
        visibility:visibility,
        owner:ownerId,
        content:content,
        issues:issues,   
     });
     const result=await newRepository.save();
     res.status(201).json({
        message:"Repository created successfully",
        repositoryID:result._id,
     });
    }catch(err){
        if(err.code===11000){
            return res.status(409).json({message:"Repository name already exists"});
        }
        console.error("Error during creating repository:",err.message);
        res.status(500).send("Internal Server Error");
    }
};

async function getAllRepositories(req,res){

   try{
           const repositories=await Repository.find({}).populate("owner").populate("issues");
           res.status(200).json(repositories);
   }catch(err){
    console.error("Error during fetching all repositories:",err.message);
    res.status(500).send("Internal Server Error");
   }
};
async function fetchRepositoryById(req,res){
    const{ id}=req.params;
    try{
        const repository=await Repository.findById(id).populate("owner").populate("issues");
        res.json(repository);
    }catch(err){
        console.error("Error during fetching repository by ID:",err.message);
        res.status(500).send("Internal Server Error");
    }
};

async function fetchRepositoryByName(req,res){
     const{name}=req.params;
    try{
        const repository=await Repository.find({name:name}).populate("owner").populate("issues");
        res.json(repository);
    }catch(err){
        console.error("Error during fetching repository by ID:",err.message);
        res.status(500).send("Internal Server Error");
    }
};

async function fetchRepositoryForCurrnentUser(req,res){
    const userId=req.params.userID;
    try{
        const repositories=await Repository.find({owner:userId});
        res.status(200).json({
            message: repositories.length === 0 ? "No repositories found for the current user" : "Repositories found!",
            repositories,
        });
    }catch(err){
        console.error("Error during fetching repository for current user:",err.message);
        res.status(500).send("Internal Server Error");
    }
};

async function updateRepository(req,res){
    const {id}=req.params;
    const {content,description}=req.body;
    try{
       const repository=await Repository.findById(id);
       if(!repository){
        return res.status(404).json({message:"Repository not found"});
       }
       repository.content.push(content);
       repository.description=description;
       const updatedRepository=await repository.save();

       res.json({message:"Repository updated successfully",updatedRepository});
    }catch(err){
        console.error("Error during updating repository:",err.message);
        res.status(500).send("Internal Server Error");
    }
};

async function toggleRepositoryVisibilityById(req,res){
    const {id}=req.params;
  
    try{
       const repository=await Repository.findById(id);
       if(!repository){
        return res.status(404).json({message:"Repository not found"});
       }
       repository.visibility=!repository.visibility;
       const updatedRepository=await repository.save();

       res.json({message:"Repositoryvisibility toggled successfully",updatedRepository});
    }catch(err){
        console.error("Error during updating repository:",err.message);
        res.status(500).send("Internal Server Error");
    }
};
async function deleteRepository(req,res){
    const {id}=req.params;
    try{
       const repository=await Repository.findOneAndDelete(id);
       if(!repository){
        return res.status(404).json({message:"Repository not found"});
       }
       res.json({message:"Repository deleted successfully",repository});
    }catch(err){
        console.error("Error during deleting repository:",err.message);
        res.status(500).send("Internal Server Error");
    }
};

module.exports={
    createRepository,
    getAllRepositories, 
    fetchRepositoryById,
    fetchRepositoryByName,
    fetchRepositoryForCurrnentUser,
    updateRepository,
    toggleRepositoryVisibilityById,
    deleteRepository,
}