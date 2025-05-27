import { EntityManager } from "typeorm";

export interface IUseCase<Input, Output> {
  execute(input: Input, manager?: EntityManager): Promise<Output>;
}
