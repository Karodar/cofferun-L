(function(window) {
  'use strict';
  var App = window.App || {};
  var $ = window.jQuery;

  function FormHandler(selector) {
    if(!selector)
      throw new Error('No selector provided');

    this.$formElement = $(selector);
    if(this.$formElement.length === 0)
      throw new Error('Could not find element with selector ' + selector);
  }

  FormHandler.prototype.addInputHandler = function (fn) {
    console.log('Setting input handler for form');

    function check (target, message, cb) {
      var email = target.value, result = cb(email);
      if (result) {
        $(target).setCustomValidity('');
      } else {
        $(target).setCustomValidity(message);
      }

    }

    this.$formElement.on('input', '[name=emailAddress]', function(e) {
      check(e.target, 'Данное название адреса электронной почты не является корпоративным!', fn);
    });
  }

  FormHandler.prototype.addSubmitHandler = function (fn) {
    console.log('Setting submit handler for form');
    this.$formElement.on('submit', function(e) {
      e.preventDefault();

      var data = {};
      $(this).serializeArray().forEach(function(item) {
        data[item.name] = item.value;
        console.log('['+item.name + ' is ' + item.value+']');
      });

      if(data['size'] == 'coffeeZilla' && data['strength'] == 100 && data['flavor'] != '') {
        console.log('Achieved achievement for form!');
        var $tpl_alert = $('<div class="alert alert-success" role="alert" data-achievement-info="alert"></div>'),
            $tpl_btn = $('<button class="btn btn-block"></button>'),
            $tpl_select = $('<select class="form-control"></select>'),
            $tpl_option = $('<option value=""></option>'),

            $box = $('#achievement'),
            $container = $box.find('.panel-body'),
            $alert,
            $achiev_btn,
            form = this,
            end = '';

        if($box.length !== 0) {
          if ($container.children().length !== 0) 
            $container.children().remove();
          $container.append($tpl_alert.text("Вы выбрали самый большой кофе невероятной крепости со вкусом '"+data['flavor']+"'. Хотите воспользоваться своим достижением?"));
          $container.append($tpl_btn.clone().addClass('btn-success').attr('data-achievement-action', 'yes').text('Да'));
          $container.append($tpl_btn.clone().addClass('btn-danger').attr({
            'data-achievement-action': 'no',
            'data-dismiss': 'modal'
          }).text('Нет'));
          $box.modal('show');
          $alert = $container.find('[data-achievement-info="alert"]');
          $achiev_btn = $container.find('.btn');

          $box.on('hidden.bs.modal', function() {
            $container.children().remove();
          });

          $achiev_btn.on('click', function(e) {
            e.preventDefault();
            switch ($(this).data('achievement-action')) {
              case 'yes':
                if (data['emailAddress']) {
                  $alert.text('Выберете дальнейшее улучшение вашего кофе:');
                  $achiev_btn.not('[data-achievement-action = yes]').remove();
                  $achiev_btn = $achiev_btn.filter('[data-achievement-action = yes]');
                  $achiev_btn.data({
                    'achievementAction': 'upgrade'
                  }).text('Усовершенствовать');
                  $tpl_select = $tpl_select.attr('name', 'improver').append($tpl_option.val('time')
                    .text('Путешествие во времени'));
                  $tpl_select = $tpl_select.append($tpl_option.clone().val('think').text('Чтение мыслей'));
                  $tpl_select = $tpl_select.append($tpl_option.clone().val('code').text('Код без ошибок'));
                  $achiev_btn.before($tpl_select);
                  $('[name=improver]').wrap('<div class="form-group"></div>');
                }
                else {
                  $(this).remove();
                  $alert.toggleClass('alert-success alert-danger').text('Вы не указали email-адрес!');
                  $achiev_btn.not('[data-achievement-action != no]').text('Понятно');
                  return false;
                }
                break;
              case 'upgrade':
                $(this).attr('data-dismiss', 'modal');
                data['improver'] = $('[name=improver]').val();
                fn(data)
                .then(function () {
                  this.reset();
                  this.elements[0].focus();
                }.bind(form));
                break;
            }
          });
        }
      } else {
        fn(data)
        .then(function () {
          this.reset();
          this.elements[0].focus();
        }.bind(this));
      } 
    });
  };

  FormHandler.prototype.addRangeHandler = function (validation) {
    console.log('Setting range handler for form');

    $(this.$formElement[0].elements[7]).on('change', function(e) {
      var value = $(this).val();
      var insert = '<span>: '+value+'</span>';
      var oldLabel = $('[for='+$(this).attr('id')+']');
      if(value < 30)
        oldLabel.css('color', 'green');
      else if(value >= 30 && value < 60)
        oldLabel.css('color', 'saddlebrown');
      else if(value >= 60 && value <= 100)
        oldLabel.css('color', 'red');

      if(oldLabel.find('span').length !== 0)
        oldLabel.find('span').text(': '+value);
      else
        oldLabel.append(insert);
    });

    this.$formElement.on('reset', function(e) {
      var $labelRating = $(e.target).find('label[for=strengthLevel]');
      $labelRating.find('span').remove();
      $labelRating.css('color', '#333');
    });
  }

  App.FormHandler = FormHandler;
  window.App = App;
})(window);
