import { loadDependencies } from "./dependencies/index";
import socketIoServer from './socket/socketIoServer';
import createApp from "./expressApp";
import routers from './routers'
import http from 'http'
import 'dotenv/config'


const port = process.env.PORT ?? 3000

loadDependencies()
    .then(dependencies => {
        console.log(dependencies);
        const app = createApp(routers, dependencies.getAll())
        const server: http.Server = http.createServer(app)
        const io = socketIoServer(server, { dependencies })
        server.listen(port, () => {
            console.log(`listening on port ${port}`);
        })
    })
    .catch(err => {
        console.log(err);
        process.exit(1)
    })
