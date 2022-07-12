import { Dependencies, DependencyContainer } from "../expressApp/types/types"
import { createQueueService } from "./services/Queue";
import { DependenciesContainer } from './models/DependenciesContainer';
import { createSubscriber } from './services/pubSub';




type LoadDependencies = () => Promise<DependenciesContainer>

export const loadDependencies: LoadDependencies = async () => {
    const dependencies: Dependencies = []
    try {
        const rabbitMqService = await createQueueService()
        dependencies.push({
            name: 'Queue',
            dependency: rabbitMqService
        })
         dependencies.push({
             name: 'Subscriber',
             dependency: createSubscriber
         })
        return new DependenciesContainer(dependencies)
    } catch (err) {
        throw err
    }
}


export const use = () => {

}

