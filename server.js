var gitroot = '/srv/data/';

var express = require('express'),
    app = express(),
    port = process.env.PORT || 3000,
    bodyParser = require('body-parser');

var cors = require('cors');

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const Backend = require('./backend.js');
const backend = new Backend({ root: gitroot });

app.get('/content*', async (req, res) => {
    let path = req.params['0'];
    if (path === '') {
        path = '/';
    }
    let content;
    try {
        if (await backend.isDirectory(path)) {
            content = await backend.list(path);
        } else {
            content = await backend.read(path);
        }
        res.json(content);
    } catch (e) {
        res.status(500).json({ error: e });
    }
});

app.post('/content*', async (req, res) => {
    let path = req.params['0'];

    try {
        if (await backend.isDirectory(path)) {
            res.status(500).json({ error: 'POST request only possible on files'});
        }
        if (path.endsWith('/')) {
            await backend.createDirectory(path);
        } else {
            await backend.write(path, req.body.content);
        }
        res.status(200).json("Success");;
    } catch (e) {
        res.status(500).json({ error: e });
    }
});

app.delete('/content*', async (req, res) => {
    let path = req.params['0'];

    try {
        await backend.remove(path);
        res.status(200).json("Success");;
    } catch (e) {
        console.log(e);
        res.status(500).json({error: "Unable to delete file."});
    }
});


backend.init().then(async () => {
    app.listen(port);
    console.log("Started on port " + port);
});
