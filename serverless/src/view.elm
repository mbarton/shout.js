module View exposing (view)

import Html exposing (..)
import Html.Attributes exposing (class, disabled, type_, classList, value)
import Html.Events exposing (onClick)
import Set exposing (Set)
import Dict exposing (Dict)

import Update exposing (..)
import Data exposing (..)

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

renderLoading: Bool -> Html Msg
renderLoading loading =
  if loading then
    span [class "alert label"] [small [] [
      text "Loading"
    ]]
  else
    span [] []

renderTrack: Int -> Set String -> (String, Track) -> Html Msg
renderTrack step samplesLoading (name, track) =
  let
    renderedNotes = List.indexedMap (renderNote name step) track.notes
    loading = Set.member name samplesLoading
  in
    div [class "row"] [
      div [class "small-1 columns"] [
        div [class "row"] [
          div [class "small-6 columns"] [
            strong [] [text name]
          ],
          div [class "small-6 columns"] [renderLoading loading]
        ]
      ],
      div [class "small-11 columns"] (renderNoteBoxes renderedNotes)
    ]

topBar: Int -> Bool -> Bool -> Html Msg
topBar bpm playing generatingToken =
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
          button [type_ "button", class "button", disabled generatingToken, onClick GenerateLink] [
            text "Share"
          ]
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
    { playing, step, loading } = model.runtime

    tracks = Dict.toList model.tracks
    ordered = List.sortBy (\track -> (Tuple.second track).position) tracks
    rendered = List.map (renderTrack step loading) ordered

    top = [(topBar model.bpm playing model.rtc.generatingToken), (br [] [])]
    bottom = [(br [] []), (bottomBar playing)]
  in
    div [] (top ++ rendered ++ bottom)