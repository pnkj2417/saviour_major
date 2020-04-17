var express = require('express')
var app =express()
var spawn =require('child_process').spawn;

var pyProcess = spawn('python',["MLmodel/main.py","tensorflow","keras","numpy"])
pyProcess.stdout.on('data',function(data){
    console.log(data.toString())
})
var port= process.env.PORT || 8080

app.get('/home',function(req,res){
    var p=spawn('python',["MLmodel/main2.py"])
    p.stdout.on('data',function(data){
        console.log(data.toString())
        res.send(data.toString())
    })

    
})

app.get('/',function(req,res){
    res.send("hello0")
})

app.listen(port,function(){
    console.log("server started",port)
})
