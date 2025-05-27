export class ResponseRecommendationDto {
    id: number;
    clientName: string;
    branchName: string;
    message: string;

    constructor(recommendation: any) {
        if (!recommendation) return;

        this.id = recommendation.id;
        this.clientName = recommendation.client?.person?.full_name || 'Unknown Client';
        this.branchName = recommendation.branch?.name || 'Unknown Branch';
        this.message = recommendation.message;
    }

    static toResponse(recommendation: any) {
        return new ResponseRecommendationDto(recommendation);
    }
}