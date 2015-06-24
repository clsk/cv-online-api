$('#btn-guardar-clave').click(function() {
    if ($('#newpassword').val() != $('#confirmnewpassword').val()) {
        alert("No se pudo confirmar la clave");
        $('#inputClaveActual').val("");
        return false;
    }

    $('#change-password-form').submit();
});

$('#btn-borrar-cuenta').click(function() {
    $('#modal-borrar-cuenta').modal('hide');
    $('#inputClaveActual').val("");
    $('#inputClaveNueva').val("");
    $('#inputConfirmacionClaveNueva').val("");
});

/*Probando*/
$('#btn-recuperar-cuenta').click(function() {
    


});