import { isNumeric } from './utility-functions';

const EPSILON = 0.00001;

export const isNegativeNumber = (value?: number | string) =>
  Math.sign(Number(value)) === 0 || value === undefined || value === null
    ? null
    : Math.sign(+value) === -1;
export interface IFractionalUnit {
  asDecimal: number;
  wholeUnits: number;
  remainder?: number;
  denominator?: number;
  hasFraction?: () => boolean;
  isNegative?: boolean | null;
}

export class FractionalUnit implements IFractionalUnit {
  constructor(
    public asDecimal: number,
    public wholeUnits: number,
    public denominator: number,
    public remainder: number,
    public isNegative: boolean | null
  ) {}

  public hasFraction(): boolean {
    return this.remainder !== 0;
  }
}

export function calculateFraction(value: number | string): IFractionalUnit {
  // https://www.calculatorsoup.com/calculators/math/decimal-to-fraction-calculator.php
  const asDecimal = Math.abs(Number(value));
  const isNegative = isNegativeNumber(value);

  let asDecimalString;
  if (Number.isInteger(asDecimal)) {
    asDecimalString = asDecimal.toFixed(1);
  } else {
    asDecimalString = asDecimal.toString();
  }

  let denominator = Math.pow(10, asDecimalString.length - 2);
  let numerator = asDecimal * denominator;

  const divisor = gcd(numerator, denominator);

  numerator /= divisor;
  denominator /= divisor;

  // https://www.calculatorsoup.com/calculators/math/fractionssimplify.php?n_1=13&d_1=8&action=solve

  const remainder = numerator % denominator;
  const wholeUnits = Math.floor(numerator / denominator);

  return new FractionalUnit(
    asDecimal,
    wholeUnits,
    denominator,
    remainder,
    isNegative
  );

  // https://www.calculatorsoup.com/calculators/math/gcf.php?input=1625%2C1000&action=solve
  function gcd(n: number, d: number): number {
    // We're looking for the largest positive integer that divides
    // evenly into both numbers with zero remainder, but 0.00001 should be close enough.
    return d < EPSILON
      ? n
      : // Keep dividing until remainder is zero'ish.
        gcd(d, Math.floor(n % d));
  }
}

export const isDivisibleByAnyFractionOf = (
  value: number | string,
  ...args: number[]
) =>
  args.some((d) => {
    const fraction = 1 / d;
    const remainder = Math.abs(+value) % fraction;
    // We may encounter a floating point discrepancy in either direction
    return remainder < EPSILON || Math.abs(remainder - fraction) < EPSILON;
  });

export function fractionAsDecimal(value: string): number | null {
  if (isNumeric(value)) {
    return Number(value);
  }

  const regex = /(\d*)\s((\d+)\/(\d+))$|(\d*)$|((\d+)\/(\d+))$/;
  const matches = value.match(regex);
  if (matches) {
    const wholeUnits =
      (matches[1] && Number(matches[1])) ||
      (matches[5] && Number(matches[5])) ||
      0;
    const remainder =
      (matches[3] && Number(matches[3])) ||
      (matches[7] && Number(matches[7])) ||
      0;
    const denominator =
      (matches[4] && Number(matches[4])) ||
      (matches[8] && Number(matches[8])) ||
      0;

    return wholeUnits + remainder / denominator;
  }
  return null;
}
