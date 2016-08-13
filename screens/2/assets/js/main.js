
var ng = angular.module('hackaton', []);
ng.controller('ControlsCtrl', function($scope) {
	var game = new Game();
	var stage = game.stage;
	var initGame = game.init.bind(game);
	initGame();
	var socket = game.websocket("192.168.1.130", "1337", "catapult");


	var masterVolume = 1;
	var songs = [
		{layers: 6}
	];

	var songLayers = [];


	var queue = new createjs.LoadQueue(true);
	queue.installPlugin(createjs.Sound);
	angular.forEach(songs, function(song, songIndex) {
		var layers = song.layers;
		for (var i = 0;i < layers;i++) {
			queue.loadFile({id: 'song' + songIndex + '-' + i, src: '../../src/sounds/songs/' + (songIndex + 1) + '/' + (i + 1) + '.mp3', type: createjs.AbstractLoader.SOUND});
		};
	});

	queue.on('complete', function(a, b, c) {
		angular.forEach(queue.getItems(), function(sound) {
			songLayers.push(createjs.Sound.play(sound.item.id, 0, 0, true));
		});

		setSongLayerVolumes();
	});



	$scope.intensity = {
		model: 0
	};

	var currentIntensity = $scope.intensity.model;

	$scope.$watch('intensity.model', function(newIntensity) {
		currentIntensity = newIntensity;

		setSongLayerVolumes();
	});

	var ANIMATION = {
		ROTATION: 'rotation'
	};


	function setSongLayerVolumes() {
		angular.forEach(songLayers, function(songLayer, index) {

			var volume = (index >= currentIntensity ? 0 : 1) * masterVolume;

			createjs.Tween.get(songLayer)
				.to({volume: volume}, 1000, createjs.Ease.getPowInOut(2));
		});
	}



	var animationsGroups = [];

	animationsGroups.push({
		images: [
			{
				name: 'images/beugel.png',
				position: {
					x: 400,
					y: 100
				},
				pivot: {
					x: 20
				},
				rotation: 0,
				animations: [
					{
						type: ANIMATION.ROTATION,
						time: 200,
						multiplier: 3,
						minIntensity: 3,
						maxIntensity: 4
					}
				]
			},
			{
				name: 'images/beugel.png',
				position: {
					x: 20,
					y: 100
				},
				pivot: {
					x: 20
				},
				rotation: 0,
				animations: [
					{
						type: ANIMATION.ROTATION,
						time: 200
					}
				]
			}
		]
	});


	function animateGroup(group) {

		var totalAnimations = 0;

		var tempIntensity = currentIntensity;
		function checkTweenValidity() {
			if (currentIntensity !== tempIntensity) {
				animateGroup(group);
			}
		}

		angular.forEach(group.images, function(image) {

			var object = image.object;

			// remove all tweens from the object
			createjs.Tween.removeTweens(object);

			angular.forEach(image.animations, function(animation) {

				var resetToDefault = false;

				var minIntensity = animation.minIntensity || 0;
				var maxIntensity = animation.maxIntensity || 0;

				if (minIntensity && minIntensity > currentIntensity) {
					resetToDefault = true;
				}
				if (maxIntensity && maxIntensity < currentIntensity) {
					resetToDefault = true;
				}

				var animationValue = currentIntensity * (animation.multiplier || 1);

				switch(animation.type) {
					case ANIMATION.ROTATION : {

						var rotation = animationValue;

						if (!resetToDefault) {

							// reset rotation to current default intensity
							object.rotation = rotation;

							createjs.Tween.get(object, {loop: true})
								.to({rotation: -rotation}, animation.time, createjs.Ease.getPowInOut(10))
								.to({rotation: rotation}, animation.time, createjs.Ease.getPowInOut(2))
								.call(checkTweenValidity);
						}
						else {
							createjs.Tween.get(object, {})
								.to({rotation: image.rotation}, animation.time, createjs.Ease.getPowInOut(2));
						}
					}
				}

				animation.isPlaying = !resetToDefault;
				if (animation.isPlaying) {
					totalAnimations += 1;
				}
			});
		});

		$scope.totalAnimations = totalAnimations;
	};


	angular.forEach(animationsGroups, function(animationGroup) {

		var parent = stage;
		angular.forEach(animationGroup.images, function(image) {

			var container = new createjs.Container();
			container.x = image.position.x || 0;
			container.y = image.position.y || 0;

			container.regX = image.pivot.x || 0;
			container.regY = image.pivot.y || 0;

			parent.addChild(container);

			var bitmap = new createjs.Bitmap('assets/' + image.name);
			container.addChild(bitmap);

			parent = container;

			image.object = container;
		});

		animateGroup(animationGroup);
	});










	var monstersHit = 0;




	var crosshair = new createjs.Bitmap("assets/images/crossfire.png");
	crosshair.scaleX = crosshair.scaleY = 0.5;
	game.stage.addChild(crosshair);

	socket.listen = function(event){

		var data = JSON.parse(event.data);

		if (data.type == "shot"){
			var velocity = $$gamesetup.gameHeight - ((data.velocity-100)/675) * $$gamesetup.gameHeight;
			game.set('velocity', velocity);
			game.set('shotX', data.shotX);
			initShotFired();
		}

		if (data.type == "aim"){
			crosshair.x = $$gamesetup.gameWidth - (data.crosshairX/675) * $$gamesetup.gameWidth
			crosshair.y = $$gamesetup.gameHeight - (data.crosshairY/475) * $$gamesetup.gameHeight + 400
		}

	};

	socket.connect();

	var initShotFired = function() {
		var shot = new createjs.Shape();
		shot.graphics.beginFill("green").drawCircle(0, 0, 50);

		shot.x = (game.get("shotX")/675) * $$gamesetup.gameWidth + crosshair.getBounds().width/4;;
		shot.y = crosshair.y + crosshair.getBounds().height/4;

		var monster = isMonster(shot);

		if (monster){
			monstersHit += 1
			createjs.Tween.get(monster, {override:true}).to(
				{
					y: monster.y + 500,
					alpha: 0
				}, 500, createjs.Ease.elasticIn);

			if(monstersHit == 5){

				setTimeout(function(){
					mon1.y=470;
					mon1.alpha = 1;
					mon2.y=330;
					mon2.alpha = 1;
					mon3.y=60;
					mon3.alpha = 1;
					mon4.y=480;
					mon4.alpha = 1;
					mon5.y=140;
					mon5.alpha = 1;
				}, 2000)

				monstersHit = 0;
			}

		}

		createjs.Tween.get(shot, {override:true}).to(
			{
				y: shot.y + 100,
				alpha: 0
			}, 500);

		game.stage.addChild(shot);
	}

	var isMonster = function(shot){
		var monsterHit = false
		$.each(monsters, function(i, monster){
			var x1 = monster.x
			var x2 = monster.x + monster.getBounds().width;
			var y1 = monster.y
			var y2 = monster.y + monster.getBounds().height;

			if(shot.x > x1 && shot.x < x2){
				if (shot.y > y1 && shot.y < y2 ){
					monsterHit = monster;
				}
			}
		});

		return monsterHit;
	}

});