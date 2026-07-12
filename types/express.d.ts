import DecodedObj from "../src/middleware/auth.js";


declare global {  //we are saying , this is globally available type modification for the whole project , 
    namespace Express {   // this means that if you declare any interface with same name again then it wont get replace , its get merged
        interface Request {
            user?: DecodedObj;
        }
    }
}

export {}; // make this file as a module . without it , ts assumes that it is a script and the global declaration wont work fine