import mongoose from "mongoose";
import {uri_local} from '../atlas_uri.js';

export const connectDB = async () => {
    try {
        await mongoose.connect(uri_local);
        console.log(`Connected to MongoDB`);
    }
    catch(err) {
        console.log(`Connection failed ${err}`);
        process.exit(1);
    }
}