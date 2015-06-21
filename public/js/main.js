$('#btn-guardar-clave').click(function() {
    console.log('cambionado contrasena');
    /* 
     * - Validar input
     * - Mandar request para cambiar clave
     * - Confirmar que cambio se realizo
     */
    alert('Su clave fue cambiada exitosamente');
    $('#modal-cambiar-clave').modal('hide');
    $('#inputClaveActual').val("");
    $('#inputClaveNueva').val("");
    $('#inputConfirmacionClaveNueva').val("");

});

$('#btn-borrar-cuenta').click(function() {
    console.log('Borrar cuenta');

    $('#modal-borrar-cuenta').modal('hide');

    var userid = $("#HiddenUserID").val();

    var parametros = {
        userID : userid,
    }

    $.ajax({
        data:  parametros,
        url:   'deleteAccountMethod',
        type:  'post',
        success:  function (response) {
            var url = "/index";    
            $(location).attr('href',url);
        }
    });

    $('#inputClaveActual').val("");
    $('#inputClaveNueva').val("");
    $('#inputConfirmacionClaveNueva').val("");

});