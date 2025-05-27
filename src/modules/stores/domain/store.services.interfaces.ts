import { IStoreCreateDto } from './dto/store.interface.dto';
import { IStore } from './models/store.interface';
import { IBranches } from './models/branches.interface';
import { ISocialNetworkCreateDto } from './dto/social-network.interface.dto';
import { ISocialNetwork } from './models/social-network.interface';
import {
  IBranchesCreateDto,
  IBranchesUpdateDto,
} from './dto/branch.interface.dto';
import { ICreateBranchApprovalDto } from './dto/branch-approval.interface.dto';
import { IBranchApproval } from './models/branch-approval.interface';
import { ICreateCriteriaResponseDto } from './dto/criteria.interface.dto';
import { ICriteria } from './models/criteria.interface';
import { IStampClients } from 'src/modules/albums/domain/models/stamp-clients.interface';
import { ICreateReviewDto } from './dto/review.interface.dto';
import { IReview } from './models/review.interface';
import { IImage } from './models/images.interface';
import { IBranchScheduleCreateDto } from './dto/branch-schedule.interface.dto';
import { IBranchSchedule } from './models/branch-schedule.interface';
import { IAttribute } from './models/attributes.interface';
import { CreateBranchAttributeDto } from '../application/dto/branch-attribute/create-branch-attribute.dto';
import { IBranchAttribute } from './models/branch-attribute.interface';
import { ICreateMultipleImages } from './dto/images.interface.dto';
import { IUpdateBranchAttribute } from './dto/branches-attributes.interface.dto';
import { UpdateBranchAttributeDto } from '../application/dto/branch-attribute/update-branch-attibute.dto';
import { IRecommendation } from './models/recommendations.interface';
import { IRecommendationCreateDto } from './dto/recommendation.interface.dto';

export interface IStoreService {
  getAllRecommendations(): unknown;
  createStore(data: IStoreCreateDto): Promise<IStore>;
  findStoreById(id: number): Promise<IStore | null>;
  findAllStores(): Promise<IStore[]>;
  findStoreByStatus(status: string): Promise<IStore[]>;
  updateStoreStatus(
    id: number,
    status: boolean,
    reason?: string,
  ): Promise<IStore | null>;

  createBranch(data: IBranchesCreateDto): Promise<IBranches>;
  findBranchById(id: number): Promise<IBranches | null>;
  findBranchesByStatus(status: string): Promise<IBranches[]>;
  findBranchByStoreId(id: number): Promise<IBranches[] | null>;
  findAllBranches(lat?: number, long?: number): Promise<IBranches[]>;
  updateBranch(id: number, data: IBranchesUpdateDto): Promise<IBranches | null>;
  updateBranchStatus(id: number, data: boolean): Promise<IBranches | null>;
  openOrCloseBranch(id: number, status: boolean): Promise<IBranches>;

  createSocialNetwork(data: ISocialNetworkCreateDto): Promise<ISocialNetwork>;
  findAllSocialNetworks(): Promise<ISocialNetwork[]>;

  getBranchApprovalByBranchId(id: number): Promise<IBranchApproval | null>;
  createBranchApproval(
    data: ICreateBranchApprovalDto,
  ): Promise<IBranchApproval>;
  updateBranchApprovalStatus(
    id: number,
    data: boolean,
    approvedById: number,
    comments?: string,
  ): Promise<IBranchApproval | null>;
  registerVisit(
    branchId: number,
    latitude: number,
    longitude: number,
    user: any,
  ): Promise<IStampClients>;

  findCriteriaById(id: number): Promise<ICriteria | null>;
  findAllCriteriaByStatus(status: boolean): Promise<ICriteria[]>;

  createCriteriaResponse(
    responses: ICreateCriteriaResponseDto[],
    approval: IBranchApproval,
  ): Promise<void>;

  createReview(review: ICreateReviewDto): Promise<IReview>;
  findAllReviewsByBranchId(branchId: number): Promise<IReview[] | null>;
  findAllReviewsByClientId(clientId: number): Promise<IReview[] | null>;

  createImages(data: ICreateMultipleImages): Promise<IImage[] | null>;
  GetImageByBranchId(branchId: number): Promise<IImage[]>;
  deleteImage(id: number);

  createBranchSchedule(
    data: IBranchScheduleCreateDto,
  ): Promise<IBranchSchedule>;
  getScheduleByBranchId(branchId: number): Promise<IBranchSchedule[]>;

  findAllAttributes(): Promise<IAttribute[]>;

  findAllBranchAttributes(branchId: number): Promise<IBranchAttribute[]>;
  createBranchAttribute(
    dto: CreateBranchAttributeDto,
  ): Promise<IBranchAttribute[]>;
  
  updateBranchAttribute(branch_id: number, 
    attribute_id: number, 
    data: UpdateBranchAttributeDto): Promise<IBranchAttribute>;

    createRecomedation(user: any, data:IRecommendationCreateDto): Promise<IRecommendation>;
    listRecommendations(): Promise<IRecommendation[]>;
    listRecommendationsByUserId(userId: number): Promise<IRecommendation[]>;
}

export const IStoreServiceToken = Symbol('IStoreSevice');
