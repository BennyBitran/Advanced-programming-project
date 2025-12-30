const {findUserByCredentials} = require('../models/users');

function createToken(req, res) {
    const {username, password} = req.body || {};
    if(typeof username !== 'string' || username.trim() === '') {
        return res.status(400).json({error: 'Invalid or missing username'});
    }
    if(typeof password !== 'string' || password.trim() === '') {
        return res.status(400).json({error: 'Invalid or missing password'});
    }

    const user = findUserByCredentials(username, password);
    if(!user) {
        return res.status(401).json({error: 'Invalid username or password'});
    }
    // for now, the token is just the user ID, it will change in the next part
    return res.status(200).json({ id: user.id});
}
module.exports = {
    createToken,
};