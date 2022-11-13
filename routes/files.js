const router = require('express').Router();
const multer = require('multer');
const path = require('path'); //to use the path function bulitin
const File = require('../models/file');
const { v4: uuid4 } = require('uuid');

//basic Config Multer

let storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    //creating template string
    const uniqueName = `${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}${path.extname(file.originalname)}`;

    cb(null, uniqueName);

    //34534534534-453453453.jpg
  },
});

let upload = multer({
  storage: storage,
  limit: { filesize: 1000000 * 100 }, //100mb max
}).single('myfile');

router.post('/', (req, res) => {
  //Store File

  //already created variable upload

  upload(req, res, async (err) => {
    //validate Req
    if (!req.file) {
      return res.json({ error: 'All fields must be' });
    }

    if (err) {
      return res.status(500).send({ error: err.message });
    }

    //Database Store

    const file = new File({
      filename: req.file.filename,
      uuid: uuid4(),
      path: req.file.path, //destination+path joined together
      size: req.file.size,
    });

    const response = await file.save();
    return res.json({
      file: `${process.env.APP_BASE_URL}/files/${response.uuid}`,
      //http:localhost:3000/files/32434dspfksop -- example link
    });
  });

  //response
});

router.post('/send', async (req, res) => {
  //validate request
  const { uuid, emailTo, emailFrom } = req.body;
  if (!uuid || !emailTo || !emailFrom) {
    return res.status(422).send({ error: 'All Fields are required ' });
  }

  //Get data from database
  const file = await File.findOne({ uuid: uuid });
  if (file.sender) {
    return res.status(422).send({ error: 'Email already Sent' });
  }

  file.sender = emailFrom;
  file.receiver = emailTo;
  const response = await file.save();

  //Send Email

  const sendMail = require('../services/emailService');
  sendMail({
    from: emailFrom,
    to: emailTo,
    subject: 'FileShare Comfort Sharing',
    text: `${emailFrom} shared a file with You`,
    html: require('../services/emailTemplate')({
      emailFrom: emailFrom,
      downloadLink: `${process.env.APP_BASE_URL}/files/${file.uuid}}`,
      size: parseInt(file.size / 1000) + 'KB',
      expires: '24 Hours',
    }),
  });

  return res.send({ success: true });
});

module.exports = router;
