import joi from 'joi';
import { drivers, generateTeamsArray } from './data.js';

const teams = generateTeamsArray();

export const positionSchemaTeams = joi
  .number()
  .min(1)
  .max(teams.length)
  .required();

export const positionSchemaDrivers = joi
  .number()
  .min(1)
  .max(drivers.length)
  .required();

export const driverSchema = joi.object({
  name: joi.string().min(3).max(30).required(),
  team: joi.string().min(3).max(30).required(),
  points: joi.number().default(0),
});

export const updateDriverSchema = joi
  .object({
    name: joi.string().min(3).max(30),
    team: joi.string().min(3).max(30),
    points: joi.number(),
  })
  .min(1)
  .required();
