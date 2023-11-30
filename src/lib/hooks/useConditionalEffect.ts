import {useEffect} from "react";

/**
 * @param callback effect callback
 * @param dependencies Effect Dependency
 * @param condition Only callback will be called when the condition is true
 */
export default function useConditionalEffect(callback: Function, dependencies: Array<any>, condition: boolean) {
  useEffect(() => {
    if (!condition) return;
    callback();
  }, dependencies)
}