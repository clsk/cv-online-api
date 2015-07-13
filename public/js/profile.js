$(function() {
	$('#btn_update_profile').click(function() {
	    $.post("Update",
	    {
	    	name : $('#name').val(),
			lastname : $('#Lastname').val(),
			email : $('#email').val(),
			telefonos : $('#telefonos').val(),
			paginas : $('#paginasWeb').val(),
	    },
	    function(data, status){
	    	window.location = "/home";
	    });
	});
});
