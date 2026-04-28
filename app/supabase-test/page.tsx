import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'

export default async function Page() {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const { data: todos } = await supabase.from('todos').select()

  return (
    <div className="p-8 text-white bg-[#020617] min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Supabase Connection Test</h1>
      {todos && todos.length > 0 ? (
        <ul className="list-disc pl-5">
          {todos.map((todo: any) => (
            <li key={todo.id}>{todo.name}</li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-400">No todos found or table 'todos' does not exist.</p>
      )}
      <div className="mt-8">
        <a href="/" className="text-blue-500 hover:underline">Back to Home</a>
      </div>
    </div>
  )
}
