import multer from "multer";
import multerS3 from "multer-s3";

import { initializeAWS, s3 } from "@utils/aws";
import * as Constants from "@constants";

let upload: multer.Multer;

function initializeMulter() {
  initializeAWS();
  upload = multer({
    storage: multerS3({
      s3,
      cacheControl: "max-age=31536000",
      bucket: process.env.AWS_S3_BUCKET_NAME!,
      acl: "public-read",
      contentDisposition: "inline",
      contentType: multerS3.AUTO_CONTENT_TYPE,
      key: function (_, file, cb) {
        cb(null, Date.now().toString() + "_" + file.originalname);
      },
    }),
    fileFilter: (_, file, cb) => {
      const imgRE = /image\/[a-zA-Z0-9]*/;

      if (
        imgRE.test(file.mimetype) &&
        file.size <= Constants.Upload.FILE_UPLOAD_LIMIT_IMG
      ) {
        cb(null, true);
      } else {
        cb(new Error("File of large size or unknown type."));
      }
    },
  });
}

export { initializeMulter, upload };
