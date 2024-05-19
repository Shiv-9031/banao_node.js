import sql from "../database.mjs";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const registration = async (req, res) => {
  try {
    //check table exist or not
    await sql`create table if not exists register(id serial primary key,name text not null,email text not null ,password text not null,isadmin boolean default false,avatar text default 'update profile pic')`;

    //validation for email
    const isEmail =
      await sql`select  email from register where email=${req.body.email} `;

    if (isEmail.length != 0) {
      return res.status(200).json({
        success: false,
        message: "user already existed",
      });
    }

    const hashPassword = await bcrypt.hash(req.body.password, 10);
    const columns = ["name", "email", "password"];
    const newUser = await sql`insert into register ${sql(
      { ...req.body, password: hashPassword },
      columns
    )} returning *`;

    return res.status(200).json({
      success: true,
      message: "user created",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "internal server error",
      error: error,
    });
  }
};

export const login = async (req, res) => {
  try {
    //check user exist or not
    const isUser =
      await sql`select * from register where email=${req.body.email}`;

    if (isUser.length === 0) {
      return res.status(200).json({
        success: false,
        message: "Either email or password is wrong",
      });
    }

    //check is password correct or not
    const isPasswordCorrect = await bcrypt.compare(
      req.body.password,
      isUser[0].password
    );

    if (!isPasswordCorrect) {
      return res.status(200).json({
        success: false,
        message: "Either email or password is wrong",
      });
    }

    //generate token
    const token = jwt.sign({ id: isUser[0].id }, process.env.SECRET_KEY, {
      expiresIn: "1h",
    });

    return res.status(200).json({
      success: true,
      message: `welcome ${isUser[0].name}`,
      user: isUser[0],
      token,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      messsage: "internal server error",
      error,
    });
  }
};

//forgot password

export const forgotPassword = async (req, res) => {
  try {
    const isUser =
      await sql`select * from register where email=${req.body.email}`;

    //validation
    if (isUser.length == 0) {
      return res.status(200).json({
        success: false,
        message: "user doesn't exist",
      });
    }

    //create super secret key
    const SECRET = process.env.SECRET_KEY + isUser[0].password;
    //generate token
    const token = jwt.sign(
      { id: isUser[0].id, email: isUser[0].email },
      SECRET,
      {
        expiresIn: "15m",
      }
    );

    const link = `localhost:3000/${isUser[0].id}/${token}`;
    const subject = `link for reset password`;

    return res.status(200).json({
      success: true,
      message: "email has sent to mail",
      link,
    });
  } catch (error) {
    return res.status(500).json({
      error: error,
    });
  }
};

//reset password
export const resetPassword = async (req, res) => {
  try {
    //get params
    const { id, token } = req.params;

    //check user exist or not
    const isUser = await sql`select * from register where id=${id}`;

    //validation
    if (isUser.length == 0) {
      return res.status(200).json({
        success: false,
        message: "user doesn't exist",
      });
    }

    //create super secret key
    const SECRET = process.env.SECRET_KEY + isUser[0].password;

    //authenticate
    jwt.verify(token, SECRET, (error, decode) => {
      if (error) {
        return res.status(500).json({
          success: false,
          message: "jwt error",
          error: error,
        });
      }
      (req.body.id = decode.id), (req.body.email = decode.email);
    });

    //hashing new password
    const updatePassword = await bcrypt.hash(req.body.newpassword, 10);

    //updating password
    await sql`update register set password=${updatePassword} where id=${req.body.id}`;

    //sending response
    return res.status(200).json({
      success: true,
      message: "password has been reset",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "internal server error(reset password)",
      error: error,
    });
  }
};
