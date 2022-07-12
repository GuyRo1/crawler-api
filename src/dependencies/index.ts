import { Dependencies, DependencyContainer } from "../expressApp/types/types"
import { createQueueService } from "./services/Queue";
import { DependenciesContainer } from './models/classes'
import { createSubscriber } from './services/pubSub';




type LoadDependencies = () => Promise<DependenciesContainer>

export const loadDependencies: LoadDependencies = async () => {
    const dependencies: Dependencies = []
    try {
        dependencies.push({
            name: 'Queue',
            type: 'factory',
            dependency: createQueueService
        })
        dependencies.push({
            name: 'Subscriber',
            type: 'factory',
            dependency: createSubscriber
        })
        return new DependenciesContainer(dependencies)
    } catch (err) {
        throw err
    }
}


export const use = () => {

}

