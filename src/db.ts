import { IMonkManager, ICollection } from "monk";
import * as monk from 'monk';
import * as dotenv from 'dotenv';

dotenv.config();

const db: IMonkManager = monk.default(process.env.MONGO_URI ?? '')

const urls: ICollection = db.get('urls')
urls.createIndex({"slug": 1}, {unique: true})

export default urls;

