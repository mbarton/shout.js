port module Storage exposing (save, init)

import Data exposing (Model, Track, default)
import Dict exposing (Dict)

-- TODO MRB: can this be replaced with custom JSON encoders/decoders?
type alias PTrack = {
  name: String,
  data: Track
}

type alias PModel = {
  tracks: List PTrack,
  bpm: Int
}

serialiseTrack: (String, Track) -> PTrack
serialiseTrack params =
  let
    (name, data) = params
  in
    { name = name, data = data }

save: Model -> Cmd msg
save model =
  let
    tracks = (Dict.toList model.tracks)
    adapted = List.map serialiseTrack tracks 
    persisted = { bpm = model.bpm, tracks = adapted}
  in
    saveJs persisted

restore: PModel -> Model
restore model =
  let
    trackList = List.map (\track -> (track.name, track.data)) model.tracks
    tracks = Dict.fromList trackList
  in
    { bpm = model.bpm, tracks = tracks, playing = False, step = -1}

init: Maybe PModel -> (Model, Cmd msg)
init model =
  case model of
    Just data ->
      (restore data, Cmd.none)

    Nothing ->
      (default, Cmd.none)

port saveJs : PModel -> Cmd msg