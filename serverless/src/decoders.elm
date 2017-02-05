module Decoders exposing (deserialise)

import Json.Decode exposing (..)
import Dict exposing (Dict)
import Data exposing (Track, Model, Tracks, default)

-- {
--   bpm: Int,
--   tracks: List {
--     name: String,
--     position: Int,
--     notes: List Bool
--   }
-- }

trackDecoder: Decoder (String, Track)
trackDecoder =
  let
  in
    map3 adapter (field "name" string) (field "position" int) (field "notes" (list bool))

modelDecoder: Decoder Model
modelDecoder =
  let
    adapter = (\bpm tracks -> { bpm = bpm, tracks = (Dict.fromList tracks), playing = False, step = -1})
  in
    map2 adapter (field "bpm" int) (field "tracks" (list trackDecoder))

deserialise: String -> Model
deserialise json =
  case (decodeString modelDecoder json) of
    Ok model ->
      model
    Err _ ->
      default
