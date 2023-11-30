import React from "react";

interface Props<T> {
  list: Array<T>,
  keyProp?: string,
  children: (item: T) => JSX.Element | JSX.Element[]
}

export default function For<T>(props: React.PropsWithChildren<Props<T>>) {
  return props.list.map((item: T) => props.children(item))
}

For.defaultProps = {
  keyProp: "id"
}