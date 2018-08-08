const bcrypt = require('bcrypt');
const saltRounds = 10;
const password = 'password';
const otherPassword = 'now_password';

bcrypt.hash(password, saltRounds)
    .then(hash => {
        console.log(hash);
        bcrypt.compare(otherPassword, hash)
            .then(res => console.log(res))
    });