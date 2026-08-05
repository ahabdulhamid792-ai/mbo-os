import { ServiceRegistry } from "./ServiceRegistry";

export class MBOCore {
  registry = new ServiceRegistry();

  async start() {
    console.log("Starting MBO Core...");
  }
}