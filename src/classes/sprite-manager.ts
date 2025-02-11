import { KAPLAYCtx } from "kaplay";
import { SceneTag } from "./game-manager";

export enum SpriteType {
  PlanetOne = 'planet-one',
  PlanetTwo = 'planet-two',
  PlanetThree = 'planet-three',
  Explosion = 'explosion',
  Bullet = 'bullet',
  Player = 'player',
}

export class SpriteManager {
  constructor(
    private readonly kaplay: KAPLAYCtx<{}, never>,
  ) { }

  public loadSprites(tag: SceneTag): void {
    this.loadScenarioSprites(tag);
    this.loadExplosionSprites();
    this.loadBulletSprites();
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
        rotation: {
          from: 0,
          to: 99,
        }
      }
    });
  }

  private loadExplosionSprites(): void {
    this.kaplay.loadSprite(SpriteType.Explosion, `src/assets/sprites/explosions.png`, {
      sliceY: 23,
      sliceX: 12,
      anims: {
        variation_1: { from: 0, to: 11 },
        variation_2: { from: 12, to: 23 },
        variation_3: { from: 24, to: 35 },
        variation_4: { from: 36, to: 47 },
        variation_5: { from: 48, to: 59 },
        variation_6: { from: 60, to: 71 },
        variation_7: { from: 72, to: 83 },
        variation_8: { from: 84, to: 95 },
        variation_9: { from: 96, to: 107 },
        variation_10: { from: 108, to: 119 },
        variation_11: { from: 120, to: 131 },
        variation_12: { from: 132, to: 143 },
        variation_13: { from: 144, to: 155 },
        variation_14: { from: 156, to: 167 },
        variation_15: { from: 168, to: 179 },
        variation_16: { from: 180, to: 191 },
        variation_17: { from: 192, to: 203 },
        variation_18: { from: 204, to: 215 },
        variation_19: { from: 216, to: 227 },
        variation_20: { from: 228, to: 239 },
        variation_21: { from: 240, to: 251 },
        variation_22: { from: 252, to: 263 },
        variation_23: { from: 264, to: 275 }
      }
    });
  }

  private loadBulletSprites(): void {
    this.kaplay.loadSprite(SpriteType.Bullet, `src/assets/sprites/bullets.png`, {
      sliceY: 15,
      sliceX: 24,
      anims: {
        variation_1: { from: 0, to: 7 },
        variation_2: { from: 8, to: 15 },
        variation_3: { from: 16, to: 23 },
        variation_4: { from: 24, to: 31 },
        variation_5: { from: 32, to: 39 },
        variation_6: { from: 40, to: 47 },
        variation_7: { from: 48, to: 55 },
        variation_8: { from: 56, to: 63 },
        variation_9: { from: 64, to: 71 },
        variation_10: { from: 72, to: 79 },
        variation_11: { from: 80, to: 87 },
        variation_12: { from: 88, to: 95 },
        variation_13: { from: 96, to: 103 },
        variation_14: { from: 104, to: 111 },
        variation_15: { from: 112, to: 119 },
        variation_16: { from: 120, to: 127 },
        variation_17: { from: 128, to: 135 },
        variation_18: { from: 136, to: 143 },
        variation_19: { from: 144, to: 151 },
        variation_20: { from: 152, to: 159 },
        variation_21: { from: 160, to: 167 },
        variation_22: { from: 168, to: 175 },
        variation_23: { from: 176, to: 183 },
        variation_24: { from: 184, to: 191 },
        variation_25: { from: 192, to: 199 },
        variation_26: { from: 200, to: 207 },
        variation_27: { from: 208, to: 215 },
        variation_28: { from: 216, to: 223 },
        variation_29: { from: 224, to: 231 },
        variation_30: { from: 232, to: 239 },
        variation_31: { from: 240, to: 247 },
        variation_32: { from: 248, to: 255 },
        variation_33: { from: 256, to: 263 },
        variation_34: { from: 264, to: 271 },
        variation_35: { from: 272, to: 279 },
        variation_36: { from: 280, to: 287 },
        variation_37: { from: 288, to: 295 },
        variation_38: { from: 296, to: 303 },
        variation_39: { from: 304, to: 311 },
        variation_40: { from: 312, to: 319 },
        variation_41: { from: 320, to: 327 },
        variation_42: { from: 328, to: 335 },
        variation_43: { from: 336, to: 343 },
        variation_44: { from: 344, to: 351 },
        variation_45: { from: 352, to: 359 }
      }
    });
  }

  private loadPlayerSprite(): void {
    this.kaplay.loadSprite(SpriteType.Player, `src/assets/sprites/player.png`, {
      sliceY: 3,
      sliceX: 2,
      anims: {
        up: { from: 0, to: 1 },
        normal: { from: 2, to: 3 },
        down: { from: 4, to: 5 }
      }
    });
  }

}
