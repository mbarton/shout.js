module Decoders exposing (deserialise)

import Json.Decode exposing (..)
import Dict exposing (Dict)
import Track
import Sequencer

-- {
--   bpm: Int,
--   tracks: List {
--     name: String,
--     index: Int,
--     steps: List Bool
--   }
-- }

trackDecoder: Decoder (String, Track.Model)
trackDecoder =
  let
    adapter = \name index steps -> (name, Track.default name index steps)
  in
    map3 adapter (field "name" string) (field "index" int) (field "steps" (list bool))

modelDecoder: Decoder Sequencer.Model
modelDecoder =
  let
    adapter = (\bpm tracks -> { bpm = bpm, tracks = (Dict.fromList tracks) })
  in
    map2 adapter (field "bpm" int) (field "tracks" (list trackDecoder))

deserialise: String -> Sequencer.Model
deserialise json =
  case (decodeString modelDecoder json) of
    Ok model ->
      model
    Err stuff ->
      Sequencer.default