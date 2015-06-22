$('#btn-guardar-clave').click(function() {
    console.log('cambiando contrasena');
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
    $('#inputClaveActual').val("");
    $('#inputClaveNueva').val("");
    $('#inputConfirmacionClaveNueva').val("");

});
