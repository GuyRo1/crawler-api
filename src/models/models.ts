export interface ServerToClientEvents {
    url: (url: string) => void;
    ack: () => void
}

export interface ClientToServerEvents {
    data: (data: SocketData) => void;
}

export interface InterServerEvents {

}

export interface SocketData {
    url: string;
    depth: number;
    max: number;
}

export interface QueueMessage {
    id:string,
    url: string;
    depth: number;
    max: number;
}



