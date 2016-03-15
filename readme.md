##Introduction##

What's this? Just another jQuery form validation plugin.

Why? Because I needed a semantic, easy-to-use, extensible plug-in.

###Credits###

**Lead coder:** biohzrdmx [&lt;github.com/biohzrdmx&gt;](http://github.com/biohzrdmx)

###License###

The MIT License (MIT)

Copyright (c) 2016 biohzrdmx

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

##What's new##

**Changes from version 3.x**

- **New file names** - Now the files are named `jquery.valid4tor.js` and `jquery.valid4tor.min.js` &mdash; l33t speak FTW!
- **New namespace** - The namespace is now `$.validate` instead of `$.fn.validate`
- **Multiple rules** - Now you can add multiple validation rules, for example `data-validate="required|email"`. The order determines in which sequence they'll be executed.
- **Callbacks** - The `success` and `error` callbacks should now be specified inside the `callback` object; also there's a new callback `failed` which will run on a per-field basis whenerver a field doesn't pass a validation rule.
- **On demand validation** - You may continue using the `$.fn.validate` call as in `$('#my-form').validate(...)` BUT now you can also use the new API call `$.validate.check(fields, options)` in which you can pass the fields you actually want to validate.
- **Fields selector** - In the beginning, the validator used only `:visible` and `:not(:disabled)` fields and there was no way to override that. Now you can use the above API call or override the `fieldsSelector` option to specify which fields you want. Because you deserved it!
- **Break on fail** - As you already know, you can specify multiple rules per-field and there's a new `failed` callback, so there's also a new `breakOnFail` option to determine whether to continue running validations on each field when a rule hasn't been met or not.
- **Messages** - Finally! If you use the new `failed` callback you'll receive a message for each failed rule, for example `'This field is required'` for the `required` type. There's also a new `strings` object in `options` to assist you in your localization needs.
- **Data messages** - In addition to the above feature, you may specify a `data-message-*` attribute to override the message for a specific rule in a specific field, for example `data-message-regexp="This must be a number"` overrides the message for the `regexp` rule on a particular field. Tasty!

##Basic usage##

###Step one: Markup###

**Note:** For `data-*` attributes to be used, you'll need a valid HTML 5 DOCTYPE.

Create your forms as usual, then just add some data-* parameters:

	<form id="form-test" method="post">
		<label>Enter your name:</label>
		<input type="text" name="name" id="name" data-validate="required">
	</form>

The `data-validate` attribute specifies the kind of validator that will be used to check the field, you may choose one of:

    required
    equal
    email
    regexp
    checked
    date

Some of these validator types require an extra parameter so you just have to add another `data-*` attribute: `data-param`

####Required type####

Just checks if the field has been set, checkboxes must be checked and radio groups must have at least one item checked.

**Note:** Radio-group items must have a common `name` attribute.

####Equal type####

Checks if the given element's value matches another element; useful for email/password confirmation.

The `data-param` attribute must contain a selector to the other element:

	<input type="text" name="email_check" id="email_check" data-validate="equal" data-param="input[name=email]">

####Email type####

The well-known email checker, uses a regular expression to validate the entered email address.

**Note:** Hey regex nerds! this is the regular expression: `/^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/`

####RegExp type####

A powerful one, this uses a custom regular expression to match the value of the field.

As you may have guessed, the regular expression is passed through the `data-param` attribute:

	<input type="text" name="date" id="date" data-validate="regexp" data-param="[0-9]{4}\/[0-9]{1,2}\/[0-9]{1,2}">

####Checked type####

This is for checkbox-groups, you can specify a minimum or maximum ammount and even an exact number of required items.

The options are passed via the `data-param` attribute, only for the first item:

	<label for="opt_1"><input type="checkbox" name="hobbies" id="opt_1" data-validate="checked" data-param="at least 2">Option 1</label>
	<label for="opt_2"><input type="checkbox" name="hobbies" id="opt_2">Option 2</label>
	<label for="opt_3"><input type="checkbox" name="hobbies" id="opt_3">Option 3</label>
	<label for="opt_4"><input type="checkbox" name="hobbies" id="opt_4">Option 4</label>
	<label for="opt_5"><input type="checkbox" name="hobbies" id="opt_5">Option 5</label>

And you may choose one of:

    at least #
    at most #
    exactly #

Where # is any valid integer.

**Note:** Checkbox-group items must have a common `name` attribute.

####Date type####

The date validator does exactly that: validate dates.

For it to work, you must add some extra markup but, hey, it's not that bad: Just wrap your `select` boxes in a `div` or `span` and add the `data-*` attributes to the wrapping element:

	<div class="i-r-wrapper" data-validate="date" data-param="before 1985/01/01">
		<select data-date="year" name="year">...</select>
		<select data-date="month" name="month">...</select>
		<select data-date="day" name="day">...</select>
	</div>

As you may have noticed, there is also an extra `data-date` attribute on each of the select boxes; that attribute specifies which date component (day, month or year) is being represented by the field.

You can have only the year component, year/month fields or the full year/month/day stack, it's up to your needs. Just remember to add the correct `data-date` attributes.

Finally, you must specify the date that the fields will be checked against; for it you'll use the `data-param` attribute, using one of:

    before yyyy/mm/dd
    after yyyy/mm/dd
    exactly yyyy/mm/dd

Remember, this attribute (as well as the `data-validate` one) must go on the wrapper element.

Once you have written your markup it's time to code some JS.

###Step Two: JavaScript###

As simple as it gets, in your `ready()` function:

	$('#form-test').on('submit', function() {
		return $(this).validate({
			callbacks: {
				failed: function(field, type, message) {
					/* An item has failed validation, field has the jQuery object, type is the rule and message its description */
				},
				success: function() {
					/* Everything is OK, continue */
				},
				error: function(fields) {
					/* Missing info! 'fields' is a jQuery object with the offending fields */
				}
			}
		});
	});

That's all you need to validate your forms quickly and easily. Don't forget server-side validation.

###What if the validation-types that I need are not included?###

Well, you may add your own types if you want. It's pretty simple:

You'll need to add them **after including the jquery.valid4tor.js file** (or jquery.valid4tor.min.js for bandwidth savers), an anonymous self-calling function will do:

	(function($) {
		// Here we are creating a custom validator type for simple ranges
		$.validate.types.range = function(field, options) {
			var param = field.data('param') || null,
				ret = true;
			if ( field.length ) {
				var opts = param.match(/([0-9]+)...([0-9]+)/);
				var min = Number( opts[1] ) || 0;
				var max = Number( opts[2] ) || 100;
				var val = Number( field.val() );
				ret = (val >= min && val <= max);
				if (! ret ) {
					options.callbacks.fail.call(this, field, 'range', 'Enter any number between 5 and 10, inclusive');
				}
			}
			return ret;
		};
	})(jQuery);

As you can see, we are just adding an extra `range` function to the validators list, that function receives an `options` object with the jQuery element and its `data-param` as the `param` property.

Our sample type checks whether the element's value is inside the given range, using a simple regular expression to parse the parameter, then checking the element's disabled state and using simple math to return the result.

The function is called once per field, for each field with a `data-validate="range"` attribute: returning `true` means the field passed the validation.

##Example##

Check the `index.html` file for a complete example =)