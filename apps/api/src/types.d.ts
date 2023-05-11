export {}

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PROJECT_ROOT: string
    }
  }
}
