import { Injectable } from '@nestjs/common';
import { IStoreService } from '../domain/store.services.interfaces';
import { CreateStoreDto } from './dto/stores/create-store.dto';
import { CreateStoreUseCase } from './use-cases/stores/create-store.use-case';
import { GetStoreUseCase } from './use-cases/stores/get-store.use-case';
import { ListStoreUseCase } from './use-cases/stores/list-store.use.case';
import { ApproveOrRejectStoreUseCase } from './use-cases/stores/approve-or-reject-store.use-case';
import { ListStoreByStatusUseCase } from './use-cases/stores/list-store-by-status.use-case';

import { CreateBranchDto } from './dto/branches/create-branch.dto';
import { CreateBranchUseCase } from './use-cases/branches/create-branch.use-case';
import { GetBranchUseCase } from './use-cases/branches/get-branch.use-case';
import { ListBranchUseCase } from './use-cases/branches/list-branch.use-case';
import { ISocialNetwork } from '../domain/models/social-network.interface';

import { ListSocialNetworkUseCase } from './use-cases/social-network/list-social-network.use-case';
import { ISocialNetworkCreateDto } from '../domain/dto/social-network.interface.dto';
import { CreateSocialNetworkUseCase } from './use-cases/social-network/create-social-network.use-case';
import { CreateBranchApprovalUseCase } from './use-cases/branch-approval/create-branch-approval.use-case';
import { CreateBranchApprovalDto } from './dto/branch-approval/create-branch-approval.dto';
import { CreateCriteriaResponseDto } from './dto/criteria-response/create-criteria-response.dto';
import { ListCriteriaByStatusUseCase } from './use-cases/criteria/list-criteria-by-status.use-case';
import { GetCriteriaUseCase } from './use-cases/criteria/get-criteria-by-id.use-case';
import { CreateCriteriaResponsesUseCase } from './use-cases/criteria-response/create-criteria-responses.use-case';
import { IBranchApproval } from '../domain/models/branch-approval.interface';
import { UpdateBranchStatusUseCase } from './use-cases/branches/update-branch-status.use-case';
import { UpdateBranchApprovalStatusUseCase } from './use-cases/branch-approval/update-branch-approval.use-case';
import { ListBranchesByStatusUseCase } from './use-cases/branches/list-branches-by-status.use-case';
import { GetBranchApprovalDetailUseCase } from './use-cases/branch-approval/get-branch-approval-detail.use-case';
import { GetBranchByIdStoreUseCase } from './use-cases/branches/get-branch-by-id-store.use-case';
import { RegisterVisitUseCase } from './use-cases/branches/register-visit.use-case';
import { CreateReviewUseCase } from './use-cases/reviews/create-review.use-case';
import { IReview } from '../domain/models/review.interface';
import { CreateReviewDto } from './dto/reviews/create-review.dto';
import { GetReviewByBranchUseCase } from './use-cases/reviews/get-review-by-branch.use-case';
import { IImage } from '../domain/models/images.interface';
import { GetImageByBranchIdUseCase } from './use-cases/images/get-image-by-branch-id.use-case';
import { GetReviewByClientUseCase } from './use-cases/reviews/get-review-by-user.use-case';
import { OpenOrCloseBranchUseCase } from './use-cases/branches/open-or-close-branch.use-case';
import { IBranches } from '../domain/models/branches.interface';
import { UpdateBranchDto } from './dto/branches/update-branch.dto';
import { UpdateBranchUseCase } from './use-cases/branches/update-branch.use-case';
import { CreateBranchScheduleDto } from './dto/branch-schedule/create-branch-schedule.dto';
import { CreateBranchScheduleUseCase } from './use-cases/branch-schedule/create-branch-schedule.use-case';
import { CreateBranchAttributeDto } from './dto/branch-attribute/create-branch-attribute.dto';
import { IBranchAttribute } from '../domain/models/branch-attribute.interface';
import { CreateBranchAttributeUseCase } from './use-cases/branch-attributes/create-branch-attribute.use-case';
import { GetBranchAttributesByBranchUseCase } from './use-cases/branch-attributes/list-branch-attributes-by-branch.use-case';
import { getScheduleByBranchIdUseCase } from './use-cases/branch-schedule/get-schedule-by-branch-id.use-case';
import { IAttribute } from '../domain/models/attributes.interface';
import { ListAttributesUseCase } from './use-cases/attributes/list-attributes.use-case';
import { CreateImagesUseCase } from './use-cases/images/create-images.use-case';
import { ICreateMultipleImages } from '../domain/dto/images.interface.dto';
import { DeleteImageUseCase } from './use-cases/images/delete-image-use.case';
import { UpdateBranchAttributeDto } from './dto/branch-attribute/update-branch-attibute.dto';
import { UpdateBranchAttributeUseCase } from './use-cases/branch-attributes/update-branch-attribute.use-case';
import { CreateRecommendationUseCase } from './use-cases/recommendations/create-recommendation.use-case';
import { IRecommendationCreateDto } from '../domain/dto/recommendation.interface.dto';
import { IRecommendation } from '../domain/models/recommendations.interface';
import { CreateRecommendationDto } from './dto/recommendation/create-recomendation.dto';
import { ListRecommendationsUseCase } from './use-cases/recommendations/list-recommendations.use-case';
import { ListRecommendationsByUserIdUseCase } from './use-cases/recommendations/list-recommendations-by-user-id.use-case.ts';

