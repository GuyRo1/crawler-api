
import http from 'http'
import { PubMessage } from '../models/pubSub'
import { Server } from 'socket.io';

import { DependenciesContainer } from '../dependencies/models/DependenciesContainer'
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

type Options = { dependencies: DependenciesContainer }

type SocketIo = (httpServer: http.Server, options: Options) => Server

const isQueueService = (obj: any): obj is QueueService =>
    (obj as QueueService).send !== undefined


const socketIoServer: SocketIo =
    (httpServer: http.Server, { dependencies }: Options) => {
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
        io.on('connection', async (socket) => {
            console.log(`welcome: ${socket.id}`)
            socket.emit('ack')
            const subFactory: SubscriberFactory = dependencies.get('Subscriber')
            const subscriber = await subFactory()
            socket.on('data', async data => {
                const queueService: QueueService = dependencies.get('Queue')
                const task: QueueMessage = { id: socket.id, ...data };
                queueService.send(task);
                await subscriber.subscribe(socket.id, (message: string) => {
                    const messageObj: PubMessage = JSON.parse(message)
                    console.log(`emitting url ${messageObj.url}`);
                    io.to(messageObj.id).emit('url', messageObj.url);
                });
            })
            socket.on('disconnecting', async (reason) => {
                await subscriber.unSubscribe()
            })
        });

        return io;
    }

export default socketIoServer