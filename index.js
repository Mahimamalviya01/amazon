require("./connection")
const pSchema=require("./schema")
const express=require("express")
const multer=require("multer")
const app=express();
const cors=require("cors")
app.use(cors())
app.use(express.json())
app.use(express.static("public"))


const storage=multer.diskStorage(
    {
        destination:(req,file,cb)=>{
            cb(null,"public/uploads/")
        },
        filename:(req,file,cb)=>{
        cb(null,file.originalname)
    }
})
const upload=multer({storage:storage}).single("pimg")
app.post("/",(req,resp)=>
{
  upload(req,resp,(err)=>
{
    if(err)
        {
            resp.send(err)
        }
        else{
            const newData=new pSchema(
                {
                    pid:req.body.pid,
                    pname:req.body.pname,
                    pprice:req.body.pprice,
                    pcat:req.body.pcat,
                    pdesc:req.body.pdesc,
                    pimg:"https://amazon-zch2.onrender.com/uploads/"+req.file.filename
                    
                })
                const entry=newData.save()
                resp.send("save data successfully")
}
})
})
app.get("/",async(req,resp)=>
{
    const data=await pSchema.find()
    resp.send(data)
})


app.get("/:key",async(req,resp)=>
    {
       // resp.send(req.params.key)
        const data=await pSchema.find({pid:req.params.key})
        resp.send(data)
    })

app.get("/search/:key",async(req,resp)=>
    {
       // resp.send(req.params.key)
       const data=await pSchema.find({
        "$or":[
            {"pcat":{$regex:req.params.key}}
        ]
       })
       resp.send(data)
        })
    
app.listen(4000)