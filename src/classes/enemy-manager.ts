import { KAPLAYCtx } from "kaplay";
import { EntityType, GameConfig, Layer, SceneTag } from "./game-manager";

export class EnemyManager {
  constructor(
    private readonly kaplay: KAPLAYCtx<{}, never>,
    private readonly configs: GameConfig,
  ) { }

  public createEnemies(scene: SceneTag): void {
    switch (scene) {
      case SceneTag.LevelOne:
        this.createLevelOneEnemies();
        break;
      case SceneTag.LevelTwo:
        this.createLevelTwoEnemies();
        break;
      case SceneTag.LevelThree:
        this.createLevelThreeEnemies();
        break;
    }
  }

  private createLevelOneEnemies(): void {
    const intervalId = setInterval(() => {
      this.kaplay.add([
        this.kaplay.rect(20, 20, { fill: true }),
        this.kaplay.pos(800, 200),
        this.kaplay.area(),
        this.kaplay.body(),
        this.kaplay.anchor('center'),
        this.kaplay.layer(Layer.Game),
        this.kaplay.move(this.kaplay.vec2(-1, 0), 120),
        this.kaplay.offscreen({ destroy: true }),
        EntityType.Enemy
      ]);
    }, 1000);

    setTimeout(() => {
      clearInterval(intervalId);
    }, 5000);
  }

  private createLevelTwoEnemies(): void {
    const intervalId = setInterval(() => {

    }, 500);

    setTimeout(() => {
      clearInterval(intervalId);
    }, 5000);
  }

  private createLevelThreeEnemies(): void {
    const intervalId = setInterval(() => {

    }, 250);

    setTimeout(() => {
      clearInterval(intervalId);
    }, 5000);
  }
}
