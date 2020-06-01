var express = require('express'),
app =express(),
upload=require('./utils/storage'),
mongoose=require('mongoose'),
createSchema=require('./schemas/genForm'),
login=require('./schemas/login')
map=require('./schemas/createMap'),
session = require('express-session'),
fs= require('fs')

mongoose.connect('mongodb://saviour:saviour123@ds117888.mlab.com:17888/saviour_form',{useNewUrlParser: true ,useUnifiedTopology: true})
var port= process.env.PORT || 8080
app.set('view engine','ejs')
app.use(express.static(__dirname +"/scripts"))
app.use(express.urlencoded({ extended: true }))
  
app.use(session({
    secret: 'It is not a secret',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false ,maxAge: 3600000}
  }))


app.get('/',function(req,res){   
    res.render("getImage",{collections:Object.keys(map),id:userLogin(req),emp:false});
})

app.post('/',upload.single('image'),function(req,res){
    var keys=getKeys(req.body.formType)
    var spawn= require('child_process').spawn
    var proc=spawn('python',["./model2.py",json])
    proc.stdout.on('data',function(data){
        if(data==-1){
            res.render("getImage",{collections:Object.keys(map),id:userLogin(req),emp:true});

        }
        else{
        data=data.toString()
        var datas=[]
        var c=""
        //model.py
        // for(var i=0;i<data.length;i++){
        //     if(data[i]!='/')
        //         c+=data[i]
        //     else{
        //         datas.push(c)
        //         c=""
        //         i=i+2
        //     }
        // }
        //model2.py
        for(var i=0;i<data.length;i++){
            if(data[i]!='\r')
                {
                    if(data[i]==' '){ 
                        c+="_" 
                    }
                    else
                    c+=data[i]
                }
            else{
                datas.push(c)
                c=""
                i=i+1
            }
        }
        
        console.log(datas)
        
        res.render('sendResult',{keys:keys,data:datas,form:req.body.formType.replace(' ','_')+"_form",id:userLogin(req)})    
    }
})
    
})

app.get('/makeForm',function(req,res){
        if(req.session.User!=undefined)
             res.render('makeForm',{id:userLogin(req)})
        else
        res.redirect('login')

})

app.post('/makeForm',function(req,res){
    if(req.body.formData!=undefined){
       createSchema(req.body.formData,map)
    }
    res.render('formSubmitted',{id:userLogin(req)})
})

app.get('/getImage',function(req,res){
    res.redirect('/')
})

app.get('/saveResult',function(req,res){
    res.redirect('/')
})

app.post('/saveResult',function(req,res){
    var data=req.body.data
    console.log(data)
    var sModel=map[data[data.length -1]]
    data.pop()
    var keys=Object.keys(sModel.schema.tree)
    var length=keys.length-3
   var obj={}
   for( i=0;i<length;i++){
       obj[keys[i]]=data[i]
   }
    var sData=new sModel(obj)
    sData.save()
})

app.get('/signUp',function(req,res){
    if(req.session.User!=undefined)
             res.redirect('/')
    else{  
    res.render('signUp',{id:userLogin(req)})
    }
})

app.post('/signUp',function(req,res){
      
    if(req.session.views==undefined)
        req.session['views']=0
    
    var user= new login({'id':req.body.id,'password':req.body.password})
    user.save()
    req.session['User']=req.body.id
    res.redirect('/')
    
})

app.get('/logIn',function(req,res){
    if(req.session.User!=undefined)
             res.redirect('/')
    else{  
    res.render('logIn',{id:null,msg:false})
    }
})

app.post('/logIn',function(req,res){

    if(req.session.viewLogin==undefined)
        req.session['viewLogin']=0
    else req.session['viewLogin']+=1

    if(req.session['viewLogin']>3){
        res.render('logIn',{id:null,msg:-1})
    }
    else{
    login.findOne({'id':req.body.id},function(err,data){
        if(err)
            console.log(err)
        else{
            if(data==null){              
                res.render('logIn',{id:null,msg:true})
            }
            else if(req.body.password ==data['password']){
                req.session['User']=req.body.id
                res.redirect('/')
            }
            else{
                res.render('logIn',{id:null,msg:true})
            }
        }
    })
}
    
})

app.get('/ ',function(req,res){ 
    
    login.findOne(req.query,function(err,details){
        if (err)
        console.log(err)
        else{
            if(details==null)
            res.json({'flag':'false'})
            else res.json({'flag':'true'})
        }
    })    
})

app.get('/checkKey',function(req,res){

    req.session['views']+=1
    if(req.session['views']>=3){
        res.json({'flag':-1})
    }
    else if(req.query['key']=='nitkkr')
            res.json({'flag':'false'})
    else {
        res.json({'flag':'true'})
    }
    
})
app.get('/logOut',function(req, res){
    if(req.session.User!= null)
        req.session.User=null
    res.redirect('/')
})

app.get('/database',function(req,res){
    if(req.session.User==undefined)
             res.redirect('/')
    else{  
        res.render('database',{collections:Object.keys(map),id:userLogin(req)})
    }
})

app.post('/database',function(req,res){
    
    var model=map[req.body.formType]
    model.find({},function(err,data){
        if (err)
        console.log(err)
        else{
            console.log(data)
            res.render('databaseResult',{id:userLogin(req),data:data,keys:getKeys(req.body.formType)})  
        }
    })
        
})

function userLogin(req){
    if(req.session.User== undefined){
        req.session['User']=null
    }
    return req.session.User
}

function getKeys(form){
    var s= map[form]
    var key=Object.keys(s.schema.paths)
    for(var i=0;i<key.length;i++){
        var s=key[i].replace(' ','_').toString()
        s=s.replace(' ','_')
        key[i]=s
    }
    var i=key.indexOf('_id')
    if(i>-1)
    key.splice(i,1)
    i=key.indexOf('__v')
    if(i>-1)
    key.splice(i,1)
    
    return key
}
var json
fs.readFile(__dirname +'/model.json',   function(err,data){
    if(err) console.log(err)
    json=data
    console.log("model.json loaded")
})

app.listen(port,function(){
    console.log("server started on ",port)
})
