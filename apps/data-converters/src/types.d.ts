declare module 'mapshaper' {
  export function runCommands(commands: string, input?: any): Promise<any>
  export function applyCommands(commands: string, input?: any): Promise<any>
}
