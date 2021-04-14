const db = require("../config/config.firestore.js");
const collection = db.collection('videoCenter')


/// GET
exports.getAll = async (req, res) => {
    try {
        const snapshot = await collection.get();
        let liste = [];
        snapshot.forEach(doc => liste.push(doc.data()));
        console.log(liste);
        res.status(200).json(liste);
    } catch (error) {
        res.status(500).send(error);
    }
}

// GET by categorie
exports.getByCategorie = async (req, res) => {
    try {
        const snapshot = await collection.where('categorie', '==', req.params.categorie).get();
        if (snapshot.empty) {
            res.status(400).send("ressources inexistante");
            return;
        }  
        let liste = [];
        snapshot.forEach(doc => {
            liste.push(doc.data());
        });
        res.status(200).json(liste);
    } catch (error) {
        res.status(500).send(error);
    }
}

// POST
exports.create = async (req, res) => {
    try {
        console.log(req.body);
        const snapshot = await collection.add(req.body);
        console.log('Document ajouté ID: ', snapshot.id);
        res.status(200).json(snapshot.id);
    } catch (error) {
        res.status(500).send(error);
    }
}

// PUT update categorie with id
exports.update = async (req, res) => {
    try {
        const snapshot = await collection.doc(req.params.id);
        const result = await snapshot.update({categorie: req.body.categorie});
        console.log('Document mise à jour ID: ', snapshot.id);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).send(error);
    }
}

// DELETE with id
exports.remove = async (req, res) => {
    try {
        console.log(videoId);
        const snapshot = await collection.doc(req.params.id);
        const result = await snapshot.delete();
        console.log('Document supprimé ID: ', snapshot.id);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).send(error);
    }
}
