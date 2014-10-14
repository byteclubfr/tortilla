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

		var modulePath = process.cwd() + '/' + path.normalize('./node_modules/' + module);

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

			if (typeof bower.main === "string") bower.main = [bower.main];

			bower.main.forEach(function (main) {
				var src = path.normalize(modulePath + '/' + main);
				var dst = process.cwd() + '/public/vendors/' + path.basename(main);
				fs.createReadStream(src).pipe(fs.createWriteStream(dst));
			});

		});

	});
});

