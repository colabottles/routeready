import { auth } from './../utils/auth/auth';

const response = await auth.api.signInEmail({
    body: {
        email,
        password,
    },
    asResponse: true
});