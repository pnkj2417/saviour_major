var mongoose=require('mongoose')
var schema=mongoose.Schema({
    id:String,
    password:String
})

module.exports=mongoose.model("login",schema)