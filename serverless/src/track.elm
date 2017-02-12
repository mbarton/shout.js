module Track exposing (Model, Msg(SetStep, Loaded, Step), update, reset, default, view, serialise)

import Html exposing (..)
import Html.Attributes exposing (class, disabled, type_, classList)
import Html.Events exposing (onClick)
import Json.Encode exposing (..)

-- model

type alias Steps = List Bool

type alias Model = {
  name: String,
  index: Int,
  step: Maybe Int,
  loading: Bool,
  steps: Steps
}

default: String -> Int -> List Bool -> Model
default name index steps =
  { name = name, index = index, step = Nothing, loading = True, steps = steps }
    

reset: Model -> Model -> Model
reset current default =
  { current | steps = default.steps }

serialise: (String, Model) -> Value
serialise (name, track) =
  Json.Encode.object [
    ("name", string name),
    ("index", int track.index),
    ("steps", list (List.map bool track.steps))
  ]


-- updates

type Msg =
  SetStep Int Bool |
  Step (Maybe Int) |
  Loaded

updateStep: Int -> Bool -> Steps -> Steps
updateStep index enabled steps =
  List.indexedMap (\ix note -> if(ix == index) then enabled else note) steps

update: Msg -> Model -> (Model, Cmd Msg)
update msg model =
  case msg of
    SetStep step enabled ->
      let
        updated = updateStep step enabled model.steps
      in
        ({ model | steps = updated }, Cmd.none)
    
    Step step ->
      ({ model | step = step }, Cmd.none)
    
    Loaded ->
      ({ model | loading = False}, Cmd.none)


-- views

step: Model -> Int -> Bool -> Html Msg
step track index enabled =
  div [class "small-3 columns"] [
      button [
        type_ "button",
        classList [
          ("button", True),
          ("primary", enabled),
          ("secondary", not enabled),
          ("success", track.step == (Just index))
        ],
        onClick (SetStep index (not enabled))
      ] []
  ]

boxSteps: List (Html Msg) -> List (Html Msg)
boxSteps notes =
  let
    indices = List.range 0 3
    -- A combinator, a combinator, my kingdom for a combinator
    dropped = List.map (\offset -> (List.drop (offset * 4) notes)) indices
    parts = List.map (List.take 4) dropped
  in
    List.map (\part -> div [class "small-3 columns"] part) parts

loading: Bool -> Html Msg
loading loading =
  if loading then
    span [class "alert label"] [small [] [
      text "Loading"
    ]]
  else
    span [] []

view: Model -> Html Msg
view model = 
  let
    steps = List.indexedMap (step model) model.steps 
  in
    div [class "row"] [
      div [class "small-1 columns"] [
        div [class "row"] [
          div [class "small-6 columns"] [
            strong [] [text model.name]
          ],
          div [class "small-6 columns"] [loading model.loading]
        ]
      ],
      div [class "small-11 columns"] (boxSteps steps)
    ]