# jQuery.Validator

A simple (but powerful) validation plugin for jQuery.

## Why another validator?

Because I can =)

Just kidding. This plugin was meant to be as easy-to-use as possible, just add some rules and then check against them when submitting the form.

## Requirements

* jQuery 1.7 or greater

## License

Licensed under Creative Commons Attribution-ShareAlike 3.0 Unported License:

* Commercial use allowed
* Attribution required
* Share alike

What does that mean? You may use it in commercial projects and share it along with any changes you make to it. Attribution is required by the license but I'll leave it up to you.

## How does it work?

After you've created your form you just have to add some validation rules and on the submit event you ask the validator whether you can continue or not. It's dead easy.

But let's talk about the rules.

### Types of rules

* Required field
* Email field
* Equal-to field
* Regex-ed field
* Date field
* At least/At most field
* Checkboxes field

#### Required field

As the name says, this is a field that must not be empty.

This type of rule supports `input[type=text]` (textboxes), `input[type=checkbox]` (checkboxes), `input[type=radio]` (radio buttons) and `textarea` elements.

For textboxes and textareas it will check the `value` attribute, first trimming any outer whitespace and comparing it to the empty string `''`.

For checkboxes it will check it using the `.is(':checked')` function.

Radio buttons are a bit different. They get checked by using the `name` attribute, so you can check for a group of radio buttons instead of querying them one by one.

#### Email field

This is self-descriptive. Only works with text-type fields (textboxes and textareas) and will match its contents against a well-tested regular expression.

#### Equal-to field

Equal-to will check text-against-text, so it's useful for '*confirm your email/password*' fields (and as such, it's only for textbox/textarea fields).

#### Regex-ed field

The most powerful of all (well, not really). This little monster will test the contents of the field against a developer-provided regular expression, and as such, it's only for textbox/textarea fields (and dedicated to all of the regex nerds out there).

#### Date field

For those pesky registration forms, validate composite (year/month/date select fields) or single-input fields (using yyyy/mm/dd format)

#### At least/At most field

For checkboxes, radio buttons and more! Specify a minimum or maximum value and pass a group of elements and you're set.

#### Checkboxes field

For checkbox-groups only, at least one of them must be selected.

## Basic usage

1. Just add water.
2. Mix, and enjoy!

You create your form as always, then add an small `script` tag, and then add your rules. Once you've done that, add a listener to the `submit` event of your form and use the plugin to determine whether you should return true or false.

### The rules

To validate your forms, you must create some rules. Let's see how you do it:

##### Required field

	<script type="text/javascript">
		$(document).ready(function() {

			// Add a 'required' rule to element '#another_id'
			$.validator.addRule({ el: '#another_id', type: 'required' });

			// Does the same as above, but for element '#another_id'. Note that if not provided, 'type' defaults to 'required'
			$.validator.addRule({ el: '#another_id' });

		});
	</script>

You can use any jQuery selector, by id, by class, by tag, etc... as long as it returns at least one element.

There's a particular case for the required-type field: radio buttons

	<script type="text/javascript">
		$(document).ready(function() {

			// Add a 'required' rule to the radio group with name 'newsletter'
			$.validator.addRule({ el: 'input[name=newsletter]', type: 'required' });

		});
	</script>

What about the other types of rule?

##### Email field

	<script type="text/javascript">
		$(document).ready(function() {

			// Add an 'email' rule to element '#email'
			$.validator.addRule({ el: '#email', type: 'email' });

		});
	</script>

##### Equal-to field

	<script type="text/javascript">
		$(document).ready(function() {

			// Add an 'email' rule to element '#email'
			$.validator.addRule({ el: '#email', type: 'email' });

			// Now add an 'equal' rule to element '#emailc': 'to' receives a jQuery selector
			$.validator.addRule({ el: '#emailc', type: 'equal', to: '#email' });

		});
	</script>

##### Regex-ed field

	<script type="text/javascript">
		$(document).ready(function() {

			// This one validates a 'YYYY/MM/DD' date
			$.validator.addRule({ el: '#birthdate', type: 'regex', match: /^\d{4}\/\d{1,2}\/\d{1,2}$/ });

		});
	</script>

