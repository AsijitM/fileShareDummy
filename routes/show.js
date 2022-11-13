const router = require('express').Router();
const File = require('../models/file');

router.get('/:uuid', async (req, res) => {
  try {
    const file = await File.findOne({ uuid: req.params.uuid });
    if (!file) {
      return res.render('download', { error: 'Link Has been Expired' });
    }

    return res.render('download', {
      uuid: file.uuid,
      fileName: file.filename,
      fileSize: file.size,
      downloadLink: `${process.env.APP_BASE_URL}/files/download/${file.uuid}`,
      //http://localhost:3000/files/donwload/3432hdsfoijfoidsfj3-3fds
    });
  } catch (err) {
    return res.render('download', { error: 'Something Went Wrong' });
  }
});

module.exports = router;
