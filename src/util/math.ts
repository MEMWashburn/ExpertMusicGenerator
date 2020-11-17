
export type fraction = [number, number];

export function gcd(a: number, b: number): number {
  return b ? gcd(b, a % b) : a;
}

export function reduce(frac: fraction): fraction {
  const gcdVal = gcd(frac[0], frac[1]);
  return [frac[0] / gcdVal, frac[1] / gcdVal];
}
