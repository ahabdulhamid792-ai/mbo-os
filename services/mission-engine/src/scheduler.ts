import { Mission } from "./types";

export class MissionScheduler {

    queue: Mission[] = [];

    add(mission: Mission){

        this.queue.push(mission);

    }

}
