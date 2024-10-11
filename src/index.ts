
import express, { Request, Response } from 'express';
import morgan from 'morgan';

const app = express();
const PORT = 9090;

app.use(express.json());
app.use(morgan('tiny'));

// Agregar un token personalizado para registrar el cuerpo de la solicitud
morgan.token('body', (req: Request) => {
    return JSON.stringify(req.body);
});

// Usar el token personalizado en la configuración de morgan
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

type Person = {
    id: number;
    name: string;
    number: string;
};

let persons: Person[] = [
    { id: 1, name: "Arto Hellas", number: "040-123456" },
    { id: 2, name: "Ada Lovelace", number: "39-44-5323523" },
    { id: 3, name: "Dan Abramov", number: "12-43-234345" },
    { id: 4, name: "Mary Poppendieck", number: "39-23-6423122" },
];

// Obtener todos los contactos
app.get('/api/people', (req: Request, res: Response) => {
    res.json(persons);
});

// Obtener información sobre la agenda
app.get('/info', (req: Request, res: Response) => {
    const time = new Date();
    res.send(`
        Agenda telefónica tiene ${persons.length} entradas.
        ${time}
    `);
});

// Obtener una persona específica
app.get('/api/people/:id', (req: Request, res: Response) => {
    const person = persons.find(p => p.id === Number(req.params.id));
    if (person) {
        res.json(person);
    } else {
        res.status(404).send({ error: 'Persona no encontrada' });
    }
});

// Eliminar una persona
app.delete('/api/people/:id', (req: Request, res: Response) => {
    persons = persons.filter(p => p.id !== Number(req.params.id));
    res.status(204).end();
});

// Crear nueva persona
app.post('/api/people', (req: any, res: any) => {
    const { name, number } = req.body;

    if (!name || !number) {
        return res.status(400).json({ error: 'Falta el nombre o el número' });
    }

    if (persons.some(p => p.name === name)) {
        return res.status(400).json({ error: 'El nombre ya existe en la agenda' });
    }

    const newPerson = { id: Math.floor(Math.random() * 100000), name, number };
    persons.push(newPerson);

    return res.status(201).json(newPerson);
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
