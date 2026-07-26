const User = require('../models/user');

// REGISTER
const register = async (req, res) => {

  if (!req.body.name || !req.body.email || !req.body.password) {
    return res.status(400).json({ message: 'All fields required' });
  }

  try {

    const user = new User();
    user.name = req.body.name;
    user.email = req.body.email;

    user.setPassword(req.body.password);

    await user.save();

    const token = user.generateJWT();

    return res.status(200).json({ token });

  } catch (err) {
    return res.status(400).json(err);
  }
};


// LOGIN (CLEAN VERSION - NO PASSPORT)
const login = async (req, res) => {

  if (!req.body.email || !req.body.password) {
    return res.status(400).json({ message: 'All fields required' });
  }

  try {

    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    if (!user.validPassword(req.body.password)) {
      return res.status(401).json({ message: 'Wrong password' });
    }

    const token = user.generateJWT();

    return res.status(200).json({ token });

  } catch (err) {
  console.log("🔥 LOGIN ERROR:", err);
  return res.status(500).json({
    message: err.message,
    stack: err.stack
  });
}
};

module.exports = {
  register,
  login
};