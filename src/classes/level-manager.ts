import { KAPLAYCtx } from 'kaplay';
import { GameConfig, SceneTag } from './game-manager';
import { EnemyManager, MoveDirection, MoveType } from './enemy-manager';

export class LevelManager {

  private enemyManager: EnemyManager;
  private currentWave = 0;
  private waves: (() => void)[] = [];

  constructor(
    private readonly kaplay: KAPLAYCtx<{}, never>,
    private readonly configs: GameConfig,
  ) {
    this.enemyManager = new EnemyManager(this.kaplay, this.configs);
  }

  public startLevel(scene: SceneTag): void {
    this.resetWaves();

    switch (scene) {
      case SceneTag.LevelOne:
        this.createLevelOneWaves();
        break;
      case SceneTag.LevelTwo:
        this.createLevelTwoEnemies();
        break;
      case SceneTag.LevelThree:
        this.createLevelThreeEnemies();
        break;
    }

    this.kaplay.wait(4, () => this.runWaves());
  }

  private resetWaves(): void {
    this.currentWave = 0;
    this.waves = [];
  }

  private runWaves(): void {
    if (!this.waves[this.currentWave]) return;

    this.waves[this.currentWave]();
  }

  private callNextWave(): void {
    this.currentWave++;
    this.runWaves();
  }

  private createLevelOneWaves(): void {
    const waveOne = () => this.levelOneWaveOne();
    const waveTwo = () => this.levelOneWaveTwo();
    const waveThree = () => this.levelOneWaveThree();

    this.waves.push(waveOne, waveTwo, waveThree);
  }

  private createLevelTwoEnemies(): void {

  }

  private createLevelThreeEnemies(): void {

  }

  private levelOneWaveOne() {
    let currentLoop = 0;

    this.kaplay.loop(1, () => {
      this.enemyManager.createMinion({
        hp: 2,
        startPosition: this.kaplay.vec2(this.configs.screen.width, (this.configs.screen.height / 2) - 100),
        moveType: MoveType.UpDownStraight,
        moveDirection: MoveDirection.Up,
        moveLimit: 100,
        size: { w: 20, h: 20 },
        speedX: 85,
        speedY: 150,
        shootInterval: 1,
      });
      this.enemyManager.createMinion({
        hp: 2,
        startPosition: this.kaplay.vec2(this.configs.screen.width, (this.configs.screen.height / 2) + 100),
        moveType: MoveType.UpDownStraight,
        moveDirection: MoveDirection.Down,
        moveLimit: 100,
        size: { w: 20, h: 20 },
        speedX: 85,
        speedY: 150,
      });

      currentLoop++;

      if (currentLoop === 10) {
        this.kaplay.wait(10, () => {
          this.callNextWave();
        });
      }
    }, 10);
  }

  private levelOneWaveTwo() {
    let currentLoop = 0;

    this.kaplay.loop(1, () => {
      this.enemyManager.createMinion({
        hp: 2,
        startPosition: this.kaplay.vec2(this.configs.screen.width, (this.configs.screen.height / 2) - 120),
        moveType: MoveType.Random,
        initialMoveInterval: 50,
        size: { w: 20, h: 20 },
        speedX: 100,
        speedY: 200,
      });

      this.enemyManager.createMinion({
        hp: 2,
        startPosition: this.kaplay.vec2(this.configs.screen.width, (this.configs.screen.height / 2) + 120),
        moveType: MoveType.Random,
        initialMoveInterval: 50,
        size: { w: 20, h: 20 },
        speedX: 100,
        speedY: 200,
      });

      currentLoop++;

      if (currentLoop === 10) {
        this.kaplay.wait(10, () => {
          this.callNextWave();
        });
      }
    }, 10);
  }

  private levelOneWaveThree() {
    this.enemyManager.createBoss({
      hp: 50,
      stopPositionX: 750,
      startPosition: this.kaplay.vec2(this.configs.screen.width + 100, (this.configs.screen.height / 2)),
      moveType: MoveType.UpDown,
      initialMoveInterval: 50,
      size: { w: 50, h: 50 },
      speedX: 100,
      speedY: 200,
    });
  }

}


