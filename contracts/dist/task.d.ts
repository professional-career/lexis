export declare enum TASK_STATUS {
    PENDING = "PENDING",
    IN_PROGRESS = "IN_PROGRESS",
    COMPLETED = "COMPLETED",
    CANCELLED = "CANCELLED"
}
export interface ITask {
    id: string;
    title: string;
    description?: string;
    status: TASK_STATUS;
    createdAt: Date;
    updatedAt: Date;
}
export interface ICreateTaskDto {
    title: string;
    description?: string;
}
export interface IUpdateTaskDto {
    title?: string;
    description?: string;
    status?: TASK_STATUS;
}
