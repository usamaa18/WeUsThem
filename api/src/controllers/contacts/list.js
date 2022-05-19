const Contact = require("../../models/contact");

const listContacts = async (req, res) => {
    Contact.find(
        {},
        (err, doc) => {
            if (err) { res.status(400).send({ error: err }); }
            else if (doc == null) { res.status(404).send("No contacts to show"); }
            else {
                res.send(doc);
            }
        }
    );

}

module.exports = { listContacts };