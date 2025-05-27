export class ResponseCreteEventClientDto {
    id: number;
    eventName: string;
    clientName: string;

    constructor(eventClient: any) {
        if (!eventClient) {
            this.id = 0;
            this.eventName = '';
            this.clientName = '';
            return;
        }

        this.id = eventClient.id;
        this.eventName = eventClient.event?.name;
        this.clientName = eventClient.client?.person?.full_name;
    }

}