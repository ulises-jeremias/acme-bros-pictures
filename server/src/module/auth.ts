const passport = require('koa-passport');
const passportLocal = require('passport-local');

const LocalStrategy = passportLocal.Strategy;

import { getRepository, Equal } from 'typeorm';
import { User } from '../entity/User';

const fetchUser = (() => {
    // Here settings could be used once
    return async function(username: string): Promise<User> {
        const userRepository = getRepository(User);
        const user = await userRepository.findOne({ username: Equal(username) });
        return user;
    };
})();

passport.serializeUser((user: User, done: any) => {
    done(null, user.username);
});

passport.deserializeUser(async (username: string, done: any) => {
    try {
      const user = await fetchUser(username);
      done(null, user);
    } catch (err) {
      done(err);
    }
});

passport.use(new LocalStrategy(function(username: string, password: string, done: any) {
    fetchUser(username)
        .then(user => {
            if (password === user.password) {
                done(null, user);
            } else {
                done(null, false);
            }
        })
        .catch(err => {
            done(err);
        });
}));
