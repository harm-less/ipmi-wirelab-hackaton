
var ng = angular.module('hackaton', []);
ng.controller('ControlsCtrl', function($scope) {

	var gameID = "rembrandt";

	var game = new Game();
	var initGame = game.init.bind(game);
	var socket = game.websocket("192.168.1.124", "4000", gameID);
	initGame();

	var debug = $scope.debug = game.debug;

	socket.connect();


	var persons = [];
	var person;

	var expectedIntensity = 0;
	var currentIntensity = 0;

	$scope.intensity = {
		model: 0
	};


	var masterVolume = 1;
	var songs = [
		{
			speed: 250,
			layers: 6
		}
	];
	var currentSong = songs[0];
	var songLayers = [];

	var queue = new createjs.LoadQueue(true);
	queue.installPlugin(createjs.Sound);
	angular.forEach(songs, function(song, songIndex) {
		var layers = song.layers;
		var layerNames = [];
		for (var i = 0;i < layers;i++) {
			var id = 'song' + songIndex + '-' + i;
			queue.loadFile({id: id, src: '../../src/sounds/songs/' + (songIndex + 1) + '/' + (i + 1) + '.mp3', type: createjs.AbstractLoader.SOUND});
			layerNames.push(id);
		}

		song.layers = layerNames;
	});

	queue.on('complete', function(event) {
		setTimeout(function() {
			playSong(currentSong);

			setSongLayerVolumes();
		}, 2000);
	});

	function playSong(song) {
		createjs.Sound.stop();

		currentSong = song;
		angular.forEach(song.layers, function(layerName) {
			songLayers.push(createjs.Sound.play(layerName, {loop: -1}));
		});

		socket.send({
			type: "song.changed",
			song: song
		});
	}

	function setSongLayerVolumes() {
		angular.forEach(songLayers, function(songLayer, index) {

			var volume = (index >= currentIntensity ? 0 : 1) * masterVolume;

			createjs.Tween.get(songLayer)
				.to({volume: volume}, 1000, createjs.Ease.getPowInOut(2));
		});
	}



	function updateCurrentIntensity() {
		if (currentIntensity === expectedIntensity) return;

		if (currentIntensity > expectedIntensity) {
			currentIntensity--;
			debouncedCurrentIntensity();
		}
		if (currentIntensity < expectedIntensity) {
			currentIntensity++;
			debouncedCurrentIntensity();
		}

		setSongLayerVolumes();

		console.log('intensity.changed', currentIntensity);

		socket.send({
			type: "intensity.changed",
			intensity: currentIntensity
		});
	}
	var debouncedCurrentIntensity = throttle(updateCurrentIntensity, 1000, {leading: true});



	function throttle(func, wait, options) {
		var timeout, context, args, result;
		var previous = 0;
		if (!options) options = {};

		var later = function() {
			previous = options.leading === false ? 0 : _.now();
			timeout = null;
			result = func.apply(context, args);
			if (!timeout) context = args = null;
		};

		var throttled = function() {
			var now = _.now();
			if (!previous && options.leading === false) previous = now;
			var remaining = wait - (now - previous);
			context = this;
			args = arguments;
			if (remaining <= 0 || remaining > wait) {
				if (timeout) {
					clearTimeout(timeout);
					timeout = null;
				}
				previous = now;
				result = func.apply(context, args);
				if (!timeout) context = args = null;
			} else if (!timeout && options.trailing !== false) {
				timeout = setTimeout(later, remaining);
			}
			return result;
		};

		throttled.cancel = function() {
			clearTimeout(timeout);
			previous = 0;
			timeout = context = args = null;
		};

		return throttled;
	};

	socket.listen = function(data) {
		if (!data.gameId || (data && data.gameId !== gameId)) return;

		if (data.type === 'person.entered') {
			expectedIntensity = Math.max(0, Math.min(6, data.total));
			console.log('entered', currentIntensity);
			debouncedCurrentIntensity();
		}
		if (data.type === 'person.left') {
			expectedIntensity = Math.max(0, Math.min(6, data.total));
			console.log('left', currentIntensity);
			debouncedCurrentIntensity();
		}
	};




	game.tsps.onEnter(function(data){
		if (debug) {
			var circle = new createjs.Shape();
			circle.graphics.beginFill("#ccc").drawCircle(0, 0, 20);
			game.stage.addChild(circle);
		}

		game.tsps.follow(circle, {x:0, y:0});
		persons[data.id] = (circle);

		sendAddPersonEvent();
	});

	function sendAddPersonEvent(data) {

		var total = objectSize(game.tsps.persons) + $scope.intensity.model;
		expectedIntensity = Math.max(0, Math.min(6, total));
		debouncedCurrentIntensity();
	}

	game.tsps.onLeave(function(data){
		if (debug) {
			game.stage.removeChild(persons[data.id]);
		}
		persons.splice(data.id, 1);

		sendRemovePersonEvent(data);
	});

	function sendRemovePersonEvent(data) {
		var total = objectSize(game.tsps.persons) + $scope.intensity.model;

		expectedIntensity = Math.max(0, Math.min(6, total));
		debouncedCurrentIntensity();
	}

	$scope.$watch('intensity.model', function(newIntensity, oldIntensity) {

		if (oldIntensity < newIntensity) {
			sendAddPersonEvent();
		}
		else {
			sendRemovePersonEvent();
		}
	});






	var bg = new createjs.Bitmap("assets/images/bg.jpg");
	game.stage.addChild(bg);

	var comeCloser = new createjs.Bitmap("assets/images/_0001_Come-closer.png");
	comeCloser.x = 320;
	comeCloser.y = 300;
	game.stage.addChild(comeCloser);

	var bitmapAnd = new createjs.Bitmap("assets/images/_0002_&.png");
	bitmapAnd.scaleX = bitmapAnd.scaleY = .6;
	bitmapAnd.x = 920;
	bitmapAnd.y = 570;
	game.stage.addChild(bitmapAnd);

	var formCrowd = new createjs.Bitmap("assets/images/_0001_Form-a-crowd.png");
	formCrowd.x = 750;
	formCrowd.y = 700;
	game.stage.addChild(formCrowd);

	var logo = new createjs.Bitmap("assets/images/_0000_M.png");
	logo.scaleX = logo.scaleY = .5;
	logo.x = 40;
	logo.y = 1060;
	game.stage.addChild(logo);

	createjs.Tween.get(comeCloser, {loop: true})
		.to({alpha: .5}, 1000, createjs.Ease.getPowInOut(2))
		.to({alpha: 1}, 1000, createjs.Ease.getPowInOut(2));

	createjs.Tween.get(bitmapAnd, {loop: true})
		.to({alpha: .5}, 1000, createjs.Ease.getPowInOut(2))
		.to({alpha: 1}, 1000, createjs.Ease.getPowInOut(2));

	createjs.Tween.get(formCrowd, {loop: true})
		.to({alpha: .5}, 1000, createjs.Ease.getPowInOut(2))
		.to({alpha: 1}, 1000, createjs.Ease.getPowInOut(2));

	createjs.Tween.get(bg, {loop: true})
		.to({alpha: .5}, 1000, createjs.Ease.getPowInOut(2))
		.to({alpha: 1}, 1000, createjs.Ease.getPowInOut(2));








	var personShape = new createjs.Shape();
	personShape.graphics.beginFill("green").drawCircle(0, 0, 50);

	game.stage.addEventListener("stagemousemove", function(evt){

		personShape.x = evt.stageX;
		personShape.y = evt.stageY;

	});

	$("#gameCanvas").on("mouseenter", function(){

		if (debug) {
			game.stage.addChild(personShape);
		}
		persons[0] = personShape;
	});

	$("#gameCanvas").on("mouseout", function(){
		if (debug) {
			game.stage.removeChild(personShape);
		}
		persons.splice(0, 1);
	});


	game.update = function(){

	};




	function objectSize(obj) {
		var size = 0, key;
		for (key in obj) {
			if (obj.hasOwnProperty(key)) size++;
		}
		return size;
	}
});