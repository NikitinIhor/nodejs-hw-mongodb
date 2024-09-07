import * as contactServices from "../services/contacts.js"
import createHttpError from "http-errors"

export const getAllContactsController = async (req, res) => {
    const data = await contactServices.getAllContacts()

    res.json({
        status: 200,
        message: "Successfully found contacts",
        data
    })

}

export const getContactByIdController = async (req, res) => {

    const { contactId } = req.params
    const data = await contactServices.getContactByID(contactId)

    if (!data) {
        throw createHttpError(404, `Contact with id=${contactId} nor found`)
    }

    res.json({
        status: 200,
        message: `Contact with ${contactId} successfully found`,
        data
    })

}

export const postContactController = async (req, res) => {
    const data = await contactServices.createContact(req.body)

    res.status(201).json({
        status: 201,
        message: "contact added successfully",
        data,
    })
};

export const upsertContactController = async (req, res) => {
    const { contactId } = req.params
    const { isNew, data } = await contactServices.updateContact({ _id: contactId },
        req.body, { upsert: true })

    const status = isNew ? 201 : 200

    res.status(status).json({
        status,
        message: "contact upsert successfully",
        data,
    })
};

export const patchContactController = async (req, res) => {
    const { contactId } = req.params

    const result = await contactServices.updateContact({ _id: contactId }, req.body)

    if (!result) {
        throw createHttpError(404, `Contact with id=${contactId} nor found`)
    }

    res.json({
        status: 200,
        message: "contact patched successfully",
        data: result.data,
    })
};

export const deleteContactController = async (req, res) => {
    const { contactId } = req.params

    const data = await contactServices.deleteContact({ _id: contactId })

    if (!data) {
        throw createHttpError(404, `Contact with id=${contactId} nor found`)
    }

    res.status(204).send()
};