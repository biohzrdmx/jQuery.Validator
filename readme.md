##Introduction##

What's this? Just another jQuery form validation plugin.

Why? Because I needed a semantic, easy-to-use, extensible plug-in.

###Credits###

**Lead coder:** biohzrdmx [&lt;github.com/biohzrdmx&gt;](http://github.com/biohzrdmx)

###License###

The MIT License (MIT)

Copyright (c) 2013 biohzrdmx

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

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
			success: function() {
				/* Everything is OK, continue */
			},
			error: function(fields) {
				/* Missing info! 'fields' is a jQuery object with the offending fields */
			}
		});
	});

That's all you need to validate your forms quickly and easily. Don't forget server-side validation.

###What if the validation-types that I need are not included?###

Well, you may add your own types if you want. It's pretty simple:

You'll need to add them **after including the jquery.validator3.js file** (or jquery.validator3.min.js for bandwidth savers), an anonymous self-calling function will do:

	(function($) {
		// Here we are creating a custom validator type for simple ranges
		$.fn.validate.types.range = function(options) {
			var element = options.element || null;
			var param = options.param || null;
			if (element && !element.is(':disabled')) {
				var opts = param.match(/([0-9]+)...([0-9]+)/);
				var min = Number( opts[1] ) || 0;
				var max = Number( opts[2] ) || 100;
				var val = Number( element.val() );
				return (val >= min && val <= max);
			}
			return true;
		};
	})(jQuery);

As you can see, we are just adding an extra `range` function to the validators list, that function receives an `options` object with the jQuery element and its `data-param` as the `param` property.

Our sample type checks whether the element's value is inside the given range, using a simple regular expression to parse the parameter, then checking the element's disabled state and using simple math to return the result.

The function is called once per field, for each field with a `data-validate="range"` attribute: returning `true` means the field passed the validation.

##Example##

Check the `index.html` file for a complete example =)