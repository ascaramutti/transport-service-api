import mongoose from "mongoose";
import {uri_local, uri_cloud} from '../atlas_uri.js';

export const connectDB = async () => {
    try {
        await mongoose.connect(uri_cloud);
        console.log(`Connected to MongoDB`);
    }
    catch(err) {
        console.log(`Connection failed ${err}`);
        process.exit(1);
    }
}