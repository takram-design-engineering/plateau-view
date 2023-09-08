import { spawn, type ModuleThread } from 'threads'

import { type Worker } from './Worker'

let worker: Promise<ModuleThread<Worker>>

export async function getWorker(): typeof worker {
  if (worker == null) {
    worker = spawn<Worker>(new Worker(new URL('./Worker.ts', import.meta.url)))
  }
  return await worker
}
