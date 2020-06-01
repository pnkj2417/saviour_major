var path =require('path'),
multer=require('multer')


var storage= multer.diskStorage({
    destination:"./image/",
    filename : function(req,file,cb){
        cb(
            null,"image" + path.extname(file.originalname)
          );
   }
})

module.exports=multer({storage:storage})