import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { createAction } from '@reduxjs/toolkit'

export const requestSaveTodo = createAction('todos/requestSave')

export const saveTodoService = createApi({
  reducerPath: 'todos.service',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://httpbin.org/' }),
  endpoints: builder => ({
    saveTodo: builder.mutation({
      query: ({ delay = 3 }) => `delay/${delay}`
    })
  })
})
