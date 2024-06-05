import { Scene } from 'phaser';
import { SCREEN_SIZE } from '../screensize';

export class Game extends Scene {
    ground: Phaser.Physics.Arcade.Image;
    character: Phaser.Physics.Arcade.Sprite;
    cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
    touch?: Phaser.Input.Pointer;
    puddle?: Phaser.Physics.Arcade.Image;
    charIsOverlappingPuddle: boolean;
    meteors: Phaser.Physics.Arcade.Image[] = [];

    constructor() {
        super('Game');
        this.charIsOverlappingPuddle = false;
    }

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
                // this.scene.start('GameOver');
            });
        }
    }
}
