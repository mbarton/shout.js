module Update exposing (Msg(..), update)

import Set exposing (Set)
import Dict exposing (Dict)
import Data exposing (..)
import Interop

type Msg =
  Reset |
  ToggleNote String Int |
  TogglePlayback |
  Step Int |
  DownloadedSample String |
  GenerateToken |
  ShowToken String

updateNote: Int -> Track -> Track
updateNote indexToUpdate track =
  let
    notes = List.indexedMap (\ix note -> if(ix == indexToUpdate) then (not note) else note) track.notes
  in
    { track | notes = notes }

updateTrack: (Track -> Track) -> String -> Tracks -> Tracks
updateTrack updateFn track tracks =
  Dict.update track (Maybe.map updateFn) tracks

updateRuntime: Model -> (Runtime -> Runtime) -> Model
updateRuntime model updateFn =
  { model | runtime = (updateFn model.runtime) }

updateRtc: Model -> (Rtc -> Rtc) -> Model
updateRtc model updateFn =
  { model | rtc = (updateFn model.rtc) }

update : Msg -> Model -> (Model, Cmd Msg)
update msg model =
  case msg of
    Reset ->
      (default, Interop.save default)

    ToggleNote track note ->
      let
        tracks = updateTrack (updateNote note) track model.tracks
        updated = { model | tracks = tracks }
      in
        (updated, Interop.save updated)
    
    TogglePlayback ->
      let
        runtime = model.runtime
        playing = not runtime.playing

        updated = updateRuntime model (\runtime ->
          { runtime | playing = playing, step = -1 }
        )
      in
        (updated, (Interop.setPlayback playing))
    
    Step _ ->
      let
        nextStep = (model.runtime.step + 1) % 16
        updated = updateRuntime model (\runtime -> { runtime | step = nextStep})
      in
        (updated, Cmd.none)

    DownloadedSample sample ->
      let
        updated = updateRuntime model (\runtime ->
          { runtime | loading = Set.remove sample runtime.loading }
        )
      in
        (updated, Cmd.none)

    GenerateToken ->
      let
        updated = updateRtc model (\rtc -> { rtc | generatingToken = True })
      in
        (updated, Interop.generateToken "")
    
    ShowToken token ->
      let
        updated = updateRtc model (\rtc -> { rtc | token = Just token })
      in
        (updated, Cmd.none)