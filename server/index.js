const express = require('express');
const axios = require('axios');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const next = require('next');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const PORT = process.env.PORT || 5555;

app.prepare().then(() => {
    const server = express();

    server.use(cors());
    server.use(express.json({ limit: '50mb' }));
    server.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
    server.use(express.urlencoded({ limit: '50mb', extended: true }));
    server.use(bodyParser.json());

    server.post('/api/card', async (req, res) => {
        const { name, desc, comment, checklists, trelloKey, trelloToken, trelloListId } = req.body;

        if (!trelloKey || !trelloToken || !trelloListId) {
            return res.status(400).json({ error: 'Missing Trello API credentials' });
        }

        try {
            // Create card
            const cardResponse = await axios.post(`https://api.trello.com/1/cards`, {
                name: name,
                desc: desc,
                idList: trelloListId,
                key: trelloKey,
                token: trelloToken
            });
    
            const cardId = cardResponse.data.id;
    
            // Add checklists to card if provided
            if (checklists && checklists.items && Array.isArray(checklists.items)) {
                const checklistResponse = await axios.post(`https://api.trello.com/1/checklists`, {
                    name: checklists.name, // ใช้ชื่อของ checklists ที่ส่งมาจาก frontend
                    idCard: cardId,
                    key: trelloKey,
                    token: trelloToken
                });
    
                const checklistId = checklistResponse.data.id;
    
                // Add items to checklist
                for (const item of checklists.items) {
                    await axios.post(`https://api.trello.com/1/checklists/${checklistId}/checkItems`, {
                        name: item,
                        key: trelloKey,
                        token: trelloToken
                    });
                }
            }
    
            // Add comment to card if provided
            if (comment) {
                await axios.post(`https://api.trello.com/1/cards/${cardId}/actions/comments`, {
                    text: comment,
                    key: trelloKey,
                    token: trelloToken
                });
            }
    
            res.json(cardResponse.data);
        } catch (error) {
            res.status(500).send(error.message);
        }
    });

    server.get('*', (req, res) => {
        return handle(req, res);
    });

    server.listen(PORT, (err) => {
        if (err) throw err;
        console.log(`Server running on port ${PORT}`);
    });
});
