import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
export const saveTodoService = createApi({
  reducerPath: 'todos.service',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://httpbin.org/' }),
  endpoints: builder => ({
    saveTodo: builder.mutation({
      query: ({delay=3}) => `delay/${delay}`
    })
  })
})
