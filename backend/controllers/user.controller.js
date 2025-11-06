import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";

//update uset details
export const updateUser = async (req, res) => {
  if (req.user.id !== req.params.id) {
    return res.status(401).send({
      success: false,
      message: "Bạn chỉ có thể cập nhật tài khoản của mình, vui lòng đăng nhập lại!",
    });
  }
  //   console.log(req.body.phone);

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          address: req.body.address,
          phone: req.body.phone,
        },
      },
      { new: true }
    );

    const { password: pass, ...rest } = updatedUser._doc;

    res.status(201).send({
      success: true,
      message: "Cập nhật thông tin người dùng thành công",
      user: rest,
    });
  } catch (error) {
    if (error.code === 11000) {
      res.status(200).send({
        success: true,
        message: "Email đã được sử dụng, vui lòng đăng nhập!",
      });
    }
  }
};

//update user profile photo
export const updateProfilePhoto = async (req, res) => {
  try {
    if (req.user.id !== req.params.id) {
      return res.status(401).send({
        success: false,
        message:
          "Bạn chỉ có thể cập nhật ảnh hồ sơ của tài khoản mình, vui lòng đăng nhập lại!",
      });
    }

    const updatedProfilePhoto = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          avatar: req.body.avatar,
        },
      },
      { new: true }
    );

    const validUser = await User.findById(req.params.id);
    const { password: pass, ...rest } = validUser._doc;

    if (updatedProfilePhoto) {
      return res.status(201).send({
        success: true,
        message: "Cập nhật ảnh hồ sơ thành công",
        user: rest,
      });
    } else {
      return res.status(500).send({
        success: false,
        message: "Đã xảy ra lỗi",
      });
    }
  } catch (error) {
    console.log(error);
  }
};

// update user password
export const updateUserPassword = async (req, res) => {
  try {
    if (req.user.id !== req.params.id) {
      return res.status(401).send({
        success: false,
        message:
          "Bạn chỉ có thể cập nhật mật khẩu tài khoản mình, vui lòng đăng nhập lại!",
      });
    }

    const validUser = await User.findById(req.params.id);

    if (!validUser) {
      return res.status(404).send({
        success: false,
        message: "Không tìm thấy người dùng!",
      });
    }

    const oldPassword = req.body.oldpassword;
    const newPassword = req.body.newpassword;

    const validPassword = bcryptjs.compareSync(oldPassword, validUser.password);
    if (!validPassword) {
      return res.status(200).send({
        success: false,
        message: "Mật khẩu không hợp lệ",
      });
    }

    const updatedHashedPassword = bcryptjs.hashSync(newPassword, 10);
    const updatedPassword = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          password: updatedHashedPassword,
        },
      },
      { new: true }
    );

    return res.status(201).send({
      success: true,
      message: "Cập nhật mật khẩu thành công",
    });
  } catch (error) {
    console.log(error);
  }
};

//delete user
export const deleteUserAccount = async (req, res, next) => {
  if (req.user.id !== req.params.id)
    return res.status(401).send({
      success: false,
      message: "Bạn chỉ có thể xóa tài khoản của mình!",
    });
  try {
    await User.findByIdAndDelete(req.params.id);
    res.clearCookie("access_token"); //clear cookie before sending json
    res.status(200).send({
      success: true,
      message: "Tài khoản người dùng đã được xóa!",
    });
  } catch (error) {
    console.log(error);
  }
};

//get all users admin
export const getAllUsers = async (req, res) => {
  try {
    const searchTerm = req.query.searchTerm || "";
    const users = await User.find({
      user_role: 0,
      $or: [
        { username: { $regex: searchTerm, $options: "i" } },
        { email: { $regex: searchTerm, $options: "i" } },
        { phone: { $regex: searchTerm, $options: "i" } },
      ],
    });
    if (users && users.length > 0) {
      res.send(users);
    } else {
      res.status(200).send({
        success: false,
        message: "Chưa có người dùng nào!",
      });
    }
  } catch (error) {
    console.log(error);
  }
};

//delete user admin
export const deleteUserAccountAdmin = async (req, res, next) => {
  try {
    await User.findByIdAndDelete(req?.params?.id);
    res.status(200).send({
      success: true,
      message: "Tài khoản người dùng đã được xóa!",
    });
  } catch (error) {
    console.log(error);
  }
};