@Injectable()
export class StoreService implements IStoreService {
  recommendationRepository: any;
  constructor(
    private readonly createStoreUseCase: CreateStoreUseCase,
    private readonly getStoreUseCase: GetStoreUseCase,
    private readonly listStoreUseCase: ListStoreUseCase,
    private readonly listStoreByStatusUseCase: ListStoreByStatusUseCase,
    private readonly approveOrRejectStoreUseCase: ApproveOrRejectStoreUseCase,

    private readonly createBranchUseCase: CreateBranchUseCase,
    private readonly getBranchUseCase: GetBranchUseCase,
    private readonly getBranchByIdStoreUseCase: GetBranchByIdStoreUseCase,

    private readonly listBranchesByStatusUseCase: ListBranchesByStatusUseCase,
    private readonly listBranchsUseCase: ListBranchUseCase,
    private readonly updateBranchStatusUseCase: UpdateBranchStatusUseCase,
    private readonly registerVisitUseCase: RegisterVisitUseCase,
    private readonly openOrCloseBranchUseCase: OpenOrCloseBranchUseCase,
    private readonly listSocialNetworkUseCase: ListSocialNetworkUseCase,
    private readonly createSocialNetworkUseCase: CreateSocialNetworkUseCase,

    private readonly getBranchApprovalDetailUseCase: GetBranchApprovalDetailUseCase,
    private readonly createBranchApprovalUseCase: CreateBranchApprovalUseCase,
    private readonly updateBranchApprovalStatusUseCase: UpdateBranchApprovalStatusUseCase,
    private readonly updateBranchUseCase: UpdateBranchUseCase,

    private readonly getCriteriaByIdUseCase: GetCriteriaUseCase,
    private readonly listCriteriaByStatusUseCase: ListCriteriaByStatusUseCase,

    private readonly createCriteriaResponsesUseCase: CreateCriteriaResponsesUseCase,

    private readonly createReviewUseCase: CreateReviewUseCase,
    private readonly getReviewByBranchUseCase: GetReviewByBranchUseCase,
    private readonly getReviewByClientUseCase: GetReviewByClientUseCase,

    private readonly createImagesUseCase: CreateImagesUseCase,
    private readonly getImageByBranchIdUseCase: GetImageByBranchIdUseCase,
    private readonly deleteImageUseCase: DeleteImageUseCase,

    private readonly listAttributesUseCase: ListAttributesUseCase,

    private readonly createScheduleUseCase: CreateBranchScheduleUseCase,

    private readonly createBranchAttributeUseCase: CreateBranchAttributeUseCase,
    private readonly listBranchAttributesUseCase: GetBranchAttributesByBranchUseCase,
    private readonly updateBranchAttributeUseCase: UpdateBranchAttributeUseCase,

    private readonly getScheduleByBranch: getScheduleByBranchIdUseCase,

    private readonly createRecommendation: CreateRecommendationUseCase,
    private readonly listRecommendationsUseCase: ListRecommendationsUseCase,
    private readonly listRecommendationsByUserIdUseCase: ListRecommendationsByUserIdUseCase,
  ) {}
  findAllRecommendations: any;
  getAllRecommendations(): unknown {
    throw new Error('Method not implemented.');
  }

  async createStore(data: CreateStoreDto) {
    return this.createStoreUseCase.execute(data);
  }

  async findStoreById(id: number) {
    return this.getStoreUseCase.execute(id);
  }

  async findAllStores() {
    return this.listStoreUseCase.execute();
  }

  async findStoreByStatus(status: string) {
    return this.listStoreByStatusUseCase.execute(status);
  }

  async updateStoreStatus(id: number, status: boolean, reason?: string) {
    return this.approveOrRejectStoreUseCase.execute({
      id,
      data: status,
      reason: reason ? reason : 'Store rejected for some reason',
    });
  }

  // ----------------------------------------------------------

  async createBranch(data: CreateBranchDto) {
    return this.createBranchUseCase.execute(data);
  }

  async findBranchById(id: number) {
    return this.getBranchUseCase.execute(id);
  }

  async findBranchByStoreId(id: number) {
    return this.getBranchByIdStoreUseCase.execute(id);
  }

  async findAllBranches(lat?: number, long?: number) {
    return this.listBranchsUseCase.execute({ lat, long });
  }

