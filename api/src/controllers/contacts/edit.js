const mongoose = require('mongoose');
const Contact = require("../../models/contact");
const sharp = require('sharp'); 

const editContact = async (req, res) => {
    // check id formatting
    if (!req.params.contactId.match(/^[0-9a-fA-F]{24}$/)) {
        res.status(400).send("Invalid contactId format, must follow MongoDB ObjectId requirements");
        return;
    }

    hasImage = false;
    if (req.file && req.file.mimetype.slice(0, 5) == "image") {
        const image = await sharp(req.file.buffer).resize(256, 256).toBuffer().toString('base64');
        console.log("saved thumbnail");
        hasImage=true;
    } else if (req.file) {
        res.status(400).send("Require valid image");
        return;
    }

    const searchObj = { _id: mongoose.Types.ObjectId(req.params.itemId) };


    // conditionally add properties to object, since we only need to update certain fields and not repalce the whole doc
    // for each property we check for two conditions
    // condition 1: the property must exist in the req.body
    // condition 2: the property must not be an empty string (which can definetly occur if using html-only forms)
    // only when condition 1 and 2 are met, do we add that property to the updateObj 
    // https://stackoverflow.com/a/51200448
    const updateObj = {
        ...("firstName" in req.body && req.body.firstName !== "") && { firstName: req.body.firstName },
        ...("lastName" in req.body && req.body.lastName !== "") && { lastName: req.body.lastName },
        ...("email" in req.body && req.body.email !== "") && { email: req.body.email },
        ...("phoneNumber" in req.body && req.body.phoneNumber !== "") && { phoneNumber: req.body.phoneNumber },
        ...(hasImage) && { image: image },
    };


    Contact.findOneAndUpdate(
        searchObj,
        updateObj,
        {
            new: true, // return updated object
            runValidators: true, // validify data
        },
        (err, doc) => {
            if (err) { res.status(400).send({ error: err }); }
            else if (doc == null) { res.status(404).send("Invalid item (contactId not found in DB)"); }
            else {
                res.send(doc);
            }
        }
    );

}

module.exports = { editContact };