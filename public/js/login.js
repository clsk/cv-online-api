$(function() {
  
  $('#login-form-link').click(function(e) {
    $("#login-form").delay(100).fadeIn(100);
    $("#register-form").fadeOut(100);
    $('#register-form-link').removeClass('active');
    $(this).addClass('active');

    return false;
  });

  $('#register-form-link').click(function(e) {
    $("#register-form").delay(100).fadeIn(100);
    $("#login-form").fadeOut(100);
    $('#login-form-link').removeClass('active');
    $(this).addClass('active');

    return false;
  });

  $('#register-login-button').click(function(e){
    $('#register-login-modal').modal('show');
    
    return false;
  });
  /**Parte de olvide la contraseña*/

  $('.forgot-password').click(function(e){
  $('#register-login-modal').modal('hide');
    $('#modal-forgot-password').modal('show');

    return false;
  });
});
