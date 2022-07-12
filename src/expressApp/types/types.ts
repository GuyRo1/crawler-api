import { Router } from "express";



export type RouterContainer = {
    name: string;
    router: Router;
    dependencies: string[];
}

export interface DependencyContainer {
    name: string;
    type: 'constructor' | 'factory' | 'service';
    dependency: any
}


export interface Dependencies extends Array<DependencyContainer> {
    use?: (dep: string) => DependencyContainer | undefined
}

export type Error = {
    status: number,
    message: string
}

// export interface Request extends _Request {
//     currentFullUrl: string;
// }

// export interface Response extends _Response {

// } 