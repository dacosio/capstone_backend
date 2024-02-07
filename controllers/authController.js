const User = require("../models/User");
const Merchant = require("../models/Merchant");
const Consumer = require("../models/Consumer");
const bcrypt = require("bcryptjs");
const { validateEmail, validateLength } = require("../helpers/validation");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  try {
    //role has to either be consumer or merchant
    const { email, password, firstName, lastName, role } = req.body;

    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({ message: "Please provide all fields" });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({ message: "Invalid email address." });
    }

    const check = await User.findOne({ email }).lean().exec();

    if (check) {
      return res.status(400).json({
        message:
          "The email address already exists, try with a different email address.",
      });
    }

    if (!validateLength(password, 6, 30)) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = await User.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      role,
    });

    if (newUser)
      res.status(201).json({
        message: `New user ${newUser.email} created`,
        userId: newUser._id,
        role: newUser.role,
      });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const foundUser = await User.findOne({ email }).exec();
    if (!foundUser) {
      return res.status(401).json({ message: "Email does not exists." });
    }

    const match = await bcrypt.compare(password, foundUser.password);

    if (!match)
      return res.status(401).json({ message: "Password is incorrect." });
    const accessToken = jwt.sign(
      {
        UserInfo: {
          id: foundUser._id,
          email: foundUser.email,
          role: foundUser.role,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "5d" }
    );

    const refreshToken = jwt.sign(
      { email: foundUser.email },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "30d" }
    );

    res.json({
      accessToken,
      refreshToken,
      firstName: foundUser.firstName,
      lastName: foundUser.lastName,
      role: foundUser.role,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const refresh = (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) return res.status(401).json({ message: "Unauthorized" });

    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      async (err, decoded) => {
        if (err) return res.status(403).json({ message: "Forbidden" });

        const foundUser = await User.findOne({
          email: decoded.email,
        }).exec();

        if (!foundUser)
          return res.status(401).json({ message: "Unauthorized" });

        const accessToken = jwt.sign(
          {
            UserInfo: {
              id: foundUser._id,
              email: foundUser.email,
              role: foundUser.role,
            },
          },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: "1d" }
        );

        res.json({
          accessToken,
          firstName: foundUser.firstName,
          lastName: foundUser.lastName,
          role: foundUser.role,
        });
      }
    );
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const logout = (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204); //No content
  res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
  res.json({ message: "Cookie cleared" });
};

const changePassword = async (req, res) => {
  try {
    const { email, currentPassword, newPassword } = req.body;

    if (!email || !currentPassword || !newPassword) {
      return res.status(400).json({ message: "Please provide all fields" });
    }
    const user = await User.findOne({ email }).exec();
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const match = await bcrypt.compare(currentPassword, user.password);

    if (!match) {
      return res
        .status(401)
        .json({ message: "Unauthorized: Password does not match" });
    }

    if (match) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);
      user.password = hashedPassword;
    }

    const updatedUser = await user.save();
    if (updatedUser)
      res
        .status(200)
        .json({ message: `Password for ${user.email} has been updated` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addMerchant = async (req, res) => {
  try {
    const { name, description, address, opening, closing, isVerified, userId } =
      req.body;

    if (
      !name ||
      !address ||
      !opening ||
      !closing ||
      typeof isVerified !== "boolean" ||
      !userId
    ) {
      return res
        .status(400)
        .json({ message: "Missing required fields in the request body" });
    }

    const existingUser = await User.findOne({ _id: userId });
    if (!existingUser) {
      return res
        .status(400)
        .json({ message: "User with the provided userId does not exist" });
    }
    const newMerchant = await Merchant.create({
      name,
      description,
      address,
      opening,
      closing,
      isVerified,
      user: userId,
    });
    if (newMerchant) {
      res
        .status(201)
        .json({ message: "Merchant added successfully", newMerchant });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addConsumer = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    const existingUser = await User.findOne({ _id: userId });
    if (!existingUser) {
      return res
        .status(400)
        .json({ message: "User with the provided userId does not exist" });
    }

    const newConsumer = await Consumer.create({ user: userId });

    res
      .status(201)
      .json({ message: "Consumer added successfully", newConsumer });
  } catch (error) {
    // Handle any errors during consumer creation
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  register,
  login,
  refresh,
  logout,
  changePassword,
  addMerchant,
  addConsumer,
};