  async findBranchesByStatus(status: string) {
    return this.listBranchesByStatusUseCase.execute(status);
  }

  async updateBranch(
    id: number,
    data: UpdateBranchDto,
  ): Promise<IBranches | null> {
    return this.updateBranchUseCase.execute({ id, data });
  }

  async updateBranchStatus(id: number, data: boolean) {
    return this.updateBranchStatusUseCase.execute({
      id,
      data,
    });
  }

  async openOrCloseBranch(id: number, status: boolean) {
    return this.openOrCloseBranchUseCase.execute({ id, status });
  }

  // -----------------------------------------------------------

  async findAllSocialNetworks(): Promise<ISocialNetwork[]> {
    return this.listSocialNetworkUseCase.execute();
  }

  async createSocialNetwork(
    data: ISocialNetworkCreateDto,
  ): Promise<ISocialNetwork> {
    return this.createSocialNetworkUseCase.execute(data);
  }
  // ----------------------------------------------------------
  async getBranchApprovalByBranchId(id: number) {
    return this.getBranchApprovalDetailUseCase.execute(id);
  }

  async createBranchApproval(data: CreateBranchApprovalDto) {
    return this.createBranchApprovalUseCase.execute(data);
  }

  async updateBranchApprovalStatus(
    id: number,
    data: boolean,
    approvedById: number,
    comments?: string,
  ) {
    return this.updateBranchApprovalStatusUseCase.execute({
      approvalId: id,
      data,
      comments,
      approvedById,
    });
  }
  registerVisit(
    branchId: number,
    latitude: number,
    longitude: number,
    user: any,
  ) {
    return this.registerVisitUseCase.execute({
      branchId,
      latitude,
      longitude,
      user,
    });
  }

  // ----------------------------------------------------------

  async findCriteriaById(id: number) {
    return this.getCriteriaByIdUseCase.execute(id);
  }

  async findAllCriteriaByStatus(status: boolean) {
    return this.listCriteriaByStatusUseCase.execute(status);
  }

  // ----------------------------------------------------------

  async createCriteriaResponse(
    criteriaResponseData: CreateCriteriaResponseDto[],
    approval: IBranchApproval,
  ): Promise<void> {
    await this.createCriteriaResponsesUseCase.execute({
      criteriaResponseData,
      approval,
    });
  }
  // ----------------------------------------------------------
  createReview(review: CreateReviewDto): Promise<IReview> {
    return this.createReviewUseCase.execute(review);
  }

  findAllReviewsByBranchId(branchId: number): Promise<IReview[] | null> {
    return this.getReviewByBranchUseCase.execute(branchId);
  }

  findAllReviewsByClientId(userId: number): Promise<IReview[] | null> {
    return this.getReviewByClientUseCase.execute(userId);
  }

  // ----------------------------------------------------------
  findAllAttributes(): Promise<IAttribute[]> {
    return this.listAttributesUseCase.execute();
  }

  // ----------------------------------------------------------
  createImages(data: ICreateMultipleImages): Promise<IImage[] | null> {
    return this.createImagesUseCase.execute(data);
  }

  GetImageByBranchId(branchId: number): Promise<IImage[]> {
    return this.getImageByBranchIdUseCase.execute(branchId);
  }

  deleteImage(id: number) {
    return this.deleteImageUseCase.execute(id);
  }

  // ----------------------------------------------------------
  createBranchSchedule(data: CreateBranchScheduleDto) {
    return this.createScheduleUseCase.execute(data);
  }
  // ----------------------------------------------------------
  findAllBranchAttributes(branchId: number): Promise<IBranchAttribute[]> {
    return this.listBranchAttributesUseCase.execute(branchId);
  }

  createBranchAttribute(
    dto: CreateBranchAttributeDto,
  ): Promise<IBranchAttribute[]> {
    return this.createBranchAttributeUseCase.execute(dto);
  }

  updateBranchAttribute(
    branchId: number,
    attributeId: number,
    data: UpdateBranchAttributeDto,
  ): Promise<IBranchAttribute> {
    return this.updateBranchAttributeUseCase.execute({
      branchId: branchId,
      attributeId: attributeId,
      data,
    });
  }
  // ----------------------------------------------------------
  getScheduleByBranchId(branchId: number) {
    return this.getScheduleByBranch.execute(branchId);
  }

  // -------------------------------------------------------------
  createRecomedation(
    user: any,
    data: CreateRecommendationDto,
  ): Promise<IRecommendation> {
    return this.createRecommendation.execute({ user, data });
  }

  async listRecommendations(): Promise<IRecommendation[]> {
    return this.listRecommendationsUseCase.execute();
  } 

  async listRecommendationsByUserId(
    userId: number,
  ): Promise<IRecommendation[]> {
    return this.listRecommendationsByUserIdUseCase.execute(userId);
  }
}
