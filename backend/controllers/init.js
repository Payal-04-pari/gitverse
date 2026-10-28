const fs=require("fs").promises;
const path=require("path");
async function initRepo(){
    const repoPath=path.resolve(process.cwd(),".gitverse");
    const commitsPath=path.join(repoPath,"commits");
    
    try{
      await fs.mkdir(repoPath,{recursive:true});
      await fs.mkdir(commitsPath,{recursive:true});
      await fs.writeFile(path.join(repoPath,"config.json"),JSON.stringify({bucket:"process.env.S3_BUCKET" }));
      console.log("Repository initialized successfully.");
    }catch(err){
        console.error("Error creating repository:", err);
    }
}

module.exports={initRepo};