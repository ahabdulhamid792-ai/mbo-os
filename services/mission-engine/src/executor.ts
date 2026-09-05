import { Mission } from "./types";

export class MissionExecutor {

    execute(mission: Mission){

        mission.status = "running";

        return mission;

    }

}