/**
 * jQuery Validator 3
 * @author     biohzrdmx <github.com/biohzrdmx>
 * @version    3.0.20150722
 * @requires   jQuery 1.8+
 * @license    MIT
 */
;(function($) {
	$.fn.validate = function(options) {
		if (!this.length) { return this; }
		var opts = $.extend(true, {}, $.fn.validate.defaults, options);
		var result = false;
		this.each(function() {
			var form = $(this);
			// Make sure we have a form
			if ( form.is('form') ) {
				var rules = form.data('validator.rules');
				if (!rules) {
					// Build rule set
					var fields = form.find('[data-validate]');
					rules = [];
					fields.each(function(index, el) {
						el = $(el);
						rules.push({
							element: el,
							validator: el.data('validate'),
							param: el.data('param') || null
						});
					});
				}
				// Rules should be already set, validate form
				var fields = [];
				var error = 0;
				if (rules) {
					var rule, fn, ret;
					for (var i = 0; i < rules.length; i++) {
						rule = rules[i];
						fn = $.fn.validate.types[rule.validator];
						if( typeof fn === 'function' ) {
							ret = fn.call(form, {
								element: rule.element,
								param: rule.param
							});
							if (!ret) {
								error++;
								fields.push( rule.element );
							}
						} else {
							if ( (typeof console === 'object') && (typeof console.log === 'function') ) {
								console.log('Unknown validator method: ' + rule.validator);
							}
						}
					};
				}
				if (error > 0) {
					opts.error.call( form, $(fields) );
				} else {
					opts.success.call( form );
					result = true;
				}
			}
		});
		return result;
	};
	// Default validators
	$.fn.validate.types = {
		required: function(options) {
			var element = options.element || null;
			var param = options.param || null;
			if ( element && element.is(':visible') && !element.is(':disabled') ) {
				var val = $.trim( element.val() );
				// Checkboxes must be checked, radio groups must have at least one checked item, otherwise val() must not be empty
				if  (
						(element.is(':checkbox ') && !element.is(':checked')) ||
						(element.is(':radio') && $('input[name='+element.attr('name')+']:checked').length == 0 ) ||
						(val == '')
					){
					return false;
				}
			}
			return true;
		},
		equal: function(options) {
			var element = options.element || null;
			var param = options.param || null;
			var compare;
			if ( element && element.is(':visible') && !element.is(':disabled') ) {
				if ( typeof(param) == 'string' ) {
					compare = $(param);
				} else {
					compare = param;
				}
				if ( compare === null || element.val() == '' || element.val() !== compare.val() ) {
					return false
				}
			}
			return true;
		},
		email: function(options) {
			var element = options.element || null;
			var param = options.param || null;
			var regexp = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
			if (element && element.is(':visible') && !element.is(':disabled')) {
				return regexp.test( element.val() );
			}
			return true;
		},
		regexp: function(options) {
			var element = options.element || null;
			var param = options.param || null;
			var regexp = new RegExp(param);
			if (element && element.is(':visible') && !element.is(':disabled')) {
				return regexp.test( element.val() );
			}
			return true;
		},
		checked: function (options) {
			var element = options.element || null;
			var param = options.param || null;
			if ( element && element.is(':visible') && !element.is(':disabled') ) {
				var opts = param.match(/(at least|at most|exactly)\s([0-9]+)/);
				var opt = opts[1] || 'exactly';
				var qty = opts[2] || 1;
				var val = $('input[name=' + element.attr('name') + ']:checked').length;
				var ret = false;
				switch (opt) {
					case 'at least':
						ret = val >= qty;
						break;
					case 'at most':
						ret = qty >= val;
						break;
					case 'exactly':
						ret = val == qty;
				}
				return ret;
			}
			return true
		},
		date: function (options) {
			var element = options.element || null;
			var params = options.param || null;
			if ( element && element.is(':visible') && !element.is(':disabled') ) {
				var opts = params.match(/(before|after)\s([0-9]{4})\/([0-9]{1,2})\/([0-9]{1,2})/);
				var dateOpt= opts[1] || 'before';
				var dateCheck = new Date(opts[2] || 1900, --opts[3] || 0, opts[4] || 1);
				var dateValue = null;
				if (element.is('input') || element.is('textarea')) {
					dateValue = new Date(element.val());
				} else {
					var components = element.find('[data-date]');
					switch (components.length) {
						case 1:
							if 	(
									$.fn.validate.types.required({ element: element.find('[data-date="year"]') })
								)
							{
								dateValue = new Date(element.find('[data-date="year"]').val() || 1900);
							}
							break;
						case 2:
							if 	(
									$.fn.validate.types.required({ element: element.find('[data-date="year"]')  }) &&
									$.fn.validate.types.required({ element: element.find('[data-date="month"]') })
								)
							{
								dateValue = new Date(
									element.find('[data-date="year"]').val()      || 1900,
									element.find('[data-date="month"]').val() - 1 || 0
								);
							}
							break;
						case 3:
							if 	(
									$.fn.validate.types.required({ element: element.find('[data-date="year"]')  }) &&
									$.fn.validate.types.required({ element: element.find('[data-date="month"]') }) &&
									$.fn.validate.types.required({ element: element.find('[data-date="day"]')   })
								)
							{
								dateValue = new Date(
									element.find('[data-date="year"]').val()      || 1900,
									element.find('[data-date="month"]').val() - 1 || 0,
									element.find('[data-date="day"]').val()       || 1)
							}
					}
				}
				var ret = false;
				if (dateValue) switch (dateOpt) {
				case 'before':
					ret = dateCheck > dateValue;
					break;
				case 'after':
					ret = dateValue > dateCheck;
					break;
				case 'exactly':
					ret = dateValue == dateCheck;
				}
				return ret;
			}
			return true;
		},
		confirm: function(options) {
			var element = options.element || null;
			var param = options.param || null;
			var compare;
			if ( element && !element.is(':disabled') ) {
				if ( typeof(param) == 'string' ) {
					compare = $(param);
				} else {
					compare = param;
				}
				if ( compare === null || (compare.val() != '' && element.val() == '') || element.val() !== compare.val() ) {
					return false
				}
			}
			return true;
		}
	};
	// default options
	$.fn.validate.defaults = {
		error: function (fields) {},
		success: function () {}
	};
})(jQuery);