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
  MenuBackground = 'menu-background',
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
    const backgroundImages = {
      [SceneTag.StartMenu]: SpriteType.MenuBackground,
      [SceneTag.Ranking]: SpriteType.MenuBackground,
      [SceneTag.LevelOne]: SpriteType.PlanetOne,
      [SceneTag.LevelTwo]: SpriteType.PlanetTwo,
      [SceneTag.LevelThree]: SpriteType.PlanetThree,
    };
    const isMenu = backgroundImages[scene] === SpriteType.MenuBackground;

    this.kaplay.loadSprite(backgroundImages[scene], `src/assets/sprites/${backgroundImages[scene]}.png`, {
      sliceY: 1,
      sliceX: isMenu ? 4 : 100,
      anims: {
        [PlanetAnimation.Default]: {
          from: 0,
          to: isMenu ? 3 : 99,
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
    this.kaplay.loadSprite(SpriteType.PlayerShot, `src/assets/sprites/player-shot.png`, {
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
