import Html exposing (..)
import Html.Attributes exposing (class, disabled, type_, classList, value)
import Html.Events exposing (onClick)
import Dict exposing (Dict)
import Time exposing (Time, minute)
import Debug exposing (log)

import Storage exposing (save, init)
import Data exposing (..)

main =
  Html.programWithFlags {
    init = init,
    view = view,
    update = update,
    subscriptions = subscriptions
  }


-- UPDATE

type Msg =
  Reset |
  ToggleNote String Int |
  TogglePlayback |
  Step Time

updateNote: Int -> Track -> Track
updateNote indexToUpdate track =
  let
    notes = List.indexedMap (\ix note -> if(ix == indexToUpdate) then (not note) else note) track.notes
  in
    { track | notes = notes }

update : Msg -> Model -> (Model, Cmd Msg)
update msg model =
  case msg of
    Reset ->
      (default, save default)

    ToggleNote track note ->
      let
        tracks = Dict.update track (Maybe.map (updateNote note)) model.tracks
        updated = { model | tracks = tracks }
      in
        (updated, save updated)
    
    TogglePlayback ->
      let
        playing = not model.playing
        step = if(playing) then 0 else -1
      in

      ({ model | playing = playing, step = step }, Cmd.none)
    
    Step _ ->
      let
        nextStep = (model.step + 1) % 16
      in
        -- log(toString nextStep)
        ({ model | step = nextStep}, Cmd.none)


-- SUBSCRIPTIONS

subscriptions : Model -> Sub Msg
subscriptions model =
  let
    rate = (1 / (120 * 4)) * minute
  in
    if model.playing then
      Time.every rate Step
    else
      Sub.none


-- -- VIEW

renderNote: String -> Int -> Int -> Bool -> Html Msg
renderNote sample step note enabled =
  div [class "small-3 columns"] [
      button [
        type_ "button",
        classList [
          ("button", True),
          ("primary", enabled),
          ("secondary", not enabled),
          ("success", note == step)
        ],
        onClick (ToggleNote sample note)
      ] []
    ]

renderNoteBoxes: List (Html Msg) -> List (Html Msg)
renderNoteBoxes notes =
  let
    indices = List.range 0 3
    -- A combinator, a combinator, my kingdom for a combinator
    dropped = List.map (\offset -> (List.drop (offset * 4) notes)) indices
    parts = List.map (List.take 4) dropped
  in
    List.map (\part -> div [class "small-3 columns"] part) parts

renderTrack: Int -> (String, Track) -> Html Msg
renderTrack step params =
  let
    (name, track) = params
    renderedNotes = List.indexedMap (renderNote name step) track.notes
  in
    div [class "row"] [
      div [class "small-1 columns"] [
        strong [] [text name]
      ],
      div [class "small-11 columns"] (renderNoteBoxes renderedNotes)
    ]

topBar: Int -> Bool -> Html Msg
topBar bpm playing =
  div [class "top-bar"] [
    div [class "top-bar-left"] [
      ul [class "menu"] [
        li [class "menu-text"] [text "Shout"]
      ]
    ],
    div [class "top-bar-right"] [
      ul [class "menu"] [
        li [] [
          input [type_ "text", disabled True, value (toString bpm)] []
        ],
        li [] [
          button [type_ "button", class "secondary button", disabled playing, onClick Reset] [
            i [class "fi-skull"] []
          ]
        ]
      ]
    ]
  ]

bottomBar: Bool -> Html Msg
bottomBar playing =
  div [class "row"] [
    div [class "small-1 small-offset-10 columns"] [
      div [class "row"] [
        button [type_ "button", class "success button", disabled playing, onClick TogglePlayback] [
          i [class "fi-play"] []
        ],
        button [type_ "button", class "alert button", disabled (not playing), onClick TogglePlayback] [
          i [class "fi-stop"] []
        ]
      ]
    ]
  ]

view : Model -> Html Msg
view model =
  let
    tracks = Dict.toList model.tracks
    ordered = List.sortBy (\track -> (Tuple.second track).position) tracks
    rendered = List.map (renderTrack model.step) ordered

    top = [(topBar model.bpm model.playing), (br [] [])]
    bottom = [(br [] []), (bottomBar model.playing)]
  in
    div [] (top ++ rendered ++ bottom)