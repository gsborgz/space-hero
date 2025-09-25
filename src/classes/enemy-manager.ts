import { AnchorComp, AreaComp, BodyComp, GameObj, KAPLAYCtx, LayerComp, OffScreenComp, PosComp, RectComp, SpriteComp, Vec2 } from 'kaplay';
import { EntityType, GameConfig, Layer, SoundType } from './game-manager';
import { BossAnimation, ExplosionAnimation, ShotAnimation, Sprite } from './sprite-manager';

export enum MinionTag {
  MinionOne = 'minion-one',
  MinionTwo = 'minion-two',
  MinionThree = 'minion-three',
  MinionFour = 'minion-four',
}

export enum MoveDirection {
  Up = 'up',
  Down = 'down',
  None = 'none',
}

export enum MoveType {
  Straight = 'straight',
  UpDown = 'up-down',
  UpDownStraight = 'up-down-straight',
  Random = 'random',
  UpDownRush = 'up-down-rush',
}

export type EnemyBody = {
  hp: number;
  isBoss: boolean;
  startPosition: Vec2;
  moveInterval: number;
  moveType: MoveType;
  speedX: number;
  speedY: number;
  moveDirection?: MoveDirection;
  moveLimit?: number;
  initialMoveInterval?: number;
  shootInterval?: number;
  waitForNextShot?: boolean;
  stopPositionX?: number;
}

export type EnemyObj = {
  sprite: string;
  scale: number;
  hp: number;
  startPosition: Vec2;
  speedX: number;
  speedY: number;
  moveType: MoveType;
  moveInterval?: number;
  isBoss?: boolean;
  stopPositionX?: number;
  moveDirection?: MoveDirection;
  moveLimit?: number;
  initialMoveInterval?: number;
  shootInterval?: number;
  waitForNextShot?: boolean;
}

export type MinionObject = GameObj<PosComp | RectComp | AreaComp | BodyComp | AnchorComp | LayerComp | OffScreenComp | EnemyBody>;
export type BossObject = GameObj<PosComp | RectComp | AreaComp | BodyComp | AnchorComp | LayerComp | OffScreenComp | EnemyBody>;

export class EnemyManager {

  constructor(
    private readonly kaplay: KAPLAYCtx<{}, never>,
    private readonly configs: GameConfig,
  ) {}

  private get minion1(): EnemyObj[] {
    return [
      {
        sprite: Sprite.MinionOne,
        hp: 2,
        scale: 1.5,
        startPosition: this.kaplay.vec2(0, 0),
        moveDirection: MoveDirection.None,
        moveType: MoveType.UpDown,
        moveLimit: 100,
        speedX: 85,
        speedY: 150,
      },
      {
        sprite: Sprite.MinionOne,
        hp: 2,
        scale: 1.5,
        startPosition: this.kaplay.vec2(0, 0),
        moveType: MoveType.UpDownStraight,
        moveDirection: MoveDirection.None,
        moveLimit: 100,
        speedX: 85,
        speedY: 150,
      }
    ];
  }

  private get minion2(): EnemyObj[] {
    return [
      {
        sprite: Sprite.MinionTwo,
        hp: 2,
        scale: 2,
        startPosition: this.kaplay.vec2(0, 0),
        moveType: MoveType.Random,
        initialMoveInterval: 50,
        speedX: 100,
        speedY: 200,
      },
      {
        sprite: Sprite.MinionTwo,
        hp: 3,
        scale: 2,
        startPosition: this.kaplay.vec2(0, 0),
        moveType: MoveType.Straight,
        initialMoveInterval: 50,
        speedX: 100,
        speedY: 200,
      }
    ];
  }

  private get minion3(): EnemyObj[] {
    return [
      {
        sprite: Sprite.MinionThree,
        hp: 4,
        scale: 2,
        startPosition: this.kaplay.vec2(0, 0),
        moveType: MoveType.Straight,
        initialMoveInterval: 50,
        speedX: 90,
        speedY: 90,
      },
      {
        sprite: Sprite.MinionThree,
        hp: 4,
        scale: 2,
        startPosition: this.kaplay.vec2(0, 0),
        moveType: MoveType.UpDownStraight,
        moveLimit: 100,
        initialMoveInterval: 50,
        speedX: 90,
        speedY: 90,
      }
    ];
  }

