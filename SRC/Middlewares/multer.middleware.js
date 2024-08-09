import multer from "multer";
import path from "path";
import { nanoid } from "nanoid";
import { DateTime } from "luxon";
import { ErrorHandleClass } from  "../Utils/error-Class.utils.js";
import { extensions } from '../Utils/file-extinsion.js'





export const multerMidleware = ({
  filePath = "general",
  allowedExtensions,
} = {}) => {
  /**
   * @param {define path}
   * @param {check path exist or not }
   * @param {if not create this path}
   * @param {diskStorag to save file in new path}
   * @param {recursive true if need to create mor than folder
   */
  const destinationPath = path.resolve(`src/uploads/${filePath}`);
  if (!fs.existsSync(destinationPath)) {
    fs.mkdirSync(destinationPath, { recursive: true });
  }
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, destinationPath);
    },

    filename: (req, file, cb) => {
      const uniqename =
        DateTime.now().toFormat("yyyy-mm-dd") +
        "___" +
        nanoid(4) +
        "__" +
        file.originalname;
      cb(null, uniqename);
    },
  });

  const fileFilter = (req, file, cb) => {
    if (!allowedExtensions.includes(file.mimetype)) {
      return cb(
        new ErrorHandleClass(
          " Invalid file extension",
          400,
          "file.mimetype",
          "multer middlware",
          "you can upload img only"
        ),
        false
      );
    }

    cb(null, true);
  };

  return multer({ fileFilter, storage });
};

export const multerCloudinary = ({
  allowedExtensions = extensions.Documents,
}) => {
  const storage = multer.diskStorage({});

  const fileFilter = (req, file, cb) => {
    if (allowedExtensions.includes(file.mimetype)) {
      return cb(null, true);
    }

    cb(
      new ErrorHandleClass(
        `Invalid file extension allowed only ${allowedExtensions}`,
        400,
        "file.mimetype",
        "multer Host middlware",
      ),
      false
    );
  };

  return multer({ fileFilter, storage });
};
