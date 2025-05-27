export class ResponseEventDto {
    events: {
        id: number;
        name: string;
        description: string;
        start_date: Date;
        end_date: Date;
        location: string;
        is_free: boolean;
        value: number;
        organizer: string;
        status: string;
    }[];

    constructor(events: any[]) {
        if (!events || events.length === 0) {
            this.events = [];
            return;
        }

        this.events = events.map(event => ({
            id: event.id,
            name: event.name,
            description: event.description,
            start_date: event.start_date,
            end_date: event.end_date,
            location: event.location,
            is_free: event.is_free,
            value: event.value,
            organizer: event.organizer,
            status: event.status
        }));
    }

    toResponse() {
        return this.events
        
    }
}