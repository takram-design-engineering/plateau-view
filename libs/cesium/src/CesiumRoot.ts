import {
  BillboardCollection,
  CesiumWidget,
  DataSourceCollection,
  DataSourceDisplay,
  EventHelper,
  type Clock,
  type EntityCollection,
  type ImageryLayer
} from '@cesium/engine'

export type CesiumRootOptions = Exclude<
  ConstructorParameters<typeof CesiumWidget>[1],
  undefined
>

export class CesiumRoot extends CesiumWidget {
  readonly dataSources = new DataSourceCollection()
  readonly dataSourceDisplay = new DataSourceDisplay({
    scene: this.scene,
    dataSourceCollection: this.dataSources
  })

  private readonly billboardCollection: BillboardCollection
  private readonly eventHelper = new EventHelper()

  constructor(
    container: Element,
    options: CesiumRootOptions = {},
    baseLayer?: ImageryLayer | false
  ) {
    super(container, options, baseLayer)
    this.billboardCollection = new BillboardCollection({
      scene: this.scene
    })
    this.scene.primitives.add(this.billboardCollection)
    this.eventHelper.add(this.clock.onTick, this.handleTick, this)
  }

  get entities(): EntityCollection {
    return this.dataSourceDisplay.defaultDataSource.entities
  }

  get billboards(): BillboardCollection {
    return this.billboardCollection
  }

  destroy(): void {
    if (!this.isDestroyed()) {
      this.scene.primitives.remove(this.billboardCollection)
      this.eventHelper.removeAll()
      this.dataSourceDisplay.destroy()
      this.dataSources.destroy()
      super.destroy()
    }
  }

  handleTick(clock: Clock): void {
    this.dataSourceDisplay.update(clock.currentTime)
  }
}
