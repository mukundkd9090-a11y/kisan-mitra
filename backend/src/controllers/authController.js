const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../prisma');
const { JWT_SECRET } = require('../middleware/auth');

const signup = async (req, res) => {
  try {
    const { fullName, mobile, email, password, role = 'FARMER', state, district, village, adminCode } = req.body;

    if (!fullName || !mobile || !password || !state || !district) {
      return res.status(400).json({ message: 'Please provide all mandatory fields.' });
    }

    // Admin role requires secret code
    const requestedRole = (role || 'FARMER').toString().toUpperCase() === 'ADMIN' ? 'ADMIN' : 'FARMER';
    if (requestedRole === 'ADMIN') {
      const expectedCode = process.env.ADMIN_SECRET || 'KISANMITRA_ADMIN2026';
      if (!adminCode || adminCode !== expectedCode) {
        return res.status(403).json({ message: 'Invalid Admin Secret Code. Contact Directorate for officer registration.' });
      }
    }

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { mobile: mobile },
          ...(email ? [{ email: email }] : [])
        ]
      }
    });

    if (existingUser) {
      return res.status(400).json({ message: 'User with this mobile number or email already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        fullName,
        mobile,
        email: email || null,
        password: hashedPassword,
        role: requestedRole,
        state,
        district,
        village: village || ''
      },
      select: {
        id: true,
        fullName: true,
        mobile: true,
        email: true,
        role: true,
        state: true,
        district: true,
        village: true,
        createdAt: true
      }
    });

    const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

    // Send welcome notification
    await prisma.notification.create({
      data: {
        userId: user.id,
        title: 'Welcome to KisanMitra!',
        titleHi: 'किसानमित्र में आपका स्वागत है!',
        message: 'Your account has been registered successfully. You can now book digital procurement tokens.',
        messageHi: 'आपका खाता सफलतापूर्वक पंजीकृत हो गया है। अब आप डिजिटल टोकन बुक कर सकते हैं।',
        type: 'TOKEN'
      }
    });

    res.status(201).json({
      message: 'Account created successfully',
      user,
      token
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Internal server error during registration.' });
  }
};

const login = async (req, res) => {
  try {
    const { identifier, password } = req.body; // mobile or email

    if (!identifier || !password) {
      return res.status(400).json({ message: 'Mobile/Email and password are required.' });
    }

    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { mobile: identifier },
          { email: identifier }
        ]
      }
    });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials. User not found.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials. Incorrect password.' });
    }

    const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

    const safeUser = {
      id: user.id,
      fullName: user.fullName,
      mobile: user.mobile,
      email: user.email,
      role: user.role,
      state: user.state,
      district: user.district,
      village: user.village
    };

    res.json({
      message: 'Logged in successfully',
      user: safeUser,
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error during login.' });
  }
};

const getMe = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        fullName: true,
        mobile: true,
        email: true,
        role: true,
        state: true,
        district: true,
        village: true,
        createdAt: true
      }
    });

    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving user profile.' });
  }
};

const demoLogin = async (req, res) => {
  try {
    const { type = 'farmer' } = req.query; // 'farmer' or 'admin'
    
    let targetUser;
    if (type === 'admin') {
      targetUser = await prisma.user.findFirst({ where: { role: 'ADMIN' } });
    } else {
      targetUser = await prisma.user.findFirst({ where: { role: 'FARMER' } });
    }

    if (!targetUser) {
      return res.status(404).json({ message: 'Demo user not seeded yet.' });
    }

    const token = jwt.sign({ userId: targetUser.id, role: targetUser.role }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      message: `Logged in as demo ${targetUser.role.toLowerCase}`,
      user: {
        id: targetUser.id,
        fullName: targetUser.fullName,
        mobile: targetUser.mobile,
        email: targetUser.email,
        role: targetUser.role,
        state: targetUser.state,
        district: targetUser.district,
        village: targetUser.village
      },
      token
    });
  } catch (error) {
    console.error('Demo login error:', error);
    res.status(500).json({ message: 'Error during demo login.' });
  }
};

module.exports = {
  signup,
  login,
  getMe,
  demoLogin
};
