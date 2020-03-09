const express = require('express'),
      multer  = require('multer'),
      path    = require('path'),
      ejs     = require('ejs'),
      port    = 3000;

//==================Set storage engine=================

const storage = multer.diskStorage({
    destination:'./public/upload',
    filename: (req,file,cb)=>{
        cb(null,file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage:storage,
    limits:{
        fileSize:1000000*10
    },
    fileFilter:(req,file,cb)=>{
        checkFileType(file,cb);
    }
}).single('upload_file');

function checkFileType(file,cb)
{
    //allowed extension
    const filetypes = /jpeg|jpg|png|gif/;

    //check extension
    const extname   = filetypes.test(path.extname(file.originalname).toLowerCase());

    //check mime
    const mimetype  = filetypes.test(file.mimetype);

    if(mimetype && extname)
    {
        return cb(null,true);
    }
    else{
        cb("Error:Images only");
    }


}

//====================
//init app
//====================
var app = express();

app.set('view engine','ejs');
app.use(express.static('./public'));

app.get('/',(req,res)=>{
   res.render('index');
})

app.post('/upload',(req,res)=>{
    upload(req,res,(err)=>{
        if(err){
            res.render('index',{
                msg:err
            });
        }
        else{
            if(req.file==undefined)
            {
                res.render('index',{
                    msg:"No file selected"
                })
            }
            else{
                res.render('index',{
                    msg:"File uploaded",
                    file: `upload/${req.file.filename}`
                });
            }
           
        }
    });
})


app.listen(process.env.PORT,()=>{
    console.log(`Server started on port ${port}`);
});
