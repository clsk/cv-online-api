$(function() {
  $('.add-row').click(function(e) {
    e.preventDefault();
    var row = $(this).parent().children('.repeater-item:first').clone();
    row.find('input, textarea').val('');
    row.find('.box-tools').removeClass('hide');
    $(this).before(row);
  });
  $(document).on('click', '.remove-row', function(e) {
    e.preventDefault();
    $(this).parents('.repeater-item').remove();
  });
});

