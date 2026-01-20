const crypto = require("crypto");

const users = [];

function createUser({username, password, name, image}) {
    let finalUsername = username.trim();
    if (users.some((user) => user.username === finalUsername)) {
        throw new Error("Username already exists.");
    }
    if (password.length < 8) {
        throw new Error("Password must be at least 8 characters long.");
    }
    
    let id;
    do {
        id = crypto.randomUUID();
    } while (users.some((user) => user.id === id));
    const newUser = {
        id,
        username: finalUsername,
        password,
        name,
        image,
    };
    users.push(newUser);
    return newUser;
}

function getUserById(id) {
    return users.find((user) => user.id === id) || null;
}

function findUserByCredentials(username, password) {
    return users.find((user) => user.username === username && user.password === password) || null;
}   

function getUserId(username) {
  const user = users.find(u => u.username === username);
  return user?.id;
}

module.exports = {
    createUser,
    getUserById,
    findUserByCredentials,
    getUserId,
};