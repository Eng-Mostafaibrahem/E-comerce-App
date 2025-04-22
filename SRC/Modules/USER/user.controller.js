import { User, Adresses } from "../../../DB/Models/index.js";
import { ErrorHandleClass } from "../../Utils/error-Class.utils.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
export const Register = async (req, res, next) => {
  //destruct data from user
  const {
    name,
    email,
    password,
    gender,
    role,
    country,
    city,
    floorNumber,
    buildingNumber,
    postalCode,
  } = req.body;
  //check if user already exists
  const isEmailExist = await User.findOne({ email });
  if (isEmailExist)
    return next(
      new ErrorHandleClass("User already exists", 400, "User already exists")
    );

  //hash pawword
  const cipher = bcrypt.hashSync(password, 10);
  //create instance new user value
  const newUser = new User({
    name,
    email,
    password: cipher,
    gender,
    role,
  });
  const user = await newUser.save();

  //   create address

 
  const newAddress = new Adresses({
    country,
    city,
    floorNumber,    
    buildingNumber,
    postalCode,
    userId: user._id,
  });

  const address = await newAddress.save();

  return res.status(200).json({
    status: "success",
    message: "User created successfully",
    data: user , address,
  });
};

export const login = async (req, res, next) => {
  //destruct data from req
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  //   COMPAR EMAIL
  if (!user)
    return next(
      new ErrorHandleClass("Invalid Credintial", 400, "Invalid Credintial")
    );

  // COMPARE PASSWORD
  const isPasswordMatch = bcrypt.compareSync(password, user.password);
  if (!isPasswordMatch)
    return next(
      new ErrorHandleClass("Invalid Credintial", 400, "Invalid Credintial")
    );

  //   generat token
  const token = jwt.sign(
    {
      userId: user._id,
      email: user.email,
    },
    process.env.LOGIN_SECRET,
    { expiresIn: "1h" }
  );
  res.status(200).json({ message: "Login Successful", token });
};
