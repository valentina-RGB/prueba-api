import { IPage } from "./page.interface";
import { IStamps } from "./stamps.interface";

export interface IPageStamps {
  id: number;
  page: IPage;
  stamp: IStamps;
}