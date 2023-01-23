// import getPosts from './get-posts';
import registerUser from './endpoints/registerUser';
import getUsers from './endpoints/getUsers';
import loginUser from './endpoints/loginUser';
// import updatePost from './update-post';
// import deletePost from './delete-post';
// import likePost from './like-post';
// import disLikePost from './dislike-post';

export default {
    paths: {
        '/users': {
            ...getUsers,
        },
        '/users/register': {
            ...registerUser
        },
        '/users/login': {
            ...loginUser
        }
        // '/posts/{id}': {
        //     //     ...getTodo,
        //     ...updatePost,
        //     ...deletePost
        // },
        // '/posts/{id}/likePost': {
        //     ...likePost,
        // },
        // '/posts/{id}/disLikePost': {
        //     ...disLikePost,
        // }
    }
}