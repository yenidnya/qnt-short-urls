import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import * as yup from "yup";
import { nanoid } from 'nanoid';
import urls from "./db"

const app: Application = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

const schema = yup.object().shape({
    dest: yup.string().trim().url().required(),
    slug: yup.string().trim(),
});

app.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    try {
        const url = await urls.findOne({slug: id})
        if (url){
            res.json({"url" : url })
        }else {
            res.status(404).json({msg: "Unable to find url"})
        }
    } catch (error) {
        next(error)
    }
});

app.post("/create", async (req: Request, res: Response, next: NextFunction) => {
    let {slug, dest} = req.body;

    try {
        await schema.validate({dest, slug});
        if (!slug) {
            slug = nanoid(5).toLowerCase();
        }
        slug = slug.toLowerCase();
        const created = await urls.insert({slug, dest});
        res.json(created);
    } catch (error) {
        if (error.message.startsWith("E11000")){
            error.message = "Slug is in use"
            next(error)
        }else{
            next(error)
        }
    }
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    if (err) {
        res.status(400).send({msg: "Invalid Request", code: err.message});
    } else {
        next();
    }
});

app.listen(5000, () => {
    console.log("running at 5000");
});
