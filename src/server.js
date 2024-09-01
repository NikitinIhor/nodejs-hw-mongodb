import express from "express"
import cors from "cors"
import pino from "pino-http"
import { env } from "./utils/env.js"
import * as contactServices from "./services/contacts.js"

const port = Number(env("PORT", 3000))

export const setupServer = () => {
    const app = express()

    const logger = pino({
        transport: {
            target: "pino-pretty"
        }
    })

    app.use(logger)
    app.use(cors())
    app.use(express.json())

    app.get("/contacts", async (req, res) => {
        const data = await contactServices.getAllContacts()

        res.json({
            status: 200,
            message: "Seccessfully found contacts",
            data
        })
    })
    app.get("/contacts/:contactId", async (req, res) => {
        const id = req.params
        const data = await contactServices.getContactByID(id)

        if (!data) {
            return res.status(400).json({
                message: `Contact with ${id} nor found`
            })
        }

        res.json({
            status: 200,
            message: `Contact with ${id} seccessfully found`,
            data
        })
    })

    app.use((req, res) => {
        res.status(404).json({
            message: `${req.url} not found`
        })
    })

    app.use((req, res, error) => {
        res.status(500).json({
            message: error.message
        })
    })
    app.listen(port, () => console.log("Server is running on port 3000"))
};
