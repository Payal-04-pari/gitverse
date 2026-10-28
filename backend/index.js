const express=require("express");
const dotenv=require("dotenv");
const cors=require("cors");
const mongoose=require("mongoose");
const bodyParser=require("body-parser");
const http=require("http");
const {Server}=require("socket.io");
const mainRouter=require("./routes/main.router");

const yargs=require("yargs");
const {hideBin}=require("yargs/helpers");

const {initRepo}=require("./controllers/init");
const {addRepo}=require("./controllers/add");
const {commitRepo} =require("./controllers/commit");
const {pushRepo}=require("./controllers/push");
const {pullRepo}=require("./controllers/pull");
const {revertRepo}=require("./controllers/revert");

dotenv.config();

yargs(hideBin(process.argv))
.command("start","Starts a new server",{},startServer)
.command("init",
    "Initialize a new repository",
      {},
      initRepo)
      .command("add <filePath>",
    "Add a file to the staging area",
   (yargs)=> {
    yargs.positional("filePath",{
        describe:"File to add",
        type:"string",
       });
   },addRepo)
   .command("commit <message>",
    "Commit changes to the repository",
    (yargs)=>{
        yargs.positional("message",{
            describe:"Commit message",
            type:"string",
        });
    },
    commitRepo
    )
    .command("push","Push commits to S3",(yargs)=>{},pushRepo)
    .command("pull","Pull commits from S3",(yargs)=>{},pullRepo)
    .command("revert <commitId>","Revert to a specific commit",
      (yargs)=>{
        yargs.positional("commitId",{
            describe:"Commit ID to revert to",
            type:"string",
        });
      },
      (argv) => revertRepo(argv.commitId)
    )
    .demandCommand(1,"You need to specify a command").help().argv;



    function startServer(){
      const app=express();
      const port=process.env.PORT || 3000;
      app.use(bodyParser.json());
      app.use(express.json());
      const mongoURI=process.env.MONGODB_URI;
      mongoose.connect(mongoURI).then(()=>console.log("Connected to MongoDB")).catch((err)=>console.error("Error connecting to MongoDB:",err));

      app.use(cors({origin:"*"}));
     
     app.use("/",mainRouter);
      const server=http.createServer(app);
      const io=new Server(server,{
        cors:{
          origin:"*",
          methods:["GET","POST"],
        },
      }); 
      io.on("connection",(socket)=>{
        socket.on("message",(userID)=>{
          user=userID;
          console.log("=====");
          console.log(user);
          console.log("=====");
          socket.join(userID);
        });
      });
      const db=mongoose.connection;
      db.once("open",()=>{
        console.log("Connected to MongoDB");
      });
     server.listen(port,()=>{
        console.log(`Server is running on port ${port}`);
      })
        }