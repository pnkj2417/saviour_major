const mongoose=require('mongoose'),
dynamicMongoose=require('mongoose-dynamic-schemas'),
// collection= require('../schemas/collection'),
fs = require('fs')

function createSchema(dataFields,map){
    var schema=new mongoose.Schema({ })
    var model= mongoose.model(dataFields[0],schema)
    var seedData= {}

    for(var i=1;i<dataFields.length;i++) {
        dynamicMongoose.addSchemaField(model,dataFields[i],{type:String})
        seedData[dataFields[i]]="String"
    }

    fs.writeFile(__dirname+'/schemaFiles/' + lower(dataFields[0]), JSON.stringify(seedData),function (err){
        if (err)
            console.log(err.toString() )
        else map[dataFields[0]]=model
    })

    
}

function lower(str){
    var s=""
    for(var i=0;i<str.length;i++){
        
        char=str.charCodeAt(i)
        if(char>=65 && char<=90)
         {
             s+=String.fromCharCode(char+32) 
            
         }
        else s+=str[i]
    }

    return s
}
module.exports=createSchema