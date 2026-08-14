// Contenedor de DI minimalista, equivalente al patrón de Assemblies de Swinject
// pero sin dependencia externa (evita reflect-metadata/decorators en Hermes).
type Factory<T> = (container: Container) => T;

export class Container {
  private readonly factories = new Map<string, Factory<unknown>>();
  private readonly singletonTokens = new Set<string>();
  private readonly instances = new Map<string, unknown>();

  register<T>(token: string, factory: Factory<T>, options?: { singleton?: boolean }): void {
    this.factories.set(token, factory as Factory<unknown>);
    this.instances.delete(token);
    if (options?.singleton) {
      this.singletonTokens.add(token);
    } else {
      this.singletonTokens.delete(token);
    }
  }

  resolve<T>(token: string): T {
    if (this.instances.has(token)) {
      return this.instances.get(token) as T;
    }
    const factory = this.factories.get(token);
    if (!factory) {
      throw new Error(`No hay ninguna factory registrada para el token "${token}"`);
    }
    const instance = factory(this);
    if (this.singletonTokens.has(token)) {
      this.instances.set(token, instance);
    }
    return instance as T;
  }
}
