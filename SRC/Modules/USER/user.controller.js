import { User } from "../../../DB/Models/User.model.js";
import { ErrorHandleClass } from "../../Utils/error-Class.utils.js";
import { compareSync, hashSync } from "bcrypt";
import jwt from "jsonwebtoken";
export const Register = async (req, res, next) => {
  //destruct data from user
  const { name, email, password, gender, role } = req.body;
  //check if user already exists
  const isEmailExist = await User.findOne({ email });
  if (isEmailExist)
    return next(
      new ErrorHandleClass("User already exists", 400, "User already exists")
    );

  //hash pawword
  const cipher = hashSync(password, 10);
  //create instance new user value
  const newUser = new User({
    name,
    email,
    password: cipher,
    gender,
    role,
  });

  const user = await User.create(newUser);
  return res.status(200).json({
    status: "success",
    message: "User created successfully",
    data: user,
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
  const isPasswordMatch = compareSync(password, user.password);
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

