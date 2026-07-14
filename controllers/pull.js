const fs=require("fs").promises;
const path=require("path");
const { ListObjectsV2Command,GetObjectCommand } = require("@aws-sdk/client-s3");
const { s3, S3_BUCKET } = require("../config/aws-config.js");



async function pullRepo(){
    const repoPath=path.resolve(process.cwd(),".gitverse");
    const commitsPath=path.join(repoPath,"commits");
   try{
           const listCommand = new ListObjectsV2Command({ 
            Bucket: S3_BUCKET, 
            Prefix: "commits/" 
        });
        const data = await s3.send(listCommand);
           const objects=data.Contents;
           for(const obj of objects){
            const key=obj.Key;
            const commitDir=path.join(
                commitsPath,
                path.dirname(key).split("/").pop()
            );
            await fs.mkdir(commitDir,{recursive:true});
            const params={Bucket:S3_BUCKET,Key:key};
            const fileData = await s3.send(new GetObjectCommand(params));
            
            // 3. File data ko stream se normal string (text) mein convert karna
            const fileContent = await fileData.Body.transformToString();
            await fs.writeFile(path.join(repoPath,key),fileContent);
           } 
           console.log("🚀 Sabhi commits successfully Cloud (MinIO) se pull ho gaye!");
   }catch(err){
    console.error("Error pulling commits from S3:",err);
   }
}

module.exports={pullRepo};