$(document).ready(function(){

    $("#id").change(function(e){
        var id={'id':$("#id").val()}
        
        $.getJSON('/checkId', id, function (data, textStatus, jqXHR){
            if(data['flag']=='true')
             {
                 $("#id").val("")
                 alert("Id already exists")
             } 
        });

    })

    $("#submit").click(function(e){
        if($("#pass").val() !=$("#pass1").val()){
            alert("Password do not match")
            $("#pass").val("")
            $("#pass1").val("")
            e.preventDefault()
        }
    })

    $("#key").change(function(e){
        var key={'key':$("#key").val()}
        $.getJSON('/checkKey', key, function (data, textStatus, jqXHR){
            if(data['flag']=='true')
             {
                 $("#key").val("")
                 alert("Secret Key do not match")
             } 
             else if(data['flag']==-1){
                $("#key").val("")
                 alert("you have exhausted try limit, please wait for an hour") 
             }
        });
    })
    
})