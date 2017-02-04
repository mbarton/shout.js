import Html exposing (..)
import Html.Attributes exposing (class, disabled, type_, classList)
import Html.Events exposing (onClick)
import Dict exposing (Dict)

main =
  Html.beginnerProgram { model = model, view = view, update = update }

-- MODEL

type alias Notes = List Bool

type alias Track = {
  position: Int,
  notes: Notes
}

type alias Tracks = Dict String Track

type alias Model = {
  tracks: Tracks,
  playing: Bool
}

notes: List Int -> Notes
notes enabled =
  List.map (\i -> List.any (\j -> i == j) enabled) (List.range 0 15)

model: Model
model =
  {
    playing = False,
    tracks = Dict.fromList
      [
        ("kick", { position = 0, notes = notes [0, 4, 8, 12] }),
        ("hihat", { position = 1, notes = notes [2, 6, 10, 14] }),
        ("snare", { position = 2, notes = notes [4, 12] })
      ]
  }


-- UPDATE

type Msg =
  ToggleNote String Int |
  TogglePlayback

updateNote: Int -> Track -> Track
updateNote indexToUpdate track =
  let
    notes = List.indexedMap (\ix note -> if(ix == indexToUpdate) then (not note) else note) track.notes
  in
    { track | notes = notes }

update : Msg -> Model -> Model
update msg model =
  case msg of
    ToggleNote track note ->
      let
        tracks = Dict.update track (Maybe.map (updateNote note)) model.tracks
      in
        { model | tracks = tracks }
    
    TogglePlayback ->
      { model | playing = not model.playing }


-- -- VIEW

renderNote: String -> Int -> Bool -> Html Msg
renderNote sample note enabled =
  div [class "small-3 columns"] [
      button [
        type_ "button",
        classList [
          ("button", True),
          ("primary", enabled),
          ("secondary", not enabled)
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

renderTrack: (String, Track) -> Html Msg
renderTrack params =
  let
    (name, track) = params
    renderedNotes = List.indexedMap (renderNote name) track.notes
  in
    div [class "row"] [
      div [class "small-1 columns"] [
        strong [] [text name]
      ],
      div [class "small-11 columns"] (renderNoteBoxes renderedNotes)
    ]

topBar: Html Msg
topBar =
  div [class "top-bar"] [
    div [class "top-bar-left"] [
      ul [class "menu"] [
        li [class "menu-text"] [text "Shout"]
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
    rendered = List.map renderTrack ordered

    top = [topBar, (br [] [])]
    bottom = [(br [] []), (bottomBar model.playing)]
  in
    div [] (top ++ rendered ++ bottom)