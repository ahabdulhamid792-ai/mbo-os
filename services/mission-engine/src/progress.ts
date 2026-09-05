import { Mission } from "./types";

export function completionRate(
    mission: Mission
){

    if(mission.tasks.length === 0){

        return 0;

    }

    const done = mission.tasks.filter(
        task => task.completed
    ).length;

    return done / mission.tasks.length;

}