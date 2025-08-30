const bcrypt = require('bcryptjs');

// This script will be used to update the production user data
// We need to create an API endpoint to run this on the production server

const correctPasswordHash = '$2b$12$ZUUGh6AbiY5PiKjnVJzGkex08T5JsdmfMkXLSUonCAFRYnqOz8tay';

console.log('Correct password hash for test123:', correctPasswordHash);
console.log('Verification:', bcrypt.compareSync('test123', correctPasswordHash));

// This will be used in the API endpoint
module.exports = {
  correctPasswordHash,
  updateTestUserPassword: (users) => {
    return users.map(user => {
      if (user.email === 'test@test.com') {
        return {
          ...user,
          password: correctPasswordHash
        };
      }
      return user;
    });
  }
};
