export class LocalStorage implements Storage {
  [name: string]: any;
  length!: number;
  clear(): void { }
  getItem(key: string): string | null {
    return null;
  }
  key(index: number): string | null {
    return null;
  }
  removeItem(key: string): void { }
  setItem(key: string, value: string): void { }
}