  private get minion4(): EnemyObj[] {
    return [
      {
        sprite: Sprite.MinionFour,
        hp: 1,
        scale: 2,
        startPosition: this.kaplay.vec2(0, 0),
        moveType: MoveType.Random,
        initialMoveInterval: 50,
        speedX: 140,
        speedY: 240,
      },
      {
        sprite: Sprite.MinionFour,
        hp: 3,
        scale: 2,
        startPosition: this.kaplay.vec2(0, 0),
        moveType: MoveType.UpDown,
        initialMoveInterval: 50,
        speedX: 140,
        speedY: 240,
      }
    ];
  }

  private get boss1(): EnemyObj {
    return {
      sprite: Sprite.BossOne,
      hp: 50,
      stopPositionX: 730,
      shootInterval: 3,
      startPosition: this.kaplay.vec2(0, 0),
      moveType: MoveType.UpDown,
      initialMoveInterval: 50,
      scale: 2,
      speedX: 100,
      speedY: 200,
    } as EnemyObj;
  }

  private get boss2(): EnemyObj {
    return {
      sprite: Sprite.BossOne,
      hp: 50,
      stopPositionX: 730,
      shootInterval: 3,
      startPosition: this.kaplay.vec2(0, 0),
      moveType: MoveType.UpDown,
      initialMoveInterval: 50,
      scale: 2,
      speedX: 100,
      speedY: 200,
    } as EnemyObj;
  }

  private get boss3(): EnemyObj {
    return {
      sprite: Sprite.BossOne,
      hp: 50,
      stopPositionX: 730,
      shootInterval: 3,
      startPosition: this.kaplay.vec2(0, 0),
      moveType: MoveType.UpDown,
      initialMoveInterval: 50,
      scale: 2,
      speedX: 100,
      speedY: 200,
    } as EnemyObj;
  }

  public getMinionTemplate(minion: MinionTag, variation: number, options: Partial<EnemyObj>): EnemyObj {
    switch (minion) {
      case MinionTag.MinionOne:
        const minionBody = Object.assign({}, this.minion1[variation]);

        this.insertCustomValuesForEnemy(minionBody, options);

        return minionBody;
      case MinionTag.MinionTwo:
        const minionBody2 = Object.assign({}, this.minion2[variation]);
        
        this.insertCustomValuesForEnemy(minionBody2, options);

        return minionBody2;
      case MinionTag.MinionThree:
        const minionBody3 = Object.assign({}, this.minion3[variation]);

        this.insertCustomValuesForEnemy(minionBody3, options);

        return minionBody3;
      case MinionTag.MinionFour:
        const minionBody4 = Object.assign({}, this.minion4[variation]);

        this.insertCustomValuesForEnemy(minionBody4, options);

        return minionBody4;
      default:
        throw new Error(`Minion ${minion} not found`);
    }
  }

  public getBossTemplate(boss: number, options: Partial<EnemyObj>): EnemyObj {
    switch (boss) {
      case 1:
        const bossBody = Object.assign({}, this.boss1);

        this.insertCustomValuesForEnemy(bossBody, options);

        return bossBody;
      case 2:
        const bossBody2 = Object.assign({}, this.boss2);

        this.insertCustomValuesForEnemy(bossBody2, options);

        return bossBody2;
      case 3:
        const bossBody3 = Object.assign({}, this.boss3);

        this.insertCustomValuesForEnemy(bossBody3, options);

        return bossBody3;
      default:
        throw new Error(`Boss ${boss} not found`);
    }
  }

