const { query } = require('../../database/connection');
const { hashPassword, comparePassword, generateToken } = require('../../utils/auth');

class UserService {
  async createUser(userData) {
    const { email, password, name, phone = null, role = 'visitor', address = null, gender = null, birthdate = null } = userData;

    // Normalize role: accept both 'user' and 'visitor', normalize to 'visitor'
    const normalizedRole = (role === 'user' || role === 'visitor') ? 'visitor' : role;

    const existingUser = await query(
      'SELECT user_id FROM USER WHERE email = ?',
      [email]
    );

    if (existingUser.length > 0) {
      const error = new Error('Email already registered');
      error.statusCode = 400;
      throw error;
    }

    const hashedPassword = await hashPassword(password);

    // Insert into USER table
    const userResult = await query(
      'INSERT INTO USER (email, password, name, phone, role) VALUES (?, ?, ?, ?, ?)',
      [email, hashedPassword, name, phone, normalizedRole]
    );

    const userId = userResult.insertId;

    // If role is visitor, create visitor record
    if (normalizedRole === 'visitor') {
      await query(
        'INSERT INTO VISITOR (address, gender, birthdate, USER_user_id) VALUES (?, ?, ?, ?)',
        [address, gender, birthdate, userId]
      );
    }

    const users = await query(
      'SELECT user_id as id, email, name, role FROM USER WHERE user_id = ?',
      [userId]
    );

    return users[0];
  }

  async authenticateUser(email, password) {
    console.log('Authenticating user with email:', email);
    const users = await query(
      'SELECT user_id as id, email, password, name, role FROM USER WHERE email = ?',
      [email]
    );
    console.log(users)
    if (users.length === 0) {
      const error = new Error('Invalid credentials');
      error.statusCode = 401;
      throw error;
    }

    const user = users[0];
    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
      const error = new Error('Invalid credentials');
      error.statusCode = 401;
      throw error;
    }

    // Prepare token payload
    const tokenPayload = {
      userId: user.id,
      email: user.email,
      role: user.role
    };

    // If user is a visitor, fetch and include visitor_id in token
    if (user.role === 'visitor') {
      const visitors = await query(
        'SELECT visitor_id FROM VISITOR WHERE USER_user_id = ?',
        [user.id]
      );

      if (visitors.length > 0) {
        tokenPayload.visitorId = visitors[0].visitor_id;
      }
    }

    const token = generateToken(tokenPayload);

    const { password: _, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      token
    };
  }

  async getUserById(userId) {
    const users = await query(
      'SELECT user_id as id, email, name, role FROM USER WHERE user_id = ?',
      [userId]
    );

    if (users.length === 0) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }

    return users[0];
  }

  async getAllUsers(page = 1, limit = 10) {
    const offset = (page - 1) * limit;

    const users = await query(
      'SELECT user_id as id, email, name, role FROM USER LIMIT ? OFFSET ?',
      [limit, offset]
    );

    const [countResult] = await query('SELECT COUNT(*) as total FROM USER');

    return {
      data: users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: countResult.total,
        pages: Math.ceil(countResult.total / limit)
      }
    };
  }

  async updateUser(userId, userData) {
    const { name, email, role } = userData;

    const existingUser = await query(
      'SELECT user_id FROM USER WHERE user_id = ?',
      [userId]
    );

    if (existingUser.length === 0) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }

    if (email) {
      const emailExists = await query(
        'SELECT user_id FROM USER WHERE email = ? AND user_id != ?',
        [email, userId]
      );

      if (emailExists.length > 0) {
        const error = new Error('Email already in use');
        error.statusCode = 400;
        throw error;
      }
    }

    const updates = [];
    const values = [];

    if (name) {
      updates.push('name = ?');
      values.push(name);
    }

    if (email) {
      updates.push('email = ?');
      values.push(email);
    }

    if (role) {
      updates.push('role = ?');
      values.push(role);
    }

    if (updates.length === 0) {
      return await this.getUserById(userId);
    }

    values.push(userId);

    await query(
      `UPDATE USER SET ${updates.join(', ')} WHERE user_id = ?`,
      values
    );

    return await this.getUserById(userId);
  }

  async deleteUser(userId) {
    const existingUser = await query(
      'SELECT user_id FROM USER WHERE user_id = ?',
      [userId]
    );

    if (existingUser.length === 0) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }

    await query('DELETE FROM USER WHERE user_id = ?', [userId]);

    return { message: 'User deleted successfully' };
  }
}

module.exports = new UserService();
