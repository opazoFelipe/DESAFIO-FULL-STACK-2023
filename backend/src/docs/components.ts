import sharedSchemas from './shared/schemas';
import userSchemas from './user/schemas';

export default {
    components: {
        schemas: {
            ...sharedSchemas,
            ...userSchemas
        }
    },
}