##### Date field

Date fields accept an optional before/after parameter so you can specify a date to check against (remember to use the YYYY/MM/DD format).

**Case 1: single-input field**

Before date:

	<script type="text/javascript">
		$(document).ready(function() {

			// This one validates a date before Jan 1, 1990
			$.validator.addRule({ el: '#date', type: 'date', before: '1990/01/01' });

		});
	</script>

After date:

	<script type="text/javascript">
		$(document).ready(function() {

			// This one validates a date after Dec 24, 2013
			$.validator.addRule({ el: '#date', type: 'date', after: '2013/12/24' });

		});
	</script>

**Case 2: composite-input (three select-boxes) field**

Before date:

	<script type="text/javascript">
		$(document).ready(function() {

			// This one validates a date before Jan 1, 1990
			$.validator.addRule({ el: '#year, #month, #day', type: 'date', before: '1990/01/01' });

		});
	</script>

After date:

	<script type="text/javascript">
		$(document).ready(function() {

			// This one validates a date after Dec 24, 2013
			$.validator.addRule({ el: '#year, #month, #day', type: 'date', after: '2013/12/24' });

		});
	</script>

Now, for this to work, you MUST add a `data-name` attribute to each of your `select` elements, and set it to 'year', 'month' or 'day', accordingly (check index.html for a sample).

##### At least/At most field

At least *n* items:

	<script type="text/javascript">
		$(document).ready(function() {

			// For a group of checkboxes, the typical 'pick at least 5 options'
			$.validator.addRule({ el: 'input[name=options]', type: 'at least', count: 5 });

		});
	</script>

At most *n* items:

	<script type="text/javascript">
		$(document).ready(function() {

			// For a group of checkboxes, the typical 'pick at most 5 options'
			$.validator.addRule({ el: 'input[name=options]', type: 'at most', count: 5 });

		});
	</script>


##### Checkboxes field

The checkboxes field applies the rule to a group of checkboxes that share a common attribute, so it will force the user to select at least one of each group; you may specify the grouping attribute with `param`:

	<script type="text/javascript">
		$(document).ready(function() {

			// For a group of checkboxes grouped by a given attribute
			$.validator.addRule({ el: 'input[type=checkbox]', type: 'checkboxes', param: 'group' });

		});
	</script>

### The validation process

With all those rules in place, we can now perform the actual validation.

Simply listen to the `submit` event of your form and then use the plugin:

	<script type="text/javascript">
		$(document).ready(function() {

			// On form submission...
			$('#frmSignup').on('submit', function() {
				// return the result of $.validator.validate()
				return $.validator.validate({
					form: $(this),
					error: function(fields) {
						fields.each(function() {
							var parent = $(this).closest('.control-group');
							parent.addClass('error');
							$(this).on('focus', function() {
								var parent = $(this).closest('.control-group');
								parent.removeClass('error');
							});
						});
					}
				});
			});

		});
	</script>

As you can see, the `validate()` method takes some parameters, they are:

* __form__ - Selector or jQuery object, the form you are validating
* __error__ - Function, will be called if some rule is not met, receives an array of jQuery objects (it is a normal array, not a jQuery object) with all of the 'missing' elements
* __success__ - Function, will be called when all the rules are met, has no parameters (see example below)

This is an example of the `success` callback:

	<script type="text/javascript">
		$(document).ready(function() {

			// On form submission...
			$('#frmSignup').on('submit', function() {
				// return the result of $.validator.validate()
				$.validator.validate({
					form: $(this),
					success: function() {
						// Do your Backbone.js magic here or post the form via AJAX, etc...
					},
					error: function(fields) {
						fields.each(function() {
							var parent = $(this).closest('.control-group');
							parent.addClass('error');
							$(this).on('focus', function() {
								var parent = $(this).closest('.control-group');
								parent.removeClass('error');
							});
						});
					}
				});
				return false;
			});

		});
	</script>

### A complete example

Just check index.html, that's the complete example from where all those code samples have been extracted. Enjoy!

## How can I help?

Clone the repo, make your changes and send me a pull request. Bug fixes and new features are always welcome =)

Also, feel free to report any issue.