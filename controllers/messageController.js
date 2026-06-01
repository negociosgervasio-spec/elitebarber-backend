const Message = require("../models/Message");

const { validationResult } = require('express-validator');

exports.createMessage = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const message = new Message({ ...req.body });
        await message.save();

        res.status(201).json({ message: "Mensagem enviada com sucesso!" });
    } catch (error) {
        res.status(500).json({ error: "Erro do servidor!" })
    }
};