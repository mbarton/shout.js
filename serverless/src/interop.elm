port module Interop exposing (save, init, downloadedSamples)

import Data exposing (Model, Track, default)
import Dict exposing (Dict)
import Set exposing (Set)
import Decoders exposing (deserialise)
import Encoders exposing (serialise)

save: Model -> Cmd msg
save model =
  saveJs (serialise model)

restore: String -> Model
restore json =
  deserialise json

init: Maybe String -> (Model, Cmd msg)
init model =
  case model of
    Just data ->
      downloadSamples (restore data)

    Nothing ->
      downloadSamples (default)

downloadSamples: Model -> (Model, Cmd msg)
downloadSamples model =
  let
    samples = Dict.keys model.tracks
    runtime = model.runtime
    updated = { runtime | loading = Set.fromList samples }
  in
    ({ model | runtime = updated}, downloadSamplesJs samples)


-- outbound

port saveJs : String -> Cmd msg

port downloadSamplesJs: List String -> Cmd msg

port downloadedSamples: (String -> msg) -> Sub msg