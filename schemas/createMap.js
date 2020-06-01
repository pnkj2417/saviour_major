var fs= require('fs'),
mongoose=require('mongoose')

var map = new Map()

fs.readdir(__dirname+'/schemaFiles',function(err,files){
    
    if(files != undefined){
        files.forEach(file => {
        fs.readFile(__dirname+'/schemaFiles/'+file,   function(err,data){
            var obj={}
            if(err) console.log(err)
            var json=JSON.parse(data)
            for(key in json){
                obj[key]=String
            }
            var schema=mongoose.Schema(obj)
            var model=mongoose.model(file,schema)
            map[file]=model
            
            })
           
        })
    }
    console.log("map formed")
})

module.exports= map