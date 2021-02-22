const db = require("./db");
const collection = db.ref("/");

// GET
exports.getAll = async (req, res) => {
    try {
        const querySnapshot = await collection.get();
        res.status(200).json(querySnapshot);
    } catch (error) {
        res.status(500).send(error);
    }
}