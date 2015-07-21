$(function() {
  if (cv) {
    console.log(cv);
    // Fill fields
    cv.work_experiences.forEach(function(work) {
    });
  }

  $('.add-row').click(function(e) {
    e.preventDefault();
    var row = $(this).parent().children('.repeater-item:first').clone();
    var fieldName = row.attr('data-name');
    var index = $(this).parent().children('.repeater-item').length;
    var name = fieldName + '[' + index + ']';
    row.find('input, textarea').each(function() {
      var newName = $(this).attr('name').replace(fieldName + '[' + (index-1) + ']', name);
      $(this).val('').attr('name', newName);
    })
    row.find('.box-tools').removeClass('hide');
    $(this).before(row);
  });
  $(document).on('click', '.remove-row', function(e) {
    e.preventDefault();
    $(this).parents('.repeater-item').remove();
  });
});

