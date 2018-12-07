/**
 * jQuery Validator 4
 * @author     biohzrdmx <github.com/biohzrdmx>
 * @version    4.0.20160315
 * @requires   jQuery 1.8+
 * @license    MIT
 */
;(function($) {
	$.fn.validate = function(options) {
		if (!this.length) { return this; }
		var opts = $.extend(true, {}, $.validate.defaults, options),
			result = false,
			errors = 0;
		this.each(function() {
			var el = $(this),
				fields = el.find(opts.fieldsSelector),
				res = $.validate.check(fields, opts);
			if (! res ) {
				errors++;
			}
		});
		// Return TRUE if there are no errors, FALSE otherwise
		return (errors == 0);
	};
	$.validate = {
		defaults: {
			breakOnFail: true,
			fieldsSelector: '[data-validate]:visible:not(:disabled)',
			callbacks: {
				fail:    $.noop,
				error:   $.noop,
				success: $.noop
			},
			strings: {
				required: 'This is a required field',
				email:    'This must be a valid email address',
				equal:    'The fields don\'t match',
				confirm:  'The fields don\'t match',
				regexp:   'The field doesn\'t match the specified pattern',
				checked:  {
					'at least': 'You must select at least # options',
					'at most':  'You must select at most # options',
					'exactly':  'You must select exactly # options'
				},
				date: {
					before:  'The date must be before #',
					after:   'The date must be after #',
					exactly: 'The date must be exactly #'
				}
			}
		},
		types: {
			required: function(field, options) {
				var val = $.trim( field.val() ),
					ret = true,
					message = field.data('message-required');
				// Checkboxes must be checked, radio groups must have at least one checked item, otherwise val() must not be empty
				if ( field.length ) {
					if  (
							(field.is(':checkbox ') && !field.is(':checked')) ||
							(field.is(':radio') && $('input[name="' + field.attr('name')+'"]:checked').length == 0 ) ||
							(val == '')
						){
						ret = false;
						options.callbacks.fail.call(this, field, 'required', message || options.strings.required);
					}
				}
				// Return TRUE if valid, FALSE otherwise
				return ret;
			},
			email: function(field, options) {
				var ret = true,
					regexp = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/,
					message = field.data('message-email');
				if ( field.length ) {
					ret = regexp.test( field.val() );
					if (! ret ) {
						options.callbacks.fail.call(this, field, 'email', message || options.strings.email);
					}
				}
				// Return TRUE if valid, FALSE otherwise
				return ret;
			},
			equal: function(field, options) {
				var ret = true,
					param = field.data('param'),
					compare = typeof(param) == 'string' ? $(param) : param,
					message = field.data('message-equal');
				if ( field.length && compare.length ) {
					ret = field.val() == compare.val();
					if (! ret ) {
						options.callbacks.fail.call(this, field, 'equal', message || options.strings.equal);
					}
				}
				// Return TRUE if valid, FALSE otherwise
				return ret;
			},
			confirm: function(field, options) {
				var ret = true,
					param = field.data('param'),
					compare = typeof(param) == 'string' ? $(param) : param,
					message = field.data('message-confirm');
				if ( compare.val() && field.length && compare.length ) {
					ret = field.val() == compare.val();
					if (! ret ) {
						options.callbacks.fail.call(this, field, 'confirm', message || options.strings.confirm);
					}
				}
				// Return TRUE if valid, FALSE otherwise
				return ret;
			},
			regexp: function(field, options) {
				var ret = true,
					param = field.data('param'),
					regexp = new RegExp(param),
					message = field.data('message-regexp');
				if ( field.length ) {
					ret = regexp.test( field.val() );
					if (! ret ) {
						options.callbacks.fail.call(this, field, 'regexp', message || options.strings.regexp);
					}
				}
				// Return TRUE if valid, FALSE otherwise
				return ret;
			},
			checked: function(field, options) {
				var ret = true,
					param = field.data('param'),
					opts = param.match(/(at least|at most|exactly)\s([0-9]+)/),
					opt = opts[1] || 'exactly',
					qty = opts[2] || 1,
					val = $('input[name="' + field.attr('name') + '"]:checked').length,
					message = field.data('message-checked');
				if ( field.length ) {
					qty = Number(qty);
					switch (opt) {
						case 'at least':
							ret = val >= qty;
						break;
						case 'at most':
							ret = qty >= val;
						break;
						case 'exactly':
							ret = val == qty;
						break;
					}
					if (! ret ) {
						options.callbacks.fail.call(this, field, 'checked', message || options.strings.checked[opt].replace('#', qty));
					}
				}
				// Return TRUE if valid, FALSE otherwise
				return ret;
			},
			date: function(field, options) {
				var ret = true,
					param = field.data('param'),
					message = field.data('message-date'),
					opts = param.match(/(before|after)\s([0-9]{4})\/([0-9]{1,2})\/([0-9]{1,2})/),
					dateOpt= opts[1] || 'before',
					dateCheck = new Date(opts[2] || 1900, --opts[3] || 0, opts[4] || 1),
					dateValue = null;
				if ( field.length ) {
					if (field.is('input') || field.is('textarea')) {
						dateValue = new Date( field.val() );
					} else {
						var components = field.find('[data-date]');
						switch (components.length) {
							case 1:
								dateValue = new Date(
									field.find('[data-date="year"]').val()      || 1900
								);
							break;
							case 2:
								dateValue = new Date(
									field.find('[data-date="year"]').val()      || 1900,
									field.find('[data-date="month"]').val() - 1 || 0
								);
							break;
							case 3:
								dateValue = new Date(
									field.find('[data-date="year"]').val()      || 1900,
									field.find('[data-date="month"]').val() - 1 || 0,
									field.find('[data-date="day"]').val()       || 1)
							break;
						}
					}
					console.log(dateCheck, dateValue);
					if (dateValue) {
						switch (dateOpt) {
							case 'before':
								ret = dateCheck > dateValue;
							break;
							case 'after':
								ret = dateValue > dateCheck;
							break;
							case 'exactly':
								ret = dateValue == dateCheck;
							break;
						}
					}
					if (! ret ) {
						options.callbacks.fail.call(this, field, 'date', message || options.strings.date[dateOpt].replace('#', dateCheck.toDateString()));
					}
				}
				// Return TRUE if valid, FALSE otherwise
				return ret;
			}
		},
		check: function(fields, options) {
			var obj = this,
				opts = $.extend(true, {}, $.validate.defaults, options),
				errors = 0,
				errorFields = [];
			$.each(fields, function() {
				var field = $(this),
					rules = field.data('validate').split('|');
				// Iterate validation rules
				for (var i = 0; i < rules.length; i++) {
					var type = rules[i],
						res = false;
					if ( typeof $.validate.types[type] === 'function' ) {
						// Run validation rule
						res = $.validate.types[type].call(obj, field, opts);
						if (! res ) {
							// Increase error counter
							errors++;
							// Add field to array
							errorFields.push(field);
							// Should we exit?
							if (opts.breakOnFail) break;
						}
					}
				};
			});
			// Run callbacks
			if (! errors ) {
				opts.callbacks.success.call(obj, fields);
			} else {
				opts.callbacks.error.call(obj, $(errorFields));
			}
			// Return TRUE if there are no errors, FALSE otherwise
			return (errors == 0);
		}
	};
})(jQuery);