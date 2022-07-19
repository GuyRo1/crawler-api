
import http from 'http'
import { PubMessage } from '../models/pubSub'
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

type Options = { dependencies: DependenciesContainer }

type SocketIo = (httpServer: http.Server, options: Options) => Server

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
            const globalSubscriber: Subscriber = await dependencies.get('Subscriber')
            const socketSubscriber: Subscriber = await dependencies.get('Subscriber')
            globalSubscriber.subscribe('main', (message: string) => {
                const messageObj: PubMessage = JSON.parse(message)
                console.log(`emitting url ${messageObj.url}`);
                io.to(messageObj.id).emit('url', messageObj.url);
            })
            
            socket.on('data', async data => {
                const queueService: QueueService = await dependencies.get('Queue')
                const task: QueueMessage = { id: socket.id, ...data };
                queueService.send(task);
                await socketSubscriber.subscribe(socket.id, (message: string) => {
                    const messageObj: PubMessage = JSON.parse(message)
                    console.log(`emitting url ${messageObj.url}`);
                    io.to(messageObj.id).emit('url', messageObj.url);
                });
            })
            socket.on('disconnecting', async (reason) => {
                await socketSubscriber.unSubscribe()
            })
        });

        return io;
    }

export default socketIoServer