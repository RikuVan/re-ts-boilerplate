import { combineReducers, Reducer } from 'redux'
import { combineEpics } from 'redux-observable'
import { apiEpics } from './api'
import api, { makeApiRequestType, completeApiRequestType } from './api'
import { RootState } from './initialState'

export const rootEpic = combineEpics(apiEpics)

export type Actions = typeof makeApiRequestType | typeof completeApiRequestType

const appReducer: Reducer<RootState> = combineReducers({
  api
})

export default appReducer
