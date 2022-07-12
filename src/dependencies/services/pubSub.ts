
import { getRedisClient } from './../db/redis';
import { Subscriber } from './../models/Subscriber';

export const createSubscriber = async () => {
    const subscriber = await getRedisClient({})
    return new Subscriber(subscriber);
}





