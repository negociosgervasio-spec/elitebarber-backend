const mongoose = require('mongoose');

const ScheduleSchema = new mongoose.Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true },
    services: [
        {
            type: String,
            enum: [
                "haircut",
                "beard",
                "hydratation",
                "full"
            ],
            required: true
        }
    ],
    datetime: { type: Date, required: true }
});

// Validação de horário de atendimento
ScheduleSchema.path("datetime").validate(function (value) {
    const day = value.getDay(); // 0 = Domingo, 1 = Segunda, ..., 6 = Sábado
    const hour = value.getHours();
    const minutes = value.getMinutes();

    // Domingo fechado
    if (day === 0) return false;

    // Segunda a Sexta: 09:00 - 20:00
    if (day >= 1 && day <= 5) {
        return (hour > 9 || (hour === 9 && minutes >= 0)) &&
            (hour < 20 || (hour === 20 && minutes === 0));
    }

    // Sábado: 09:00 - 18:00
    if (day === 6) {
        return (hour > 9 || (hour === 9 && minutes >= 0)) &&
            (hour < 18 || (hour === 18 && minutes === 0));
    }

    return false;
}, "Horário fora do expediente");

module.exports = mongoose.model("Schedule", ScheduleSchema);
