import { AnchorComp, AreaComp, BodyComp, EmptyComp, GameObj, KAPLAYCtx, LayerComp, OffScreenComp, PosComp, RectComp, Vec2 } from "kaplay";
import { EntityType, GameConfig, Layer, SceneTag } from "./game-manager";

enum MoveDirection {
  Up = 'up',
  Down = 'down',
  None = 'none',
}

enum MoveType {
  Straight = 'straight',
  UpDown = 'up-down',
  UpDownStraight = 'up-down-straight',
  Random = 'random',
  UpDownRush = 'up-down-rush',
}

type EnemyObj = {
  hp: number;
  isBoss?: boolean,
  nextScene?: SceneTag;
  startPosition: Vec2;
  size: { w: number, h: number };
  moveType: MoveType;
  moveDirection?: MoveDirection;
  moveLimit?: number;
  initialMoveInterval?: number;
  moveInterval?: number;
  speedX: number;
  speedY: number;
}

export type EnemyObject = GameObj<PosComp | RectComp | AreaComp | BodyComp | AnchorComp | LayerComp | OffScreenComp | EnemyObj>;

type WaveConfig = {
  loopInterval: number;
  maxLoops: number;
  waitTimeBeforeEnd: number;
  spawnFunction: () => void;
}

export class EnemyManager {

  private currentWave = 0;
  private currentWaveLoop = 0;
  private waves: WaveConfig[] = [];

  constructor(
    private readonly kaplay: KAPLAYCtx<{}, never>,
    private readonly configs: GameConfig,
  ) { }

  public createEnemies(scene: SceneTag): void {
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

    this.currentWave = 0;
    this.currentWaveLoop = 0;

    this.kaplay.wait(4, () => this.runWaves());
  }

  public resetWaves(): void {
    this.currentWave = 0;
    this.currentWaveLoop = 0;
    this.waves = [];
  }

  private runWaves(): void {
    if (!this.waves[this.currentWave]) return;

    this.kaplay.loop(this.waves[this.currentWave].loopInterval, () => {
      this.currentWaveLoop++;
      this.waves[this.currentWave].spawnFunction();

      if (this.currentWaveLoop >= this.waves[this.currentWave].maxLoops) {
        this.currentWaveLoop = 0;

        if (!this.waves[this.currentWave + 1]) return;

        this.kaplay.wait(this.waves[this.currentWave].waitTimeBeforeEnd, () => {
          this.currentWave++;
          this.runWaves();
        });
      }
    }, this.waves[this.currentWave].maxLoops);
  }

  private createLevelOneWaves(): void {
    const waveOne: WaveConfig = {
      loopInterval: 0.5,
      maxLoops: 10,
      waitTimeBeforeEnd: 10,
      spawnFunction: () => {
        this.createMinion({
          hp: 2,
          startPosition: this.kaplay.vec2(this.configs.screen.width, (this.configs.screen.height / 2) - 100),
          moveType: MoveType.UpDownStraight,
          moveDirection: MoveDirection.Up,
          moveLimit: 100,
          size: { w: 20, h: 20 },
          speedX: 85,
          speedY: 150,
        });
        this.createMinion({
          hp: 2,
          startPosition: this.kaplay.vec2(this.configs.screen.width, (this.configs.screen.height / 2) + 100),
          moveType: MoveType.UpDownStraight,
          moveDirection: MoveDirection.Down,
          moveLimit: 100,
          size: { w: 20, h: 20 },
          speedX: 85,
          speedY: 150,
        });
      }
    };
    const waveTwo: WaveConfig = {
      loopInterval: 2,
      maxLoops: 3,
      waitTimeBeforeEnd: 10,
      spawnFunction: () => {
        this.createMinion({
          hp: 2,
          startPosition: this.kaplay.vec2(this.configs.screen.width, (this.configs.screen.height / 2) - 120),
          moveType: MoveType.Random,
          initialMoveInterval: 50,
          size: { w: 20, h: 20 },
          speedX: 100,
          speedY: 200,
        });

        this.createMinion({
          hp: 2,
          startPosition: this.kaplay.vec2(this.configs.screen.width, (this.configs.screen.height / 2) + 120),
          moveType: MoveType.Random,
          initialMoveInterval: 50,
          size: { w: 20, h: 20 },
          speedX: 100,
          speedY: 200,
        });
      }
    };
    const waveThree: WaveConfig = {
      loopInterval: 1,
      maxLoops: 1,
      waitTimeBeforeEnd: 0,
      spawnFunction: () => {
        this.createBoss({
          hp: 2,
          nextScene: SceneTag.LevelTwo,
          startPosition: this.kaplay.vec2(this.configs.screen.width, (this.configs.screen.height / 2)),
          moveType: MoveType.UpDown,
          initialMoveInterval: 50,
          size: { w: 50, h: 50 },
          speedX: 100,
          speedY: 200,
        });
      }
    }

    this.waves.push(waveOne, waveTwo, waveThree);
  }

  private createLevelTwoEnemies(): void {

  }

  private createLevelThreeEnemies(): void {

  }

  private createMinion(config: EnemyObj): void {
    const enemy = this.kaplay.add([
      this.kaplay.rect(config.size.w, config.size.h, { fill: true }),
      this.kaplay.pos(config.startPosition),
      this.kaplay.area({ collisionIgnore: [EntityType.Enemy] }),
      this.kaplay.body({ isStatic: true }),
      this.kaplay.anchor('center'),
      this.kaplay.layer(Layer.Game),
      this.kaplay.offscreen({ destroy: true }),
      {
        ...config,
        moveInterval: config.initialMoveInterval || 0,
      },
      EntityType.Enemy
    ]);

    enemy.onUpdate(() => {
      this.setEnemyMovement(enemy, config.speedX, config.speedY);
    });
  }

  private createBoss(config: EnemyObj): void {
    const enemy = this.kaplay.add([
      this.kaplay.rect(config.size.w, config.size.h, { fill: true }),
      this.kaplay.pos(config.startPosition),
      this.kaplay.area({ collisionIgnore: [EntityType.Enemy] }),
      this.kaplay.body({ isStatic: true }),
      this.kaplay.anchor('center'),
      this.kaplay.layer(Layer.Game),
      this.kaplay.offscreen({ destroy: true }),
      {
        ...config,
        moveInterval: config.initialMoveInterval || 0,
        isBoss: true,
      },
      EntityType.Enemy
    ]);

    enemy.onUpdate(() => {
      const isEnteringScreen = enemy.pos.x > this.configs.screen.width / 2 + 300;

      if (isEnteringScreen) {
        enemy.move(-50, 0);
      } else {
        this.setEnemyMovement(enemy, 0, config.speedY);
      }
    });
  }

  private setEnemyMovement(enemy: EnemyObject, speedX: number, speedY: number): void {
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

        enemy.moveInterval = enemy.initialMoveInterval;
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

  private randomIntFromInterval(min: number, max: number) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

}
