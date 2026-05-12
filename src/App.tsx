/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Phone, 
  Send, 
  CheckCircle2, 
  Hammer, 
  Clock, 
  MapPin, 
  Menu, 
  X, 
  Star,
  Zap,
  ShieldCheck,
  Thermometer,
  Wrench,
  Settings,
  Flame,
  Droplets,
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronDown
} from 'lucide-react';

import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { LeadModal } from './components/LeadModal';
import { SectionHeader } from './components/SectionHeader';

// --- Constants & Data ---

const PRIMARY_CITIES = [
  'Симферополь',
  'Бахчисарай',
  'Ялта',
  'Алушта',
  'Евпатория',
  'Саки'
];

const INTERACTIVE_SERVICES = [
  {
    id: 'boiler',
    name: 'Бойлер',
    price: '2500',
    faults: 'Замена ТЭНа · Демонтаж · Замена термостата',
    faultsList: [
      { name: 'Замена ТЭНа', price: '3000' },
      { name: 'Монтаж - демонтаж', price: '4000' },
      { name: 'Замена термостата', price: '2500' }
    ],
    image: '/assets/бойлер.jpg'
  },
  {
    id: 'washing',
    name: 'Стиральная машина',
    price: '3000',
    faults: 'Замена подшипников · Замена помпы · Замена манжеты · Ремонт мотора',
    faultsList: [
      { name: 'Замена подшипников', price: '6000' },
      { name: 'Замена помпы', price: '3000' },
      { name: 'Замена манжеты', price: '3500' },
      { name: 'Ремонт / замена мотора', price: '4000' }
    ],
    image: '/assets/стиральная машина.jpg'
  },
  {
    id: 'gas-boiler',
    name: 'Котёл',
    price: '3000',
    faults: 'ТО · Замена насоса · Промывка теплообменника · Замена расширительного бака',
    faultsList: [
      { name: 'Техническое обслуживание', price: '3000' },
      { name: 'Замена насоса', price: '4000' },
      { name: 'Промывка теплообменника', price: '5000' },
      { name: 'Замена расширительного бака', price: '5000' }
    ],
    image: '/assets/котел.jpg'
  },
  {
    id: 'column',
    name: 'Колонка',
    price: '2500',
    faults: 'Замена мембраны · ТО · Замена газового клапана',
    faultsList: [
      { name: 'Замена мембраны', price: '2500' },
      { name: 'Техническое обслуживание', price: '3500' },
      { name: 'Замена газового клапана', price: '3000' }
    ],
    image: '/assets/колонка.jpeg'
  },
  {
    id: 'ac',
    name: 'Кондиционер',
    price: '3500',
    faults: 'Чистка · Заправка',
    faultsList: [
      { name: 'Чистка внутреннего блока', price: '3500' },
      { name: 'Заправка фреоном', price: '3500' }
    ],
    image: '/assets/кондиционер.jpg'
  },
  {
    id: 'cleaning',
    name: 'Клининг',
    price: 'по договоренности',
    faults: 'Уборка после ремонта · Генеральная уборка · Мытьё окон',
    faultsList: [
      { name: 'Уборка после ремонта', price: 'по договоренности' },
      { name: 'Генеральная уборка', price: 'по договоренности' },
      { name: 'Мытьё окон', price: 'по договоренности' }
    ],
    image: '/assets/cleaning.jpg'
  }
];

const REVIEWS = [
  { id: 1, name: 'Александр', city: 'Ялта', text: 'Кондиционер перестал охлаждать в самый жаркий день. Мастер приехал быстро, объяснил причину и сразу заправил систему.', rating: 5, featured: true },
  { id: 2, name: 'Елена', city: 'Бахчисарай', text: 'Котел отключился вечером. По телефону подсказали, что проверить, а утром уже заменили деталь. Цена была понятна заранее.', rating: 5 },
  { id: 3, name: 'Игорь', city: 'Симферополь', text: 'Сначала сделали диагностику и назвали стоимость. Ничего лишнего не навязывали, ремонт согласовали до начала работ.', rating: 4 },
  { id: 4, name: 'Марина', city: 'Алушта', text: 'Посудомойка не грела воду. Мастер заменил ТЭН прямо на кухне, после себя все оставил чисто.', rating: 5, featured: true },
  { id: 5, name: 'Сергей', city: 'Саки', text: 'Стиралка не запускалась и показывала ошибку. Мастер нашел проблему в плате, починил без замены всей машины.', rating: 5 },
];

