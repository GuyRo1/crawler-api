
import rabbitMQ, { Connection, Channel } from 'amqplib'
import { SocketData } from '../../models/models'
import { ConnectToQueue, CreateQueueService, GetChannel, SendTaskToQueue } from '../../models/rabbitmq'
import { QueueMessage } from './../../models/models';

const connectToQueue: ConnectToQueue = async () =>
    await rabbitMQ.connect('amqp://localhost:5672')

const getQueueChannel: GetChannel = async (connection: Connection) =>
    await connection.createChannel()

const sendTaskToQueue: SendTaskToQueue = async (channel: Channel, task: QueueMessage) => {
    const tasks = 'new-tasks'
    await channel.assertQueue(tasks)
    channel.sendToQueue(tasks, Buffer.from(
        JSON.stringify(task)
    ))
}

export const createQueueService:CreateQueueService = async () => {
    const connection: Connection = await connectToQueue()
    const channel: Channel = await getQueueChannel(connection)
    return {
        connection: connection,
        channel: channel,
        send: (task: QueueMessage) => { sendTaskToQueue(channel, task) }
    }
}




