const Schedule = require('../models/Schedule');
const { validationResult } = require('express-validator');

// Criar agendamento
exports.createSchedule = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
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
    const schedule = await Schedule.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!schedule) return res.status(404).json({ error: "Agendamento não encontrado" });
    res.json({ message: "Agendamento atualizado com sucesso!", schedule });
  } catch (error) {
    res.status(400).json({ error: error.message });
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


