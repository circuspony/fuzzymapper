import { NextApiRequest, NextApiResponse } from "next"
import fs from 'fs';
import { connect } from '../../utils/database'
import { ObjectId } from "mongodb";

export default async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const { database } = await connect()
        const collection = database.collection('mapProjects')
        if (req.method === "GET") {
            const docs = await collection.find().toArray()
            res.status(200).json({ ok: true, data: { message: "worked", docs: docs } })
            return
        }
        else {
            res.status(204).json({ ok: false, data: { message: "method does not exist" } })
            return
        }
    } catch (error) {
        res.status(204).json({ ok: false, data: { message: error.message } })
        return
    }
}
