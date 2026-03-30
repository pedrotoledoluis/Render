import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const DATA_DIR = path.join(__dirname, 'data');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR);
}

// Utility to read/write JSON
const readJSON = (filename, defaultData = []) => {
    const filePath = path.join(DATA_DIR, filename);
    if (!fs.existsSync(filePath)) return defaultData;
    try {
        const data = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        return defaultData;
    }
};

const writeJSON = (filename, data) => {
    const filePath = path.join(DATA_DIR, filename);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
};

// API Endpoints
app.get('/api/config', (req, res) => {
    const config = readJSON('config.json', { salary: 0, fixedConfig: [] });
    res.json(config);
});

app.post('/api/config', (req, res) => {
    writeJSON('config.json', req.body);
    res.sendStatus(200);
});

app.get('/api/expenses/all/:year', (req, res) => {
    const { year } = req.params;
    const files = fs.readdirSync(DATA_DIR).filter(f => f.startsWith(`${year}-`));
    let allExpenses = [];
    files.forEach(f => {
        const data = readJSON(f, { expenses: [] });
        if (data.expenses) {
            allExpenses = [...allExpenses, ...data.expenses];
        }
    });
    res.json(allExpenses);
});

app.get('/api/expenses/:year/:month', (req, res) => {
    const { year, month } = req.params;
    const filename = `${year}-${month}.json`;
    const config = readJSON('config.json', { salary: 0, fixedConfig: [] });
    const data = readJSON(filename, { income: config.salary || 0, expenses: [] });
    res.json(data);
});

app.post('/api/expenses/:year/:month', (req, res) => {
    const { year, month } = req.params;
    const filename = `${year}-${month}.json`;
    writeJSON(filename, req.body);
    res.sendStatus(200);
});

// SERVE STATIC FILES (AFTER API ROUTES)
const DIST_PATH = path.join(__dirname, 'dist');
app.use(express.static(DIST_PATH));

// CATCH-ALL FOR REACT ROUTING
app.get('*', (req, res) => {
    res.sendFile(path.join(DIST_PATH, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`SERVER V3 - Running on http://localhost:${PORT}`);
});
