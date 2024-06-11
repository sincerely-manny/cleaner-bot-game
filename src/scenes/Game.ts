import { Scene } from 'phaser';
import { SCREEN_SIZE } from '../screensize';
import { Message, reactNativeEvents } from '@lib/events';

export class Game extends Scene {
    ground: Phaser.Physics.Arcade.Image;
    character: Phaser.Physics.Arcade.Sprite;
    coin: Phaser.Physics.Arcade.Image;
    coinText: Phaser.GameObjects.Text;
    cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
    touch?: Phaser.Input.Pointer;
    puddle?: Phaser.Physics.Arcade.Image;
    charIsOverlappingPuddle: boolean;
    meteors: Phaser.Physics.Arcade.Image[] = [];
    score = 0;

    nativeEvents = reactNativeEvents;

    gameOver = false;

    constructor() {
        super('Game');
        this.charIsOverlappingPuddle = false;
        this.nativeEvents.redirectLogs();
        this.nativeEvents.listen(this.nativeEnentCallback);
    }

    nativeEnentCallback = (msg: Message) => {
        switch (msg.type) {
            case 'set-state':
                if (msg.payload === 'play') {
                    this.scene.resume();
                    this.nativeEvents.send({
                        type: 'declare-state',
                        payload: 'play',
                    });
                }
                if (msg.payload === 'pause') {
                    this.scene.pause();
                    this.nativeEvents.send({
                        type: 'declare-state',
                        payload: 'pause',
                    });
                }
                if (msg.payload === 'restart') {
                    this.scene.restart();
                    this.nativeEvents.send({
                        type: 'declare-state',
                        payload: 'play',
                    });
                }
                break;
        }
    };

    create() {
        this.add
            .image(SCREEN_SIZE.width / 2, SCREEN_SIZE.height / 2, 'background')
            .setScale(0.75);
        this.add
            .image(SCREEN_SIZE.width / 2, SCREEN_SIZE.height - 42, 'horizon')
            .setOrigin(0.5, 1);

        this.ground = this.physics.add.image(
            SCREEN_SIZE.width / 2,
            SCREEN_SIZE.height,
            'ground'
        );
        this.ground
            .setOrigin(0.5, 1)
            .setImmovable(true)
            .setVelocityX(-300)
            .setSize(1706, 5)
            .setOffset(0, 60);

        this.character = this.physics.add.sprite(
            SCREEN_SIZE.width / 2 - 100,
            SCREEN_SIZE.height - 260,
            'character'
        );
        this.character
            .setOrigin(0.5, 1)
            .setBounce(0.1)
            .setGravityY(500)
            .setFriction(0, 0)
            .setDepth(1);
        this.character.body?.setSize(70, 90).setOffset(65, 80);

        this.tweens.add({
            targets: this.character,
            angle: { from: -5, to: 5 },
            rotation: { from: -0.03, to: 0.03 },
            duration: 1500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut',
        });

        this.anims.create({
            key: 'idle',
            frames: [{ key: 'character', frame: 0 }],
        });
        this.anims.create({
            key: 'up',
            frames: [{ key: 'character', frame: 1 }],
        });
        this.anims.create({
            key: 'down',
            frames: [{ key: 'character', frame: 2 }],
        });
        this.anims.create({
            key: 'cleaning',
            frames: [{ key: 'character', frame: 3 }],
        });

        this.physics.world.setBounds(
            0,
            0,
            SCREEN_SIZE.width,
            SCREEN_SIZE.height - 70
        );
        this.character.setCollideWorldBounds(true);

        this.coin = this.physics.add.image(0, 0, 'coin');
        this.coin.setOrigin(0.5, 0.5);
        this.coin.visible = false;
        this.coinText = this.add.text(400, 500, '+1', {
            fontSize: '22px',
            color: '#ffffff',
            fontFamily: 'SF Pro Display Semibold',
        });
        this.coinText.setOrigin(1, 0.5);
        this.coinText.visible = false;

        this.cursors = this.input.keyboard?.createCursorKeys();
        this.touch = this.input.pointer1;

        this.input.on('pointerdown', () => {
            this.goUp();
        });
        this.input.on('pointerup', () => {
            this.goDown();
        });

        this.cursors?.space.on('down', () => {
            this.goUp();
        });
        this.cursors?.space.on('up', () => {
            this.goDown();
        });
    }

