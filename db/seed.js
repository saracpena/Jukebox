import db from "#db/client";

await db.connect();
await seed();
await db.end();
console.log("🌱 Database seeded.");

async function seed() {
  // TODO
  const tracks = [
    { name: "Track 1", durationMs: 180000 },
    { name: "Track 2", durationMs: 200000 },
    { name: "Track 3", durationMs: 240000 },
    { name: "Track 4", durationMs: 195000 },
    { name: "Track 5", durationMs: 210000 },
    { name: "Track 6", durationMs: 225000 },
    { name: "Track 7", durationMs: 175000 },
    { name: "Track 8", durationMs: 205000 },
    { name: "Track 9", durationMs: 230000 },
    { name: "Track 10", durationMs: 190000 },
    { name: "Track 11", durationMs: 215000 },
    { name: "Track 12", durationMs: 250000 },
    { name: "Track 13", durationMs: 185000 },
    { name: "Track 14", durationMs: 220000 },
    { name: "Track 15", durationMs: 235000 },
    { name: "Track 16", durationMs: 200000 },
    { name: "Track 17", durationMs: 245000 },
    { name: "Track 18", durationMs: 170000 },
    { name: "Track 19", durationMs: 210000 },
    { name: "Track 20", durationMs: 260000 },
  ];

  const playlists = [
    { name: "Playlist 1", description: "First playlist" },
    { name: "Playlist 2", description: "Second playlist" },
    { name: "Playlist 3", description: "Third playlist" },
    { name: "Playlist 4", description: "Fourth playlist" },
    { name: "Playlist 5", description: "Fifth playlist" },
    { name: "Playlist 6", description: "Sixth playlist" },
    { name: "Playlist 7", description: "Seventh playlist" },
    { name: "Playlist 8", description: "Eighth playlist" },
    { name: "Playlist 9", description: "Ninth playlist" },
    { name: "Playlist 10", description: "Tenth playlist" },
  ];

  for (const track of tracks) {
    await db.query(
      `INSERT INTO tracks (name, duration_ms)
       VALUES ($1, $2)`,
      [track.name, track.durationMs],
    );
  }

  for (const playlist of playlists) {
    await db.query(
      `INSERT INTO playlists (name, description)
       VALUES ($1, $2)`,
      [playlist.name, playlist.description],
    );
  }

  const playlistTracks = [
    [1, 1],
    [1, 2],
    [1, 3],
    [2, 4],
    [2, 5],
    [2, 6],
    [3, 7],
    [3, 8],
    [3, 9],
    [4, 10],
    [4, 11],
    [5, 12],
    [5, 13],
    [6, 14],
    [6, 15],
  ];

  for (const [playlistId, trackId] of playlistTracks) {
    await db.query(
      `INSERT INTO playlists_tracks (playlist_id, track_id)
       VALUES ($1, $2)`,
      [playlistId, trackId],
    );
  }
}
