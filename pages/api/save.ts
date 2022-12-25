import { NextApiRequest, NextApiResponse } from "next"
import { connect } from '../../utils/database'
import { ObjectId } from "mongodb";

export default async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const { database } = await connect()
        const collection = database.collection('mapProjects')
        if (req.method === "POST") {
            const insertDoc = await collection.insertOne(req.body)
            const neededDoc = await collection.findOne({ _id: insertDoc.insertedId })
            res.status(200).json({ ok: true, data: { message: "worked", neededDoc: neededDoc } })
            return 
        }
        if (req.method === "PUT") {
            const updateDoc = await collection.updateOne(
                { _id: new ObjectId(req.body._id) },
                { $set: req.body.doc },
                { upsert: true }
            )
            const neededDoc = await collection.findOne({ _id: new ObjectId(req.body._id) })
            res.status(200).json({ ok: true, data: { message: "worked", neededDoc: neededDoc } })
            return
        }
        else {
            res.status(204).json({ ok: false, data: { message: "method does not exist" } })
            return
        }
    } catch (error) {
        console.log(error)
        res.status(204).json({ ok: false, data: { message: error.message } })
        return
    }
}
