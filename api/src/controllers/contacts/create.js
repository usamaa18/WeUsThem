const Contact = require("../../models/contact");
const sharp = require('sharp'); 

const createContact = async (req, res) => {

  // check that all the required item properties are passed via req.body
  const reqProps = ["firstName", "lastName", "email", "phoneNumber"];
  if (reqProps.some(x => !(x in req.body))) {
    res.status(400).send("Incomplete form");
    return;
  }

  if (req.file && req.file.mimetype.slice(0, 5) == "image") {
    const image = await sharp(req.file.buffer).resize(256, 256).toBuffer();
    console.log("saved thumbnail");
  } else {
    res.status(400).send("Require valid image");
    return;
  }

  const obj = {
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
}

module.exports = { createContact };