  public createMinion(config: EnemyObj): void {
    const body: EnemyBody = {
      hp: config.hp,
      startPosition: config.startPosition,
      moveInterval: config.initialMoveInterval || 0,
      speedX: config.speedX,
      speedY: config.speedY,
      moveType: config.moveType,
      moveDirection: config.moveDirection,
      isBoss: false,
    };

    if (config.moveLimit) body.moveLimit = config.moveLimit;
    if (config.initialMoveInterval) body.initialMoveInterval = config.initialMoveInterval;
    if (config.moveInterval) body.moveInterval = config.moveInterval;
    if (config.moveDirection) body.moveDirection = config.moveDirection;

    const enemy = this.kaplay.add([
      this.kaplay.sprite(config.sprite),
      this.kaplay.scale(config.scale),
      this.kaplay.pos(config.startPosition),
      this.kaplay.area({ collisionIgnore: [EntityType.Enemy] }),
      this.kaplay.body({ isStatic: true }),
      this.kaplay.anchor('center'),
      this.kaplay.layer(Layer.Game),
      this.kaplay.offscreen({ destroy: true }),
      body,
      EntityType.Enemy
    ]);

    enemy.onUpdate(() => {
      if (config.shootInterval && !enemy.waitForNextShot) {
        this.enemyShoot(enemy);
      }

      this.setEnemyMovement(enemy, config.speedX, config.speedY);
    });
  }

  public createBoss(config: EnemyObj): void {
    const body: EnemyBody = {
      hp: config.hp,
      startPosition: config.startPosition,
      moveInterval: config.initialMoveInterval || 0,
      isBoss: true,
      speedX: config.speedX,
      speedY: config.speedY,
      moveType: config.moveType,
      stopPositionX: config.stopPositionX,
      shootInterval: config.shootInterval,
      waitForNextShot: config.waitForNextShot
    };

    if (config.moveLimit) body.moveLimit = config.moveLimit;
    if (config.initialMoveInterval) body.initialMoveInterval = config.initialMoveInterval;
    if (config.moveInterval) body.moveInterval = config.moveInterval;
    if (config.moveDirection) body.moveDirection = config.moveDirection;

    const enemy = this.kaplay.add([
      this.kaplay.sprite(config.sprite),
      this.kaplay.pos(config.startPosition),
      this.kaplay.area({ collisionIgnore: [EntityType.Enemy] }),
      this.kaplay.body({ isStatic: true }),
      this.kaplay.scale(config.scale),
      this.kaplay.anchor('center'),
      this.kaplay.layer(Layer.Game),
      this.kaplay.offscreen({ destroy: true }),
      body,
      EntityType.Enemy
    ]);

    enemy.play(BossAnimation.Default, { loop: true });

    enemy.onUpdate(() => {
      const isEnteringScreen = enemy.pos.x > config.stopPositionX!;

      if (isEnteringScreen) {
        enemy.move(-50, 0);
      } else {
        if (config.shootInterval && !enemy.waitForNextShot) {
          this.enemyShoot(enemy);
        }

        this.setEnemyMovement(enemy, 0, config.speedY);
      }
    });
  }

