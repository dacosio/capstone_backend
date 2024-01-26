const multer = require("multer");
const multerS3 = require("multer-s3");

const s3 = new S3Client();

const AWS = require('aws-sdk');

AWS.config.update({
  accessKeyId: 'AKIAXBPMHAVOALG6IJV4',
  secretAccessKey: 'your_secret_access_key',
  region: 'your_bucket_region',
});


const bucket = 'bucket name'

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket,
    acl: 'public-read',
    contentType: multerS3.AUTO_CONTENT_TYPE,
    // metadata: function (req, file, cb) {
    //   cb(null, { fieldName: file.fieldname });
    // },
    key: function (req, file, cb) {
      cb(null, Date.now().toString());
    },
  }),
});


app.post('/upload', upload.array('photos', 3), function(req, res, next) {
    res.send('Successfully uploaded ' + req.files.length + ' files!')
  })