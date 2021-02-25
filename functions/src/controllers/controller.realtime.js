const db = require("../config/config.realtime.js");

// GET
exports.getAll = async (req, res) => {
    try {
        const querySnapshot = await db.ref("videoCenter").get();
        res.status(200).json(querySnapshot);
    } catch (error) {
        res.status(500).send(error);
    }
}

// GET by categorie
exports.getByCategorie = async (req, res) => {
    try {
        let querySnapshot = db.ref("/videoCenter").orderByChild("categorie").equalTo(req.params.categorie);
        let snapshot = await querySnapshot.get();
        if (snapshot.exists()) {
            res.status(200).json(snapshot);       
        } else {
            res.status(400).json({ "message": "Bad request" })
        }
    } catch (error) {
        res.status(500).send(error);
    }
}

// GET by id
exports.getById = async (req, res) => {
    try {
        const querySnapshot = await db.ref('/videoCenter/' + req.params.id).get();
        if (querySnapshot.val() != null) {
            res.status(200).json(querySnapshot);
        } else {
            res.status(400).json({ "message": "Bad request" });
        }
    } catch (error) {
        res.status(500).send(error);
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
        /* const ref = await db.ref("/videoCenter");
        await db.ref("/videoCenter").transaction(async (t) => {
            const snapshot = await t.get();
            let lastId = 0;
            snapshot.forEach(doc => { lastId = doc.ref.path.pieces_[1] });
            let newId = parseInt(lastId)+1;
            console.log(newId) */
            //const querySnapshot = await db.ref('/videoCenter/' + newId).set(req.body);
        res.status(200).send(`Identifiant ${newId} créé`);
    } catch (error) {
        res.status(500).send(error);
    }
}

// PUT with id
exports.update = async (req, res) => {
    try {
        const querySnapshot = await db.ref('/videoCenter/' + req.params.id);
        let snapshot = await querySnapshot.get();
        if (snapshot.val() != null) {
            await querySnapshot.update(req.body);
            res.status(200).send(`Identifiant ${req.params.id} mis à jour.`);
        } else {
            res.status(400).send(`Identifiant ${req.params.id} inconnu`);
        }
    } catch (error) {
        res.status(500).send(error);
    }
}

// DELETE with id
exports.remove = async (req, res) => {
    try {
        const querySnapshot = await db.ref('/videoCenter/' + req.params.id);
        let snapshot = await querySnapshot.get();
        if (snapshot.val() != null) {
            await querySnapshot.remove();
            res.status(200).send(`Identifiant ${req.params.id} supprimé`);
        } else {
            res.status(400).send(`Identifiant ${req.params.id} inconnu`);
        }
    } catch (error) {
        res.status(500).send(error);
    }
}
