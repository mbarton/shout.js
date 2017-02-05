module Encoders exposing (serialise)

import Dict exposing (Dict)
import Json.Encode exposing (..)
import Data exposing (Model, Track)

-- {
--   bpm: Int,
--   tracks: List {
--     name: String,
--     position: Int,
--     notes: List Bool
--   }
-- }

trackEncoder: (String, Track) -> Value
trackEncoder (name, track) =
  object [
    ("name", string name),
    ("position", int track.position),
    ("notes", list (List.map bool track.notes))
  ]

modelEncoder: Model -> Value
modelEncoder model =
  let
    tracks = Dict.toList model.tracks
  in
    object [
      ("bpm", int model.bpm),
      ("tracks", list (List.map trackEncoder tracks))
    ]

serialise: Model -> String
serialise model =
  encode 0 (modelEncoder model)