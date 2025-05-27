import { forwardRef, Get, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StoreEntity } from './infrastructure/entities/store.entity';
import { RouterModule } from '@nestjs/core';
import { StoreController } from './infrastructure/controllers/store.controller';
import { StoreService } from './application/store.service';
import { CreateStoreUseCase } from './application/use-cases/stores/create-store.use-case';
import { GetStoreUseCase } from './application/use-cases/stores/get-store.use-case';
import { IStoreRepositoryToken } from './domain/repositories/store.repository.interface';
import { IStoreServiceToken } from './domain/store.services.interfaces';
import { StoreRepository } from './infrastructure/repositories/store.repository';
import { ListStoreUseCase } from './application/use-cases/stores/list-store.use.case';
import { IBranchRepositoryToken } from './domain/repositories/branches.repository.interface';
import { CreateBranchUseCase } from './application/use-cases/branches/create-branch.use-case';
import { GetBranchUseCase } from './application/use-cases/branches/get-branch.use-case';
import { ListBranchUseCase } from './application/use-cases/branches/list-branch.use-case';
import { BranchController } from './infrastructure/controllers/branch.controller';
import { BranchesEntity } from './infrastructure/entities/branches.entity';
import { ApproveOrRejectStoreUseCase } from './application/use-cases/stores/approve-or-reject-store.use-case';
import { MailerModule } from '../mailer/mailer.module';
import { BranchRepository } from './infrastructure/repositories/branch.respository';
import { ListStoreByStatusUseCase } from './application/use-cases/stores/list-store-by-status.use-case';
import { UsersModule } from '../users/users.module';
import { ISocialNetworkRepositoryToken } from './domain/repositories/social-network.repository.interface';
import { SocialNetworkRepository } from './infrastructure/repositories/social-network.repository';
import { ISocialBranchRepositoryToken } from './domain/repositories/social-branch.repository.interface';
import { SocialBranchRepository } from './infrastructure/repositories/social-branch.repository';
import { CreateSocialNetworkUseCase } from './application/use-cases/social-network/create-social-network.use-case';
import { ListSocialNetworkUseCase } from './application/use-cases/social-network/list-social-network.use-case';
import { CreateSocialBranchUseCase } from './application/use-cases/social-branches/create-social-branch.use-case';
import { GetSocialBranchUseCase } from './application/use-cases/social-branches/get-social-branch.use-case';
import { ListSocialBranchUseCase } from './application/use-cases/social-branches/list-social-branch.use-case';
import { GetSocialNetworkUseCase } from './application/use-cases/social-network/get-social-network-use-case';
import { SocialNetworkEntity } from './infrastructure/entities/social-network.entity';
import { SocialBranchEntity } from './infrastructure/entities/social-branch.entity';
import { SocialNetworkController } from './infrastructure/controllers/social-network.controller';
import { CreateBranchApprovalUseCase } from './application/use-cases/branch-approval/create-branch-approval.use-case';
import { IBranchApprovalRepositoryToken } from './domain/repositories/branch-approval.repository.interface';
import { BranchApprovalRepository } from './infrastructure/repositories/branch-approval.repository';
import { BranchApprovalEntity } from './infrastructure/entities/branch-approval.entity';
import { CriteriaEntity } from './infrastructure/entities/criteria.entity';
import { CriteriaResponseEntity } from './infrastructure/entities/criteria-response.entity';
import { CreateCriteriaResponsesUseCase } from './application/use-cases/criteria-response/create-criteria-responses.use-case';
import { ICriteriaRepositoryToken } from './domain/repositories/criteria.repository.interface';
import { CriteriaRepository } from './infrastructure/repositories/criteria.repository';
import { ICriteriaResponseRepositoryToken } from './domain/repositories/criteria-response.repository.interface';
import { CriteriaResponseRepository } from './infrastructure/repositories/criteria-response.repository';
import { GetCriteriaUseCase } from './application/use-cases/criteria/get-criteria-by-id.use-case';
import { ListCriteriaByStatusUseCase } from './application/use-cases/criteria/list-criteria-by-status.use-case';
import { UpdateBranchStatusUseCase } from './application/use-cases/branches/update-branch-status.use-case';
import { UpdateBranchApprovalStatusUseCase } from './application/use-cases/branch-approval/update-branch-approval.use-case';
import { BranchApprovalController } from './infrastructure/controllers/branch-approval.controller';
import { ListBranchesByStatusUseCase } from './application/use-cases/branches/list-branches-by-status.use-case';
import { CriteriaController } from './infrastructure/controllers/criteria.controller';
import { GetBranchApprovalDetailUseCase } from './application/use-cases/branch-approval/get-branch-approval-detail.use-case';
import { GetBranchByIdStoreUseCase } from './application/use-cases/branches/get-branch-by-id-store.use-case';
import { RegisterVisitUseCase } from './application/use-cases/branches/register-visit.use-case';
import { AlbumModule } from '../albums/album.module';
import { CreateReviewUseCase } from './application/use-cases/reviews/create-review.use-case';
import { IReviewRepositoryToken } from './domain/repositories/review.repository.interface';
import { ReviewRepository } from './infrastructure/repositories/review.repository';
import { ReviewController } from './infrastructure/controllers/review.controller';
import { ReviewEntity } from './infrastructure/entities/review.entity';
import { ImageEntity } from './infrastructure/entities/images.entity';
import { GetReviewByBranchUseCase } from './application/use-cases/reviews/get-review-by-branch.use-case';
import { RegisterVisitEntity } from './infrastructure/entities/register-visit.entity';
import { GetReviewByClientUseCase } from './application/use-cases/reviews/get-review-by-user.use-case';
import { ImageController } from './infrastructure/controllers/image.controller';
import { IImageRepositoryToken } from './domain/repositories/image.repository.interface';
import { ImageRepository } from './infrastructure/repositories/image.repository';
import { GetImageByBranchIdUseCase } from './application/use-cases/images/get-image-by-branch-id.use-case';
import { OpenOrCloseBranchUseCase } from './application/use-cases/branches/open-or-close-branch.use-case';
import { UpdateBranchUseCase } from './application/use-cases/branches/update-branch.use-case';
import { BranchScheduleEntity } from './infrastructure/entities/branch-schedule.entity';
import { BranchScheduleController } from './infrastructure/controllers/branch-schedule.controller';
import { IBranchScheduleRepositoryToken } from './domain/repositories/branch-schedule.repository.interface';
import { BranchScheduleRepository } from './infrastructure/repositories/branch-schedule.repository';
import { CreateBranchScheduleUseCase } from './application/use-cases/branch-schedule/create-branch-schedule.use-case';
import { BranchAttributeEntity } from './infrastructure/entities/branches-attributes.entity';
import { BranchAttributesController } from './infrastructure/controllers/branch-attributes.controller';
import { CreateBranchAttributeUseCase } from './application/use-cases/branch-attributes/create-branch-attribute.use-case';
import { IBranchAttributeRepositoryToken } from './domain/repositories/branch-attributes.repository.interface';
import { BranchAttributeRepository } from './infrastructure/repositories/branches-attributes.repository';
import { GetBranchAttributesByBranchUseCase } from './application/use-cases/branch-attributes/list-branch-attributes-by-branch.use-case';
import { getScheduleByBranchIdUseCase } from './application/use-cases/branch-schedule/get-schedule-by-branch-id.use-case';
import { IAttributeRepositoryToken } from './domain/repositories/attributes.repository.interface';
import { AttributeRepository } from './infrastructure/repositories/attribute.repository';
import { AttributeEntity } from './infrastructure/entities/attributes.entity';
import { ListAttributesUseCase } from './application/use-cases/attributes/list-attributes.use-case';
import { AttributeController } from './infrastructure/controllers/attribute.controller';
import { GetAttributeByIdUseCase } from './application/use-cases/attributes/get-attribute-by-id.use-case';
import { CalculateAverageRatingUseCase } from './application/use-cases/branches/calculate-average-rating.use-case';
import { CreateImagesUseCase } from './application/use-cases/images/create-images.use-case';
import { DeleteImageUseCase } from './application/use-cases/images/delete-image-use.case';
import { UpdateBranchAttributeUseCase } from './application/use-cases/branch-attributes/update-branch-attribute.use-case';
import { RecommendationEntity } from './infrastructure/entities/recommendations.entity';
import { RecommendationController } from './infrastructure/controllers/recommendation.controller';
import { IRecommendationRepositoryToken } from './domain/repositories/recommendation.repository.interface';
import { RecommendationRepository } from './infrastructure/repositories/recommendation.repository';
import { CreateRecommendationUseCase } from './application/use-cases/recommendations/create-recommendation.use-case';
import { ListRecommendationsUseCase } from './application/use-cases/recommendations/list-recommendations.use-case';
import { ListRecommendationsByUserIdUseCase } from './application/use-cases/recommendations/list-recommendations-by-user-id.use-case.ts';

