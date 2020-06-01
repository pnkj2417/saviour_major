$(document).ready(function(){
    
$("#submit").click(function(e){
    if($("#formType").val()=="Form type"){
        alert("Select a from type")
        e.preventDefault()
    }
})

})