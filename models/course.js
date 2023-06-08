"use strict";

const db = require("../db");
const bcrypt = require("bcrypt");
const { sqlForPartialUpdate } = require("../helpers/sql");
const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} = require("../expressError");

const { BCRYPT_WORK_FACTOR } = require("../config.js");

/** Related functions for users. */

class Course {
  /** Register new course with data.
   *
   * Returns { id, name, location, distance, par, price_in_dollars, num_of_holes,
   * phone_number, owner, image }
   *
   * Throws BadRequestError on duplicates.
   **/

  static async create({
    name,
    location,
    distance,
    par,
    priceInDollars,
    numOfHoles,
    phoneNumber,
    owner,
    image,
  }) {
    const duplicateCheck = await db.query(
      `
        SELECT name
        FROM courses
        WHERE name = $1`,
      [name]
    );

    if (duplicateCheck.rows.length > 0) {
      throw new BadRequestError(`Duplicate course: ${name}`);
    }

    const result = await db.query(
      `
                INSERT INTO courses
                (name,
                 location,
                 distance,
                 par,
                 price_in_dollars,
                 num_of_holes,
                 phone_number,
                 owner,
                 image)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
                RETURNING
                    id,
                    location,
                    distance,
                    par
                    price_in_dollars AS "priceInDollars",
                    num_of_holes AS "numOfHoles",
                    phone_number AS "phoneNumber",
                    owner,
                    image`,
      [
        name,
        location,
        distance,
        par,
        priceInDollars,
        numOfHoles,
        phoneNumber,
        owner,
        image,
      ]
    );

    const course = result.rows[0];

    return course;
  }

  /** Find all courses.
   *
   * Returns [
   * { id, name, location, distance, par, priceInDollars, numOfHoles, phoneNumber,
   *   owner, image }, ...]
   **/

  static async findAll() {
    const result = await db.query(`
        SELECT id,
               name,
               location,
               distance,
               par, 
               price_in_dollars AS "priceInDollars",
               num_of_holes AS "numOfHoles",
               phone_number AS "phoneNumber",
               owner,
               image
        FROM courses
        ORDER BY name`);

    return result.rows;
  }

  /** Given a course name, return data about course.
   *
   * Returns { username, first_name, last_name, is_admin, jobs }
   *   where jobs is { id, title, company_handle, company_name, state }
   *
   * Throws NotFoundError if user not found.
   **/

  static async get(name) {
    const userRes = await db.query(
      `
        SELECT id,
               name,
               location,
               distance,
               par, 
               price_in_dollars AS "priceInDollars",
               num_of_holes AS "numOfHoles",
               phone_number AS "phoneNumber",
               owner,
               image
        FROM courses
        WHERE name = $1`,
      [name]
    );

    const course = userRes.rows[0];

    if (!course) throw new NotFoundError(`No course: ${name}`);

    // const courseHoles = await db.query(
    //   `
    //     SELECT id,
    //            par,
    //            distance,
    //            handicap,
    //            image
    //     FROM holes
    //     WHERE course_name = $1`,
    //   [course.name]
    // );

    // course.holes = courseHoles.rows.map((hole) => a.job_id);
    return course;
  }

  /** Update user data with `data`.
   *
   * This is a "partial update" --- it's fine if data doesn't contain
   * all the fields; this only changes provided ones.
   *
   * Data can include:
   *   { firstName, lastName, password, email, isAdmin }
   *
   * Returns { username, firstName, lastName, email, isAdmin }
   *
   * Throws NotFoundError if not found.
   *
   * WARNING: this function can set a new password or make a user an admin.
   * Callers of this function must be certain they have validated inputs to this
   * or a serious security risks are opened.
   */

  static async update(username, data) {
    if (data.password) {
      data.password = await bcrypt.hash(data.password, BCRYPT_WORK_FACTOR);
    }

    const { setCols, values } = sqlForPartialUpdate(data, {
      firstName: "first_name",
      lastName: "last_name",
      isAdmin: "is_admin",
    });
    const usernameVarIdx = "$" + (values.length + 1);

    const querySql = `
        UPDATE users
        SET ${setCols}
        WHERE username = ${usernameVarIdx}
        RETURNING username,
            first_name AS "firstName",
            last_name AS "lastName",
            email,
            is_admin AS "isAdmin"`;
    const result = await db.query(querySql, [...values, username]);
    const user = result.rows[0];

    if (!user) throw new NotFoundError(`No user: ${username}`);

    delete user.password;
    return user;
  }

  /** Delete given user from database; returns undefined. */

  static async remove(username) {
    let result = await db.query(
      `
        DELETE
        FROM users
        WHERE username = $1
        RETURNING username`,
      [username]
    );
    const user = result.rows[0];

    if (!user) throw new NotFoundError(`No user: ${username}`);
  }

  /** Apply for job: update db, returns undefined.
   *
   * - username: username applying for job
   * - jobId: job id
   **/

  static async applyToJob(username, jobId) {
    const preCheck = await db.query(
      `
        SELECT id
        FROM jobs
        WHERE id = $1`,
      [jobId]
    );
    const job = preCheck.rows[0];

    if (!job) throw new NotFoundError(`No job: ${jobId}`);

    const preCheck2 = await db.query(
      `
        SELECT username
        FROM users
        WHERE username = $1`,
      [username]
    );
    const user = preCheck2.rows[0];

    if (!user) throw new NotFoundError(`No username: ${username}`);

    await db.query(
      `
        INSERT INTO applications (job_id, username)
        VALUES ($1, $2)`,
      [jobId, username]
    );
  }
}

module.exports = User;
