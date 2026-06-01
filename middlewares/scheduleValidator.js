const { body } = require('express-validator');

const scheduleValidator = [
    body('name')
        .notEmpty().withMessage('O nome é obrigatório')
        .isLength({ min: 3 }).withMessage('O nome deve ter pelo menos 3 caracteres'),

    body('phone')
        .notEmpty().withMessage('O telefone é obrigatório')
        .matches(/^[0-9]{10,11}$/).withMessage('Telefone deve conter apenas números com 10 ou 11 dígitos'),

    body('services')
        .isArray({ min: 1 }).withMessage('É necessário escolher pelo menos um serviço')
        .custom((services) => {
            const validServices = [
                "haircut",
                "beard",
                "hydratation",
                "full"
            ];
            for (let s of services) {
                if (!validServices.includes(s)) {
                    throw new Error(`Serviço inválido: ${s}`);
                }
            }
            return true;
        }),

    body('datetime')
        .notEmpty().withMessage('A data e hora são obrigatórias')
        .isISO8601().withMessage('Data/hora inválida')
        .custom((value) => {
            const date = new Date(value);
            const day = date.getDay();
            const hour = date.getHours();
            const minutes = date.getMinutes();

            if (day === 0) throw new Error('Domingo não há atendimento');

            if (day >= 1 && day <= 5) {
                if (!((hour > 9 || (hour === 9 && minutes >= 0)) &&
                    (hour < 20 || (hour === 20 && minutes === 0)))) {
                    throw new Error('Horário permitido: Segunda a Sexta das 09:00 às 20:00');
                }
            }

            if (day === 6) {
                if (!((hour > 9 || (hour === 9 && minutes >= 0)) &&
                    (hour < 18 || (hour === 18 && minutes === 0)))) {
                    throw new Error('Horário permitido: Sábado das 09:00 às 18:00');
                }
            }

            return true;
        })
];

module.exports = scheduleValidator;
