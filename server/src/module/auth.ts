const passport = require('koa-passport');
const { Strategy: LocalStrategy } = require('passport-local');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');

import { getRepository, Equal } from 'typeorm';
import { User } from '../entity/User';
import config from '../config';

type SerializeUserFn<TID> = (err: any, id?: TID) => void;
type DeserializeUserFn<TUser> = (err: any, user?: TUser) => void;
type LocalStrategyFn<TUser> = (err: any, user?: boolean|TUser) => void;

const localOptions = {
    usernameField: 'username',
    passwordField: 'password',
};

const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('jwt'),
    secretOrKey: config.session.secret,
};

const fetchUser = (() => {
    // Here settings could be used once
    return async function(username: string): Promise<User> {
        const userRepository = getRepository(User);
        const user = await userRepository.findOne({ username: Equal(username) });
        return user;
    };
})();

passport.serializeUser((user: User, done: SerializeUserFn<string>) => {
    done(null, user.username);
});

passport.deserializeUser(async (username: string, done: DeserializeUserFn<User>) => {
    try {
      const user = await fetchUser(username);
      done(null, user);
    } catch (err) {
      done(err);
    }
});

passport.use(new LocalStrategy(localOptions, async (username: string, password: string, done: LocalStrategyFn<User>) => {
    try {
        const user = await fetchUser(username);
        if (!user) {
            done(null, false);
        }

        const checked = await user.checkPassword(password);
        if (checked) {
            done(null, user);
        } else {
            done(null, false);
        }
    } catch (err) {
        done(err);
    }
}));

passport.use(new JwtStrategy(jwtOptions, async (jwtPayload: { user: string }, done: LocalStrategyFn<User>) => {
    try {
        const user = await fetchUser(jwtPayload.user);

        if (user) {
            done(null, user);
        } else {
            done(null, false);
        }
    } catch (err) {
        done(err);
    }
}));

export default passport;
