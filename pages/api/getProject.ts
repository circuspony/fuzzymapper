import { NextApiRequest, NextApiResponse } from "next"
import { connect } from '../../utils/database'
import { ObjectId } from "mongodb";

export default async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const { database } = await connect()
        const collection = database.collection('mapProjects')
        if (req.method === "GET") {
            const neededDoc = await collection.findOne({ _id: new ObjectId(req.query.id.toString()) })
            res.status(200).json({ ok: true, data: { message: "worked", neededDoc: neededDoc } })
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
