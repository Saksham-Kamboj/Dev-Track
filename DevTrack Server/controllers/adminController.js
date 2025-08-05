import User from '../models/User.js';
import Task from '../models/Task.js';

// Get dashboard stats
export const getDashboard = async (req, res) => {
  try {
    const totalDevelopers = await User.countDocuments({ role: 'developer' });
    const totalTasks = await Task.countDocuments();
    const completedTasks = await Task.countDocuments({ status: 'completed' });
    const pendingTasks = await Task.countDocuments({ status: 'pending' });

    res.json({
      stats: {
        totalDevelopers,
        totalTasks,
        completedTasks,
        pendingTasks
      }
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all tasks
export const getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find().populate('developer', 'name email');
    res.json({ tasks });
  } catch (error) {
    console.error('Get all tasks error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all users (both admin and developer)
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');

    // Format users for frontend
    const formattedUsers = users.map(user => ({
      id: user._id,
      userId: `USR-${user._id.toString().slice(-6).toUpperCase()}`,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      status: user.status,
      joinDate: user.createdAt ? user.createdAt.toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      lastLogin: user.lastLogin ? user.lastLogin.toISOString() : null,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`
    }));

    res.json({
      success: true,
      users: formattedUsers
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Create user (admin or developer)
export const createUser = async (req, res) => {
  try {
    const { name, email, password, role, phone } = req.body;

    // Validate input
    if (!name || !email || !password || !role || !phone) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, password, phone and role are required'
      });
    }

    // Validate role
    if (!['admin', 'developer'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Role must be either admin or developer'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Create new user
    const user = new User({
      name,
      email,
      password,
      role,
      phone
    });

    await user.save();

    // Format user response
    const formattedUser = {
      id: user._id,
      userId: `USR-${user._id.toString().slice(-6).toUpperCase()}`,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      status: user.status,
      joinDate: user.createdAt.toISOString().split('T')[0],
      lastLogin: null, // New users haven't logged in yet
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`
    };

    res.status(201).json({
      success: true,
      message: `${role.charAt(0).toUpperCase() + role.slice(1)} created successfully`,
      user: formattedUser
    });
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Update user
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, role, phone, status } = req.body;

    // Validate input
    if (!name || !email || !role) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and role are required'
      });
    }

    // Validate role
    if (!['admin', 'developer'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Role must be either admin or developer'
      });
    }

    // Validate status if provided
    if (status && !['active', 'inactive'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status must be either active or inactive'
      });
    }

    // Find user
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if email is being changed and if it already exists
    if (email !== user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'User with this email already exists'
        });
      }
    }

    // Update user
    user.name = name;
    user.email = email;
    user.role = role;
    if (phone !== undefined) user.phone = phone;
    if (status !== undefined) user.status = status;

    await user.save();

    // Format user response
    const formattedUser = {
      id: user._id,
      userId: `USR-${user._id.toString().slice(-6).toUpperCase()}`,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      status: user.status,
      joinDate: user.createdAt.toISOString().split('T')[0],
      lastLogin: user.lastLogin ? user.lastLogin.toISOString() : null,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`
    };

    res.json({
      success: true,
      message: 'User updated successfully',
      user: formattedUser
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Delete user
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Find user
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Prevent deleting the current admin user (optional safety check)
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete your own account'
      });
    }

    // Delete user
    await User.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Get user by ID
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id).select('-password');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Format user response
    const formattedUser = {
      id: user._id,
      userId: `USR-${user._id.toString().slice(-6).toUpperCase()}`,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      status: user.status,
      joinDate: user.createdAt.toISOString().split('T')[0],
      lastLogin: user.lastLogin ? user.lastLogin.toISOString() : null,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`
    };

    res.json({
      success: true,
      user: formattedUser
    });
  } catch (error) {
    console.error('Get user by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};
