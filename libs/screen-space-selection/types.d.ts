declare module '@cesium/engine/Source/Scene/Cesium3DTilePass' {
  enum Cesium3DTilePass {
    PICK
  }
  export default Cesium3DTilePass
}

declare module '@cesium/engine/Source/Scene/Cesium3DTilePassState' {
  // eslint-disable-next-line @typescript-eslint/no-extraneous-class
  export default class Cesium3DTilePassState {
    viewport: BoundingRectangle
    constructor(arg: { pass: Cesium3DTilePass })
  }
}

declare module '@cesium/engine' {
  // Cesium's type definition is wrong. The parameter type of raiseEvent()
  // should be (...args: Parameter<Listener>) instead of
  // (...args: Parameter<Listener>[]).
  // This cannot be fixed by augmentation but by overloading.
  export interface Event<
    Listener extends (...args: any[]) => void = (...args: any[]) => void
  > {
    // eslint-disable-next-line @typescript-eslint/method-signature-style
    raiseEvent(...arguments: Parameters<Listener>): void
  }
}
