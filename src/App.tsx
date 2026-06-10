import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SharedLayout from "@/components/layout/SharedLayout";
import Home from "./pages/Index";
import Services from "./pages/Services";
import ServicesInFull from "./pages/ServicesInFull";
import Arrival from "./pages/Arrival";
import About from "./pages/About";
import Contact from "./pages/Contact";
import CoolCalm from "./pages/CoolCalm";
import WhoWeServe from "./pages/WhoWeServe";
import PersonaExpat from "./pages/PersonaExpat";
import PersonaTicinese from "./pages/PersonaTicinese";
import PersonaCorporate from "./pages/PersonaCorporate";
import PersonaVisitor from "./pages/PersonaVisitor";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<SharedLayout />}>
            <Route index element={<Home />} />
            <Route path="services" element={<Services />} />
            <Route path="services-in-full" element={<ServicesInFull />} />
            <Route path="arrival" element={<Arrival />} />
            <Route path="who-we-serve" element={<WhoWeServe />} />
            <Route path="expat" element={<PersonaExpat />} />
            <Route path="ticinese" element={<PersonaTicinese />} />
            <Route path="corporate" element={<PersonaCorporate />} />
            <Route path="visitor" element={<PersonaVisitor />} />
            <Route path="cool-calm" element={<CoolCalm />} />
            <Route path="about" element={<About />} />
            <Route path="contact" element={<Contact />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
