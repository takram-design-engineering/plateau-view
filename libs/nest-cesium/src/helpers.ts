export async function importESM<T = unknown>(path: string): Promise<T> {
  // eslint-disable-next-line no-eval
  return await (eval(`import('${path}')`) as Promise<T>)
}
