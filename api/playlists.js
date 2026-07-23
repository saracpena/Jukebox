import express from "express";
import {
  addTrackToPlaylist,
  createPlaylist,
  getPlaylist,
  getPlaylists,
  getPlaylistTracks,
} from "#db/playlists";

import { getTrack } from "#db/tracks";

const router = express.Router();

/** Sends all playlists. */
router.get("/", async (req, res, next) => {
  try {
    const playlists = await getPlaylists();
    res.send(playlists);
  } catch (error) {
    next(error);
  }
});

/** Creates and sends a new empty playlist. */
router.post("/", async (req, res, next) => {
  const { name, description } = req.body ?? {};

  if (!name || !description) {
    return res.status(400).send({
      message: "Name and description are required.",
    });
  }

  try {
    const playlist = await createPlaylist(name, description);
    res.status(201).send(playlist);
  } catch (error) {
    next(error);
  }
});

/** Sends the playlist matching the provided ID. */
router.get("/:id", async (req, res, next) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id)) {
    return res.status(400).send({
      message: "Playlist ID must be a number.",
    });
  }

  try {
    const playlist = await getPlaylist(id);

    if (!playlist) {
      return res.status(404).send({
        message: "Playlist not found.",
      });
    }

    res.send(playlist);
  } catch (error) {
    next(error);
  }
});

/** Sends all tracks belonging to the specified playlist. */
router.get("/:id/tracks", async (req, res, next) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id)) {
    return res.status(400).send({
      message: "Playlist ID must be a number.",
    });
  }

  try {
    const playlist = await getPlaylist(id);

    if (!playlist) {
      return res.status(404).send({
        message: "Playlist not found.",
      });
    }

    const tracks = await getPlaylistTracks(id);
    res.send(tracks);
  } catch (error) {
    next(error);
  }
});

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

/** Adds a track to the specified playlist. */
router.post("/:id/tracks", async (req, res, next) => {
  const playlistId = Number(req.params.id);
  const { trackId } = req.body ?? {};

  if (!Number.isInteger(playlistId)) {
    return res.status(400).send({
      message: "Playlist ID must be a number.",
    });
  }

  if (!Number.isInteger(trackId)) {
    return res.status(400).send({
      message: "Track ID must be provided as a number.",
    });
  }

  try {
    const playlist = await getPlaylist(playlistId);

    if (!playlist) {
      return res.status(404).send({
        message: "Playlist not found.",
      });
    }

    const track = await getTrack(trackId);

    if (!track) {
      return res.status(400).send({
        message: "Track does not exist.",
      });
    }

    const playlistTrack = await addTrackToPlaylist(playlistId, trackId);

    res.status(201).send(playlistTrack);
  } catch (error) {
    if (error.code === "23505") {
      return res.status(400).send({
        message: "Track is already in this playlist.",
      });
    }

    next(error);
  }
});

export default router;