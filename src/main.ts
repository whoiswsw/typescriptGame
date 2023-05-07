import kaboom from "kaboom";

const FLOOR_HEIGHT = 48;
const JUMP_FORCE = 800;
const SPEED = 480;

const k = kaboom({
	// width: 640,
	// height: 480,
	// // stretch: false,
	// letterbox: true,
	background: [200, 200, 200],
	global: false
});

k.loadSprite("wjh", "sprites/wjh.png");

k.scene("game", () => {
	k.setGravity(2400);

	const player = k.add([
		k.sprite("wjh"),
		k.scale(0.5, 0.5),
		k.pos(320, 240),
		k.area(),
		k.body(),
		k.doubleJump()
	]);

	k.add([
		k.rect(k.width(), FLOOR_HEIGHT),
		k.outline(4),
		k.pos(0, k.height() - FLOOR_HEIGHT),
		k.area(),
		k.body({ isStatic: true }),
		k.color(127, 200, 255),
	])

	function jump() {
		if (player.isGrounded()) {
			player.jump(JUMP_FORCE);
		}
	}

	k.onKeyPress("space", jump);
	k.onClick(jump);

	function spawnTree() {

		// add tree obj
		const treeH = k.rand(32, 96);
		k.add([
			k.rect(48, treeH),
			k.area(),
			k.outline(4),
			k.pos(k.width(), k.height() - FLOOR_HEIGHT - treeH),
			// k.origin("botleft"),
			k.color(255, 180, 255),
			k.move(k.LEFT, SPEED),
			"tree",
		]);

		// wait a random amount of time to spawn next tree
		k.wait(k.rand(0.5, 1.5), spawnTree);

	}
	spawnTree();

	let score = 0;
	player.onCollide("tree", () => {
		// go to "lose" scene and pass the score
		k.go("lose", score);
		k.burp();
		k.addKaboom(player.pos);
	});
	const scoreLabel = k.add([
		k.text(score.toString()),
		k.pos(24, 24),
	]);

	// increment score every frame
	k.onUpdate(() => {
		score++;
		scoreLabel.text = score.toString();
	});
});

k.scene("lose", (score) => {

	k.add([
		k.sprite("wjh"),
		k.pos(k.width() / 2, k.height() / 2 - 80),
		k.scale(2),
		// k.origin("center"),
	]);

	// display score
	k.add([
		k.text(score),
		k.pos(k.width() / 2, k.height() / 2 + 80),
		k.scale(2),
		// origin("center"),
	]);

	// go back to game with space is pressed
	k.onKeyPress("space", () => k.go("game"));
	k.onClick(() => k.go("game"));

});

k.go("game");