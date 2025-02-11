import { KAPLAYCtx } from "kaplay";
import { SceneTag } from "./game-manager";

export enum PlayerAnimation {
  Default = 'default',
  Up = 'up',
  Down = 'down',
}

export enum ExplosionAnimation {
  Default = 'default',
}

export enum ShotAnimation {
  Default = 'default',
}

export enum PlanetAnimation {
  Default = 'default',
}

export enum SpriteType {
  PlanetOne = 'planet-one',
  PlanetTwo = 'planet-two',
  PlanetThree = 'planet-three',
  Explosion = 'explosion',
  PlayerShot = 'player-shot',
  EnemyShot = 'enemy-shot',
  Player = 'player',
}

export class SpriteManager {
  constructor(
    private readonly kaplay: KAPLAYCtx<{}, never>,
  ) { }

  public loadSprites(tag: SceneTag): void {
    this.loadScenarioSprites(tag);
    this.loadExplosionSprite();
    this.loadShotSprites();
    this.loadPlayerSprite();
  }

  private loadScenarioSprites(scene: SceneTag): void {
    const planets = {
      [SceneTag.LevelOne]: SpriteType.PlanetOne,
      [SceneTag.LevelTwo]: SpriteType.PlanetTwo,
      [SceneTag.LevelThree]: SpriteType.PlanetThree,
    };

    this.kaplay.loadSprite(planets[scene], `src/assets/sprites/${planets[scene]}.png`, {
      sliceY: 1,
      sliceX: 100,
      anims: {
        [PlanetAnimation.Default]: {
          from: 0,
          to: 99,
        }
      }
    });
  }

  private loadExplosionSprite(): void {
    this.kaplay.loadSprite(SpriteType.Explosion, `src/assets/sprites/explosion.png`, {
      sliceY: 1,
      sliceX: 6,
      anims: {
        [ExplosionAnimation.Default]: { from: 0, to: 5 },
      }
    });
  }

  private loadShotSprites(): void {
    this.kaplay.loadSprite(SpriteType.PlayerShot, `src/assets/sprites/player_shot.png`, {
      sliceY: 1,
      sliceX: 2,
      anims: {
        [ShotAnimation.Default]: { from: 0, to: 1 },
      }
    });
  }

  private loadPlayerSprite(): void {
    this.kaplay.loadSprite(SpriteType.Player, `src/assets/sprites/player.png`, {
      sliceY: 3,
      sliceX: 2,
      anims: {
        [PlayerAnimation.Up]: { from: 0, to: 1 },
        [PlayerAnimation.Default]: { from: 2, to: 3 },
        [PlayerAnimation.Down]: { from: 4, to: 5 },
      }
    });
  }

}
