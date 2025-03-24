import multer from "multer";
import path from "path";
import { v4 as uuidv4 } from "uuid";

const storage = multer.diskStorage({
    destination: function (request, file, cb) {
        cb(null, "./uploads");
    },
    filename: function (request, file, cb) {
        cb(
            null,
            file.fieldname + "-" + uuidv4() + path.extname(file.originalname)
        );
    },
});
export const upload = multer({ storage });
