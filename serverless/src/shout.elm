import Html exposing (..)
import Html.Attributes exposing (class, disabled, type_, value)
import Html.Events exposing (onClick)

import Sequencer
import Transport
import Decoders exposing (deserialise)

-- model

type alias Model = {
  sequencer: Sequencer.Model,
  transport: Transport.Model
}

default: Model
default =
  {
    sequencer = Sequencer.default,
    transport = Transport.default
  }

-- updates

type Msg =
  SequencerMsg Sequencer.Msg |
  TransportMsg Transport.Msg

update: Msg -> Model -> (Model, Cmd Msg)
update msg model =
  case msg of
    SequencerMsg msg ->
      let 
        (updated, cmd) = Sequencer.update msg model.sequencer  
      in
        ({ model | sequencer = updated}, Cmd.map SequencerMsg cmd)
    
    TransportMsg msg ->
      let 
        (updated, cmd) = Transport.update msg model.transport  
      in
        ({ model | transport = updated}, Cmd.map TransportMsg cmd)


-- subscriptions

subscriptions: Model -> Sub Msg
subscriptions model =
  Sub.batch [
    Sub.map SequencerMsg (Sequencer.subscriptions model.sequencer)
  ]    

-- view

view: Model -> Html Msg
view model =
  let
    top = topBar model.sequencer.bpm model.transport.playing
    sequencer = Html.map SequencerMsg (Sequencer.view model.sequencer) 
    transport = Html.map TransportMsg (Transport.view model.transport)
  in
    div [] [
      top, br [] [], sequencer, br [] [], transport
    ] 

topBar: Int -> Bool -> Html Msg
topBar bpm playing =
  let
    reset = SequencerMsg Sequencer.Reset
  in
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
            button [type_ "button", class "secondary button", disabled playing, onClick reset] [
              i [class "fi-skull"] []
            ]
          ]
        ]
      ]
    ]


-- bootstrap

init: Maybe String -> (Model, Cmd Msg)
init config =
  case config of
    Just json ->
      let
        model = { default | sequencer = deserialise json}
        cmd = Sequencer.init model.sequencer
      in  
        (model, Cmd.map SequencerMsg cmd)

    Nothing ->
      (default, Cmd.none)

main =
  Html.programWithFlags {
    init = init,
    view = view,
    update = update,
    subscriptions = subscriptions
  }