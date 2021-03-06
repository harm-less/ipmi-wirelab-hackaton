
var ng = angular.module('hackaton', []);
ng.controller('ControlsCtrl', function($scope) {
	var gameId = 'rembrandt';
	var game = new Game();
	var stage = game.stage;
	var initGame = game.init.bind(game);
	initGame();
	var socket = game.websocket("192.168.1.124", "4000", gameId);


	var ANIMATION = {
		ROTATION: 'rotation',
		POSITION_X: 'position_x',
		POSITION_Y: 'position_y',
		PULSE: 'pulse'
	};

	var DIRECTION = {
		CLOCKWISE: 'clockwise',
		ANTI_CLOCKWISE: 'anti_clockwise'
	};


	var debug = $scope.debug = game.debug;
	var shouldListen = true;
	var currentIntensity = 0;


	var currentSong = {};



	$scope.intensity = {
		model: currentIntensity
	};

	$scope.$watch('intensity.model', function(newIntensity) {
		currentIntensity = newIntensity;
		animateGroups();
	});



	var animationsGroups = [];

	animationsGroups.push(
		// man with musked
		{
			images: [
				{
					name: 'images/_0011_hoofd-man-rood-pak-links.png',
					position: {
						x: 260,
						y: 205
					},
					pivot: {
						x: 100,
						y: 143
					},
					rotation: 0,
					animations: [
						{
							type: ANIMATION.POSITION_Y,
							value: -3,
							multiplier: .2,
							minIntensity: 3
						},
						{
							type: ANIMATION.POSITION_X,
							value: -2,
							multiplier: .2,
							minIntensity: 3
						}
					]
				}
			]
		},
		{
			images: [
				{
					name: 'images/_0010_been-man-rood-pak-links.png',
					position: {
						x: 320,
						y: 735
					},
					pivot: {
						x: 45,
						y: 30
					},
					rotation: 0,
					animations: [
						{
							type: ANIMATION.ROTATION,
							value: 1,
							multiplier: 0.1,
							minIntensity: 3
						},
						{
							type: ANIMATION.POSITION_Y,
							value: -8,
							multiplier: 0.3,
							minIntensity: 3
						}
					],
					images: [
						{
							name: 'images/_0009_voet-man-rood-pak-links.png',
							position: {
								x: 38,
								y: 150
							},
							pivot: {
								x: 20,
								y: 35
							},
							rotation: 0,
							animations: [
								{
									type: ANIMATION.ROTATION,
									value: 3,
									direction: DIRECTION.CLOCKWISE,
									minIntensity: 2,
									maxIntensity: 4
								}
							]
						}
					]
				}
			]
		},

		// woman in white
		{
			images: [
				{
					name: 'images/_0008_hoofdje-zittende-vrouw-witte-jurk.png',
					position: {
						x: 510,
						y: 405
					},
					pivot: {
						x: 40,
						y: 80
					},
					rotation: 0,
					animations: [
						{
							type: ANIMATION.ROTATION,
							value: 3,
							multiplier: .2,
							minIntensity: 3
						},
						{
							type: ANIMATION.POSITION_Y,
							value: -3,
							multiplier: .2,
							minIntensity: 3
						},
						{
							type: ANIMATION.POSITION_X,
							value: -2,
							multiplier: .2,
							minIntensity: 3
						}
					]
				}
			]
		},

		// man behind foreground people
		{
			images: [
				{
					name: 'images/_0026_Hoofd-Man-schrikken.png',
					position: {
						x: 975,
						y: 240
					},
					pivot: {
						x: 100,
						y: 150
					},
					rotation: 0,
					animations: [
						{
							type: ANIMATION.POSITION_X,
							value:-.5,
							multiplier: .4,
							minIntensity: 3
						},
						{
							type: ANIMATION.POSITION_Y,
							value: -2,
							multiplier: .4,
							minIntensity: 3
						}
					]
				}
			]
		},

		// man behind foreground people
		{
			images: [
				{
					name: 'images/_0006_Hoofd-hoge-muts.png',
					position: {
						x: 155,
						y: 10
					},
					pivot: {
						x: 80,
						y: 170
					},
					rotation: 0,
					animations: [
						{
							type: ANIMATION.POSITION_X,
							value:-.5,
							multiplier: .4,
							minIntensity: 3
						},
						{
							type: ANIMATION.POSITION_Y,
							value: -2,
							multiplier: .4,
							minIntensity: 3
						},
						{
							type: ANIMATION.ROTATION,
							value: 2,
							multiplier: .4,
							minIntensity: 3
						}
					]
				}
			]
		},

		// thinker
		{
			images: [
				{
					name: 'images/_0008_Hoofd-hoed-links.png',
					position: {
						x: 135,
						y: 170
					},
					pivot: {
						x: 80,
						y: 100
					},
					rotation: 0,
					animations: [
						{
							type: ANIMATION.POSITION_X,
							value:-.5,
							multiplier: .4,
							minIntensity: 3
						},
						{
							type: ANIMATION.POSITION_Y,
							value: -2,
							multiplier: .4,
							minIntensity: 3
						},
						{
							type: ANIMATION.ROTATION,
							direction: DIRECTION.ANTI_CLOCKWISE,
							value: 1,
							multiplier: .1,
							minIntensity: 3
						}
					]
				}
			]
		},

		// man behind foreground people
		{
			images: [
				{
					name: 'images/_0027_hoofd-Man-met-geweer.png',
					position: {
						x: 1275,
						y: 300
					},
					pivot: {
						x: 100,
						y: 150
					},
					rotation: 0,
					animations: [
						{
							type: ANIMATION.POSITION_X,
							value:-.5,
							multiplier: .4,
							minIntensity: 3
						},
						{
							type: ANIMATION.POSITION_Y,
							value: -2,
							multiplier: .4,
							minIntensity: 3
						}
					]
				}
			]
		},

		// man behind foreground people
		{
			images: [
				{
					name: 'images/_0005_man-achtergrond-met-stok-hoofd.png',
					position: {
						x: 1355,
						y: 120
					},
					pivot: {
						x: 90,
						y: 180
					},
					rotation: 0,
					animations: [
						{
							type: ANIMATION.ROTATION,
							direction: DIRECTION.ANTI_CLOCKWISE,
							value: 1,
							multiplier: .4,
							minIntensity: 3
						},
						{
							type: ANIMATION.POSITION_X,
							value: 3,
							multiplier: .1,
							minIntensity: 3
						},
						{
							type: ANIMATION.POSITION_Y,
							value: -2,
							multiplier: .4,
							minIntensity: 3
						}
					]
				}
			]
		},

		// man behind foreground people
		{
			images: [
				{
					name: 'images/_0003_Man-rechts-hoed-Hoofd.png',
					position: {
						x: 1715,
						y: 77
					},
					pivot: {
						x: 85,
						y: 125
					},
					rotation: 0,
					animations: [
						{
							type: ANIMATION.ROTATION,
							direction: DIRECTION.CLOCKWISE,
							value: 2,
							multiplier: 1,
							minIntensity: 3
						},
						{
							type: ANIMATION.POSITION_X,
							value: 3,
							multiplier: .1,
							minIntensity: 3
						},
						{
							type: ANIMATION.POSITION_Y,
							value: -2,
							multiplier: .4,
							minIntensity: 3
						}
					]
				}
			]
		},
		{
			images: [
				{
					name: 'images/_0001_regerende-arm-rechts.png',
					position: {
						x: 1465,
						y: 220
					},
					pivot: {
						x: 265,
						y: 30
					},
					rotation: 0,
					animations: [
						{
							type: ANIMATION.ROTATION,
							direction: DIRECTION.CLOCKWISE,
							value: 1,
							multiplier: 1,
							minIntensity: 3
						}
					]
				}
			]
		},

		// man behind foreground people
		{
			images: [
				{
					name: 'images/_0004_Man-rechts-hoofd-helm-hoofdrechts.png',
					position: {
						x: 1085,
						y: -50
					},
					pivot: {
						x: 75,
						y: 175
					},
					rotation: 0,
					animations: [
						{
							type: ANIMATION.ROTATION,
							direction: DIRECTION.CLOCKWISE,
							value: 2,
							multiplier: 1,
							minIntensity: 3
						},
						{
							type: ANIMATION.POSITION_X,
							value: 3,
							multiplier: .1,
							minIntensity: 3
						},
						{
							type: ANIMATION.POSITION_Y,
							value: -2,
							multiplier: .4,
							minIntensity: 3
						}
					]
				}
			]
		},

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
							minIntensity: 2
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
							value: -5,
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

		{
			images: [
				{
					name: 'images/_0025_Geweer-Man-met-geweer.png',
					position: {
						x: 1275,
						y: 400
					},
					pivot: {
						x: 100,
						y: 150
					},
					rotation: 0,
					animations: [
						{
							type: ANIMATION.POSITION_X,
							value:-.5,
							multiplier: .4,
							minIntensity: 3
						},
						{
							type: ANIMATION.POSITION_Y,
							value: -2,
							multiplier: .4,
							minIntensity: 3
						},
						{
							type: ANIMATION.ROTATION,
							value: 2,
							multiplier: .4,
							minIntensity: 3
						}
					],
					images: [
						{
							name: 'images/laser.png',
							position: {
								x: 223,
								y: -5
							},
							pivot: {
								x: 13,
								y: 13
							},
							rotation: 337,
							animations: [
								{
									type: ANIMATION.PULSE,
									minIntensity: 6
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
					name: 'images/laser.png',
					position: {
						x: 243,
						y: 290
					},
					pivot: {
						x: 13,
						y: 13
					},
					rotation: 246,
					animations: [
						{
							type: ANIMATION.PULSE,
							minIntensity: 6
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
					name: 'images/_0007_Arm-zwaard-wit-pak.png',
					position: {
						x: 1215,
						y: 420
					},
					pivot: {
						x: 20,
						y: 30
					},
					rotation: 0,
					animations: [
						{
							type: ANIMATION.ROTATION,
							direction: DIRECTION.CLOCKWISE,
							value: 1,
							multiplier: .5,
							minIntensity: 3
						}
					],
					images: [
						{
							name: 'images/_0009_Zwaard.png',
							position: {
								x: -120,
								y: 190
							},
							pivot: {
								x: 180,
								y: 40
							},
							rotation: 0,
							animations: [
								{
									type: ANIMATION.ROTATION,
									direction: DIRECTION.CLOCKWISE,
									value: 3,
									multiplier: .5,
									minIntensity: 3
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
		},

		// man behind two foreground with had
		{
			images: [
				{
					name: 'images/_0024_Hoofd-en-hoed-Man-links-veer-hoed.png',
					position: {
						x: 555,
						y: -55
					},
					pivot: {
						x: 60,
						y: 150
					},
					rotation: 0,
					animations: [
						{
							type: ANIMATION.ROTATION,
							direction: DIRECTION.ANTI_CLOCKWISE,
							value: 2,
							multiplier: .5,
							minIntensity: 3
						},
						{
							type: ANIMATION.POSITION_Y,
							value: 1,
							multiplier: .5,
							minIntensity: 3
						}
					]
				}
			]
		},

		// man behind two foreground with had
		{
			images: [
				{
					name: 'images/_0022_Hoofdhelm-Ridder-linksachterboven.png',
					position: {
						x: 725,
						y: 40
					},
					pivot: {
						x: 60,
						y: 100
					},
					rotation: 0,
					animations: [
						{
							type: ANIMATION.ROTATION,
							direction: DIRECTION.CLOCKWISE,
							value: 2,
							multiplier: .5,
							minIntensity: 3
						}
					],
					images: [
						{
							name: 'images/_0023_Baardding-Ridder-linksachterboven.png',
							position: {
								x: 1,
								y: 80
							},
							pivot: {
								x: 60,
								y: 100
							},
							rotation: 0,
							animations: [
								{
									type: ANIMATION.POSITION_Y,
									value: 1,
									multiplier: .5,
									minIntensity: 4
								},
								{
									type: ANIMATION.POSITION_Y,
									value: 1,
									multiplier: .5,
									minIntensity: 4
								}
							]
						}
					]
				}
			]
		},

		// man behind two foreground with had
		{
			images: [
				{
					name: 'images/_0021_Hoodmet-hoed-Man-achter-grote-hoed.png',
					position: {
						x: 890,
						y: -5
					},
					pivot: {
						x: 80,
						y: 150
					},
					rotation: 0,
					animations: [
						{
							type: ANIMATION.ROTATION,
							direction: DIRECTION.CLOCKWISE,
							value: 1,
							multiplier: .5,
							minIntensity: 3
						}
					]
				}
			]
		},

		// drummer on the right
		{
			images: [
				{
					name: 'images/_0007_Hoofd-drummer.png',
					position: {
						x: 1845,
						y: 240
					},
					pivot: {
						x: 80,
						y: 123
					},
					rotation: 0,
					animations: [
						{
							type: ANIMATION.ROTATION,
							direction: DIRECTION.CLOCKWISE,
							value: 3,
							multiplier: .2,
						}
					]
				}
			]
		},
		{
			images: [
				{
					name: 'images/_0006_drumarm.png',
					position: {
						x: 1785,
						y: 390
					},
					pivot: {
						x: 160,
						y: 63
					},
					rotation: 0,
					animations: [
						{
							type: ANIMATION.ROTATION,
							direction: DIRECTION.CLOCKWISE,
							value: 6,
							multiplier: .01,
							minIntensity: 2
						}
					]
				}
			]
		},

		// dog
		{
			images: [
				{
					name: 'images/_0002_hondekop.png',
					position: {
						x: 1575,
						y: 810
					},
					pivot: {
						x: 80,
						y: 103
					},
					rotation: 0,
					minIntensity: 4,
					animations: [
						{
							type: ANIMATION.ROTATION,
							direction: DIRECTION.CLOCKWISE,
							value: 2,
							multiplier: .5,
							minIntensity: 4
						},
						{
							type: ANIMATION.POSITION_Y,
							value: 5,
							multiplier: .2,
							minIntensity: 4
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

			container.rotation = image.rotation || 0;

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

			if (image.minIntensity ) {
				object.alpha = image.minIntensity > currentIntensity ? 0 : 1;
			}

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

					var intensityMultiplier = currentIntensity * (animation.multiplier || 1);

					var animationValue = (intensityMultiplier * animation.value) + animation.value;

					// ugly 250 millisecond hack
					var animationTime = (animation.time || currentSong.speed) || 250;
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
						case ANIMATION.PULSE :
						{
							var pulseTime = 120;
							if (!resetToDefault) {

								createjs.Tween.get(object, {loop: true})
									.to({alpha: 1}, 1)
									.wait(pulseTime)
									.to({alpha: 0}, 1)
									.wait(pulseTime)
									.to({alpha: 1}, 1)
									.wait(pulseTime)
									.to({alpha: 0}, 1)
									.wait(pulseTime)
									.to({alpha: 1}, 1)
									.wait(pulseTime)
									.to({alpha: 0}, 1)
									.wait(2000)
									.call(checkTweenValidity);
							}
							else {
								object.alpha = 0;
							}
							break;
						}
					}

					animation.isPlaying = !resetToDefault;
				});
			}

			if (image.images && image.images.length) {
				animateGroup(image);
			}
		});
	}
	function animateGroups() {
		angular.forEach(animationsGroups, function(animationGroup) {
			animateGroup(animationGroup);
		});
	}


	socket.listen = function(data) {

		if (!data.gameId || (data && data.gameId !== gameId)) return;

		if (data.type === 'intensity.changed') {
			if (shouldListen) {
				currentIntensity = data.intensity;
			}
			animateGroups(true);
			console.log('intensity.changed', data);
		}

		if (data.type === 'song.changed') {
			currentSong = data.song;
			animateGroups();
		}
	};






	var bg = new createjs.Bitmap("assets/images/_0037_Layer-1.png");
	bg.y = -140;
	stage.addChild(bg);

	buildAnimationGroups();

	setTimeout(function() {
		animateGroups();
	}, 1000);



	socket.connect();

});