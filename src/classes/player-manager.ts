import { AnchorComp, AreaComp, BodyComp, GameObj, KAPLAYCtx, LayerComp, PosComp, SpriteComp, Vec2 } from "kaplay";
import { EntityType, GameConfig, Layer, SceneTag, SoundType } from "./game-manager";
import { ExplosionAnimation, PlayerAnimation, ShotAnimation, Sprite } from "./sprite-manager";
import { store, score, life } from '../store';
import { BossObject, MinionObject } from "./enemy-manager";

type PlayerObj = {
  speed: number;
  movementDirection: Vec2;
};

export type PlayerObject = GameObj<SpriteComp | PosComp | LayerComp | AreaComp | BodyComp | AnchorComp | PlayerObj>;

export class PlayerManager {

  constructor(
    private readonly kaplay: KAPLAYCtx<{}, never>,
    private readonly configs: GameConfig,
  ) { }

  public createPlayer(): PlayerObject {
    const newPlayer = this.kaplay.add([
      this.kaplay.sprite(Sprite.Player),
      this.kaplay.pos(0, 0),
      this.kaplay.area({ scale: 0.5, offset: this.kaplay.vec2(8, 0) }),
      this.kaplay.body({ isStatic: true }),
      this.kaplay.scale(1.5),
      this.kaplay.anchor('center'),
      this.kaplay.layer(Layer.Game),
      {
        speed: 250,
        movementDirection: this.kaplay.vec2(0, 0)
      } as PlayerObj,
      EntityType.Player
    ]);

    newPlayer.pos.x = 20;
    newPlayer.pos.y = this.configs.screen.height / 2;

    this.setPlayerListeners(newPlayer);

    return newPlayer;
  }

  private setPlayerListeners(player: PlayerObject): void {
    player.onUpdate(() => {
      player.movementDirection.x = 0;
      player.movementDirection.y = 0;

      this.playerMovement(player);
      this.playerShoot(player);
    });

    player.onCollide(EntityType.Enemy, (enemy) => {
      enemy.hp -= 2;

      this.damagePlayer(player);

      if (enemy.hp <= 0) {
        this.playExplosion(enemy.pos, SoundType.EnemyDeath);

        enemy.destroy();

        if (enemy.isBoss) {
          store.set(score, (currentScore) => currentScore + 100);

          player.trigger('boss-defeated');
        } else {
          store.set(score, (currentScore) => currentScore + 1);
        }
      }
    });

    player.onCollide(EntityType.EnemyBullet, (bullet) => {
      bullet.destroy();

      this.damagePlayer(player);
    });
  }

  private playerMovement(player: PlayerObject): void {
    const movingRight = this.kaplay.isKeyDown('right');
    const movingLeft = this.kaplay.isKeyDown('left');
    const movingDown = this.kaplay.isKeyDown('down');
    const movingUp = this.kaplay.isKeyDown('up');

    if (movingRight) player.movementDirection.x = 1;
    if (movingLeft) player.movementDirection.x = -1;
    if (movingDown) player.movementDirection.y = 1;
    if (movingUp) player.movementDirection.y = -1;

    player.move(player.movementDirection.scale(player.speed));

    if (player.pos.x - (player.width / 2) < this.configs.screen.leftBorder) player.pos.x = this.configs.screen.leftBorder + (player.width / 2);
    if (player.pos.x + (player.width / 2) > this.configs.screen.rightBorder) player.pos.x = this.configs.screen.rightBorder - (player.width / 2);
    if (player.pos.y - (player.height / 2) < this.configs.screen.topBorder) player.pos.y = this.configs.screen.topBorder + (player.height / 2);
    if (player.pos.y + (player.height / 2) > this.configs.screen.bottomBorder) player.pos.y = this.configs.screen.bottomBorder - (player.height / 2);

    if (movingUp && (player.getCurAnim()?.name !== PlayerAnimation.Up)) player.play(PlayerAnimation.Up, { loop: true });
    if (movingDown && (player.getCurAnim()?.name !== PlayerAnimation.Down)) player.play(PlayerAnimation.Down, { loop: true });
    if (!movingUp && !movingDown && (player.getCurAnim()?.name !== PlayerAnimation.Default)) player.play(PlayerAnimation.Default, { loop: true });
  }

  private playerShoot(player: PlayerObject): void {
    if (this.kaplay.isKeyPressed('space')) {
      const bullet = this.createNewShot(this.kaplay.vec2(player.pos.x + (player.width / 1.5), player.pos.y));

      bullet.play(ShotAnimation.Default, { loop: true });

      this.kaplay.play(SoundType.PlayerAttack, {
        speed: 2,
        volume: this.configs.sfxVolume,
      });

      bullet.onCollide(EntityType.Enemy, (object) => {
        bullet.destroy();

        const enemy = object as MinionObject & BossObject;

        enemy.hp -= 1;

        if (enemy.hp <= 0) {
          this.playExplosion(enemy.pos, SoundType.EnemyDeath);

          enemy.destroy();

          if (enemy.isBoss) {
            store.set(score, (currentScore) => currentScore + 100);

            player.trigger('boss-defeated');
          } else {
            store.set(score, (currentScore) => currentScore + 1);
          }
        }
      });

      bullet.onCollide(EntityType.EnemyBullet, (object) => {
        bullet.destroy();
        object.destroy();
      });
    }
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

  private createNewShot(pos: Vec2): GameObj<SpriteComp | PosComp | LayerComp | AreaComp | BodyComp> {
    return this.kaplay.add([
      this.kaplay.sprite(Sprite.PlayerShot),
      this.kaplay.pos(pos),
      this.kaplay.area({ scale: 0.2, offset: this.kaplay.vec2(8, 0), collisionIgnore: [EntityType.Player] }),
      this.kaplay.body({ isStatic: false }),
      this.kaplay.anchor('center'),
      this.kaplay.layer(Layer.Game),
      this.kaplay.move(this.kaplay.vec2(1, 0), 650),
      this.kaplay.offscreen({ destroy: true }),
      EntityType.PlayerBullet
    ]);
  }

  private damagePlayer(player: PlayerObject): void {
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
  }

}
