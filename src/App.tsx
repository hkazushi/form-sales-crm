import React from 'react'
import { supabase } from './lib/supabaseClient'

function App() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">Revos</h1>
          <p className="text-gray-400">営業自動化プラットフォームへようこそ</p>
        </header>
        
        <main className="max-w-md mx-auto">
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">ログイン</h2>
            
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  メールアドレス
                </label>
                <input
                  type="email"
                  defaultValue="demo@example.com"
                  className="w-full px-3 py-2 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">
                  パスワード
                </label>
                <input
                  type="password"
                  className="w-full px-3 py-2 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 py-2 px-4 rounded-md transition-colors"
              >
                → ログイン
              </button>
            </form>
            
            <div className="mt-4 text-center">
              <a href="#" className="text-blue-400 hover:text-blue-300 text-sm">
                新規アカウント登録
              </a>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default App
