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