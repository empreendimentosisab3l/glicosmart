import { Food } from '@/lib/types';
import FoodDatabase from '@/components/alimentos/FoodDatabase';
import fs from 'fs';
import path from 'path';

export const metadata = {
  title: 'Alimentos - Índice Glicêmico',
  description: 'Banco de alimentos com índice glicêmico para diabéticos',
};

async function getFoods(): Promise<Food[]> {
  const filePath = path.join(process.cwd(), 'src/data/alimentos.json');
  const fileContents = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(fileContents);
}

export default async function AlimentosPage() {
  const foods = await getFoods();

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-white to-slate-50 pt-16 pb-12 px-4 sm:px-6 lg:px-8 border-b border-slate-100/50">
        <div className="max-w-md mx-auto text-center md:max-w-none">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl mb-3 relative inline-block">
            Banco de Alimentos
            <span className="absolute -top-1 -right-6 text-2xl animate-bounce">🥕</span>
          </h1>
          <p className="text-lg text-slate-500 leading-relaxed">
            Consulte o índice glicêmico de <span className="font-bold text-emerald-600">{foods.length} itens</span>.
          </p>
        </div>
      </div>

      <div className="-mt-6">
        <FoodDatabase foods={foods} />
      </div>
    </div>
  );
}
