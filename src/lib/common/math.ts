import {curry} from "ramda";

export const isInRange = curry((min: number, max: number, needle: number): boolean => {
  return (needle >= min && needle <= max);
})

