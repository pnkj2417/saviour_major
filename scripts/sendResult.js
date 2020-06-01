$(document).ready(function(){

    $("#submit").click(function(e){
        var data=[]
        var form= $("#formType").val().toString()
        
        form =form.replace("_form","").toString()
        while(true){
            if(form.includes("_"))
                {
                    form=form.replace("_"," ").toString()
                    
                }
            else break
        }
        
        var i=0
        
        while($("#"+i).val() != undefined){
            var c=$("#"+i).val()
            c=c.replace("_"," ").toString()
            c=c.replace("_"," ").toString()
            c=c.replace("_"," ").toString()
            c=c.replace("_"," ").toString()
            data[i]=c
            i++  
        }
        data[i]=form
        var d={"data":data}
        $.post('/saveResult',d) 
    })
})