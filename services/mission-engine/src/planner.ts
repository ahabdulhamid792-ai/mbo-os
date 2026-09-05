import { Mission } from "./types";

export class MissionPlanner {

    createMission(
        title: string,
        description: string,
        business: string
    ): Mission {

        return {

            id: crypto.randomUUID(),

            title,

            description,

            business,

            status: "pending",

            tasks: []

        };

    }

}