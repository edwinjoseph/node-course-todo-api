const mongoose = require('mongoose');
const { isEmail } = require('validator');
const jwt = require('jsonwebtoken');
const pick = require('lodash/pick');

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        minLength: 1,
        trim: true,
        unique: true,
        validate: {
            validator: isEmail,
            message: '{VALUE} is not a valid email address'
        }
    },
    password: {
        type: String,
        required: true,
        minLength: 8,
    },
    tokens: [{
        access: {
            type: String,
            required: true,
        },
        token: {
            type: String,
            required: true,
        }
    }]
});

UserSchema.methods = {
    toJSON: function () {
      let user = this;
      let userObject = user.toObject();

      return pick(userObject, ['_id', 'email']);
    },
    generateAuthToken: function () {
        let user = this;
        const access = 'auth';
        const token = jwt.sign({ _id: user._id.toHexString(), access }, 'oaKdl9Elgj');

        // Use concat as push acts differently across different versions of mongoose
        user.tokens = user.tokens.concat([{ access, token }]);
        return user.save().then(() => {
            return token;
        });
    }
};

const User = mongoose.model('user', UserSchema);

module.exports = User;
