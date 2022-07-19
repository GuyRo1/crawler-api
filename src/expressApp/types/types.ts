import { Router } from "express";



export type RouterContainer = {
    name: string;
    router: Router;
    dependencies: string[];
}

export type DependencyType = 'constructor' | 'factory' | 'service'



export interface DependencyContainer {
    name: string;
    type: DependencyType;
    dependency: any
}


export interface Dependencies extends Array<DependencyContainer> {
    use?: (dep: string) => DependencyContainer | undefined
}

export type Error = {
    status: number,
    message: string
}
