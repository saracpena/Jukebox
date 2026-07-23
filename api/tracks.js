import express from "express";
import { getTrack, getTracks } from "#db/tracks";

const router = express.Router();

/** Sends all tracks. */
router.get("/", async (req, res, next) => {
  try {
    const tracks = await getTracks();
    res.send(tracks);
  } catch (error) {
    next(error);
  }
});

/** Sends the track matching the provided ID. */
router.get("/:id", async (req, res, next) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id)) {
    return res.status(400).send({ message: "Track ID must be a number." });
  }

  try {
    const track = await getTrack(id);

    if (!track) {
      return res.status(404).send({ message: "Track not found." });
    }

    res.send(track);
  } catch (error) {
    next(error);
  }
});

export default router;