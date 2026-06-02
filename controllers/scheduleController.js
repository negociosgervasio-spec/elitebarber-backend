const Schedule = require('../models/Schedule');
const { validationResult } = require('express-validator');

// Criar agendamento
exports.createSchedule = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const requestedDate = new Date(req.body.datetime);
    // Verifica se já existe agendamento naquele datetime
    const exists = await Schedule.findOne({ datetime: requestedDate });
    if (exists) return res.status(409).json({ error: "Horário já agendado" });

    const schedule = new Schedule(req.body);
    await schedule.save();
    res.status(201).json({ message: "Agendamento criado com sucesso!", schedule });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Listar agendamentos
exports.getSchedules = async (req, res) => {
  try {
    const schedules = await Schedule.find();
    res.json(schedules);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Buscar agendamento por ID
exports.getScheduleById = async (req, res) => {
  try {
    const schedule = await Schedule.findById(req.params.id);
    if (!schedule) return res.status(404).json({ error: "Agendamento não encontrado" });
    res.json(schedule);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Atualizar agendamento
exports.updateSchedule = async (req, res) => {
  try {
    // Se houver mudança de datetime, garantir que outro agendamento não esteja no mesmo horário
    if (req.body.datetime) {
      const requestedDate = new Date(req.body.datetime);
      const conflict = await Schedule.findOne({ datetime: requestedDate });
      if (conflict && String(conflict._id) !== String(req.params.id)) {
        return res.status(409).json({ error: 'Horário já agendado por outro cliente' });
      }
    }

    const schedule = await Schedule.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!schedule) return res.status(404).json({ error: "Agendamento não encontrado" });
    res.json({ message: "Agendamento atualizado com sucesso!", schedule });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Retorna horários disponíveis para uma dada data (YYYY-MM-DD)
exports.getAvailableTimes = async (req, res) => {
  try {
    const dateStr = req.query.date;
    if (!dateStr) return res.status(400).json({ error: 'Parâmetro date é obrigatório (YYYY-MM-DD)' });

    const date = new Date(dateStr + 'T00:00:00');
    const day = date.getDay(); // 0 = domingo

    // Domingo fechado
    if (day === 0) return res.json({ availableTimes: [] });

    let openHour = 9;
    let closeHour = 20; // inclusive up to 20:00
    if (day === 6) closeHour = 18; // sábado

    // Gera slots de 30 em 30 minutos
    const slots = [];
    for (let h = openHour; h <= closeHour; h++) {
      for (let m of [0, 30]) {
        // evita passar do horário de fechamento (se closeHour e m > 0 e h === closeHour, pular)
        if (h === closeHour && m > 0) continue;
        const hh = String(h).padStart(2, '0');
        const mm = String(m).padStart(2, '0');
        slots.push(`${hh}:${mm}`);
      }
    }

    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const schedules = await Schedule.find({ datetime: { $gte: startOfDay, $lte: endOfDay } });
    const taken = schedules.map(s => {
      const d = new Date(s.datetime);
      const hh = String(d.getHours()).padStart(2, '0');
      const mm = String(d.getMinutes()).padStart(2, '0');
      return `${hh}:${mm}`;
    });

    // filtra slots já ocupados
    let available = slots.filter(s => !taken.includes(s));

    // se for hoje, remover horários já passados
    const today = new Date();
    const isToday = today.toDateString() === date.toDateString();
    if (isToday) {
      const nowH = today.getHours();
      const nowM = today.getMinutes();
      available = available.filter((t) => {
        const [hh, mm] = t.split(':').map(Number);
        if (hh < nowH) return false;
        if (hh === nowH && mm <= nowM) return false;
        return true;
      });
    }

    res.json({ availableTimes: available });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Busca agendamento por telefone e data (mesmo dia)
exports.findByPhoneAndDate = async (req, res) => {
  try {
    const { phone, date } = req.query;
    if (!phone || !date) return res.status(400).json({ error: 'Parâmetros phone e date são obrigatórios' });

    const day = new Date(date + 'T00:00:00');
    const startOfDay = new Date(day);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(day);
    endOfDay.setHours(23, 59, 59, 999);

    const schedule = await Schedule.findOne({ phone: phone, datetime: { $gte: startOfDay, $lte: endOfDay } });
    res.json({ schedule });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Deletar agendamento
exports.deleteSchedule = async (req, res) => {
  try {
    const schedule = await Schedule.findByIdAndDelete(req.params.id);
    if (!schedule) return res.status(404).json({ error: "Agendamento não encontrado" });
    res.json({ message: "Agendamento removido com sucesso!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


