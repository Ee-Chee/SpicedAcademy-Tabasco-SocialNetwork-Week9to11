const knox = require("knox-s3");
const fs = require("fs");
//knox is a S3 client used to serve S3 cloud/database (where we store images) between our server
let secrets;
if (process.env.NODE_ENV == "production") {
    secrets = process.env; // in prod the secrets are environment variables
} else {
    secrets = require("./secrets"); // secrets.json is in .gitignore!!!!
}

const client = knox.createClient({
    key: secrets.AWS_KEY,
    secret: secrets.AWS_SECRET,
    bucket: "spicedling"
});

exports.upload = function(req, res, next) {
    // console.log(req.file);
    if (!req.file) {
        return res.sendStatus(500); //send 'Internal Server Error'
    }
    const s3Request = client.put(req.file.filename, {
        "Content-Type": req.file.mimetype,
        "Content-Length": req.file.size,
        "x-amz-acl": "public-read" //so that the images can be seen by public
    });
    const stream = fs.createReadStream(req.file.path);
    stream.pipe(s3Request); //make a request to s3 and pipe all the img data (or uploading to cloud) to s3

    s3Request.on("response", s3Response => {
        // console.log(s3Response.statusCode, req.file.filename);
        if (s3Response.statusCode == 200) {
            //async the order doesnt matter here
            next();
            fs.unlink(req.file.path, () => {}); //delete image file in the 'uploads' folder, callback return nothing
        } else {
            res.sendStatus(500);
        }
    });
};
