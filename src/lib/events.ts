export type GameEventDTO = {
    type: string;
    data: any;
};

export interface GameEvent extends Event {
    type: string;
    data: any;
}
