const express = require('express');
const http = require('http');
const dotenv = require('dotenv');
const fs = require('fs');
const { Server: SocketIO } = require('socket.io');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const { spawn, exec } = require('child_process');
const { log, error } = require('console');
const { DateTime } = require('luxon');

dotenv.config();
// Inicialización del servidor y configuración
const app = express();
app.use(express.json());
app.use(cors());
const PORT = process.env.PORT;

// `__dirname` está disponible automáticamente en CommonJS
const route = "../node"
const services = [];
const server = http.createServer(app);

const io = new SocketIO(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

io.on('connection', (socket) => {
    console.log('connected', socket.id);
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });

    socket.on('connection_server', () => {
        console.log('Conexión exitosa al servidor!');
    });
});

// Cargar los servicios
fs.readdirSync(path.join(route, 'services')).forEach(file => {

    services.push({
        id: uuidv4(),
        name: file,
        status: 'stopped',
        enabled: 'enabled',
        message: [],
        log: [],
        logError: [],
        process: null,
    });

});



// Rutas de la API
app.get('/getProcess', (req, res) => {
    res.json(services);
});

app.get('/startService/:id', (req, res) => {
    const id = req.params.id;
    const service = services.find(service => service.id === id);

    if (service) {
        const servicePath = path.join(route, 'services', service.name);
        const logDir = path.join(servicePath, 'logs');

        if (!fs.existsSync(logDir)) {
            fs.mkdirSync(logDir, { recursive: true });
        }
        const logFilePath = path.join(logDir, 'logs.log');
        const logErrorFilePath = path.join(logDir, 'error_logs.log');
        const messageFilePath = path.join(logDir, 'messages.log');

        //SPAWN
        const processData = spawn('node', [path.join(__dirname, 'services') + `/${service.name}/index.js`], {
            cwd: path.join(__dirname, 'services') + `/${service.name}`,
        });
        service.process = processData;
        service.status = 'running';
        service.enabled = 'enabled';

        service.process.stdout.on('data', (data) => {
            const logMessage = {
                message: `${data.toString()}`,
                timestamp: DateTime.now().setZone('Europe/Paris').toFormat('dd/MM/yyyy HH:mm:ss')
            };
            console.log("log: ", logMessage.message);
            fs.appendFileSync(logFilePath, `${JSON.stringify(logMessage)}\n`);
            service.log.push(logMessage);
            io.emit('wsdata', JSON.stringify(services));
        });

        service.process.stderr.on('data', (data) => {
            const errorMessage = {
                message: `${data.toString()}`,
                timestamp: DateTime.now().setZone('Europe/Paris').toFormat('dd/MM/yyyy HH:mm:ss')
            };
            console.error(`err log: ${errorMessage.message}`);
            service.status = 'error';
            service.enabled = 'disabled';
            fs.appendFileSync(logErrorFilePath, `${JSON.stringify(errorMessage)}\n`);
            service.logError.push(errorMessage);
            io.emit('wsdata', JSON.stringify(services));
        });

        service.process.on('close', (code) => {
            const closeMessage = {
                message: `processo cerrado correctamente`,
                timestamp: DateTime.now().setZone('Europe/Paris').toFormat('dd/MM/yyyy HH:mm:ss')
            };
            console.log(`close message: ${closeMessage.message}`);
            service.status = 'stopped';
            service.enabled = 'disabled';
            fs.appendFileSync(messageFilePath, `${JSON.stringify(closeMessage)}\n`);
            service.message.push(closeMessage);
            io.emit('wsdata', JSON.stringify(services));
        });

        console.log(`Started service ${service.name} with id ${service.id}`);
        res.send(service);
    } else {
        res.status(404).send('Service not found');
    }
});

// app.put('/changeEnabledProcess/:id', (req, res) => {
//     const id = req.params.id;
//     const service = services.find(service => service.id === id);

//     if (service) {
//         service.enabled = 'invisible';
//         service.log.push({ message: `${service.name} is invisible for students` });
//         res.send(service);
//     } else {
//         res.status(404).send('Service not found');
//     }
// });

app.get('/getStatusService/:id', (req, res) => {
    const id = req.params.id;
    const service = services.find(service => service.id === id);

    if (service) {
        res.send(service.status);
    } else {
        res.status(404).send('Service not found');
    }
});

app.get('/stopService/:id', (req, res) => {
    const id = req.params.id;
    const service = services.find(service => service.id === id);

    if (service) {
        service.status = 'stopped';
        service.enabled = 'disabled';
        service.log.push({ message: `${service.name} is stopped`, timestamp: DateTime.now().setZone('Europe/Paris').toFormat('dd/MM/yyyy HH:mm:ss') });
        service.process.kill();
        res.send(service);

    } else {
        res.status(404).send('Service not found');
    }
});

app.put('/changeServiceViewUserFront/:id', (req, res) => {
    const id = req.params.id;
    const { enabled } = req.body;

    const service = services.find(service => service.id === id);

    if (service) {
        service.enabled = enabled;
        service.log.push({
            message: `Service visibility changed to ${enabled}`,
            timestamp: DateTime.now().setZone('Europe/Paris').toFormat('dd/MM/yyyy HH:mm:ss'),
        });

        io.emit('wsdata', JSON.stringify(services)); // Notificar cambios a través de WebSocket
        res.status(200).send(service);
    } else {
        res.status(404).send({ error: 'Service not found' });
    }
});

// Iniciar el servidor
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});