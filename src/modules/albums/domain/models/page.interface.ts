import { IAlbum } from "./album.interface";

export interface IPage {
    id: number;
    album: IAlbum;
    // type: string; // 'BRANCHES' | 'EVENTS' | 'OTHERS';
    title: string;
    // number_page: number;
    description: string;
    status: boolean;
}