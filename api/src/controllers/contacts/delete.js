const mongoose = require('mongoose');
const Contact = require("../../models/contact");
const sharp = require('sharp'); 

const deleteContact = async (req, res) => {
    // check id formatting 
    if (!req.params.contactId.match(/^[0-9a-fA-F]{24}$/)) {
        res.status(400).send("Invalid contactId format, must follow MongoDB ObjectId requirements");
        return;
    }

    const searchObj = { _id: mongoose.Types.ObjectId(req.params.contactId) };

    Contact.findOneAndDelete(
        searchObj,
        {},
        (err, doc) => {
            if (err) { res.status(404).send({ error: err }); }
            else if (doc == null) { res.status(400).send("Invalid item (contactId not found in DB)"); }
            else {
                fs.unlink("./public/images/" + req.params.contactId + "jpg");
                res.send("Deleted item successfully");
                // alternatively can do res.send(doc);
            }
        }
    );

}

module.exports = { deleteContact };