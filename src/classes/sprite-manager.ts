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

export enum BossAnimation {
  Default = 'default',
}

export enum Sprite {
  Explosion = 'explosion',
  PlayerShot = 'player-shot',
  EnemyShot = 'enemy-shot',
  Player = 'player',
  BossOne = 'boss-1',
  BossTwo = 'boss-2',
  BossThree = 'boss-3',
  MinionOne = 'minion-1',
  MinionTwo = 'minion-2',
  MinionThree = 'minion-3',
  MinionFour = 'minion-4',
}

export enum Background {
  Menu = 'menu-background',
  PlanetOne = 'planet-one',
  PlanetTwo = 'planet-two',
  PlanetThree = 'planet-three',
}

export class SpriteManager {
  constructor(
    private readonly kaplay: KAPLAYCtx<{}, never>,
  ) { }

  public loadSprites(tag: SceneTag): void {
    this.loadSceneSprites(tag);
    this.loadExplosionSprite();
    this.loadShotSprites();
    this.loadPlayerSprite();
    this.loadEnemiesSprites(tag);
  }

  private loadSceneSprites(scene: SceneTag): void {
    const backgroundImages = {
      [SceneTag.StartMenu]: Background.Menu,
      [SceneTag.Ranking]: Background.Menu,
      [SceneTag.LevelOne]: Background.PlanetOne,
      [SceneTag.LevelTwo]: Background.PlanetTwo,
      [SceneTag.LevelThree]: Background.PlanetThree,
    };
    const isMenu = backgroundImages[scene] === Background.Menu;

    this.kaplay.loadSprite(backgroundImages[scene], `assets/sprites/${backgroundImages[scene]}.png`, {
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

  private loadEnemiesSprites(scene: SceneTag): void {
    const bossImages = {
      [SceneTag.LevelOne]: Sprite.BossOne,
      [SceneTag.LevelTwo]: Sprite.BossTwo,
      [SceneTag.LevelThree]: Sprite.BossThree,
    };

    if (scene !== SceneTag.StartMenu && scene !== SceneTag.Ranking) {
      this.kaplay.loadSprite(bossImages[scene], `assets/sprites/${bossImages[scene]}.png`, {
        sliceY: 1,
        sliceX: 20,
        anims: {
          [BossAnimation.Default]: { from: 0, to: 19 },
        }
      });
    }

    this.kaplay.loadSprite(Sprite.MinionOne, `assets/sprites/${Sprite.MinionOne}.png`);
    this.kaplay.loadSprite(Sprite.MinionTwo, `assets/sprites/${Sprite.MinionTwo}.png`);
    this.kaplay.loadSprite(Sprite.MinionThree, `assets/sprites/${Sprite.MinionThree}.png`);
    this.kaplay.loadSprite(Sprite.MinionFour, `assets/sprites/${Sprite.MinionFour}.png`);
  }

  private loadExplosionSprite(): void {
    this.kaplay.loadSprite(Sprite.Explosion, `assets/sprites/${Sprite.Explosion}.png`, {
      sliceY: 1,
      sliceX: 6,
      anims: {
        [ExplosionAnimation.Default]: { from: 0, to: 5 },
      }
    });
  }

  private loadShotSprites(): void {
    this.kaplay.loadSprite(Sprite.PlayerShot, `assets/sprites/${Sprite.PlayerShot}.png`, {
      sliceY: 1,
      sliceX: 2,
      anims: {
        [ShotAnimation.Default]: { from: 0, to: 1 },
      }
    });

    this.kaplay.loadSprite(Sprite.EnemyShot, `assets/sprites/${Sprite.EnemyShot}.png`, {
      sliceY: 1,
      sliceX: 2,
      anims: {
        [ShotAnimation.Default]: { from: 0, to: 1 },
      }
    });
  }

  private loadPlayerSprite(): void {
    this.kaplay.loadSprite(Sprite.Player, `assets/sprites/${Sprite.Player}.png`, {
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
