const db = require("./db");

// GET
exports.getAll = async (req, res) => {
    try {
        const querySnapshot = await db.ref("/videoCenter").get();
        res.status(200).json(querySnapshot);
    } catch (error) {
        res.status(500).send(error);
    }
}

// GET by categorie
exports.getByCategorie = async (req, res) => {
    if (req.params.categorie) {
        try {
            //const querySnapshot = await db.ref('/videoCenter/').get();
            console.log(req.params.categorie);
            const rootRef = db.ref('/videoCenter');
            let result = rootRef.orderByValue('categorie');
            console.log(result);
            res.status(200).json(result);
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
        const snapshot = await db.ref("/videoCenter").get();
        let lastId = 0;
        snapshot.forEach(doc => { lastId = doc.ref.path.pieces_[1] });
        let newId = parseInt(lastId)+1;
        const querySnapshot = await db.ref('/videoCenter/' + newId).set(req.body);
        res.status(200).json(querySnapshot);
    } catch (error) {
        res.status(500).send(error);
    }
}

// PUT with id
exports.update = async (req, res) => {
    try {

        const querySnapshot = await db.ref('/videoCenter/' + req.params.id).set(req.body);
        res.status(200).json(querySnapshot);
    } catch (error) {
        res.status(500).send(error);
    }
}

// DELETE with id
exports.remove = async (req, res) => {
    try {
        const querySnapshot = await db.ref('/videoCenter/' + req.params.id).remove();
        res.status(200).json(querySnapshot);
    } catch (error) {
        res.status(500).send(error);
    }
}
