import 'dotenv/config';
import pg from "pg";
import format from "pg-format";

async function createAdmin() {
  const client = new pg.Client({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
  });

  try {
    await client.connect();
    await client.query("BEGIN");

    const adminResult = await client.query("" +
      "INSERT INTO employee (name, email, password) VALUES ($1, $2, crypt($3, gen_salt('bf'))) RETURNING id",
      [
        process.env.DB_ADMIN_NAME,
        process.env.DB_ADMIN_EMAIL,
        process.env.DB_ADMIN_PASSWORD,
      ]
    );

    const adminId = adminResult.rows[0].id;

    const permissionsResult = await client.query("SELECT id from permission");
    const permissions = permissionsResult.rows.map(({ id }) => id);

    const userPermissionsMap = permissions.map((p) => [adminId, p]);

    await client.query(
      format(
        `
      INSERT INTO employee_permission (employee_id, permission_id) VALUES %L
    `,
        userPermissionsMap,
      ),
    );

    await client.query("COMMIT");
    console.log("admin was successfully successfully!");
  } catch (error) {
    await client.query("ROLLBACK");
    console.error(error);
  } finally {
    await client.end();
  }
}

createAdmin();