@Module({
  imports: [
    MailerModule,
    forwardRef(() => UsersModule),
    forwardRef(() => AlbumModule),
    TypeOrmModule.forFeature([
      StoreEntity,
      BranchesEntity,
      BranchApprovalEntity,
      CriteriaEntity,
      CriteriaResponseEntity,
      SocialNetworkEntity,
      SocialBranchEntity,
      ImageEntity,
      ReviewEntity,
      AttributeEntity,
      BranchAttributeEntity,
      RegisterVisitEntity,
      BranchScheduleEntity,
      BranchAttributeEntity,
      RecommendationEntity,
    ]),
    RouterModule.register([
      {
        path: 'api/v2',
        module: StoreModule,
      },
    ]),
  ],
  controllers: [
    StoreController,
    BranchController,
    BranchApprovalController,
    SocialNetworkController,
    CriteriaController,
    ReviewController,
    AttributeController,
    ImageController,
    BranchScheduleController,
    BranchAttributesController,
    RecommendationController,
  ],
  providers: [
    { provide: IStoreServiceToken, useClass: StoreService },
    { provide: IStoreRepositoryToken, useClass: StoreRepository },
    { provide: IBranchRepositoryToken, useClass: BranchRepository },
    {
      provide: ISocialNetworkRepositoryToken,
      useClass: SocialNetworkRepository,
    },
    { provide: ISocialBranchRepositoryToken, useClass: SocialBranchRepository },
    {
      provide: IBranchApprovalRepositoryToken,
      useClass: BranchApprovalRepository,
    },
    { provide: ICriteriaRepositoryToken, useClass: CriteriaRepository },
    {
      provide: ICriteriaResponseRepositoryToken,
      useClass: CriteriaResponseRepository,
    },
    { provide: IReviewRepositoryToken, useClass: ReviewRepository },

    { provide: IAttributeRepositoryToken, useClass: AttributeRepository },

    { provide: IImageRepositoryToken, useClass: ImageRepository },

    {
      provide: IBranchScheduleRepositoryToken,
      useClass: BranchScheduleRepository,
    },

    {
      provide: IBranchAttributeRepositoryToken,
      useClass: BranchAttributeRepository,
    },

    {
      provide: IRecommendationRepositoryToken,
      useClass: RecommendationRepository,
    },

    CreateStoreUseCase,
    GetStoreUseCase,
    ListStoreUseCase,
    ListStoreByStatusUseCase,
    ApproveOrRejectStoreUseCase,

    CreateBranchUseCase,
    ListBranchUseCase,
    ListBranchesByStatusUseCase,
    GetBranchUseCase,
    GetBranchByIdStoreUseCase,
    UpdateBranchStatusUseCase,
    OpenOrCloseBranchUseCase,
    UpdateBranchUseCase,
    CalculateAverageRatingUseCase,

    CreateSocialNetworkUseCase,
    ListSocialNetworkUseCase,
    GetSocialNetworkUseCase,

    CreateSocialBranchUseCase,
    ListSocialBranchUseCase,
    GetSocialBranchUseCase,

    GetBranchApprovalDetailUseCase,
    CreateBranchApprovalUseCase,
    UpdateBranchApprovalStatusUseCase,
    RegisterVisitUseCase,

    GetCriteriaUseCase,
    ListCriteriaByStatusUseCase,

    CreateCriteriaResponsesUseCase,

    CreateReviewUseCase,
    GetReviewByBranchUseCase,
    GetReviewByClientUseCase,

    ListAttributesUseCase,
    GetAttributeByIdUseCase,

    CreateImagesUseCase,
    GetImageByBranchIdUseCase,
    DeleteImageUseCase, 

    CreateBranchScheduleUseCase,
    getScheduleByBranchIdUseCase,

    GetBranchAttributesByBranchUseCase,
    CreateBranchAttributeUseCase,
    UpdateBranchAttributeUseCase,

    CreateRecommendationUseCase,
    ListRecommendationsUseCase,
    ListRecommendationsByUserIdUseCase
  ],
  exports: [
    IStoreServiceToken,
    IStoreRepositoryToken,
    IBranchRepositoryToken,
    ISocialNetworkRepositoryToken,
    ISocialBranchRepositoryToken,
    CreateStoreUseCase,
    GetStoreUseCase,
    GetBranchUseCase,
    CreateBranchAttributeUseCase,
  ],
})
export class StoreModule {}
