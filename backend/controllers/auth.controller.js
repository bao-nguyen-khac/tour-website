import User from '../models/user.model.js';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';

//test controller
export const test = (req, res) => {
  return res.send('Xin chào từ Test!');
};

//signup controller
export const signupController = async (req, res) => {
  try {
    const { username, email, password, address, phone } = req.body;

    if (!username || !password || !address || !phone) {
      return res.status(200).send({
        success: false,
        message: 'Các trường bắt buộc: username, password, address, phone',
      });
    }

    const normalizedPhone = phone?.trim();
    if (!normalizedPhone) {
      return res.status(200).send({
        success: false,
        message: 'Số điện thoại không hợp lệ',
      });
    }

    const phoneExists = await User.findOne({ phone: normalizedPhone });
    if (phoneExists) {
      return res.status(200).send({
        success: false,
        message: 'Số điện thoại đã được đăng ký, vui lòng đăng nhập',
      });
    }

    if (email) {
      const normalizedEmail = email.trim().toLowerCase();
      const emailExists = await User.findOne({ email: normalizedEmail });
      if (emailExists) {
        return res.status(200).send({
          success: false,
          message: 'Email đã được đăng ký, vui lòng dùng email khác hoặc để trống',
        });
      }
    }

    const hashedPassword = bcryptjs.hashSync(password, 10);
    const newUser = new User({
      username,
      email: email?.trim() || undefined,
      password: hashedPassword,
      address,
      phone: normalizedPhone,
    });

    await newUser.save();

    return res.status(201).send({
      message: 'Tạo người dùng thành công',
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: 'Lỗi máy chủ!',
    });
  }
};

//login controller
export const loginController = async (req, res) => {
  try {
    const { phone, password } = req.body;

    if (!phone || !password) {
      return res.status(200).send({
        success: false,
        message: 'Các trường bắt buộc: phone, password',
      });
    }

    const normalizedPhone = phone.trim();
    const validUser = await User.findOne({ phone: normalizedPhone });
    if (!validUser) {
      return res.status(404).send({
        success: false,
        message: 'Không tìm thấy người dùng với số điện thoại này!',
      });
    }
    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) {
      return res.status(200).send({
        success: false,
        message: 'Số điện thoại hoặc mật khẩu không hợp lệ',
      });
    }

    const token = await jwt.sign(
      { id: validUser._id },
      process.env.JWT_SECRET,
      {
        expiresIn: '4d',
      }
    );
    const { password: pass, ...rest } = validUser._doc; //deselcting password to send user(this will send all data accept password)
    res.status(200).send({
      success: true,
      message: 'Đăng nhập thành công',
      user: rest,
      token, // trả về token
    });
  } catch (error) {
    console.log(error);
  }
};

export const logOutController = (req, res) => {
  try {
    res.clearCookie('access_token');
    res.status(200).send({
      success: true,
      message: 'Đăng xuất thành công',
    });
  } catch (error) {
    console.log(error);
  }
};
