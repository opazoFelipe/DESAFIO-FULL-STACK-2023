import basicInfo from './basicInfo';
import servers from './servers';
import components from './components';
import tags from './tags';
import users from './user';

export default {
    ...basicInfo,
    ...servers,
    ...components,
    ...tags,
    ...users
};