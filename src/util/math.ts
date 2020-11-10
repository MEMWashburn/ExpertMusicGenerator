
export type fraction = [number, number];

export function gcd(a: number, b: number): number {
  return b ? gcd(b, a % b) : a;
}

export function reduce(numerator: number, denominator: number) {
  const gcdVal = gcd(numerator, denominator);
  return [numerator / gcdVal, denominator / gcdVal];
}
