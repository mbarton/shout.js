port module Storage exposing (save, init)

import Data exposing (Model, Track, default)
import Dict exposing (Dict)
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
      (restore data, Cmd.none)

    Nothing ->
      (default, Cmd.none)

port saveJs : String -> Cmd msg