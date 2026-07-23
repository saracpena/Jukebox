import db from "#db/client";

/** Returns every playlist in the database. */
export async function getPlaylists() {
  const sql = `
    SELECT *
    FROM playlists
    ORDER BY id;
  `;

  const { rows } = await db.query(sql);
  return rows;
}

/** Returns one playlist matching the provided ID. */
export async function getPlaylist(id) {
  const sql = `
    SELECT *
    FROM playlists
    WHERE id = $1;
  `;

  const {
    rows: [playlist],
  } = await db.query(sql, [id]);

  return playlist;
}

/** Creates and returns a new empty playlist. */
export async function createPlaylist(name, description) {
  const sql = `
    INSERT INTO playlists (name, description)
    VALUES ($1, $2)
    RETURNING *;
  `;

  const {
    rows: [playlist],
  } = await db.query(sql, [name, description]);

  return playlist;
}

/** Returns all tracks belonging to the specified playlist. */
export async function getPlaylistTracks(playlistId) {
  const sql = `
    SELECT tracks.*
    FROM tracks
    JOIN playlists_tracks
      ON tracks.id = playlists_tracks.track_id
    WHERE playlists_tracks.playlist_id = $1
    ORDER BY tracks.id;
  `;

  const { rows } = await db.query(sql, [playlistId]);
  return rows;
}

/** Adds a track to a playlist and returns the new junction record. */
export async function addTrackToPlaylist(playlistId, trackId) {
  const sql = `
    INSERT INTO playlists_tracks (playlist_id, track_id)
    VALUES ($1, $2)
    RETURNING *;
  `;

  const {
    rows: [playlistTrack],
  } = await db.query(sql, [playlistId, trackId]);

  return playlistTrack;
}