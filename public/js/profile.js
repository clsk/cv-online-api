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
				telefonos : $('#telefonos').val(),
				paginas : $('#paginasWeb').val(),
		    },
		    function(data, status){
		    	window.location = "/home";
		    });

		}
	});

	function IsEmail(email) {
	  var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
	  return regex.test(email);
	}

	function IsPhoneNumber(phone) {
		console.log(phone);
	  if (phone == "") return true;
	  var regex = /^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/;
	  return regex.test(phone.trim());
	}

	$("#telefono").mask("(999) 999-9999");

});
