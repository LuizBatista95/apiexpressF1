import express from 'express';
import { positionSchemaTeams } from '../inputValidation.js';
import { generateTeamsArray } from '../data.js';

const router = express.Router();

router.get(`/`, (req, res) => {
  res.status(200).send(generateTeamsArray());
});

router.get(`/standings/:position`, (req, res) => {
  const teams = generateTeamsArray();
  const { position } = req.params;

  const { error } = positionSchemaTeams.validate(position);
  if (error) {
    res.status(400).send({ error: error.details[0].message });
    return;
  }

  const team = teams[position - 1];
  res.status(200).send(team);
});

export default router;
