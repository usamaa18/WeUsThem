const express = require('express');
const router = express.Router();
const { createContact } = require('../src/controllers/contacts/create');
const { editContact } = require('../src/controllers/contacts/edit');
const { deleteContact } = require('../src/controllers/contacts/delete');
const { listContacts } = require('../src/controllers/contacts/list');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() })

router.post('/', upload.single('image'), (req, res) => {
    createContact(req, res);
});

router.post('/:contactId', upload.single('image'), (req, res) => {
    editContact(req, res);
});


router.delete('/:contactId', (req, res) => {
    deleteContact(req, res);
});

router.get('/', (req, res) => {
    listContacts(req, res);
});


module.exports = router;