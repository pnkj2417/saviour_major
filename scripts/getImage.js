$(document).ready(function(){
    
        $('input[type="file"]').change(function(e){
            const filetypes = /jpeg|jpg|png/;
            var fileName = e.target.files[0].name;
            if(!fileName.match(filetypes)){
                alert("Only images are allowed")
                $('#image').val('')
            }
})
    $("#submit").click(function(e){
        if($("#formType").val()=="Form type"){
            alert("Select a from type")
            e.preventDefault()
        }
    })

    $("#flash").fadeOut(5000,function(){

    })

})