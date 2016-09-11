var express = require('express');
var router = express.Router();
var config = require('config');
var request = require('request');
var util = require('util');
var vm = require('vm');

/* GET users listing. */
router.get('/', function(req, res, next) {
	if(req.session.team){
		res.render('index/welcome',{
			team: req.session.team
		});
	}else{
		res.render('index/index',{
			config: config
		});
	}
});

router.get('/logout', function(req, res, next) {
	delete req.session.team;
	res.redirect('/');
});


router.get('/:package/:function', function(req, res, next) {
	console.log('params: %s',util.inspect(req.params))
	console.log('query: %s',util.inspect(req.query))

	var code = "var %s = require('%s');var %s = new %s();%s.%s(%s)";
	var renderedCode = util.format(code,capitalizeFirstLetter(req.params.package),req.params.package,req.params.package,capitalizeFirstLetter(req.params.package),req.params.package,req.params.function,JSON.stringify(req.query));

	console.log('renderedCode: %s',renderedCode)

	// var context = new vm.createContext({});
	// var script = new vm.Script(renderedCode);
	// var ret = script.runInContext(context);
	// console.log('ret is %s',util.inspect(ret))

	var ret = eval(renderedCode)
	console.log('ret is %s',util.inspect(ret))

	res.json({ret: ret})
})

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

module.exports = router;
