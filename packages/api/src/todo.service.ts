import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { ITodo, ICreateTodoDto, IUpdateTodoDto, TODO_STATUS } from '@lexis/contracts';

@Injectable()
export class TodoService {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<ITodo[]> {
    const todos = await this.prisma.client.todo.findMany();
    return todos.map(todo => ({
      ...todo,
      status: todo.status as unknown as TODO_STATUS
    }));
  }

  async create(data: ICreateTodoDto): Promise<ITodo> {
    const todo = await this.prisma.client.todo.create({
      data: {
        title: data.title,
        description: data.description,
        status: 'PENDING'
      }
    });
    return {
      ...todo,
      status: todo.status as unknown as TODO_STATUS
    };
  }

  async update(id: string, data: IUpdateTodoDto): Promise<ITodo> {
    const todo = await this.prisma.client.todo.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        status: data.status as any
      }
    });
    return {
      ...todo,
      status: todo.status as unknown as TODO_STATUS
    };
  }

  async remove(id: string): Promise<void> {
    await this.prisma.client.todo.delete({ where: { id } });
  }
}
