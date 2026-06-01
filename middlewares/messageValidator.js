const { body } = require('express-validator');


const messageValidator = [

    body('name')
        .notEmpty().withMessage('O nome é obrigatório')
        .isLength({ min: 3 }).withMessage('O nome deve ter pelo menos 3 caracteres'),
    body('email')
        .notEmpty('O email é obrigatório!')
        .isEmail()
        .withMessage('Envie um e-mail válido!'),
    body('message')
        .notEmpty('Por favor, insira uma mensagem')
        .isLength({ min: 30, max: 150 })
        .withMessage('Sua mensagem deve ter no miníno 30 caracteres e no máximo 150'),
];

module.exports = messageValidator;