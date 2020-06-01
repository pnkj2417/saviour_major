$(document).ready(function(){
        var num=0
        var data=[]
        
    $('#add-field').click(function(e){
        
        num=num+1
       let html_template=`<input id="`+num+`" type="text" class="form-control"  style=" width: 17% ;margin-top:2%;margin-left:12%" value="Field `+ num +`" readonly>
       <input type="text" id="`+num+`field" name="field" class="form-control"  style=" width: 40%; margin-top:2%;margin-left:5%" required>
       </div>`
   $("#add").append(html_template)
   
    })

    $('#remove-field').click(function(e){

        var id=`#`+num
        if(num!=0)
            {
                $(id).remove()
                $(id+"field").remove()
                num=num-1
            }
        else{
            alert("No fields added")
        }
    })

    $("#submit").click(function(e){
        if (confirm("You want to submit details!")) {
            
            if(num==0){
                e.preventDefault()
                alert("Add fields")
            }
            else{
                data[0]=$("#formName").val()
                for(var i=0;i<num;i++){
                    var c=i+1
                    var id=`#`+c+"field"
                    data[i+1]=($(id).val())
                    
                }
                var d={"formData":data}
                $.post('/makeForm',d)
            }
        }else{
            e.preventDefault()
        }
    })
})
