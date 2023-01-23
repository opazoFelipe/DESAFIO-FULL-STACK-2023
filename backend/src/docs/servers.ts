import { environment } from "../environment";

export default {
    servers: [
        {
            url: environment.DEVELOPMENT_HOST, // url
            description: "Local server", // name
        },
    ],
};
