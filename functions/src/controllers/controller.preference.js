const db = require("../config/config.firestore.js");
const collection = db.collection('parameter')


/// GET
exports.get = async (req, res) => {
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

// PUT
exports.update = async (req, res) => {
    try {
        const query = await collection.get();
        const snapshot = await collection.doc(query.docs[0].id);
        await snapshot.update(req.body);
        console.log('Document modifié ID: ', snapshot.id);
        res.status(200).json(snapshot.id);
    } catch (error) {
        res.status(500).send(error);
    }
}
