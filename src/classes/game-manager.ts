import Kaplay, { KAPLAYCtx } from 'kaplay';
import { PlayerManager } from './player-manager';
import { PlanetAnimation, SpriteManager, Background } from './sprite-manager';
import { life, score, store } from '../store';
import { LevelManager } from './level-manager';

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
  EnemyBullet = 'enemy-bullet',
}

export enum SoundType {
  PlayerDeath = 'player-death',
  EnemyDeath = 'enemy-death',
  PlayerAttack = 'player-attack',
  EnemyAttack = 'player-attack',
}

export enum SceneTag {
  StartMenu = 'start-menu',
  LevelOne = 'level-one',
  LevelTwo = 'level-two',
  LevelThree = 'level-three',
  Ranking = 'ranking',
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
  sfxVolume: number;
  musicVolume: number;
}

export class GameManager {

  private currentScene: SceneTag = SceneTag.StartMenu;
  private kaplay: KAPLAYCtx<{}, never>;
  private configs: GameConfig = {
    screen: {
      width: 800,
      height: 500,
      topBorder: 0,
      bottomBorder: 0,
      leftBorder: 0,
      rightBorder: 0
    },
    sfxVolume: 0.2,
    musicVolume: 0.2
  };
  private sceneSequence = {
    [SceneTag.StartMenu]: SceneTag.LevelOne,
    [SceneTag.LevelOne]: SceneTag.LevelTwo,
    [SceneTag.LevelTwo]: SceneTag.LevelThree,
    [SceneTag.LevelThree]: SceneTag.Ranking,
    [SceneTag.Ranking]: SceneTag.StartMenu
  }

  private playerManager: PlayerManager;
  private spriteManager: SpriteManager;
  private levelManager: LevelManager;

  constructor() {
    this.configs.screen.rightBorder = this.configs.screen.width - 20;
    this.configs.screen.bottomBorder = this.configs.screen.height - 20;
    this.configs.screen.topBorder = 20;
    this.configs.screen.leftBorder = 10;

    this.kaplay = this.createKaplayInstance();
    this.playerManager = new PlayerManager(this.kaplay, this.configs);
    this.spriteManager = new SpriteManager(this.kaplay);
    this.levelManager = new LevelManager(this.kaplay, this.configs);
  }

  public start(): void {
    this.createScenes();

    store.set(life, 3);
    store.set(score, 0);

    this.kaplay.go(this.currentScene);
  }

  private createScenes(): void {
    this.kaplay.setLayers([Layer.Background, Layer.Game, Layer.Foreground, Layer.HUD], Layer.Game);

    this.createStartMenuScene();
    this.createLevel(SceneTag.LevelOne);
    this.createLevel(SceneTag.LevelTwo);
    this.createLevel(SceneTag.LevelThree);
    this.createRankingScene();
  }

  private createStartMenuScene(): void {
    this.kaplay.scene(SceneTag.StartMenu, () => {
      this.spriteManager.loadSprites(this.currentScene);
      this.createScenario();

      this.kaplay.onUpdate(() => {
        if (this.kaplay.isKeyPressed('enter')) {
          this.kaplay.go(this.sceneSequence[this.currentScene]);
        }
      });
    });
  }

  private createRankingScene(): void {
    this.kaplay.scene(SceneTag.Ranking, () => {
      this.spriteManager.loadSprites(this.currentScene);
      this.createScenario();

      this.kaplay.onUpdate(() => {
        if (this.kaplay.isKeyPressed('escape')) {
          this.kaplay.go(this.sceneSequence[this.currentScene]);
        }
      });
    });
  }

  private createLevel(scene: SceneTag): void {
    this.kaplay.scene(scene, () => {
      this.currentScene = scene;

      this.spriteManager.loadSprites(this.currentScene);

      this.loadSounds();
      this.createScenario();

      this.playerManager.createPlayer();
      this.levelManager.startLevel(scene);

      this.kaplay.on('boss-defeated', EntityType.Player, () => {
        this.kaplay.wait(2, () => this.kaplay.go(this.sceneSequence[this.currentScene]));
      });
    });
  }

  private createScenario(): void {
    const sceneBackground = {
      [SceneTag.StartMenu]: Background.Menu,
      [SceneTag.Ranking]: Background.Menu,
      [SceneTag.LevelOne]: Background.PlanetOne,
      [SceneTag.LevelTwo]: Background.PlanetTwo,
      [SceneTag.LevelThree]: Background.PlanetThree,
    }
    const isMenu = sceneBackground[this.currentScene] === Background.Menu;
    const scale = isMenu ? 12.5 : 0.6;

    this.kaplay.add([
      this.kaplay.rect(this.configs.screen.width, this.configs.screen.height, { fill: true }),
      this.kaplay.pos(0, 0),
      this.kaplay.color(1, 0, 0),
      this.kaplay.layer(Layer.Background)
    ]);

    const backgroundSprite = this.kaplay.add([
      this.kaplay.sprite(sceneBackground[this.currentScene]),
      this.kaplay.pos(this.configs.screen.width / 2, this.configs.screen.height / 2),
      this.kaplay.scale(scale),
      this.kaplay.anchor('center'),
      this.kaplay.layer(Layer.Background)
    ]);

    backgroundSprite.play(PlanetAnimation.Default, { loop: true });

    // this.kaplay.loadSprite('foreground', `assets/maps/${tag}/foreground.png`);
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
      debugKey: 'f2',
      canvas: document.getElementById('game') as HTMLCanvasElement,
      pixelDensity: devicePixelRatio
    });
  }

  private loadSounds(): void {
    this.kaplay.loadSound(SoundType.PlayerDeath, 'assets/sounds/player_death.wav');
    this.kaplay.loadSound(SoundType.PlayerAttack, 'assets/sounds/player_shoot.wav');
    this.kaplay.loadSound(SoundType.EnemyDeath, 'assets/sounds/enemy_death.wav');
  }

}
