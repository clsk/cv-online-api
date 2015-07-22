$(function() {
	$('#btn_update_profile').click(function() {
		var email = $('#email').val();
		var phone = $("#telefono").val();

		if (IsEmail(email) && IsPhoneNumber(phone)) {
			$.post("Update",
		    {
		    	name : $('#name').val(),
				lastname : $('#Lastname').val(),
				email : $('#email').val(),
				telefonos : $('#telefono').val(),
				paginas : $('#paginasWeb').val(),
		    },
		    function(data, status){
		    	window.location = "/home";
		    });

		}
	});

	$("#telefono").mask("(999) 999-9999");

});
