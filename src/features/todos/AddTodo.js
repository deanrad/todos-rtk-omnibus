import React, { useState } from 'react'
import { connect } from 'react-redux'
import { addTodo } from './todosSlice'
import { saveTodoService } from 'services/saveTodo'

const mapDispatch = { addTodo }

const { useSaveTodoMutation } = saveTodoService

const AddTodo = ({ addTodo }) => {
  const [todoText, setTodoText] = useState('')
  const [saveTodo, { isLoading }] = useSaveTodoMutation()

  const onChange = e => setTodoText(e.target.value)

  return (
    <div>
      <form
        onSubmit={e => {
          e.preventDefault()
          if (!todoText.trim()) {
            return
          }
          // Do the API call.
          // Race conditions due to saves going concurrently
          // - Saves can go concurrently, leading to indeterminate save order
          // - RTKQ only tracks loading status for a single todo at a time,
          //   so if #1 is still loading when #2 completes, the loading indicator
          //   will be gone too soon
          saveTodo(todoText).then(() => {
            addTodo(todoText)
            setTodoText('')
          })
        }}
      >
        <input value={todoText} onChange={onChange} />
        <button type="submit">Add Todo{isLoading ? '...' : ''}</button>
      </form>
    </div>
  )
}

export default connect(null, mapDispatch)(AddTodo)
