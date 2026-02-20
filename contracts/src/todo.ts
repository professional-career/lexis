export enum TODO_STATUS {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED'
}

export interface ITodo {
  id: string;
  title: string;
  description?: string;
  status: TODO_STATUS;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateTodoDto {
  title: string;
  description?: string;
}

export interface IUpdateTodoDto {
  title?: string;
  description?: string;
  status?: TODO_STATUS;
}
