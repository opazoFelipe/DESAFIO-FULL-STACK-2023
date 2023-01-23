import userFieldsSchema from './userFieldsSchema';
import userResponseSchema from './userResponseSchema';
import createUserSchema from './createUserSchema';
import loginUserSchema from './loginUserSchema';

export default {
    ...userFieldsSchema,
    ...createUserSchema,
    ...userResponseSchema,
    ...loginUserSchema,
}