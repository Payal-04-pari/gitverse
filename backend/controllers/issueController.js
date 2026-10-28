const mongoose = require('mongoose');
const Repository = require('../models/repoModel');
const User = require('../models/userModel');
const Issue = require('../models/issueModel');


async function createIssue(req,res){
   const {title,description}=req.body;
   const {id}=req.params;
   try{
   const issue=new Issue({
    title,
    description,
    repository:id,
   });
   await issue.save();
   res.status(201).json(issue);
}catch(err){
    console.error("Error during creating issue:",err.message);
    res.status(500).send("Internal Server Error");
}
};

async function updateIssueById(req,res){
   const {id}=req.params;
   const {title,description,status}=req.body;

   try{
     const issue=await Issue.findById(id);
     if(!issue){    
        res.status(404).json({message:"Issue not found"});
     }
     issue.title=title;
     issue.description=description;
     issue.status=status;
     await issue.save();
     res.status(200).json(issue);
   }catch(err){
    console.error("Error during updating issue by ID:",err.message);
    res.status(500).send("Internal Server Error");
   }
};

async function deleteIssueById(req,res){
    const {id}=req.params;
    try{
        const issue=await Issue.findByIdAndDelete(id);
        if(!issue){
            res.status(404).json({message:"Issue not found"});
        }
        res.status(200).json({message:"Issue deleted successfully"});
    }catch(err){
        console.error("Error during deleting issue by ID:",err.message);
        res.status(500).send("Internal Server Error");
    }
};

async function getAllIssues(req,res){
    const {id}=req.params;
    try{
        const issues=await Issue.find({repository:id});
      
        if(!issues){
            res.status(404).json({message:"No issues found for this repository"});
        }
          res.status(200).json(issues);
    }catch(err){
        console.error("Error during fetching all issues:",err.message);
        res.status(500).send("Internal Server Error");
    }
}

async function getIssueById(req,res){
    const {id}=req.params;
    try{
        const issue=await Issue.findById(id);
        if(!issue){
            res.status(404).json({message:"Issue not found"});
        }
        res.json(issue);
    }catch(err){
        console.error("Error during fetching issue by ID:",err.message);
        res.status(500).send("Internal Server Error");
    }
};

module.exports={
    createIssue,
    updateIssueById,    
    deleteIssueById,
    getAllIssues,
    getIssueById,
}