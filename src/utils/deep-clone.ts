/** JSON-safe deep clone for lesson banks and admin edits. */
export function deepClone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}
