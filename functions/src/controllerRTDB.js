const db = require("./db");

// GET
exports.getAll = async (req, res) => {
    try {
        const querySnapshot = await db.ref("/").get();
        res.status(200).json(querySnapshot);
    } catch (error) {
        res.status(500).send(error);
    }
}

// GET by id
exports.getById = async (req, res) => {
    console.log(req.params.id);
    if (req.params.id) {
        try {
            const querySnapshot = await db.ref('/' + req.params.id).get();
            res.status(200).json(querySnapshot);
        } catch (error) {
            res.status(500).send(error);
        }
    } else {
        res.status(400)
        res.json({ "message": "Bad request" })

    }
}

// POST
exports.create = async (req, res) => {
    try {
        const querySnapshot = await db.ref('/').set({
            videoId: videoId,
            title: title,
            channelTitle: channelTitle,
            description: description,
            categorie: categorie
        });
        res.status(200).json(querySnapshot);
    } catch (error) {
        res.status(500).send(error);
    }
}

// PUT with id
exports.update = async (req, res) => {
    try {
        const querySnapshot = await db.ref('/' + videoId).set({
            categorie: categorie
        });
        res.status(200).json(querySnapshot);
    } catch (error) {
        res.status(500).send(error);
    }
}

// DELETE with id
exports.remove = async (req, res) => {
    try {
        const querySnapshot = await db.ref('/' + videoId).remove();
        res.status(200).json(querySnapshot);
    } catch (error) {
        res.status(500).send(error);
    }
}
