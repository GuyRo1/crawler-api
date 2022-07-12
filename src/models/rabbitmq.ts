import { Channel, Connection } from 'amqplib'
import { SocketData,QueueMessage } from './models'

export type ConnectToQueue = () => Promise<Connection>

export type GetChannel = (connection: Connection) => Promise<Channel>

export type SendTaskToQueue = (channel:Channel,task:QueueMessage)=>Promise<void>

export type QueueService = {
    connection: Connection,
    channel: Channel,
    send: Send
}

export type CreateQueueService = ()=>Promise<QueueService>

export type Send = (task:QueueMessage)=>void