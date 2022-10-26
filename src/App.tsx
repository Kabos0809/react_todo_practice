import React, { useState } from 'react'

type Todo = {
  value: string
  readonly id: number
  checked: boolean
  removed: boolean
}

type Filter = "all" | "checked" | "unchecked" | "removed"

export const App = () => {
  /*
    text = ステートの値
    setText = ステートの値を更新するメソッド
    useStateの引数 = ステートの初期値
  */
  const [text, setText] = useState('')
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<Filter>('all')

  const handleOnSubmit = () => {
    if (!text) return
    const newTodo: Todo = {
      value: text,
      id: new Date().getTime(),
      checked: false,
      removed: false,
    }
    setTodos([newTodo, ...todos])
    setText('')
  }

  const handelOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value)
  }

  //const handleOnEdit = (id: number, value: string) => {
  //  const deepCopy = todos.map((todo) => ({...todo}))
  //  const newTodos = deepCopy.map((todo) => {
  //    if (todo.id === id) {
  //      todo.value = value
  //    }
  //    return todo
  //  })
//
  //  console.log('=== Original todos ===')
  //  todos.map((todo) => console.log(`id: ${todo.id}, value: ${todo.value}`))
//
  //  setTodos(newTodos)
  //}
//
  //const handleOnCheck = (id: number, checked: boolean) => {
  //  const deepCopy = todos.map((todo) => ({ ...todo }))
  //  const newTodos = deepCopy.map((todo) => {
  //    if (todo.id === id) {
  //      todo.checked = !checked
  //    }
  //    return todo
  //  })
//
  //  setTodos(newTodos)
  //}
//
  //const handleOnRemove = (id: number, removed: boolean) => {
  //  const deepCopy = todos.map((todo) => ({ ...todo }))
  //  const newTodos = deepCopy.map((todo) => {
  //    if (todo.id === id) {
  //      todo.removed = !removed
  //    }
  //    return todo
  //  })
//
  //  setTodos(newTodos)
  //}

  const handleOnTodo = <T extends Todo, U extends keyof Todo, V extends T[U]>(
    obj: T,
    key: U,
    value: V
  ) => {
    const deepCopy = todos.map((todo) => ({ ...todo }))
    const newTodos = deepCopy.map((todo) => {
      if (todo.id === obj.id) {
        todo[key] = value
      }

      return todo
    })

    setTodos(newTodos)
  }

  const handleOnEmpty = () => {
    const newTodos = todos.filter((todo) => !todo.removed)
    setTodos(newTodos)
  }

  const filteredTodos = todos.filter((todo) => {
    switch (filter) {
      case 'all':
        return !todo.removed
      case 'checked':
        return todo.checked && !todo.removed
      case 'unchecked':
        return !todo.checked && !todo.removed
      case 'removed':
        return todo.removed
      default:
        return todo
    }
  })

  return (
    <div>
      <select defaultValue="all" onChange={(e) => setFilter(e.target.value as Filter)}>
        <option value="all">すべてのタスク</option>
        <option value="checked">完了したタスク</option>
        <option value="unchecked">現在のタスク</option>
        <option value="removed">ゴミ箱
      </option>
      </select>
      {filter === 'removed' ? (
        <button 
          onClick={handleOnEmpty}
          disabled={todos.filter((todo) => todo.removed).length === 0}
        >
          ゴミ箱を空にする
        </button>
      ):(
        filter !== 'checked' && (
        <form onSubmit={(e) => {
          e.preventDefault();
          handleOnSubmit();
        }}>
          <input type="text" 
                 value={text} 
                 onChange={(e) => handelOnChange(e)} 
          />
          <input type="submit"
                 value="追加"
                 onSubmit={handleOnSubmit}
          />
        </form>
        )
      )}
      <ul>
        {filteredTodos.map((todo) => {
          return (
          <li key={todo.id}>
            <input
              type="checkbox"
              disabled={todo.removed}
              checked={todo.checked}
              onChange={() => handleOnTodo(todo, 'checked', !todo.checked)}
            />
            <input
              type="text"
              disabled={todo.checked || todo.removed}
              value={todo.value}
              onChange={(e) => handleOnTodo(todo, 'value', e.target.value)}
            />
            <button onClick={() => handleOnTodo(todo, 'removed', !todo.removed)}>
              {todo.removed ? '復元' : '削除'}
            </button>
          </li>
          )
        })}
      </ul>
    </div>
  )
}

export default App