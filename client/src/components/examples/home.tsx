import { ThemeProvider } from "@/components/theme-provider";
import { Home } from "@/components/home";

export default function HomeExample() {
  return (
    <ThemeProvider>
      <div className="h-screen">
        <Home />
      </div>
    </ThemeProvider>
  );
}