export interface Mission {

    id: string;

    title: string;

    description: string;

    business: string;

    status:
        | "pending"
        | "running"
        | "completed"
        | "failed";

    tasks: MissionTask[];

}

export interface MissionTask {

    id: string;

    title: string;

    completed: boolean;

}