  private setEnemyMovement(enemy: MinionObject | BossObject, speedX: number, speedY: number): void {
    if (enemy.moveType === MoveType.Straight) {
      enemy.move(speedX * -1, 0);
    } else if (enemy.moveType === MoveType.UpDown) {
      if (enemy.pos.y + (enemy.height / 2) >= this.configs.screen.bottomBorder) {
        enemy.moveDirection = MoveDirection.Up;
      } else if (enemy.pos.y - (enemy.height / 2) <= this.configs.screen.topBorder) {
        enemy.moveDirection = MoveDirection.Down;
      }

      enemy.moveDirection === MoveDirection.Up ? enemy.move(speedX * -1, speedY * -1) : enemy.move(speedX * -1, speedY);
    } else if (enemy.moveType === MoveType.UpDownStraight) {
      const moveLimitTop = enemy.startPosition.y - enemy.moveLimit!;
      const moveLimitBottom = enemy.startPosition.y + enemy.moveLimit!;

      if (enemy.pos.y + (enemy.height / 2) >= moveLimitBottom) {
        enemy.moveDirection = MoveDirection.Up;
      } else if (enemy.pos.y - (enemy.height / 2) <= moveLimitTop) {
        enemy.moveDirection = MoveDirection.Down;
      }

      enemy.moveDirection === MoveDirection.Up ? enemy.move(speedX * -1, speedY * -1) : enemy.move(speedX * -1, speedY);
    } else if (enemy.moveType === MoveType.Random) {
      if (enemy.moveInterval! <= 0) {
        const random = this.randomIntFromInterval(0, 3);

        if (random === 0) {
          enemy.moveDirection = MoveDirection.Up;
        } else if (random === 1) {
          enemy.moveDirection = MoveDirection.Down;
        } else {
          enemy.moveDirection = MoveDirection.None;
        }

        enemy.moveInterval = enemy.initialMoveInterval!;
      }

      if (enemy.pos.y - (enemy.height / 2) < this.configs.screen.topBorder) {
        enemy.moveDirection = MoveDirection.Down;
      } else if (enemy.pos.y + (enemy.height / 2) >= this.configs.screen.bottomBorder) {
        enemy.moveDirection = MoveDirection.Up;
      }

      if (enemy.moveDirection === MoveDirection.Up) {
        enemy.move(speedX * -1, speedY * -1);
      } else if (enemy.moveDirection === MoveDirection.Down) {
        enemy.move(speedX * -1, speedY);
      } else {
        enemy.move(speedX * -1, 0);
      }

      enemy.moveInterval! -= 1;
    } else if (enemy.moveType === MoveType.UpDownRush) {
      console.log('rush');
    }
  }

  private enemyShoot(enemy: MinionObject | BossObject): void {
    enemy.waitForNextShot = true;

    const bullet = this.createNewShot(this.kaplay.vec2(enemy.pos.x - (enemy.width / 1.5), enemy.pos.y));

    bullet.play(ShotAnimation.Default, { loop: true });

    this.kaplay.play(SoundType.EnemyAttack, {
      speed: 2,
      volume: this.configs.sfxVolume,
    });

    this.kaplay.wait(enemy.shootInterval!, () => enemy.waitForNextShot = false);
  }

  private createNewShot(pos: Vec2): GameObj<SpriteComp | PosComp | LayerComp | AreaComp | BodyComp> {
    return this.kaplay.add([
      this.kaplay.sprite(Sprite.EnemyShot),
      this.kaplay.pos(pos),
      this.kaplay.area({ scale: 0.2, offset: this.kaplay.vec2(8, 0), collisionIgnore: [EntityType.Enemy] }),
      this.kaplay.body({ isStatic: false }),
      this.kaplay.anchor('center'),
      this.kaplay.layer(Layer.Game),
      this.kaplay.move(this.kaplay.vec2(-1, 0), 650),
      this.kaplay.offscreen({ destroy: true }),
      EntityType.EnemyBullet
    ]);
  }

  private playExplosion(pos: Vec2, explosionType: SoundType): void {
    const explosion = this.kaplay.add([
      this.kaplay.sprite(Sprite.Explosion),
      this.kaplay.pos(pos.x, pos.y),
      this.kaplay.scale(2.5),
      this.kaplay.anchor('center'),
      this.kaplay.layer(Layer.Game)
    ]);

    explosion.play(ExplosionAnimation.Default, {
      speed: 20,
      loop: false,
      onEnd: () => explosion.destroy()
    });

    this.kaplay.play(explosionType, {
      volume: this.configs.sfxVolume,
      speed: 2,
      detune: -100
    });
  }

  private randomIntFromInterval(min: number, max: number) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  private insertCustomValuesForEnemy(enemy: EnemyObj, options: Partial<EnemyObj>): void {
    Object.keys(options).forEach((key) => {
      if (key in enemy) {
        if (options[key as keyof EnemyObj] !== undefined) {
          (enemy as any)[key as keyof EnemyObj] = options[key as keyof EnemyObj]!;
        }
      }
    });
  }

}