const ADVANTAGES = [
  { icon: <Clock />, title: 'Выезд сегодня', desc: 'Примем заявку и подберем ближайшее время без долгого ожидания.' },
  { icon: <ShieldCheck />, title: 'Цена до ремонта', desc: 'Сначала диагностика и согласование, потом работа. Без сюрпризов.' },
  { icon: <Zap />, title: 'Ремонт на дому', desc: 'Чиним технику у вас дома, когда это возможно и безопасно.' },
  { icon: <Hammer />, title: 'Гарантия на работу', desc: 'После ремонта объясним причину поломки и дадим гарантию.' },
];

// --- Components ---

export default function App() {
  const [addressQuery, setAddressQuery] = useState('');
  const [addressResult, setAddressResult] = useState<'success' | 'fail' | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '', problem: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [activeServiceIndex, setActiveServiceIndex] = useState(() => 
    typeof window !== 'undefined' && window.innerWidth < 1024 ? -1 : 0
  );
  const [timerKey, setTimerKey] = useState(0);
  const [isAtStart, setIsAtStart] = useState(true);
  const reviewsRef = React.useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (reviewsRef.current) {
      const { scrollLeft } = reviewsRef.current;
      setIsAtStart(scrollLeft <= 5);
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth >= 1024 && activeServiceIndex === -1) {
      setActiveServiceIndex(0);
    }
  }, []);

  useEffect(() => {
    // Автопереключение только для десктопа
    if (typeof window !== 'undefined' && window.innerWidth < 1024) return;
    if (activeServiceIndex === -1) return;

    const timer = setTimeout(() => {
      setActiveServiceIndex((prev) => {
        if (prev === -1) return 0;
        return (prev + 1) % INTERACTIVE_SERVICES.length;
      });
      setTimerKey((prev) => prev + 1);
    }, 10000);
    return () => clearTimeout(timer);
  }, [activeServiceIndex, timerKey]);

  const handleModalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const webhookUrl = import.meta.env.VITE_GOOGLE_SHEETS_WEBHOOK_URL;
    const tgToken = import.meta.env.VITE_TELEGRAM_BOT_TOKEN;
    const tgChatId = import.meta.env.VITE_TELEGRAM_CHAT_ID;
    
    // Отправка в Google Sheets
    if (webhookUrl) {
      try {
        await fetch(webhookUrl, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...formData,
            timestamp: new Date().toLocaleString(),
            source: 'Site Modal'
          }),
        });
      } catch (error) {
        console.error('Error sending lead to Sheets:', error);
      }
    }

    // Отправка в Telegram
    if (tgToken && tgChatId) {
      try {
        const message = `🚀 *Новая заявка!*\n\n👤 *Имя:* ${formData.name}\n📞 *Телефон:* ${formData.phone}\n🛠 *Проблема:* ${formData.problem || 'Не указана'}\n\n📍 *Откуда:* Сайт (Попап)`;
        await fetch(`https://api.telegram.org/bot${tgToken}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: tgChatId,
            text: message,
            parse_mode: 'Markdown'
          }),
        });
      } catch (error) {
        console.error('Error sending lead to Telegram:', error);
      }
    }

    if (!webhookUrl && (!tgToken || !tgChatId)) {
      // Имитация для демо, если ничего не задано
      await new Promise(resolve => setTimeout(resolve, 1500));
    }

    setIsSubmitting(false);
    setIsSubmitted(true);
    setTimeout(() => {
      setIsModalOpen(false);
      setIsSubmitted(false);
      setFormData({ name: '', phone: '', problem: '' });
    }, 2000);
  };

  const handleAddressCheck = (e: React.FormEvent) => {
    e.preventDefault();
    const query = addressQuery.toLowerCase().trim();
    if (!query) return;

    const isAvailable = PRIMARY_CITIES.some(city => query.includes(city.toLowerCase()));
    setAddressResult(isAvailable ? 'success' : 'fail');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900">
      
      <LeadModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        isSubmitted={isSubmitted}
        isSubmitting={isSubmitting}
        formData={formData}
        onFormChange={setFormData}
        onSubmit={handleModalSubmit}
      />

      <Header />

      <main>
        
        {/* Hero Section */}
        <section className="relative pt-10 pb-24 md:pt-24 md:pb-32 overflow-hidden bg-white border-b border-slate-100">
          {/* Decorative background graphics */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
            {/* Grid Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:60px_60px] opacity-[0.4]" />
            
            <motion.div 
              animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-20 left-[5%] opacity-[0.02] text-blue-600 hidden lg:block"
            >
              <Wrench size={180} strokeWidth={0.5} />
            </motion.div>
            <motion.div 
              animate={{ y: [0, 25, 0], rotate: [0, -8, 0] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute bottom-10 right-[5%] opacity-[0.02] text-blue-600 hidden lg:block"
            >
              <Settings size={220} strokeWidth={0.5} />
            </motion.div>
            <motion.div 
              animate={{ x: [0, 15, 0], y: [0, 10, 0] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              className="absolute top-1/2 left-[2%] opacity-[0.01] text-blue-600 hidden xl:block"
            >
              <Hammer size={130} strokeWidth={0.5} />
            </motion.div>
            <motion.div 
              animate={{ scale: [1, 1.05, 1], opacity: [0.02, 0.04, 0.02] }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-32 -right-32 w-[500px] h-[500px] bg-blue-100 rounded-full blur-[120px]"
            />
            <motion.div 
              animate={{ scale: [1, 1.1, 1], opacity: [0.01, 0.03, 0.01] }}
              transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
              className="absolute -bottom-32 -left-32 w-[400px] h-[400px] bg-blue-50 rounded-full blur-[100px]"
            />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center max-w-4xl mx-auto">
              <div className="flex flex-col items-center">
                <motion.div 
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-bold rounded-full uppercase tracking-widest mb-1"
                >
                  Выезд по Крыму
                </motion.div>
                <motion.h1 
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-4xl md:text-6xl font-extrabold text-slate-900 leading-tight tracking-tight mb-6 font-display"
                >
                  Ремонт бытовой техники <br /> <span className="text-blue-600">без лишних хлопот</span>
                </motion.h1>
                <motion.p 
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-sm md:text-lg text-slate-600 mb-6 md:mb-10 leading-relaxed mx-auto max-w-md"
                >
                  Выезд за 1 час. Честные цены и гарантия до года. Чиним любую крупную технику на дому.
                </motion.p>
                <motion.div 
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex flex-col items-center"
                >
                  <div className="flex flex-col sm:flex-row gap-2 justify-center items-center sm:items-start w-full">
                    <div className="flex flex-col items-center gap-2 w-full sm:w-auto">
                      <button 
                        onClick={() => setIsModalOpen(true)}
                        className="w-full sm:w-64 bg-blue-600 text-white px-8 py-4 rounded-xl font-bold shadow-lg shadow-blue-100 hover:bg-blue-700 hover:scale-105 active:scale-95 transition-all text-center"
                      >
                        Оставить заявку
                      </button>
                      <p className="hidden sm:block text-slate-400 text-[10px] font-normal">*отвечаем на заявку в течение 15 минут</p>
                    </div>

                    <div className="flex flex-col items-center gap-2 w-full sm:w-auto">
                      <a 
                        href="https://t.me/DochGubernatora" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="w-full sm:w-64 flex items-center justify-center gap-2 px-8 py-4 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-50 hover:scale-105 active:scale-95 transition-all shadow-sm group"
                      >
                        <Send size={18} className="text-[#0088cc] group-hover:scale-110 transition-transform" />
                        <span>Написать мастеру</span>
                      </a>
                      <p className="sm:hidden text-slate-400 text-[10px] font-normal">*отвечаем на заявку в течение 15 минут</p>
                    </div>
                  </div>
                </motion.div>
                

              </div>
            </div>
          </div>
        </section>

        {/* Advantages */}
        <section id="advantages" className="pt-12 pb-24 md:py-24 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeader 
              title="Почему нам доверяют"
              subtitle="Коротко объясняем причину поломки, цену и сроки до начала ремонта."
            />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {ADVANTAGES.map((adv, idx) => (
                <motion.div 
                  key={idx}
                  className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm transition-all"
                >
                  <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 mb-6">
                    {adv.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-slate-900 font-display">{adv.title}</h3>
                  <p className="text-slate-500 leading-relaxed text-sm">{adv.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Interactive Services Block */}
        <section id="services" className="pt-12 pb-24 md:py-32 bg-white border-y border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeader 
              title="Что мы ремонтируем"
              subtitle="Для точной оценки стоимости мастеру необходимо провести осмотр техники."
            />

            <div className="grid lg:grid-cols-12 gap-12 lg:gap-20 items-start">
              {/* Left Column: Services list */}
              <div className="lg:col-span-6 space-y-0">
                {INTERACTIVE_SERVICES.map((service, idx) => {
                  const isActive = activeServiceIndex === idx;
                  return (
                    <div 
                      key={service.id}
                      className="group relative pt-4 md:pt-6 cursor-pointer border-b border-slate-100 last:border-0"
                      onMouseEnter={() => {
                        if (window.innerWidth >= 1024) {
                          setActiveServiceIndex(idx);
                          setTimerKey(k => k + 1);
                        }
                      }}
                      onClick={() => {
                        if (window.innerWidth < 1024 && activeServiceIndex === idx) {
                          setActiveServiceIndex(-1);
                        } else {
                          setActiveServiceIndex(idx);
                          setTimerKey(k => k + 1);
                        }
                      }}
                    >
                      <div className="flex items-center justify-between py-2">
                        <span className={`text-2xl md:text-3xl font-extrabold transition-all duration-300 font-display ${isActive ? 'text-slate-900 translate-x-1 md:translate-x-2' : 'text-slate-300 hover:text-slate-400'}`}>
                          {service.name}
                        </span>
                        
                        {/* Desktop Price Information next to Title */}
                        {isActive && window.innerWidth >= 1024 && (
                          <div className="hidden lg:flex items-baseline gap-1 animate-in fade-in slide-in-from-right-4 duration-500">
                            {service.price === 'по договоренности' ? (
                              <span className="text-lg font-bold text-slate-400 font-display">по договоренности</span>
                            ) : (
                              <>
                                <span className="text-slate-400 text-xs font-medium uppercase tracking-wider">от</span>
                                <span className="text-2xl font-black text-slate-900 font-display">{service.price} ₽</span>
                              </>
                            )}
                          </div>
                        )}

                        <div className="lg:hidden">
                          <ChevronDown 
                            strokeWidth={1.5} 
                            className={`w-6 h-6 transition-all duration-300 ${isActive ? 'rotate-180 text-blue-600' : 'text-slate-300'}`} 
                          />
                        </div>
                      </div>
                      
                      {/* Progress Line Container */}
                      <div className="relative mt-2 h-[2px]">
                        <div className={`absolute inset-0 rounded-full transition-colors duration-300 ${isActive ? (window.innerWidth < 1024 ? 'bg-blue-600' : 'bg-slate-200') : 'bg-slate-200'}`} />
                        {isActive && window.innerWidth >= 1024 && (
                          <div className="absolute inset-0 overflow-hidden rounded-full">
                            <motion.div 
                              key={timerKey}
                              initial={{ x: '-100%' }}
                              animate={{ x: '0%' }}
                              transition={{ duration: 10, ease: "linear" }}
                              className="w-full h-full bg-blue-600 rounded-full"
                            />
                          </div>
                        )}
                      </div>

                      {/* Expandable Content for Both Mobile and Desktop */}
                      <AnimatePresence>
                        {isActive && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                          >
                            <div className="py-6 space-y-6">
                              {/* Mobile Image (hidden on desktop) */}
                              <div className="lg:hidden relative rounded-xl overflow-hidden aspect-video shadow-md">
                                <img 
                                  src={service.image} 
                                  alt={service.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="space-y-4">
                                <div className="space-y-3">
                                  {service.faultsList?.map((fault, fIdx) => (
                                    <div key={fIdx} className="flex justify-between items-baseline gap-2 pb-1">
                                      <span className="text-slate-600 text-sm md:text-base">{fault.name}</span>
                                      <span className="text-slate-900 font-bold text-sm md:text-base whitespace-nowrap">{service.price === 'по договоренности' ? '' : (fault.price === 'по договоренности' ? 'по договоренности' : `от ${fault.price} ₽`)}</span>
                                    </div>
                                  ))}
                                </div>
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setIsModalOpen(true);
                                  }}
                                  className="lg:hidden w-full py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all active:scale-95 shadow-lg shadow-blue-200"
                                >
                                  Заказать консультацию
                                </button>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>

              {/* Right: Visual Content (Desktop Only) */}
              <div className="hidden lg:block lg:col-span-6 sticky top-32">
                {activeServiceIndex !== -1 && (
                  <div className="space-y-10">
                    <div className="relative rounded-3xl overflow-hidden bg-slate-50 aspect-[4/3] shadow-2xl shadow-blue-500/10 group border border-slate-100">
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={activeServiceIndex}
                          initial={{ opacity: 0, scale: 1.05 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                          className="absolute inset-0"
                        >
                          <img 
                            src={INTERACTIVE_SERVICES[activeServiceIndex].image} 
                            alt={INTERACTIVE_SERVICES[activeServiceIndex].name}
                            className="w-full h-full object-cover"
                          />
                        </motion.div>
                      </AnimatePresence>
                    </div>

                    <motion.div 
                      key={`desktop-btn-${activeServiceIndex}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      <button 
                        onClick={() => setIsModalOpen(true)}
                        className="w-full bg-blue-600 text-white py-5 rounded-2xl font-bold hover:bg-blue-700 transition-all hover:scale-105 active:scale-95 shadow-xl shadow-blue-500/10 text-lg whitespace-nowrap"
                      >
                        Заказать бесплатную консультацию
                      </button>
                    </motion.div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Interactive Map/Area Check */}
        <section id="map" className="pt-12 pb-24 md:py-32 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeader 
              title="Где мы работаем"
              subtitle="Выезжаем во все города и поселки полуострова"
            />
            <div className="bg-white rounded-3xl p-8 md:p-12 border border-slate-100 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Зона охвата</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 hidden md:block">Проверьте ваш адрес</h3>
                  <div className="md:hidden mt-4">
                    <h3 className="text-xl font-bold text-slate-900 mb-4">Города выезда</h3>
                    <div className="grid grid-cols-2 gap-y-3 gap-x-4">
                      {PRIMARY_CITIES.map((city, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm font-medium text-slate-600">
                          <span className="w-1.5 h-1.5 bg-blue-600 rounded-full shrink-0" />
                          {city}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="hidden md:flex gap-2 shrink-0">
                  <span className="px-3 py-1 bg-green-50 text-green-600 text-[10px] font-bold rounded-full uppercase tracking-widest flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                    Мастера на связи
                  </span>
                </div>
              </div>

              <div className="hidden md:block relative mb-8">
                <input 
                  type="text" 
                  placeholder="Город или район, например Симферополь"
                  className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all text-sm outline-none"
                  value={addressQuery}
                  onChange={(e) => {
                    setAddressQuery(e.target.value);
                    setAddressResult(null);
                  }}
                />
                <button 
                  onClick={handleAddressCheck}
                  className="absolute right-2 top-2 bottom-2 bg-slate-900 text-white px-6 rounded-lg text-sm font-bold hover:bg-slate-800 hover:scale-[1.03] active:scale-[0.97] transition-all"
                >
                  Проверить
                </button>
              </div>

              <AnimatePresence mode="wait">
                {addressResult === 'success' && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="hidden md:block mb-8 p-4 bg-green-50 text-green-700 rounded-xl text-sm font-medium border border-green-100"
                  >
                    Да, выезжаем сюда. Свяжемся и уточним удобное время.
                  </motion.div>
                )}
                {addressResult === 'fail' && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="hidden md:block mb-8 p-4 bg-red-50 text-red-700 rounded-xl text-sm font-medium border border-red-100"
                  >
                    Пока не видим этот район в зоне выезда. Напишите нам - проверим вручную.
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="aspect-[21/10] w-full bg-slate-100 rounded-2xl relative overflow-hidden">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1419409.049458992!2d32.744158499999996!3d45.068222949999996!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40ea674ec2575ed1%3A0xe7264a7c06eb7058!2z0JrRgNGL0Lw!5e0!3m2!1sru!2sru!4v1714800000000!5m2!1sru!2sru" 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen={true} 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  className="grayscale hover:grayscale-0 transition-all duration-700"
                ></iframe>
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-4 rounded-xl border border-slate-100 shadow-lg pointer-events-none hidden md:block">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Города выезда</p>
                  <ul className="text-xs text-slate-700 font-medium space-y-1">
                    <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-blue-600 rounded-full"/> Симферополь</li>
                    <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-blue-600 rounded-full"/> Бахчисарай</li>
                    <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-blue-600 rounded-full"/> Ялта и Алушта</li>
                    <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-blue-600 rounded-full"/> Саки и Евпатория</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Reviews */}
        <section id="reviews" className="pt-12 pb-24 md:py-32 bg-white border-b border-slate-100 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-row items-center justify-between gap-4 mb-6 md:mb-12">
              <div className="flex-1">
                <SectionHeader 
                  title="Отзывы клиентов"
                  align="left"
                  noMargin
                />
              </div>
              
              <div className="flex gap-2">
                <button 
                  disabled={isAtStart}
                  onClick={() => {
                    if (reviewsRef.current) reviewsRef.current.scrollBy({ left: -400, behavior: 'smooth' });
                  }}
                  className={`w-10 h-10 rounded-xl border border-slate-100 bg-white flex items-center justify-center transition-all ${isAtStart ? 'opacity-30 cursor-not-allowed text-slate-300' : 'text-slate-400 hover:text-blue-600 hover:border-blue-100 hover:shadow-md hover:shadow-blue-500/5 cursor-pointer hover:scale-105 active:scale-95'}`}
                >
                  <ChevronLeft size={20} />
                </button>
                <button 
                  onClick={() => {
                    if (reviewsRef.current) reviewsRef.current.scrollBy({ left: 400, behavior: 'smooth' });
                  }}
                  className="w-10 h-10 rounded-xl border border-slate-100 bg-white flex items-center justify-center text-slate-400 hover:text-blue-600 hover:border-blue-100 hover:shadow-md hover:shadow-blue-500/5 transition-all cursor-pointer hover:scale-105 active:scale-95"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>

            <div 
              ref={reviewsRef}
              onScroll={handleScroll}
              id="reviews-container"
              className="flex overflow-x-auto gap-5 pb-8 snap-x snap-mandatory no-scrollbar"
            >
              {REVIEWS.map((rev) => (
                <div 
                  key={rev.id} 
                  className="min-w-[80%] md:min-w-[320px] snap-start p-6 rounded-2xl border bg-white border-slate-100 shadow-sm transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex gap-1 mb-4 text-yellow-400">
                      {[...Array(rev.rating)].map((_, i) => <Star key={i} className="w-3 h-3 fill-current" />)}
                    </div>
                    <p className="leading-relaxed text-sm text-slate-600">
                      {rev.text}
                    </p>
                  </div>
                  <div className="mt-6 text-xs font-medium text-slate-400 font-display tracking-wider">
                    {rev.name} · {rev.city}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="pt-12 pb-24 md:py-24 bg-white relative">
           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="relative rounded-3xl overflow-hidden bg-blue-600 p-8 md:p-20 text-center shadow-2xl shadow-blue-200">
                 <div className="max-w-3xl mx-auto">
                    <h2 className="text-2xl md:text-4xl font-extrabold text-white mb-12 font-display leading-tight">
                      Техника подвела? <br/> Поможем разобраться
                    </h2>
                    <div className="flex flex-col items-center">
                       <div className="flex flex-col items-center gap-4 w-full sm:w-auto">
                         <button 
                            onClick={() => setIsModalOpen(true)}
                            className="w-full sm:w-72 bg-white text-blue-600 px-10 py-5 rounded-2xl font-bold text-lg hover:bg-blue-50 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-blue-900/20"
                          >
                            Оставить заявку
                         </button>
                         <p className="text-blue-100/60 text-[10px] font-normal">*отвечаем на заявку в течение 15 минут</p>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
