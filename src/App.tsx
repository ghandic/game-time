import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Route, Routes } from "react-router";

import Scoundrel from './games/scoundrel';

function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-3xl">Game Time</h1>
      <p className="text-lg mt-4">Select a game from the sidebar to get started.</p>
    </div>
  )
}

function App() {

  return (

    <div className="w-full"><SidebarProvider>
      <AppSidebar />
      <main className="w-full">
        <SidebarTrigger />
        <div className="min-h-screen p-4 bg-gray-100">
          <Routes>
            <Route index element={<Home />} />
            <Route path="scoundrel" element={<Scoundrel />} />
          </Routes>
        </div>
      </main>
    </SidebarProvider></div>

  );
}

export default App;
