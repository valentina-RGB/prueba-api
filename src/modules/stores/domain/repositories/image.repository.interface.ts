import { ICreateImage } from "../dto/images.interface.dto";
import { IImage } from "../models/images.interface";

export interface IImageRepository {
    createImages(data: ICreateImage[]): Promise<IImage[]>;
    deleteImageById(id: number)
    GetImageByBranchId(branchId: number): Promise<IImage[]>;
    getImageById(id: number): Promise<IImage | null>;
}

export const IImageRepositoryToken = Symbol('IImageRepository');