export class ServiceRegistry {
  private services = new Map<string, unknown>();

  register(name: string, service: unknown) {
    this.services.set(name, service);
  }

  get<T>(name: string): T {
    return this.services.get(name) as T;
  }
}