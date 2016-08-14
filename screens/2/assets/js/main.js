
var ng = angular.module('hackaton', []);
ng.controller('ControlsCtrl', function($scope) {
	var game = new Game();
	var stage = game.stage;
	var initGame = game.init.bind(game);
	initGame();
	var socket = game.websocket("192.168.1.130", "1337", "catapult");


	var ANIMATION = {
		ROTATION: 'rotation',
		POSITION_X: 'position_x',
		POSITION_Y: 'position_y'
	};

	var DIRECTION = {
		CLOCKWISE: 'clockwise',
		ANTI_CLOCKWISE: 'anti_clockwise'
	};


	var masterVolume = 0;
	var songs = [
		{
			speed: 250,
			layers: 2
		}
	];
	var currentSong = songs[0];
	var songLayers = [];

	var debug = true;
	var currentIntensity = 1;


	var queue = new createjs.LoadQueue(true);
	queue.installPlugin(createjs.Sound);
	angular.forEach(songs, function(song, songIndex) {
		var layers = song.layers;
		var layerNames = [];
		for (var i = 0;i < layers;i++) {
			var id = 'song' + songIndex + '-' + i;
			queue.loadFile({id: id, src: '../../src/sounds/songs/' + (songIndex + 1) + '/' + (i + 1) + '.wav', type: createjs.AbstractLoader.SOUND});
			layerNames.push(id);
		}

		song.layers = layerNames;
	});

	queue.on('complete', function(event) {
		playSong(currentSong);

		setSongLayerVolumes();
	});



	$scope.intensity = {
		model: currentIntensity
	};

	$scope.$watch('intensity.model', function(newIntensity) {
		currentIntensity = newIntensity;

		setSongLayerVolumes();
		animateGroups(true);
	});


	function playSong(song) {
		createjs.Sound.stop();

		currentSong = song;
		angular.forEach(song.layers, function(layerName) {
			songLayers.push(createjs.Sound.play(layerName, {loop: -1}));
		});
	}

	function setSongLayerVolumes() {
		angular.forEach(songLayers, function(songLayer, index) {

			var volume = (index >= currentIntensity ? 0 : 1) * masterVolume;

			createjs.Tween.get(songLayer)
				.to({volume: volume}, 1000, createjs.Ease.getPowInOut(2));
		});
	}



	var animationsGroups = [];

	animationsGroups.push(
		// man in foreground (left)
		{
			images: [
				{
					name: 'images/_0018_hoofd-Man-rode-sherp-links-voor.png',
					position: {
						x: 800,
						y: 170
					},
					pivot: {
						x: 100,
						y: 153
					},
					rotation: 0,
					animations: [
						{
							type: ANIMATION.ROTATION,
							value: 3,
							direction: DIRECTION.CLOCKWISE,
							minIntensity: 3
						}
					]
				}
			]
		},
		{
			images: [
				{
					name: 'images/_0020_-arm-Man-rode-sherp-links-voor.png',
					position: {
						x: 920,
						y: 335
					},
					pivot: {
						x: 80,
						y: 20
					},
					rotation: 0,
					animations: [
						{
							type: ANIMATION.ROTATION,
							value: -5,
							multiplier: 0.1,
							minIntensity: 3
						}
					],
					images: [
						{
							name: 'images/_0019_Hand-Man-rode-sherp-links-voor.png',
							position: {
								x: -20,
								y: 100
							},
							pivot: {
								x: 80,
								y: 45
							},
							rotation: 0,
							animations: [
								{
									type: ANIMATION.ROTATION,
									value: 3,
									direction: DIRECTION.ANTI_CLOCKWISE,
								}
							]
						}
					]
				}
			]
		},
		{
			images: [
				{
					name: 'images/_0017_been-Man-rode-sherp-links-voor.png',
					position: {
						x: 775,
						y: 883
					},
					pivot: {
						x: 80,
						y: 20
					},
					rotation: 0,
					animations: [
						{
							type: ANIMATION.POSITION_Y,
							value: -10,
							multiplier:.2,
							minIntensity: 1
						}
					],
					images: [
						{
							name: 'images/_0016_voet1-Man-rode-sherp-links-voor.png',
							position: {
								x: -35,
								y: 100
							},
							pivot: {
								x: 80,
								y: 45
							},
							rotation: 0,
							animations: [
								{
									type: ANIMATION.ROTATION,
									value: 3,
									direction: DIRECTION.ANTI_CLOCKWISE,
									maxIntensity: 2
								}
							]
						}
					]
				}
			]
		},

		// man in foreground (right)
		{
			images: [
				{
					name: 'images/_0015_hoofd-man-wit-pak-rechts-voor.png',
					position: {
						x: 1075,
						y: 240
					},
					pivot: {
						x: 100,
						y: 150
					},
					rotation: 0,
					animations: [
						{
							type: ANIMATION.ROTATION,
							direction: DIRECTION.ANTI_CLOCKWISE,
							value: 3,
							multiplier: .5,
							minIntensity: 3
						}
					]
				}
			]
		},
		{
			images: [
				{
					name: 'images/_0013_been-copy-man-wit-pak-rechts-voor.png',
					position: {
						x: 1070,
						y: 880
					},
					pivot: {
						x: 50,
						y: 100
					},
					rotation: 0,
					animations: [
						{
							type: ANIMATION.POSITION_Y,
							value: -5,
							multiplier: .5,
							minIntensity: 3
						}
					],
					images: [
						{
							name: 'images/_0012_voetje-man-wit-pak-rechtsvoor.png',
							position: {
								x: -20,
								y: 100
							},
							pivot: {
								x: 80,
								y: 45
							},
							rotation: 0,
							animations: [
								{
									type: ANIMATION.ROTATION,
									value: 3,
									direction: DIRECTION.ANTI_CLOCKWISE,
									maxIntensity: 2
								}
							]
						}
					]
				}
			]
		}
	);


	function buildAnimationGroup(group, parent) {
		parent = parent || stage;

		angular.forEach(group.images, function(image) {

			var container = new createjs.Container();
			var x = image.position.x || 0;
			var y = image.position.y || 0;
			var pivotX = image.pivot.x || 0;
			var pivotY = image.pivot.y || 0;

			container.x = x + pivotX;
			container.y = y + pivotY;

			container.regX = pivotX;
			container.regY = pivotY;

			parent.addChild(container);

			var bitmap = new createjs.Bitmap('assets/' + image.name);
			container.addChild(bitmap);

			image.object = container;

			if (debug) {
				var pivotPoint = new createjs.Shape();
				pivotPoint.graphics.beginFill('red').drawCircle(0, 0, 5);
				pivotPoint.x = container.regX;
				pivotPoint.y = container.regY;
				container.addChild(pivotPoint);
			}

			if (image.images && image.images.length) {
				buildAnimationGroup(image, container);
			}
		});
	}
	function buildAnimationGroups() {
		angular.forEach(animationsGroups, function(animationGroup) {
			buildAnimationGroup(animationGroup);
		});
	}


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

			if (image.animations) {
				angular.forEach(image.animations, function (animation) {

					var resetToDefault = false;

					var minIntensity = animation.minIntensity || 0;
					var maxIntensity = animation.maxIntensity || 0;

					if (minIntensity && minIntensity > currentIntensity || currentIntensity === 0) {
						resetToDefault = true;
					}
					if (maxIntensity && maxIntensity < currentIntensity) {
						resetToDefault = true;
					}

					var intensityMultiplier = (currentIntensity * (animation.multiplier || 1)) || 1;

					var animationValue = intensityMultiplier * animation.value;


					console.log(intensityMultiplier, animationValue);
					var animationTime = animation.time || currentSong.speed;
					var animationEaseTo = animation.easeTo || createjs.Ease.getPowInOut(2);
					var animationEaseFrom = animation.easeFrom || createjs.Ease.getPowInOut(10);

					switch (animation.type) {
						case ANIMATION.ROTATION :
						{

							var rotation = animationValue;

							if (!resetToDefault) {

								var direction = animation.direction || DIRECTION.CLOCKWISE;

								// reset rotation to current default intensity
								object.rotation = direction === DIRECTION.CLOCKWISE ? rotation : -rotation;

								var to = direction === DIRECTION.CLOCKWISE ? -rotation : rotation;
								var from = direction === DIRECTION.CLOCKWISE ? rotation : -rotation;

								createjs.Tween.get(object, {loop: true})
									.to({rotation: to}, animationTime, animationEaseTo)
									.to({rotation: from}, animationTime, animationEaseFrom)
									.call(checkTweenValidity);
							}
							else {
								createjs.Tween.get(object, {})
									.to({rotation: image.rotation}, animationTime, animationEaseFrom);
							}
							break;
						}
						case ANIMATION.POSITION_X :
						{

							var defaultX = (image.position.x || 0) + (image.pivot.x || 0);
							var positionX = animationValue;

							if (!resetToDefault) {
								createjs.Tween.get(object, {loop: true})
									.to({x: defaultX + positionX}, animationTime, animationEaseTo)
									.to({x: defaultX}, animationTime, animationEaseFrom)
									.call(checkTweenValidity);
							}
							else {
								createjs.Tween.get(object, {})
									.to({x: defaultX}, animationTime, animationEaseFrom);
							}
							break;
						}
						case ANIMATION.POSITION_Y :
						{
							var defaultY = (image.position.y || 0) + (image.pivot.y || 0);
							var positionY = animationValue;

							if (!resetToDefault) {
								createjs.Tween.get(object, {loop: true})
									.to({y: defaultY + positionY}, animationTime, animationEaseTo)
									.to({y: defaultY}, animationTime, animationEaseFrom)
									.call(checkTweenValidity);
							}
							else {
								createjs.Tween.get(object, {})
									.to({y: defaultY}, animationTime, animationEaseFrom);
							}
							break;
						}
					}

					animation.isPlaying = !resetToDefault;
					if (animation.isPlaying) {
						totalAnimations += 1;
					}
				});
			}

			if (image.images && image.images.length) {
				animateGroup(image);
			}
		});

		$scope.totalAnimations = totalAnimations;
	}
	function animateGroups() {
		angular.forEach(animationsGroups, function(animationGroup) {
			animateGroup(animationGroup);
		});
	}




	var bg = new createjs.Bitmap("assets/images/_0028_Layer-1.png");
	bg.y = -140;
	stage.addChild(bg);

	buildAnimationGroups();
	animateGroups();




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