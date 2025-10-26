export const pct = (n: number) => `${n.toFixed(1)}%`;
export const pc1 = (n: number) => `${(n * 100).toFixed(1)}%`;
export function clsx(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(" ");
}
