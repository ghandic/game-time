import { AppSidebar } from "@/components/app-sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Bug, Github, HelpCircle } from "lucide-react";
import { Route, Routes } from "react-router";

import { Button } from "./components/ui/button";
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
        <div className="flex flex-row justify-between">
          <SidebarTrigger />
          <DropdownMenu>
            <DropdownMenuTrigger asChild><Button
              data-sidebar="trigger"
              data-slot="sidebar-trigger"
              variant="ghost"
              size="icon"
              className="h-7 w-7"
            >
              <HelpCircle />
              <span className="sr-only">Help</span>
            </Button></DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem><a href="https://github.com/ghandic/game-time" target="_blank"><div className="flex flex-row gap-2 items-center"><Github /><div>View the code</div></div></a></DropdownMenuItem>
              <DropdownMenuItem><a href="https://github.com/ghandic/game-time/issues/new" target="_blank"><div className="flex flex-row gap-2 items-center"><Bug /><div>Report an issue</div></div></a></DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

        </div>
        <div className="min-h-screen p-4 bg-gray-100">
          <Routes >
            <Route index element={<Home />} />
            <Route path="scoundrel" element={<Scoundrel />} />
          </Routes>
        </div>
      </main>
    </SidebarProvider></div>

  );
}

export default App;
