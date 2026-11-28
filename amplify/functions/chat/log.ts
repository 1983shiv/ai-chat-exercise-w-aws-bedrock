type Level = 'INFO' | 'WARN';

export function log(level: Level, msg: string, fields: Record<string, unknown> = {}): void {
  const line = JSON.stringify({ level, msg, ...fields });
  if (level === 'WARN') {
    console.warn(line);
  } else {
    console.log(line);
  }
}