const axios = require('axios');

const getUserIdByUsername = async (username) => {
  try {
    const response = await axios.get('http://localhost:3000/users', {
      params: {
        username: username,
      },
    });

    const user = response.data.find((user) => user.username === username);
    if (user) {
      return user.userId;
    } else {
      throw new Error('User not found');
    }
  } catch (error) {
    throw new Error('Failed to retrieve user ID');
  }
};

module.exports = getUserIdByUsername;