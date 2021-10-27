import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { addTodo } from './todosSlice'
import { saveTodoService, requestSaveTodo } from 'services/saveTodo'
import { bus } from 'services/bus'
const mapDispatch = { addTodo }

const { useSaveTodoMutation } = saveTodoService

// Any function returning an RxJS subscription
export function useWhileMounted(subsFactory) {
  useEffect(() => {
    const sub = subsFactory()
    return () => sub?.unsubscribe()
  }, [])
}

const AddTodo = ({ addTodo }) => {
  const [todoText, setTodoText] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [saveTodo] = useSaveTodoMutation()

  const onChange = e => setTodoText(e.target.value)

  // While this component is mounted..
  //   For any requestSaveTodo,
  //     Initiate athe RTKQ saveTodo function, returning its Promise
  //     Handle the start(subscribe) and end(complete) events with local state mutations
  //
  // This listener is in queueing mode - only 1 query will execute at a time,
  //   and saves will occur at the server in the order they occurred at the client.
  useWhileMounted(() =>
    bus.listenQueueing(
      requestSaveTodo.match,
      // Optimistic UI option
      // ({ payload }) => {
      //   addTodo(payload)
      //   return saveTodo(payload)
      // },
      // Await service response option
      // async ({ payload }) => {
      //   await saveTodo(payload)
      //   addTodo(payload)
      // },
      {
        subscribe() {
          setIsLoading(true)
        },
        complete() {
          setIsLoading(false)
        }
      }
    )
  )
  return (
    <div>
      <form
        onSubmit={e => {
          e.preventDefault()
          if (!todoText.trim()) {
            return
          }
          // D̶o̶ ̶t̶h̶e̶ ̶A̶P̶I̶ ̶c̶a̶l̶l̶.̶
          // Put a request to save onto the event bus.
          bus.trigger(requestSaveTodo(todoText))
          setTodoText('')
        }}
      >
        <input value={todoText} onChange={onChange} />
        <button type="submit">Add Todo{isLoading ? '...' : ''}</button>
      </form>
    </div>
  )
}

export default connect(null, mapDispatch)(AddTodo)
