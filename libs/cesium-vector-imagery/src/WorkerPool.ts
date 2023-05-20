import { Pool, spawn, type ModuleThread } from 'threads'

import { type VectorTileRenderWorker } from './VectorTileRenderWorker'

export type WorkerPool = Pool<ModuleThread<VectorTileRenderWorker>>

let workerPool: WorkerPool | undefined

export function getWorkerPool(): WorkerPool {
  if (workerPool == null) {
    workerPool = Pool(
      async () =>
        await spawn<VectorTileRenderWorker>(
          new Worker(new URL('./VectorTileRenderWorker.ts', import.meta.url))
        ),
      // TODO: Make configurable
      // Increasing this up to navigator.hardwareConcurrency technically speed
      // up the rendering, but that affects the performance of the main thread
      // and feels slower.
      1
    )
  }
  return workerPool
}

export async function destroyWorkerPool(): Promise<void> {
  if (workerPool == null) {
    return
  }
  await workerPool.completed()
  await workerPool.terminate()
  workerPool = undefined
}
