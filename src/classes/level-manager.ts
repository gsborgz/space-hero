import { KAPLAYCtx } from 'kaplay';
import { GameConfig, SceneTag } from './game-manager';
import { EnemyManager, MinionTag, MoveDirection, MoveType } from './enemy-manager';
import { Sprite } from './sprite-manager';

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

    this.kaplay.wait(1, () => this.runWaves());
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
    const waveFour = () => this.levelOneWaveFour();

    this.waves.push(waveOne, waveTwo, waveThree, waveFour);
  }

  private createLevelTwoEnemies(): void {

  }

  private createLevelThreeEnemies(): void {

  }

  private async levelOneWaveOne() {
    await this.loop(1, 10, async (currentLoop) => {
      this.enemyManager.createMinion(this.enemyManager.getMinionTemplate(MinionTag.MinionOne, 0, {
        startPosition: this.kaplay.vec2(this.configs.screen.width, (this.configs.screen.height / 2) - 100),
        moveDirection: MoveDirection.Up,
      }));
      this.enemyManager.createMinion(this.enemyManager.getMinionTemplate(MinionTag.MinionOne, 0, {
        startPosition: this.kaplay.vec2(this.configs.screen.width, (this.configs.screen.height / 2) + 100),
        moveDirection: MoveDirection.Down,
      }));

      if (currentLoop === 9) {
        await this.wait(5);

        this.callNextWave();
      }
    });
  }

  private levelOneWaveTwo() {
    this.loop(1, 10, async (currentLoop) => {
      this.enemyManager.createMinion(this.enemyManager.getMinionTemplate(MinionTag.MinionTwo, 0, {
        startPosition: this.kaplay.vec2(this.configs.screen.width, (this.configs.screen.height / 2) - 120)
      }));

      this.enemyManager.createMinion(this.enemyManager.getMinionTemplate(MinionTag.MinionTwo, 0, {
        startPosition: this.kaplay.vec2(this.configs.screen.width, (this.configs.screen.height / 2) + 120),
      }));

      currentLoop++;

      if (currentLoop === 10) {
        await this.wait(5);

        this.callNextWave();
      }
    });
  }

  private levelOneWaveThree() {
    this.loop(1, 10, async (currentLoop) => {
      this.enemyManager.createMinion(this.enemyManager.getMinionTemplate(MinionTag.MinionThree, 1, {
        startPosition: this.kaplay.vec2(this.configs.screen.width, (this.configs.screen.height / 2) - 120),
        
      }));

      this.enemyManager.createMinion(this.enemyManager.getMinionTemplate(MinionTag.MinionThree, 1, {
        startPosition: this.kaplay.vec2(this.configs.screen.width, (this.configs.screen.height / 2) + 120),
      }));

      currentLoop++;

      if (currentLoop === 10) {
        await this.wait(5);

        this.callNextWave();
      }
    });
  }

  private levelOneWaveFour() {
    this.enemyManager.createBoss({
      sprite: Sprite.BossOne,
      hp: 50,
      stopPositionX: 730,
      shootInterval: 3,
      startPosition: this.kaplay.vec2(this.configs.screen.width + 100, (this.configs.screen.height / 2)),
      moveType: MoveType.UpDown,
      initialMoveInterval: 50,
      scale: 2,
      speedX: 100,
      speedY: 200,
    });
  }

  private levelTwoWaveOne() {

  }

  private levelTwoWaveTwo() {

  }

  private levelTwoWaveThree() {

  }

  private async loop(time: number, maxLoops: number, callback: (currentLoop: number) => Promise<void>): Promise<void> {
    let currentLoop = 0;

    return new Promise((resolve) => {
      this.kaplay.loop(time, async () => {
        await callback(currentLoop);

        currentLoop++;

        if (currentLoop === maxLoops) {
          resolve();
        }
      }, maxLoops);
    });
  }

  private wait(time: number): Promise<void> {
    return new Promise((resolve) => {
      this.kaplay.wait(time, () => {
        resolve();
      });
    });
  }

}


