// backend/src/scripts/seed.ts
import { Pool } from 'pg';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const demoUsers = [
  {
    email: 'hr@company.com',
    password: 'demo123',
    name: 'Sarah Johnson',
    role: 'hr',
    department: 'Human Resources',
    designation: 'HR Manager',
  },
  {
    email: 'manager@company.com',
    password: 'demo123',
    name: 'David Chen',
    role: 'manager',
    department: 'Engineering',
    designation: 'Engineering Manager',
  },
  {
    email: 'employee@company.com',
    password: 'demo123',
    name: 'Alice Smith',
    role: 'employee',
    department: 'Engineering',
    designation: 'Software Engineer',
  },
];

async function cleanDatabase() {
  console.log('Cleaning database...');
  const client = await pool.connect();
  try {
    // The order is important due to foreign key constraints
    await client.query('TRUNCATE TABLE skill_assessments, reviews, goals, skills, users, employees, review_cycles RESTART IDENTITY CASCADE;');
    console.log('Database cleaned.');
  } catch (error) {
    console.error('Error cleaning database:', error.message);
  } finally {
    client.release();
  }
}

async function seed() {
  await cleanDatabase();

  console.log('\nSeeding new data...');
  const client = await pool.connect();
  try {
    // 1. Seed Employees and Users
    console.log('Seeding employees and users...');
    const createdEmployees: any[] = [];
    for (const userData of demoUsers) {
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(userData.password, salt);

      // Insert into employees table
      const empRes = await client.query(
        'INSERT INTO employees (name, email, department, designation, "joiningDate", status) VALUES ($1, $2, $3, $4, NOW(), $5) RETURNING id, email, name',
        [userData.name, userData.email, userData.department, userData.designation, 'active']
      );
      const newEmployee = empRes.rows[0];
      createdEmployees.push(newEmployee);

      // Insert into users table
      await client.query(
        'INSERT INTO users ("employeeId", email, password, role) VALUES ($1, $2, $3, $4)',
        [newEmployee.id, newEmployee.email, hashedPassword, userData.role]
      );
      console.log(`Created user and employee for: ${userData.email}`);
    }

    // 2. Update manager relationship
    const employee = createdEmployees.find(e => e.email === 'employee@company.com');
    const manager = createdEmployees.find(e => e.email === 'manager@company.com');

    if (!employee || !manager) {
      throw new Error('Could not find seeded employee or manager profiles.');
    }
    await client.query('UPDATE employees SET "managerId" = $1 WHERE id = $2', [manager.id, employee.id]);
    console.log('Updated manager relationship');

    // 3. Seed Skills
    const skillsToCreate = [{ name: 'TypeScript', category: 'Technical' }, { name: 'Communication', category: 'Soft Skill' }, { name: 'Project Management', category: 'Leadership' }];
    const skillRes = await client.query(
      `INSERT INTO skills (name, category) SELECT unnest($1::text[]), unnest($2::text[]) RETURNING id`,
      [skillsToCreate.map(s => s.name), skillsToCreate.map(s => s.category)]
    );
    const skills = skillRes.rows;
    console.log('Seeded skills');

    // 4. Seed Goals
    const goalsToCreate = [
      { employeeId: employee.id, title: 'Refactor Authentication Module', description: 'Improve performance and security.', type: 'quarterly', status: 'in_progress', progress: 50, weightage: 40 },
      { employeeId: employee.id, title: 'Complete Security Training', description: 'Finish all modules of the security awareness course.', type: 'quarterly', status: 'completed', progress: 100, weightage: 20 }
    ];
    await client.query(
        `INSERT INTO goals ("employeeId", title, description, type, status, progress, weightage) SELECT "employeeId", title, description, type, status, progress, weightage FROM jsonb_to_recordset($1) AS x("employeeId" uuid, title text, description text, type text, status text, progress int, weightage int)`,
        [JSON.stringify(goalsToCreate)]
    );
    console.log('Seeded goals');

    // 5. Seed Review Cycles & Reviews
    const cycleRes = await client.query(`INSERT INTO review_cycles (name, start_date, end_date, status) VALUES ('Q2 2024 Performance Review', '2024-04-01', '2024-06-30', 'closed') RETURNING id`);
    const cycle = cycleRes.rows[0];
    console.log('Seeded review cycles');

    const reviewsToCreate = [
        { cycle_id: cycle.id, reviewee_id: employee.id, reviewer_id: employee.id, rating: 4, feedback: 'I believe I performed well this quarter.', type: 'self', status: 'completed' },
        { cycle_id: cycle.id, reviewee_id: employee.id, reviewer_id: manager.id, rating: 5, feedback: 'Alice consistently delivers high-quality work.', type: 'manager', status: 'completed' },
    ];
    await client.query(
        `INSERT INTO reviews (cycle_id, reviewee_id, reviewer_id, rating, feedback, type, status) SELECT cycle_id, reviewee_id, reviewer_id, rating, feedback, type, status FROM jsonb_to_recordset($1) AS x(cycle_id uuid, reviewee_id uuid, reviewer_id uuid, rating int, feedback text, type text, status text)`,
        [JSON.stringify(reviewsToCreate)]
    );
    console.log('Seeded reviews');
    
    // 6. Seed Skill Assessments
    const assessmentsToCreate = [
        { employeeId: employee.id, skillId: skills[0].id, selfRating: 4, managerRating: 4 },
        { employeeId: employee.id, skillId: skills[1].id, selfRating: 5, managerRating: 5 },
    ];
    await client.query(
        `INSERT INTO skill_assessments ("employeeId", "skillId", "selfRating", "managerRating") SELECT "employeeId", "skillId", "selfRating", "managerRating" FROM jsonb_to_recordset($1) AS x("employeeId" uuid, "skillId" uuid, "selfRating" int, "managerRating" int)`,
        [JSON.stringify(assessmentsToCreate)]
    );
    console.log('Seeded skill assessments');

    console.log('\n✅ Seeding finished successfully!');
  } catch (error) {
    console.error('Error during seeding:', error);
  } finally {
    await client.release();
    await pool.end();
  }
}

seed();
