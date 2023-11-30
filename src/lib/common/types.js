import {equals, complement} from "ramda";

export const isUndefined = equals(undefined);
export const isNotUndefined = complement(isUndefined);

export const isNull = equals(null);
export const isNotNull = complement(isNull);

export const isArray = value => Array.isArray(value);
