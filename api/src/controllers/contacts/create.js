const Contact = require("../../models/contact");
const sharp = require('sharp');
const mongoose = require('mongoose');

const createContact = async (req, res) => {

  // check that all the required item properties are passed via req.body
  const reqProps = ["firstName", "lastName", "email", "phoneNumber"];
  if (reqProps.some(x => !(x in req.body))) {
    res.status(400).send("Incomplete form");
    return;
  }

  // TODO: add email and phoneNumber validation. For now, we can rely on front-end for basic syntax validation

  id = new mongoose.Types.ObjectId();
  image = id; // in a real deployment, this would instead be the url to the image served by a cdn

  if (req.file && req.file.mimetype.slice(0, 5) == "image") {
    sharp(req.file.buffer).resize(256, 256).toFile("./public/images/" + image + ".jpg").then(info => {
      const obj = {
        _id: id,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        phoneNumber: req.body.phoneNumber,
        image: image
      };

      Contact.create(obj, (err, doc) => {
        if (err) { res.status(400).send({ error: err }); }
        else {
          res.send(doc);
        }
      });
    }).catch(err => { res.status(500).send(err) });
  } else {
    res.status(400).send("Require valid image");
    return;
  }
}

module.exports = { createContact };