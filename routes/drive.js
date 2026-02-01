import express from 'express';
import {
  positionSchemaDrivers,
  driverSchema,
  updateDriverSchema,
} from '../inputValidation.js';
import { drivers } from '../data.js';
import { randomUUID } from 'node:crypto';

const router = express.Router();

router.get(`/`, (req, res) => {
  res.status(200).send(drivers);
});

router.get(`/standings/:position`, (req, res) => {
  const { position } = req.params;
  const { error } = positionSchemaDrivers.validate(position);

  if (error) {
    res.status(400).send({ error: error.details[0].message });
    return;
  }

  const driver = drivers[position - 1];

  res.status(200).send(driver);
});

router.get(`/:id`, (req, res) => {
  const { id } = req.params;
  const driver = drivers.find((driver) => driver.id === id);

  if (!driver) {
    res.status(404).send({ error: 'Driver not found' });
    return;
  }

  res.status(200).send(driver);
});

router.post(``, (req, res) => {
  const { value, error } = driverSchema.validate(req.body, {
    stripUnknown: true,
    abortEarly: false,
  });

  if (error) {
    res
      .status(400)
      .send({ error: error.details.map((detail) => detail.message) });
    return;
  }
  const newDriver = { ...value, id: randomUUID() };
  drivers.push(newDriver);
  drivers.sort((a, b) => {
    if (a.points > b.points) return -1;
    if (a.points < b.points) return 1;
    return 0;
  });
  res.status(201).send(newDriver);
});

router.put(`/:id`, (req, res) => {
  const { error } = updateDriverSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    res
      .status(400)
      .send({ error: error.details.map((detail) => detail.message) });
    return;
  }

  const { id } = req.params;
  const driverSelect = drivers.find((driver) => driver.id === id);

  if (!driverSelect) {
    res.status(404).send({ error: 'Driver not found' });
    return;
  }

  for (const key in driverSelect) {
    if (req.body[key]) {
      driverSelect[key] = req.body[key];
    }
  }

  drivers.sort((a, b) => {
    if (a.points > b.points) return -1;
    if (a.points < b.points) return 1;
    return 0;
  });

  res.status(200).send(driverSelect);
});

router.delete(`/:id`, (req, res) => {
  const { id } = req.params;
  const driverSelector = drivers.find((driver) => driver.id === id);

  if (!driverSelector) {
    res.status(404).send({ error: 'Driver not found' });
    return;
  }

  const driverIndex = drivers.indexOf(driverSelector);
  drivers.splice(driverIndex, 1);
  drivers.sort((a, b) => {
    if (a.points > b.points) return -1;
    if (a.points < b.points) return 1;
    return 0;
  });
  res.status(200).send(driverSelector);
});

export default router;
