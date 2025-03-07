import { AnchorComp, AreaComp, BodyComp, GameObj, KAPLAYCtx, LayerComp, OffScreenComp, PosComp, RectComp, SpriteComp, Vec2 } from "kaplay";
import { EntityType, GameConfig, Layer, SceneTag, SoundType } from "./game-manager";
import { BossAnimation, ExplosionAnimation, ShotAnimation, Sprite } from "./sprite-manager";
import { life, score, store } from "../store";
import { PlayerObject } from "./player-manager";

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
  ) { }

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

    bullet.onCollide(EntityType.Player, (object) => {
      bullet.destroy();

      const player = object as PlayerObject;

      store.set(life, (currentLife) => currentLife - 1);

      if (store.get(life) <= 0) {
        this.playExplosion(player.pos, SoundType.PlayerDeath);

        player.destroy();

        this.kaplay.wait(2, () => {
          store.set(life, 3);
          store.set(score, 0);

          this.kaplay.go(SceneTag.LevelOne);
        });
      }
    });

    this.kaplay.wait(enemy.shootInterval!, () => enemy.waitForNextShot = false);
  }

  private createNewShot(pos: Vec2): GameObj<SpriteComp | PosComp | LayerComp | AreaComp | BodyComp> {
    return this.kaplay.add([
      this.kaplay.sprite(Sprite.EnemyShot),
      this.kaplay.pos(pos),
      this.kaplay.area({ scale: 0.2, offset: this.kaplay.vec2(8, 0), collisionIgnore: [EntityType.Player] }),
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

}
