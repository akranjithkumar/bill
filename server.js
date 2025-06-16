const express = require('express');
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json()); // ✅ Add this to parse JSON bodies

// Railway PostgreSQL connection
const pool = new Pool({
  connectionString: 'postgresql://postgres:UTlqxsMpktaofPiNfwmiIzKrYqXSfwCO@shuttle.proxy.rlwy.net:14651/railway',
  ssl: {
    rejectUnauthorized: false
  }
});


// POST route
app.post('/submit', async (req, res) => {
  const { sampleId, department } = req.body;

  if (!sampleId || !department) {
    return res.status(400).send('Missing sampleId or department');
  }

  try {
    const checkQuery = 'SELECT * FROM logdata WHERE sampleid = $1 AND department = $2';
    const checkResult = await pool.query(checkQuery, [sampleId, department]);
const insertQuery = `
  INSERT INTO logdata (sampleid, department, time, date)
  VALUES (
    $1,
    $2,
    (CURRENT_TIME AT TIME ZONE 'Asia/Kolkata')::TIME(0),
    (CURRENT_DATE AT TIME ZONE 'Asia/Kolkata')::DATE
  )
`;



    await pool.query(insertQuery, [sampleId, department]);

    console.log('✅ Inserted Data:', { sampleId, department });
    res.status(201).json({ message: '✅ Data inserted successfully' });

  } catch (err) {
    console.error('❌ Error inserting data:', err);
    res.status(500).send('Database insert error');
  }
});

app.post('/getlog', async (req, res) => {
  const { sampleId } = req.body;

  if (!sampleId) {
    return res.status(400).json({ success: false, message: 'Missing sampleId' });
  }

  const sql = 'SELECT department, time, date FROM logdata WHERE sampleid = $1';

  try {
    const result = await pool.query(sql, [sampleId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'No data found for given sampleId' });
    }

    res.json({
      success: true,
      count: result.rows.length,
      data: result.rows  // return all rows as an array inside `data`
    });
  } catch (err) {
    console.error('Error fetching data:', err);
    res.status(500).json({ success: false, message: 'Database query error' });
  }
});



app.post('/login', async (req, res) => {  // ✅ Fixed route path
  const { username, password } = req.body;


  try {
    const checkQuery = 'SELECT Department FROM staff_login WHERE username = $1 AND password = $2'; // ✅ Updated placeholders
    const result = await pool.query(checkQuery, [username, password]); // ✅ Fixed variable name

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    res.status(200).json({ department: result.rows[0].department }); // ✅ Return department
  } catch (err) {
    console.error('Insert error:', err);
    res.status(500).json({ error: 'Failed to register user' });
  }
});


app.listen(PORT, () => {
  console.log("Server running at http://localhost:${PORT}");
});