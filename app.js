import express from "express";
import tracksRouter from "#api/tracks";
import playlistsRouter from "#api/playlists";

const app = express();

app.use(express.json());

app.use("/tracks", tracksRouter);
app.use("/playlists", playlistsRouter);

/** Handles errors passed to next(error). */
app.use((error, req, res, next) => {
  console.error(error);

  res.status(500).send({
    message: "Something went wrong.",
  });
});

export default app;