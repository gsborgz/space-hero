import Kaplay, { KAPLAYCtx } from 'kaplay';
import { PlayerManager } from './player-manager';
import { SpriteManager, SpriteType } from './sprite-manager';
import { EnemyManager } from './enemy-manager';
import { life, score, store } from '../store';

export enum Layer {
  Background = 'background',
  Game = 'game',
  Foreground = 'foreground',
  HUD = 'hud',
}

export enum EntityType {
  Player = 'player',
  Enemy = 'enemy',
  PlayerBullet = 'player-bullet',
}

export enum SoundType {
  PlayerDeath = 'player-death',
  EnemyDeath = 'enemy-death',
  PlayerAttack = 'player-attack',
  EnemyAttack = 'enemy-attack',
}

export enum SceneTag {
  LevelOne = 'level-one',
  LevelTwo = 'level-two',
  LevelThree = 'level-three',
}

export type GameConfig = {
  screen: {
    width: number;
    height: number;
    topBorder: number;
    bottomBorder: number;
    leftBorder: number;
    rightBorder: number;
  };
  volume: number;
}

export class GameManager {

  private currentScene: SceneTag = SceneTag.LevelOne;
  private kaplay: KAPLAYCtx<{}, never>;
  private configs: GameConfig = {
    screen: {
      width: 800,
      height: 600,
      topBorder: 30,
      bottomBorder: 570,
      leftBorder: 10,
      rightBorder: 770
    },
    volume: 0.2
  };

  private playerManager: PlayerManager;
  private spriteManager: SpriteManager;
  private enemyManager: EnemyManager;

  constructor() {
    this.kaplay = this.createKaplayInstance();
    this.playerManager = new PlayerManager(this.kaplay, this.configs);
    this.spriteManager = new SpriteManager(this.kaplay);
    this.enemyManager = new EnemyManager(this.kaplay, this.configs);
  }

  public start(): void {
    this.createScenes();

    store.set(life, 3);
    store.set(score, 0);

    this.kaplay.go(this.currentScene);
  }

  private createScenes(): void {
    this.kaplay.setLayers([Layer.Background, Layer.Game, Layer.Foreground, Layer.HUD], Layer.Game);

    this.createLevel(SceneTag.LevelOne);
    this.createLevel(SceneTag.LevelTwo);
    this.createLevel(SceneTag.LevelThree);
  }

  private createLevel(scene: SceneTag): void {
    this.kaplay.scene(scene, () => {
      this.currentScene = scene;

      this.spriteManager.loadSprites(this.currentScene);

      this.loadSounds();
      this.createScenario();

      this.playerManager.createPlayer();
      this.enemyManager.createEnemies(this.currentScene);
    });
  }

  private createScenario(): void {
    this.kaplay.add([
      this.kaplay.rect(this.configs.screen.width, this.configs.screen.height, { fill: true }),
      this.kaplay.pos(0, 0),
      this.kaplay.color(1, 0, 0),
      this.kaplay.layer(Layer.Background)
    ]);

    const planet = this.kaplay.add([
      this.kaplay.sprite(SpriteType.PlanetOne),
      this.kaplay.pos(this.configs.screen.width / 2, this.configs.screen.height / 2),
      this.kaplay.scale(0.6),
      this.kaplay.anchor('center'),
      this.kaplay.layer(Layer.Background)
    ]);

    planet.play('rotation', { loop: true });

    // this.kaplay.loadSprite('foreground', `src/assets/maps/${tag}/foreground.png`);
    // this.kaplay.add([this.kaplay.sprite("foreground"), this.kaplay.pos(0, 0), this.kaplay.scale(this.scale), this.kaplay.layer('foreground')]);
  }

  private createKaplayInstance(): KAPLAYCtx<{}, never> {
    return Kaplay({
      width: this.configs.screen.width,
      height: this.configs.screen.height,
      letterbox: true,
      stretch: false,
      global: false,
      debug: true,
      debugKey: 'f1',
      canvas: document.getElementById('game') as HTMLCanvasElement,
      pixelDensity: devicePixelRatio
    });
  }

  private loadSounds(): void {
    this.kaplay.loadSound(SoundType.PlayerDeath, 'src/assets/sounds/player_death.wav');
    this.kaplay.loadSound(SoundType.PlayerAttack, 'src/assets/sounds/player_shoot.wav');
    this.kaplay.loadSound(SoundType.EnemyDeath, 'src/assets/sounds/enemy_death.wav');
  }

}
