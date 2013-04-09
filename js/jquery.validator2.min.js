/*
 *	jquery.validator2.js
 *
 *	Plugin: Validator
 *	Author: biohzrdmx
 *	Description: A very simple form validation plugin
 *	Version: 2.0 rev. 910
 *
 *	Licensed under Creative Commons Attribution-ShareAlike 3.0 Unported License:
 *
 *		- Commercial use allowed
 *		- Attribution required
 *		- Share alike
 */
(function($){$.validator={rules:[],init:function(options){return this},ltrim:function(stringToTrim){return stringToTrim.replace(/^\s+/,"")},rtrim:function(stringToTrim){return stringToTrim.replace(/\s+$/,"")},validate:function(options){var opts=$.extend({form:null,success:function(){},error:function(){}},options);var error=0;var email=/^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;var fields=[];var elem=null;var form=null;var val=null;var ptr=this;if(opts.form===null)return false;if(typeof(opts.form)=='string'){form=$(options.form)}else{form=opts.form}for(var i=0;i<this.rules.length;i++){rule=this.rules[i];if(typeof(rule.el)=='string'){elem=$(rule.el)}else{elem=rule.el}if(elem===undefined||elem===null){continue}if(!elem.parents('form').is(form)){continue}switch(rule.type){case'required':elem.each(function(){el=$(this);val=ptr.ltrim(ptr.rtrim(el.val()));if((el.is(':checkbox ')&&!el.is(':checked'))||(el.is(':radio')&&$('input[name='+el.attr('name')+']:checked').length==0)||(val=='')){error++;fields.push(el)}});break;case'email':elem.each(function(){el=$(this);if(!email.test(el.val())){error++;fields.push(el)}});break;case'regex':elem.each(function(){el=$(this);if(rule.param===null||!rule.param.test(el.val())){error++;fields.push(el)}});break;case'equal':elem.each(function(){el=$(this);var compare=null;if(typeof(rule.param)=='string'){compare=$(rule.param)}else{compare=rule.param}if(compare===null||el.val()==''||el.val()!==compare.val()){error++;fields.push(el)}});break}}if(error>0){opts.error.call(form,$(fields));return false}else if(error==0){ret=opts.success.call(form);return true}},addRule:function(options){var opts=$.extend({el:null,type:'required',msg:null,attr:null,param:null,to:null,match:null},options);if(opts.el!==null){var rule={el:opts.el,type:opts.type,msg:opts.msg,param:opts.param||opts.to||opts.match};this.rules.push(rule)}}}})(jQuery);