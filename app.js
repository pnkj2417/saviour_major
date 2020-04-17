var express = require('express')
var app =express()
var spawn =require('child_process').spawn;

var pyProcess = spawn('python',["MLmodel/main.py","tensorflow","keras","numpy"])
pyProcess.stdout.on('data',function(data){
    console.log(data.toString())
})
var port= process.env.PORT || 8080

app.get('/',function(req,res){
    var p=spawn('python',["MLmodel/main2.py"])
    p.stdout.on('data',function(data){
        res.send(data.toString)
    })

    
})

app.listen(port,function(){
    console.log("server started")
})
