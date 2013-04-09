/*
 *  jquery.validator2.js
 *
 *  Plugin: Validator
 *  Author: biohzrdmx
 *  Description: A very simple form validation plugin
 *  Version: 2.3
 *  License: MIT
 */
(function($) {

    $.validator = {
        rules: [],
        init: function(options) {
            return this;
        },
        ltrim: function(stringToTrim) {
            return stringToTrim.replace(/^\s+/,"");
        },
        rtrim: function(stringToTrim) {
            return stringToTrim.replace(/\s+$/,"");
        },
        validate: function(options) {
            var validator = this;
            var opts = $.extend({
                rules: [],
                form: null,
                success: validator.onSuccess,
                error: validator.onError
            }, options);
            var error = 0;
            var email = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
            var fields = [];
            var elem = null;
            var form = null;
            var val = null;
            var ptr = this;
            if (opts.form === null)
                return false;
            // Get the form
            if (typeof(opts.form) == 'string') {
                form = $(options.form);
            } else {
                form = opts.form;
            }
            // Rules to check
            var ruleSet = opts.rules.length > 0 ? opts.rules : this.rules;
            // Check each rule
            for(var i= 0; i< ruleSet.length; i++) {
                rule = ruleSet[i];
                if (typeof(rule.el) == 'string') {
                    elem = $(rule.el);
                } else {
                    elem = rule.el;
                }
                // Each rule should have a valid 'el' attribute
                if (elem === undefined || elem === null) {
                    // Bad 'el', skip rule
                    continue;
                }
                // Check whether the rule applies to the current form or not
                if (!elem.parents('form').is(form)) {
                    // Not on the current form, skip rule
                    continue;
                }
                // Check rule type
                switch (rule.type) {
                    case 'required':
                        // Value must be set and/or not empty
                        elem.each(function() {
                            el = $(this);
                            if ( el.is(':disabled') ) return;
                            val = ptr.ltrim(ptr.rtrim(el.val()));
                            // Checkboxes must be checked, radio groups must have at least one checked item, otherwise val() must not be empty
                            if ((el.is(':checkbox ') && !el.is(':checked')) ||
                                (el.is(':radio') && $('input[name='+el.attr('name')+']:checked').length == 0 ) ||
                                (val == '') ){
                                error++;
                                fields.push(el);
                            }
                        });
                        break;
                    case 'email':
                        // Value must be a valid email address
                        elem.each(function() {
                            el = $(this);
                            if ( el.is(':disabled') ) return;
                            if (!email.test(el.val())) {
                                error++;
                                fields.push(el);
                            }
                        });
                        break;
                    case 'regex':
                        // Value must pass regex test
                        elem.each(function() {
                            el = $(this);
                            if ( el.is(':disabled') ) return;
                            if (rule.param === null || !rule.param.test(el.val())) {
                                error++;
                                fields.push(el);
                            }
                        });
                        break;
                    case 'equal':
                        // Value must be equal to another element's value
                        elem.each(function() {
                            el = $(this);
                            var compare = null;
                            // Check type of 'param' var
                            if (typeof(rule.param) == 'string') {
                                // If it's a string it must be a jQuery selector, run it
                                compare = $(rule.param);
                            } else {
                                compare = rule.param
                            }
                            if ( el.is(':disabled') || compare.is(':disabled') ) return;
                            if (compare === null || el.val() == '' || el.val() !== compare.val()) {
                                error++;
                                fields.push(el);
                            }
                        });
                        break;
                    case 'checkboxes':
                        // At least one checkbox must be set
                        elem.each(function() {
                            el = $(this);
                            if ( el.is(':disabled') ) return;
                            var group = el.attr(rule.param);
                            if ( (el.is(':checkbox') && $('input['+rule.param+'="'+group+'"]:checked').length == 0 ) ){
                                error++;
                                fields.push(el);
                            }
                        });
                        break;
                    case 'at least':
                    case 'at most':
                        // Value must be set and/or not empty
                        var localFields = [];
                        var count = 0;
                        elem.each(function() {
                            el = $(this);
                            if ( el.is(':disabled') ) return;
                            val = ptr.ltrim(ptr.rtrim(el.val()));
                            localFields.push(el);
                            // Checkboxes must be checked, radio groups must have at least one checked item, otherwise val() must not be empty
                            if ((el.is(':checkbox ') && !el.is(':checked')) ||
                                (el.is(':radio') && $('input[name='+el.attr('name')+']:checked').length == 0 ) ||
                                (val == '') ){
                                // Do nothing, an empty field doesn't increment counter
                            } else {
                                count++;
                            }
                        });
                        if (rule.type == 'at least' && count < rule.param) {
                            // There aren't at least n items
                            error++;
                            fields = fields.concat(localFields);
                        } else if (rule.type == 'at most' && count > rule.param) {
                            // At most n items
                            error++;
                            fields = fields.concat(localFields);
                        }
                        break;
                }
            }
            //  Now check for erros
            if (error > 0) {
                // There are some errors, form doesn't validate
                opts.error.call(form, $(fields));
                return false;
            }
            else if (error == 0) {
                // Everything's OK, form validates!
                ret = opts.success.call(form);
                return true;
            }
        },
        addRule: function(options) {
            var validator = this;
            var opts = $.extend({
                el: null,
                type: 'required',
                msg: null,
                attr: null,
                param: null,
                to: null,
                match: null,
                auto: false
            }, options);
            if (opts.el !== null) {
                var rule = {
                    el: opts.el,
                    type: opts.type,
                    msg: opts.msg,
                    param: opts.param || opts.to || opts.match
                };
                // Automatic validation
                if (opts.auto) {
                    var el = typeof opts.el == 'string' ? $(opts.el) : opts.el;
                    el.on('blur', function() {
                        validator.validate({
                            form: el.closest('form'),
                            rules: [ rule ],
                            error: validator.onError,
                            success: function() {
                                validator.onSuccess.call(validator, el);
                            }
                        });
                    });
                }
                // Save the rule
                this.rules.push(rule);
            }
        },
        onSuccess: function(fields) {
            /* Placeholder, override to receive notifications on auto validating fields */
        },
        onError: function(fields) {
            /* Placeholder, override to receive errors on auto validating fields */
        }
    };
})(jQuery);