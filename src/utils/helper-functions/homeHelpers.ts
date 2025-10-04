export const creditNames: string[] = [
  "עידו מוטווסל",
  "אור שביט מליבובסקי",
  "יונתן טויטו",
  "תומר כהן",
  "ליאל ממן",
  "אופק וקנין"
];

export function shuffleCreditNames(arr: string[]): string[] {
  const copy: string[] = [...arr];
  for (let i: number = copy.length - 1; i > 0; i--) {
    const j: number = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}