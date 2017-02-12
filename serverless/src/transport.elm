module Transport exposing (Model, Msg, default, update, view)

import Html exposing (..)
import Html.Attributes exposing (class, disabled, type_)
import Html.Events exposing (onClick)

-- model

type alias Model = {
  playing: Bool
}

default: Model
default =
  { playing = False }


-- updates

type Msg =
  TogglePlayback

update: Msg -> Model -> (Model, Cmd Msg)
update msg model =
  case msg of
    TogglePlayback ->
      ({ model | playing = (not model.playing) }, Cmd.none)

-- view

view: Model -> Html Msg
view model =
  div [class "row"] [
    div [class "small-1 small-offset-10 columns"] [
      div [class "row"] [
        button [type_ "button", class "success button", disabled model.playing, onClick TogglePlayback] [
          i [class "fi-play"] []
        ],
        button [type_ "button", class "alert button", disabled (not model.playing), onClick TogglePlayback] [
          i [class "fi-stop"] []
        ]
      ]
    ]
  ]