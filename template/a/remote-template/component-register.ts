import type React from 'react';

interface CustomComponentMap {
  SchemaButton: (props: React.PropsWithChildren<React.HTMLAttributes<HTMLButtonElement>>) => any;
}

type CustomCompName = keyof CustomComponentMap;

const componentMap = new Map<CustomCompName, CustomComponentMap[CustomCompName]>();

export function register<N extends CustomCompName>(name: N, component: CustomComponentMap[N]) {
  componentMap.set(name, component);
}

export function getComp<N extends CustomCompName>(name: N): CustomComponentMap[N] | undefined {
  return componentMap.get(name);
}
