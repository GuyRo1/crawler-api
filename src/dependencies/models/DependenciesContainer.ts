import { DependencyContainer } from "../../expressApp/types/types"


export class DependenciesContainer {
    private dependencies: DependencyContainer[]

    constructor(dependencies: DependencyContainer[]) {
        this.dependencies = dependencies
    }

    getAll() {
        return this.dependencies
    }

    get(dependency: string) {
        return this.dependencies.find(item => item.name === dependency)?.dependency
    }
}