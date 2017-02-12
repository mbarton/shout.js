port module Sequencer exposing (Model, Msg(Reset), default, update, reset, view, init, subscriptions)

import Html exposing (..)
import Dict exposing (Dict)
import Json.Encode exposing (..)

import Track

-- model

type alias Tracks = Dict String Track.Model

type alias Model = {
  bpm: Int,
  tracks: Tracks
}

default: Model
default =
  {
    bpm = 120,
    tracks = Dict.fromList [
      ("kick", Track.default "kick" 0 (steps [0, 4, 8, 12])),
      ("hihat", Track.default "hihat" 1 (steps [2, 6, 10, 14])),
      ("snare", Track.default "snare" 2 (steps [4, 12]))
    ]
  }

steps: List Int -> List Bool
steps enabled =
  List.map (\i -> List.any (\j -> i == j) enabled) (List.range 0 15)

reset: Model -> Model -> Model
reset current default =
  let
    tracks = Dict.merge
      -- just appears in current and not defaults. should be removed
      (\name _ -> (Dict.remove name))
      -- appears in both. apply the reset function to the track
      (\name currentTrack defaultTrack -> Dict.insert name (Track.reset currentTrack defaultTrack))
      -- just appears in defaults. assume it has already been loaded
      (\name defaultTrack -> (Dict.insert name defaultTrack))
      current.tracks default.tracks Dict.empty
  in
    { current | tracks = tracks }

serialise: Model -> String
serialise model =
  let
    tracks = Dict.toList model.tracks
  in
    encode 0 (Json.Encode.object [
      ("bpm", int model.bpm),
      ("tracks", list (List.map Track.serialise tracks))
    ])


-- updates

type Msg =
  SetBpm Int |
  Step (Maybe Int) |
  TrackMsg String Track.Msg |
  Reset

updateTrack: String -> Track.Msg -> Tracks -> (Tracks, Cmd Track.Msg)
updateTrack name msg tracks =
  case (Dict.get name tracks) of
    Just track ->
      let
        (updated, cmd) = Track.update msg track
      in
        (Dict.insert name updated tracks, cmd)

    Nothing ->
      (tracks, Cmd.none)

handleTrackMsg: Model -> String -> Track.Msg -> (Model, Cmd Msg)
handleTrackMsg model name msg =
  let
    (updated, cmd) = updateTrack name msg model.tracks 
  in
    ({ model | tracks = updated}, Cmd.map (TrackMsg name) cmd)

init: Model -> Cmd Msg
init model =
  Cmd.batch (List.map download (Dict.keys model.tracks))

update: Msg -> Model -> (Model, Cmd Msg)
update msg model =
  case msg of
    SetBpm bpm ->
      let
        updated = { model | bpm = bpm }
      in
        (updated, save (serialise updated))
    
    TrackMsg name (Track.SetStep step enabled) ->
      let
        (updated, cmd) = handleTrackMsg model name (Track.SetStep step enabled) 
      in
        (updated, Cmd.batch [cmd, save (serialise updated)])

    TrackMsg name msg ->
      handleTrackMsg model name msg

    Step step ->
      let
        updateFn = (\name _ updated -> Tuple.first(updateTrack name (Track.Step step) updated))
        tracks = Dict.foldl updateFn model.tracks model.tracks
      in
        ({model | tracks = tracks}, Cmd.none)

    Reset ->
      let
        updated = reset model default
      in
        (updated, save (serialise updated))


-- outbound ports

port save: String -> Cmd msg
port download: String -> Cmd msg
port downloaded: (String -> msg) -> Sub msg
port step: (Int -> msg) -> Sub msg

-- subscriptions

subscriptions: Model -> Sub Msg
subscriptions model =
  let
    downloadFn = \track -> (TrackMsg track Track.Loaded)
    stepFn = \step -> (Step (Just step))
  in
    Sub.batch [(downloaded downloadFn), (step stepFn)]

-- view

view : Model -> Html Msg
view model =
  let
    tracks = Dict.values model.tracks
    ordered = List.sortBy .index tracks

    trackView = (\track -> Html.map (TrackMsg track.name) (Track.view track))
    rendered = List.map trackView ordered
  in
    div [] rendered
    