import type { Metadata } from 'next';
import { Outfit } from 'next/font/google';
import { AuthProvider } from '@/contexts/AuthContext';
import { RecipeProvider } from '@/contexts/RecipeContext';
import { MealPlanProvider } from '@/contexts/MealPlanContext';
import BottomNav from '@/components/ui/BottomNav';
import './globals.css';

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'GlicoSmart - Seu Plano Alimentar',
  description: 'Monte seu plano alimentar personalizado',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning className={outfit.variable}>
      <body className="font-sans antialiased bg-slate-50 text-slate-800">
        <AuthProvider>
          <RecipeProvider>
            <MealPlanProvider>
              <div className="md:flex md:justify-center md:min-h-screen md:py-6 lg:py-10">
                <div className="md:w-[430px] md:min-h-[85vh] md:max-h-[93vh] md:overflow-y-auto md:bg-white md:rounded-3xl md:shadow-2xl md:shadow-slate-300/50 md:border md:border-slate-200/60 md:relative hide-scrollbar">
                  {children}
                  <BottomNav />
                </div>
              </div>
            </MealPlanProvider>
          </RecipeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