    goUp() {
        this.character.setAccelerationY(-300);
        this.character.setVelocityY(-500);
    }
    goDown() {
        this.character.setAccelerationY(0);
        this.character.setVelocityY(0);
    }

    update() {
        const currentVelocity = this.character.body?.velocity.y;

        if (currentVelocity && currentVelocity < -100) {
            this.character.anims.play('up');
        } else if (currentVelocity && currentVelocity > 100) {
            this.character.anims.play('down');
        } else {
            if (!this.charIsOverlappingPuddle) {
                this.character.anims.play('idle');
            } else {
                this.character.anims.play('cleaning', true);
            }
        }

        const groundPosition = this.ground.body?.position;
        if (groundPosition && groundPosition.x < -1250) {
            this.ground.setX(400);

            const puddleChancePercentage = 50;
            if (Math.round(Math.random() * 100) < puddleChancePercentage) {
                if (this.puddle) {
                    this.puddle.destroy();
                }
                this.puddle = this.physics.add.image(
                    SCREEN_SIZE.width,
                    SCREEN_SIZE.height - 100,
                    'puddle'
                );
                this.puddle
                    .setOrigin(0, 1)
                    .setFriction(1)
                    .setGravityY(500)
                    .setSize(70, 40);
                this.physics.add.collider(this.ground, this.puddle);
                this.physics.add.overlap(this.character, this.puddle, () => {
                    if (!this.charIsOverlappingPuddle) {
                        this.charIsOverlappingPuddle = true;
                        this.tweens.add({
                            targets: this.puddle,
                            alpha: { from: 1, to: 0 },
                            duration: 500,
                            repeat: 0,
                        });

                        this.coin.visible = true;
                        this.coin.setPosition(
                            this.character.x,
                            this.character.y - 70
                        );
                        this.coinText.visible = true;
                        this.coinText.setPosition(
                            this.coin.x - 18,
                            this.coin.y
                        );
                        this.tweens.add({
                            targets: [this.coin, this.coinText],
                            y: '-=200',
                            alpha: 0.5,
                            duration: 2000,
                            ease: 'Power2',
                            onComplete: () => {
                                this.coin.visible = false;
                                this.coinText.visible = false;
                                this.coin.setAlpha(1);
                                this.coinText.setAlpha(1);
                            },
                        });

                        this.score += 1;
                        this.nativeEvents.send({
                            type: 'set-score',
                            payload: this.score,
                        });
                    }
                });
            }
        }

        if (
            this.charIsOverlappingPuddle &&
            !this.physics.overlap(this.character, this.puddle)
        ) {
            this.charIsOverlappingPuddle = false;
        }

        const meteorChancePercentage = 1;
        if (Math.round(Math.random() * 100) < meteorChancePercentage) {
            const meteor = this.physics.add.image(
                SCREEN_SIZE.width,
                Math.random() * (SCREEN_SIZE.height - 300) + 200,
                'meteor'
            );
            meteor
                .setOrigin(0, 0.5)
                .setVelocityX(0 - (Math.random() * 200 + 100))
                .body.setSize(40, 40, true)
                .setOffset(20, 20);

            this.meteors.push(meteor);
            this.physics.add.collider(this.character, meteor, () => {
                this.character.tint = 0xff0000;
                this.character.setTint(0xff5555);
                this.scene.pause();
                this.gameOver = true;
                this.nativeEvents.send({
                    type: 'declare-state',
                    payload: 'game-over',
                });
            });
        }
        this.meteors.forEach((meteor) => {
            if (meteor.body?.position.x && meteor.body.position.x < -100) {
                meteor.destroy();
            }
        });
    }
}
