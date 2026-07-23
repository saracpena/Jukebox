import db from "#db/client";

/** Returns every track in the database. */
export async function getTracks() {
  const sql = `
    SELECT *
    FROM tracks
    ORDER BY id;
  `;

  const { rows } = await db.query(sql);
  return rows;
}

/** Returns one track matching the provided ID. */
export async function getTrack(id) {
  const sql = `
    SELECT *
    FROM tracks
    WHERE id = $1;
  `;

  const {
    rows: [track],
  } = await db.query(sql, [id]);

  return track;
}