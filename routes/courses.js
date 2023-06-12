"use strict";

/** Routes for courses. */

const jsonschema = require("jsonschema");

const express = require("express");
const { ensureCorrectUserOrAdmin, ensureAdmin } = require("../middleware/auth");
const { BadRequestError } = require("../expressError");
const Course = require("../models/course");
const { createToken } = require("../helpers/tokens");
const courseNewSchema = require("../schemas/courseNew.json");
const courseUpdateSchema = require("../schemas/courseUpdate.json");

const router = express.Router();

/** POST / { course }  => { id, name, location, distance, par, priceInDollars, numOfHoles, phoneNumber, owner, image }
 *
 * Adds a new course.
 *
 * This returns the newly created course:
 *  {Course: { id, name, location, distance, par, priceInDollars, numOfHoles, phoneNumber, owner, image }
 *
 **/

router.post("/", async function (req, res, next) {
  console.log(req.body, "THE BODY");
  const validator = jsonschema.validate(req.body, courseNewSchema, {
    required: true,
  });
  if (!validator.valid) {
    const errs = validator.errors.map((e) => e.stack);
    throw new BadRequestError(errs);
  }

  const course = await Course.create(req.body);
  return res.status(201).json({ Course: course });
});

/** GET / => { users: [ {username, firstName, lastName, email }, ... ] }
 *
 * Returns list of all users.
 *
 * Authorization required: admin
 **/

router.get("/", async function (req, res, next) {
  const courses = await Course.findAll();
  return res.json({ courses });
});

/** GET /[id] => { course }
 *
 * Returns { id, name, location, distance, par, priceInDollars, numOfHoles, phoneNumber, owner, image }
 *
 * Authorization required: admin or same user-as-:username
 **/

router.get("/:id", async function (req, res, next) {
  const course = await Course.get(req.params.id);
  return res.json({ course });
});

/** PATCH /[id] { course } => { course }
 *
 * Data can include:
 *   { name, location, distance, par, priceInDollars, numOfHoles, phoneNumber, owner, image }
 *
 * Returns { id, name, location, distance, par, priceInDollars, numOfHoles, phoneNumber, owner, image }
 *
 * Authorization required: admin or owner of course
 **/

// id, name, location, distance, par, priceInDollars, numOfHoles, phoneNumber, owner, image

router.patch("/:id", async function (req, res, next) {
  const validator = jsonschema.validate(req.body, courseUpdateSchema, {
    required: true,
  });
  if (!validator.valid) {
    const errs = validator.errors.map((e) => e.stack);
    throw new BadRequestError(errs);
  }

  const course = await course.update(req.params.id, req.body);
  return res.json({ course });
});

// /** DELETE /[id]  =>  { deleted: courseName }
//  *
//  * Authorization required: _______
//  **/

router.delete("/:id", async function (req, res, next) {
  await Course.remove(req.params.id);
  return res.json({ deleted: req.params.id });
});

// /** POST /[username]/jobs/[id]  { state } => { application }
//  *
//  * Returns {"applied": jobId}
//  *
//  * Authorization required: admin or same-user-as-:username
//  * */

// router.post(
//   "/:username/jobs/:id",
//   ensureCorrectUserOrAdmin,
//   async function (req, res, next) {
//     const jobId = +req.params.id;
//     await User.applyToJob(req.params.username, jobId);
//     return res.json({ applied: jobId });
//   }
// );

module.exports = router;
