import { DependencyContainer } from "../../expressApp/types/types"


export class DependenciesContainer {
    private dependencies: DependencyContainer[]

    constructor(dependencies: DependencyContainer[]) {
        this.dependencies = dependencies
    }

    getAll() {
        return this.dependencies
    }

    async get(dependency: string) {
        
        const dep: DependencyContainer | undefined =
            this.dependencies.find(item => item.name === dependency)

        if (!dep) return undefined

        switch (dep.type) {
            case 'constructor':
                    return new dep.dependency()
            case 'factory':
                    return await dep.dependency()
            case 'service':
                    return dep.dependency
            default:
                return undefined;
        }
    }
}