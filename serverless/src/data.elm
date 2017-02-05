module Data exposing (..)

import Dict exposing (Dict)
import Set exposing (Set)

type alias Notes = List Bool

type alias Track = {
  position: Int,
  notes: Notes
}

type alias Tracks = Dict String Track

type alias Runtime = {
  playing: Bool,
  step: Int,
  loading: Set String
}

type alias Model = {
  tracks: Tracks,
  bpm: Int,
  runtime: Runtime
}

notes: List Int -> Notes
notes enabled =
  List.map (\i -> List.any (\j -> i == j) enabled) (List.range 0 15)

runtimeAtStart: Runtime
runtimeAtStart =
  { playing = False, step = -1, loading = Set.empty }

default: Model
default =
  {
    bpm = 120,
    tracks = Dict.fromList
      [
        ("kick", { position = 0, notes = notes [0, 4, 8, 12] }),
        ("hihat", { position = 1, notes = notes [2, 6, 10, 14] }),
        ("snare", { position = 2, notes = notes [4, 12] })
      ],
    runtime = runtimeAtStart
  }