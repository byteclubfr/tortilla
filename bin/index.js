#!/usr/bin/env node
var npm = require('npm');
var fs = require('fs');
var path = require('path');
var module = require('yargs').argv._[0];

npm.load({
	loaded: false
}, function (err) {
	// catch errors
	npm.commands.install([module], function (er, data) {

		var modulePath = './' + path.normalize('./node_modules/' + module);

		fs.exists(modulePath + '/bower.json', function(exists) {

			if (!exists) {
				console.error("module or bower file not found");
				return;
			}

			var bower = require(modulePath + '/bower.json');

			if (!bower.main) {
				console.error("main section not found in bower.json");
				return
			}

			var src = './' + path.normalize(modulePath + '/' + bower.main);
			var dst = './public/vendors/' + path.normalize(bower.main);

			fs.createReadStream(src).pipe(fs.createWriteStream(dst));

		});

	});
});

