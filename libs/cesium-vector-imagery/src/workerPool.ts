import { Pool, spawn, type ModuleThread } from 'threads'

import { type VectorTileRenderWorker } from './VectorTileRenderWorker'

type WorkerPool = Pool<ModuleThread<VectorTileRenderWorker>> & {
  taskQueue: readonly unknown[]
}

let workerPool: WorkerPool | undefined

function get(): WorkerPool {
  if (workerPool == null) {
    workerPool = Pool(
      async () =>
        await spawn<VectorTileRenderWorker>(
          new Worker(new URL('./VectorTileRenderWorker.ts', import.meta.url))
        ),
      {
        // TODO: Make configurable
        // Increasing this up to navigator.hardwareConcurrency technically
        // speeds up rendering, but that affects the performance of the main
        // thread and feels slower.
        // Assume that the number of concurrency is virtual, like by hyper
        // threading, then considering the number of workers created by Cesium,
        // the number of hardware concurrency divided by 4 might fit here.
        size: Math.ceil(navigator.hardwareConcurrency / 4)
      }
    ) as unknown as WorkerPool
  }
  return workerPool
}

export function queue(
  ...args: Parameters<WorkerPool['queue']>
): ReturnType<WorkerPool['queue']> {
  return get().queue(...args)
}

export function canQueue(maxQueuedJobs: number): boolean {
  return workerPool == null || workerPool.taskQueue.length < maxQueuedJobs
}

export async function destroy(): Promise<void> {
  if (workerPool == null) {
    return
  }
  await workerPool.completed()
  await workerPool.terminate()
  workerPool = undefined
}
