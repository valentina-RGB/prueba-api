export class ListEventsByClientDto {
    events:{idEvenClient: number;
    idEvent: number;
    name: string;
    description: string;
    startDate: Date;
    endDate: Date;
    location: string;
    is_free: boolean;
    value: number;
    organizer: string;
    status: string;}[];

    constructor(events: any[]) {
        if (!events || events.length === 0) {
            this.events = [];
            return;
        }

        this.events = events.map(event => ({
            idEvenClient: event.id,
            idEvent: event.event.id,
            name: event.event.name,
            description: event.event.description,
            startDate: event.event.start_date,
            endDate: event.event.end_date,
            location: event.event.location,
            is_free: event.event.is_free,
            value: event.event.value,
            organizer: event.event.organizer,
            status: event.event.status
        }));
    }

    toResponse() {
        return this.events
    }
  
    
}