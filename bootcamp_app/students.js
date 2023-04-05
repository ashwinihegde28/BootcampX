const { Pool } = require("pg");

const pool = new Pool({
  user: "labber",
  password: "labber",
  host: "localhost",
  database: "bootcampx",
});

/* Parameterized Query:
 separate out our SQL into two different parts.
The part that we write as the developer, the part that we have complete control over.
The part that comes from somewhere else and might be malicious.*/

const queryString = `
  SELECT students.id as student_id, students.name as name, cohorts.name as cohort
  FROM students
  JOIN cohorts ON cohorts.id = cohort_id
  WHERE cohorts.name LIKE $1
  LIMIT $2;
  `;

/*Each $s in our query is a placeholder that represents where a value should go but can't because it's coming from somewhere else, so it might be malicious.
The $1 and $2 placeholders will eventually get replaced with the actual data from the values array. The numbering starts at 1 instead of 0, so the first value in the query $1 corresponds to the first value in the array values[0]*/
const cohortName = process.argv[2];
const limit = process.argv[3] || 5;
// Store all potentially malicious values in an array.
const values = [`%${cohortName}%`, limit];

//run the query
pool
  .query(queryString, values)
  .then((res) => {
    res.rows.forEach((user) => {
      console.log(
        `${user.name} has an id of ${user.student_id} and was in the ${user.cohort} cohort`
      );
    });
  })
  .catch((err) => console.error("query error", err.stack));

/* For reference
//Accepting the inputs from the command line.
//Where FEB is the cohort name and 2 is the maximum number of results
pool
  .query(
    `
SELECT students.id as student_id, students.name as name, cohorts.name as cohort
FROM students
JOIN cohorts ON cohorts.id = cohort_id
WHERE cohorts.name LIKE '%${process.argv[2]}%'
LIMIT ${process.argv[3] || 5};
`
  )
  .then((res) => {
    res.rows.forEach((user) => {
      console.log(
        `${user.name} has an id of ${user.student_id} and was in the ${user.cohort} cohort`
      );
    });
  })
  .catch((err) => console.error("query error", err.stack));*/
