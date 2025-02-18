import { injectable as TsyringeInjectable, inject as TsyringeInject } from 'tsyringe';

export function Injectable() {
  return TsyringeInjectable();
}

export function Inject(dependency: any) {
  return TsyringeInject(dependency);
}