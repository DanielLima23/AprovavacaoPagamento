import 'reflect-metadata';

export const JsonIgnoreKey = Symbol('JsonIgnore');

export function JsonIgnore(target: any, key: string): void {
  const ignoredProperties = Reflect.getMetadata(JsonIgnoreKey, target) || [];
  ignoredProperties.push(key);
  Reflect.defineMetadata(JsonIgnoreKey, ignoredProperties, target);
}

export function removerPropriedadesIgnoradas(obj: any): any {
  const ignoredProperties = Reflect.getMetadata(JsonIgnoreKey, obj.constructor) || [];

  for (const prop of ignoredProperties) {
    if (obj.hasOwnProperty(prop)) {
      delete obj[prop];
    }
  }

  return obj;
}
