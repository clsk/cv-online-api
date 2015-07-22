var CVForm = function(data) {
  var self = this;
  this.cv = data || null;

  var fillRepeater = function(repeaterName, selector) {
    for(key in this.cv[repeaterName]) {
      var container = $(selector).find('.repeater-item:last');
      for(field in this.cv[repeaterName][key]) {
        var element = container.find('.' + field);
        if (!element.length) continue;
        if (element[0].nodeName.toLowerCase() == 'textarea') {
          console.log(this.cv[repeaterName][key][field]);
          element.text(this.cv[repeaterName][key][field]);
        } else if(element.attr('datepicker') != undefined) {
          var date = new Date(this.cv[repeaterName][key][field]);
          element.val(date.getFullYear() + '-' + (date.getMonth()+1) + '-' + date.getDate());
        } else {
          element.val(this.cv[repeaterName][key][field]);          
        }
      }
      if (key < this.cv[repeaterName].length - 1) {
        CVForm.addRow(container, key + 1);
      }
    };
  }

  var fillFields = function() {
    for (key in this.cv.fields) {
      $('[name="fields[' + key + ']"]').val(this.cv.fields[key]);
    }
  }

  this.fillData = function(cv) {
    fillRepeater('work_experiences', '#experience');
    fillRepeater('education', '#education');
    fillFields();
  }
}

CVForm.addRow = function(container, index) {
  var row = container.clone();
  var fieldName = row.attr('data-name');
  var name = fieldName + '[' + index + ']';
  row.find('input, textarea').each(function() {
    var newName = $(this).attr('name').replace(fieldName + '[' + (index-1) + ']', name);
    $(this).val('').attr('name', newName);
  })
  row.find('.box-tools').removeClass('hide');
  container.after(row);
  row.find('[datepicker]').datepicker({format: "yyyy-mm-dd"});
}

$(function() {
  if (typeof cv != 'undefined') {
    var form = new CVForm(cv);
    form.fillData(cv);
  }

  $('.add-row').click(function(e) {
    e.preventDefault();
    var container = $(this).parent().children('.repeater-item:last');
    var count = $(this).parent().children('.repeater-item').length;
    CVForm.addRow(container, count);
  });

  $(document).on('click', '.remove-row', function(e) {
    e.preventDefault();
    $(this).parents('.repeater-item').remove();
  });

  $('[datepicker]').datepicker({format: "yyyy-mm-dd"});
  CKEDITOR.replaceAll();
});