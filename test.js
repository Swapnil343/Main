const multer = require('multer');
const express = require("express");
const mongoose =require("mongoose");
mongoose.connect(process.env.mongo_key, { useNewUrlParser: true, useUnifiedTopology: true });
const fs =require("fs")
const imageSchema =new mongoose.Schema({
    data : String   
})
const Image = mongoose.model("Main",imageSchema);
const multerStorage = multer.diskStorage({
    destination:(req,file,cb)=>{
        const ext = file.mimetype.split("/")[0];
        if(ext=="image"){
            cb(null,"C:\\Users\\youga\\OneDrive\\Desktop\\Images")
        }else{
            cb(null,"C:\Users\youga\OneDrive\Desktop\Images\others")
        }
    },
    filename:(req,file,cb)=>{
        cb(null, `${Date.now()}.${file.originalname}`);
    }
}
);
const app = express();
const upload=multer({storage:multerStorage});
app.get('/data', (req, res) => {
    Image.find({}).then(function (data) {
        res.send(data);
    }).catch(function (err) {
        console.log(err)
    })
});
app.post("/upload",upload.single('myfile'), async(req,res)=>{
    try {
        const filepath =req.file.path
        const imageData = fs.readFileSync( filepath, { encoding: 'base64' });
      
        const newImage = new Image({ data: imageData });
        await newImage.save();
        res.send("File Uploaded Successfully");
        
    } catch (error) {
        console.log(error);
        res.send("An Error Occurred While Uploading the file ")
        
    }
})
const PORT = process.env.PORT ;
app.listen(PORT, () => {
    console.log("Server is running at port ", PORT);
});