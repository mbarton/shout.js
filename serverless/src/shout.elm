import Html

import Interop
import Data exposing (Model)
import Update exposing (..)
import View exposing (view)

main =
  Html.programWithFlags {
    init = Interop.init,
    view = view,
    update = update,
    subscriptions = subscriptions
  }

subscriptions : Model -> Sub Msg
subscriptions model =
  Sub.batch [
    Interop.downloadedSamples(DownloadedSample),
    Interop.step(Step)
  ]