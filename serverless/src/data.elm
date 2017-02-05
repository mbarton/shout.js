module Data exposing (..)

import Dict exposing (Dict)

type alias Notes = List Bool

type alias Track = {
  position: Int,
  loading: Bool,
  notes: Notes
}

type alias Tracks = Dict String Track

type alias Model = {
  tracks: Tracks,
  bpm: Int,
  playing: Bool,
  step: Int
}

notes: List Int -> Notes
notes enabled =
  List.map (\i -> List.any (\j -> i == j) enabled) (List.range 0 15)

default: Model
default =
  {
    playing = False,
    step = -1,
    bpm = 120,
    tracks = Dict.fromList
      [
      ]
  }