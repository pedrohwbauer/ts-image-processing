export interface Transform {
  execute(...args: any[]): Promise<void>;
}