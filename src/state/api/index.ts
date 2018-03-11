import { ofType, combineEpics, Epic } from 'redux-observable'
import { Actions } from '../'
import initialState, { RootState } from '../initialState'
import { from } from 'rxjs/observable/from'
import { switchMap, map } from 'rxjs/operators'
import produce from 'immer'
import { createAction, getReturnType } from '../types'
import request from './request'

// ACTIONS
export const INIT_API_REQUEST = 'api/INIT_API_REQUEST'
export const COMPLETE_API_REQUEST = 'api/COMPLETE_API_REQUEST'

// ACTION CREATORS
interface ApiPayload {
  id: string
  method?: string
  param?: string
  process?: (...args: any[]) => any
}
interface ApiCompletionPayload extends ApiPayload {
  status: number
  data?: {}
  error?: string
}
export const makeApiRequest = (payload: ApiPayload) =>
  createAction(INIT_API_REQUEST, payload)
export const completeApiRequest = (payload: ApiCompletionPayload) =>
  createAction(COMPLETE_API_REQUEST, payload)

export const makeApiRequestType = getReturnType(makeApiRequest)
export const completeApiRequestType = getReturnType(completeApiRequest)

const apiRequest: Epic<Actions, RootState> = (action$, store) =>
  action$.pipe(
    ofType(INIT_API_REQUEST),
    switchMap(({ payload }) => {
      return from(request({ resource: payload.id })).pipe(
        map(({ status, data, error }) =>
          completeApiRequest({
            id: payload.id,
            status: status,
            data: data,
            error: error
          })
        )
      )
    })
  )

export const apiEpics = combineEpics(apiRequest)

const handlers = {
  [INIT_API_REQUEST]: (draft: Partial<RootState>, { id }: ApiPayload) => {
    draft[id] = { loading: true }
    return draft
  },
  [COMPLETE_API_REQUEST]: (
    draft: Partial<RootState>,
    { id, data, status, error }: ApiCompletionPayload
  ) => {
    draft[id].loading = false
    draft[id].status = status
    draft[id].data = data
    draft[id].error = error
    return draft
  }
}

const api = (state = initialState.api, action: Actions): Partial<RootState> =>
  handlers[action.type]
    ? produce(handlers[action.type])(state, action.payload)
    : state

export default api
