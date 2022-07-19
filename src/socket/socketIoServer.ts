
import http from 'http'
import { NewUrlPubMessage, TaskFinishedMessage } from '../models/pubSub'
import { Server } from 'socket.io';
import { DependenciesContainer } from '../dependencies/models/classes'
import { QueueService } from '../models/rabbitmq';
import { Subscriber } from './../dependencies/models/Subscriber';
import {
    QueueMessage,
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents,
    SocketData
} from './../models/models';
import { SubscriberFactory } from '../dependencies/types/types';
import crypto from 'crypto'





type Options = { dependencies: DependenciesContainer }

type SocketIo = (httpServer: http.Server, options: Options) => Promise<Server>

const socketIoServer: SocketIo =
    async (httpServer: http.Server, { dependencies }: Options) => {

        const io = new Server
            <ClientToServerEvents,
                ServerToClientEvents,
                InterServerEvents,
                SocketData>
            (httpServer, {
                cors: {
                    origin: '*',
                    methods: ['GET', 'POST']
                }
            });

        const serverId = crypto.randomUUID()

        const workSubscriber: Subscriber = await dependencies.get('Subscriber')
        const finishedTaskSubscriber: Subscriber = await dependencies.get('Subscriber')
        console.log(`subscribing to ${serverId}`);

        finishedTaskSubscriber.subscribe(`finished-${serverId}`, (message: string) => {
            const { id }: TaskFinishedMessage = JSON.parse(message)
            io.to(id).emit('finished');
        })

        workSubscriber.subscribe(serverId, (message: string) => {
            const messageObj: NewUrlPubMessage = JSON.parse(message)
            io.to(messageObj.id).emit('url', messageObj.urls);
        })


        io.on('connection', async (socket) => {
            console.log(`welcome: ${socket.id}`)
            socket.emit('ack')
            socket.on('data', async data => {
                const queueService: QueueService = await dependencies.get('Queue')
                const task: QueueMessage = { id: socket.id, serverId, ...data };
                queueService.send(task);
            })
        });

        return io;
    }

export default socketIoServer