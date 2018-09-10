(function (window) {
	'use strict';

	var App = window.App || {};
	var $ = window.jQuery;

	function CheckList(selector) {
		if (!selector) {
			throw new Error('No selector provided!');
		}

		this.$element = $(selector);
		if (this.$element.lenght === 0) {
			throw new Error('Could not find element with selector: ' + selector);
		}
	}

	CheckList.prototype.addRow = function (coffeeOrder) {
		var rowElement = new Row(coffeeOrder);
		var edit = this.$element.find('[value="'+ coffeeOrder.emailAddress +'"]').closest('[data-coffee-order="checkbox"]');

		this.$element.find('label').css('text-decoration', 'none');
		if (edit.length !== 0) {
			edit.replaceWith(rowElement.$element);
		}
		else {
			this.$element.append(rowElement.$element);
		}
	}

	CheckList.prototype.removeRow = function (email) {
		this.$element
			.find('[value="' + email + '"]')
			.closest('[data-coffee-order="checkbox"]')
			.remove();
	}

	CheckList.prototype.addClickHandler = function (fn) {
		this.$element.on('contextmenu', 'label', function(e) {
			e.preventDefault();

			var data = $(e.target).find('input').data('order');
			for (var prop in data) {
				if (prop === 'size')
					$('[type=radio][value="'+ data[prop] +'"]').prop('checked', true);
				else 
					$('[name="'+ prop +'"]').val(data[prop]);
			}
			$(e.target).css('text-decoration', 'line-through');
		});

		this.$element.on('click', 'input', function(e) {
			var email = e.target.value;
			$(e.target).closest('[data-coffee-order=checkbox]').css('opacity', '0.5');
			setTimeout(function() {
				fn(email)
				.then(function () {
					this.removeRow(email);
				}.bind(this));
			}.bind(this), 1500);
		}.bind(this));
	}

	function Row(coffeeOrder) {
		var $div = $('<div></div>', {
			'data-coffee-order': 'checkbox',
			'class': 'checkbox'
		});

		var $label = $('<label></label>');

		var $checkbox = $('<input></input>', {
			type: 'checkbox',
			value: coffeeOrder.emailAddress
		}).data('order', coffeeOrder);

		var $badge = $('<span></span>', {
			'class': 'btn btn-success btn-xs disabled'
		}).text('Улучшение напитка: ' + coffeeOrder.improver);

		var description = '[' + coffeeOrder.strength + 'x] ';
		description += coffeeOrder.size + ' ';
		if (coffeeOrder.flavor) 
			description += coffeeOrder.flavor + ' ';

		description += coffeeOrder.coffee + ', ';
		description += ' (' + coffeeOrder.emailAddress + ')';

		$label.append($checkbox);
		$label.append(description);
		if (coffeeOrder.improver)
			$label.append($badge);

		switch (coffeeOrder.flavor) {
			case 'caramel':
				$div.css({
					background: '#b17517',
					color: '#fff'
				});
				break;
			case 'almond':
				$div.css({
					background: '#d4b585',
				});
				break;
			case 'mocha':
				$div.css({
					background: '#7d491b',
					color: '#fff'
				});
				break;
		}
		$div.css('padding', '5px 10px');
		$div.append($label);

		this.$element = $div;
	}

	App.CheckList = CheckList;
	window.App = App;
})(window);