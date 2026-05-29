import React, { useState, useMemo } from 'react';
import { Star, MapPin, Clock, Phone, MessageSquare, ShieldCheck, Plus, ShoppingBag, ShieldAlert, Heart, Calendar } from 'lucide-react';
import { Workshop, Part, Review } from '../types';
import { INITIAL_REVIEWS } from '../data';

interface WorkshopProfileProps {
  workshopId: string;
  workshopsState: Workshop[];
  partsState: Part[];
}

export default function WorkshopProfile({
  workshopId,
  workshopsState,
  partsState
}: WorkshopProfileProps) {

  // Load the target workshop
  const workshop = useMemo(() => {
    return workshopsState.find(w => w.id === workshopId) || workshopsState[0];
  }, [workshopsState, workshopId]);

  // Load target parts listed in this workshop
  const featuredParts = useMemo(() => {
    return partsState.filter(p => p.workshopId === workshop.id);
  }, [partsState, workshop]);

  // Handle local reviews state to allow user submit reviews
  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);

  // Likes/Favorites toggle
  const [isFavorite, setIsFavorite] = useState(false);

  // Review states inputs
  const [authorName, setAuthorName] = useState('');
  const [selectedStars, setSelectedStars] = useState(5);
  const [commentText, setCommentText] = useState('');
  const [bikeQueryModel, setBikeQueryModel] = useState('');

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName || !commentText) return;

    const newReview: Review = {
      id: 'R-' + Date.now(),
      author: authorName,
      rating: selectedStars,
      date: new Date().toISOString().split('T')[0],
      comment: commentText,
      bikeModel: bikeQueryModel || 'Yamaha FZ25'
    };

    setReviews(prev => [newReview, ...prev]);
    
    // Reset reviews state
    setAuthorName('');
    setSelectedStars(5);
    setCommentText('');
    setBikeQueryModel('');
  };

  // Re-calculate rating on-the-fly for realistic prototyping
  const activeRatingMetric = useMemo(() => {
    const allRatingsSum = reviews.reduce((sum, r) => sum + r.rating, 0);
    const avg = allRatingsSum / reviews.length;
    return {
      avg: parseFloat(avg.toFixed(1)),
      count: reviews.length
    };
  }, [reviews]);

  return (
    <div className="w-full blueprint-bg bg-matte-950 text-gray-100 min-h-screen pt-4 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">

        {/* 1. HERO BANNER HEADER JUMBOTRON */}
        <div className="relative h-64 md:h-80 w-full rounded-2xl overflow-hidden shadow-2xl border border-matte-800">
          <img 
            src={workshop.banner} 
            alt={workshop.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-matte-950 via-matte-950/50 to-transparent"></div>

          {/* Floated actions top right */}
          <div className="absolute top-4 right-4 flex items-center gap-3">
            <button
              onClick={() => setIsFavorite(!isFavorite)}
              className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-center ${
                isFavorite 
                  ? 'bg-rose-500 border-rose-450 text-white' 
                  : 'bg-matte-950/80 border-matte-800 text-gray-400 hover:text-white'
              }`}
              title={isFavorite ? 'Quitar de Favoritos' : 'Agregar de Favoritos'}
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
            </button>
          </div>

          {/* Floated content details bottom left */}
          <div className="absolute bottom-6 left-6 right-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
            <div className="flex items-center gap-4">
              <img 
                src={workshop.avatar} 
                alt={workshop.name}
                referrerPolicy="no-referrer"
                className="w-16 h-16 object-cover rounded-xl border-2 border-white ring-4 ring-matte-950/50 shrink-0" 
              />
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-none">{workshop.name}</h1>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/50 border border-emerald-900/30 px-2 py-0.5 rounded leading-none font-bold">
                    TALLER VERIFICADO
                  </span>
                </div>
                <p className="text-xs text-gray-300 font-light flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-moto-red shrink-0" /> {workshop.address}, {workshop.city}
                </p>
              </div>
            </div>

            {/* Rating display on header */}
            <div className="bg-matte-950/80 border border-matte-800 backdrop-blur-sm px-3.5 py-2 rounded-xl flex items-center gap-2 text-xs font-mono select-none">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-current text-yellow-500" />
                <span className="text-white font-bold leading-none text-sm">{activeRatingMetric.avg}</span>
              </div>
              <span className="text-gray-600 leading-none">|</span>
              <span className="text-gray-400 leading-none">{activeRatingMetric.count} valoraciones</span>
            </div>
          </div>
        </div>

        {/* 2. BODY COLUMNS DETAILS */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* L: Details about catalog, maps instructions and active submissions reviews */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Description Card */}
            <div className="bg-matte-900 border border-matte-800 rounded-2xl p-6 space-y-4 shadow-xl text-xs">
              <span className="text-[10px] font-mono font-bold text-moto-red uppercase tracking-widest block border-b border-matte-800 pb-2">
                Descripción Técnica Sucursal
              </span>
              <p className="text-gray-300 font-light leading-relaxed font-sans text-sm">
                {workshop.description}
              </p>
              
              {/* Internal visual map representation */}
              <div className="pt-2">
                <span className="text-[10px] font-mono text-gray-500 uppercase block mb-2">Instrucciones de ruteo GPS</span>
                <div className="p-4 bg-matte-950 rounded-xl border border-matte-800 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                  <div className="space-y-1">
                    <p className="text-white font-bold font-mono text-[11px]">COORDS: -34.582, -58.435</p>
                    <p className="text-[11px] text-gray-500 font-light">Acércate por Av. Juan B. Justo esq. Honduras. Playa de estacionamiento privada de motos.</p>
                  </div>
                  
                  <button
                    onClick={() => window.open('https://maps.google.com/?q=' + encodeURIComponent(workshop.address), '_blank')}
                    className="px-4 py-2 bg-matte-900 hover:bg-matte-800 border border-matte-800 hover:border-gray-600 rounded-lg text-xs font-semibold cursor-pointer text-center text-gray-300"
                  >
                    📍 Abrir en Google Maps
                  </button>
                </div>
              </div>
            </div>

            {/* In-stock parts listed directly in this sucursal shop */}
            <div className="bg-matte-900 border border-matte-800 rounded-2xl p-6 space-y-5 shadow-xl">
              <span className="text-[10px] font-mono font-bold text-moto-blue uppercase tracking-widest block border-b border-matte-800 pb-2">
                Repuestos Destacados con Stock en este Taller ({featuredParts.length})
              </span>

              {featuredParts.length === 0 ? (
                <div className="py-8 text-center text-gray-500 font-mono text-xs">
                  Este taller no tiene productos listados actualmente.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {featuredParts.map((part) => (
                    <div 
                      key={part.id}
                      className="p-3 bg-matte-950/80 border border-matte-800 rounded-xl flex items-center justify-between gap-3 hover:border-matte-600 transition"
                    >
                      <div className="flex items-center gap-3">
                        <img 
                          src={part.imageUrl} 
                          alt={part.name}
                          referrerPolicy="no-referrer"
                          className="w-10 h-10 object-cover rounded-lg border border-matte-800 shrink-0" 
                        />
                        <div>
                          <h4 className="text-xs font-bold text-white line-clamp-1 truncate max-w-[150px]">{part.name}</h4>
                          <span className="text-[10px] font-mono text-gray-500 tracking-tight block">Stock: {part.stock} u. • SKU {part.sku}</span>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-xs font-mono font-bold text-white block">${part.price.toLocaleString('es-AR')}</span>
                        <a
                          href={`${workshop.whatsapp}&text=Hola!%20Busco%20la%20pieza%20${part.sku}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[10px] font-mono text-green-400 hover:text-green-300 font-bold block mt-0.5"
                        >
                          Preguntar
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Verified reviews and star summary chart list section */}
            <div className="bg-matte-900 border border-matte-800 rounded-2xl p-6 space-y-6 shadow-xl">
              <span className="text-[10px] font-mono font-bold text-yellow-500 uppercase tracking-widest block border-b border-matte-800 pb-2">
                Reseñas de Motociclistas Certificados
              </span>

              {/* Verified list feed */}
              <div className="divide-y divide-matte-800">
                {reviews.map((r) => (
                  <div key={r.id} className="py-4 space-y-2 first:pt-0 last:pb-0">
                    <div className="flex justify-between items-start text-xs">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white">{r.author}</span>
                          <span className="text-[10px] font-mono text-gray-500">Motos de Paseo • {r.bikeModel}</span>
                        </div>
                        <p className="text-[10px] font-mono text-gray-600">{r.date}</p>
                      </div>

                      {/* Stars count */}
                      <div className="flex gap-0.5 mt-1 shrink-0 select-none">
                        {Array.from({ length: r.rating }).map((_, idx) => (
                          <Star key={idx} className="w-3.5 h-3.5 fill-current text-yellow-500" />
                        ))}
                      </div>
                    </div>

                    <p className="text-xs text-gray-300 font-light font-sans leading-relaxed">
                      "{r.comment}"
                    </p>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* R: Contact specs details side panels and review submission adder form */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Operation info directory */}
            <div className="bg-matte-900 border border-matte-800 rounded-2xl p-5 shadow-xl space-y-4 text-xs font-sans">
              <span className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-wider block">Directorio Comercial</span>
              
              <div className="space-y-3.5">
                {/* Hours row */}
                <div className="flex gap-3 items-start">
                  <Clock className="w-4 h-4 text-gray-500 mt-0.5 shrink-0" />
                  <div className="space-y-0.5">
                    <span className="font-bold text-white block">Horarios de Atención Atleta</span>
                    <span className="text-gray-400 text-[11px] leading-relaxed block">{workshop.hours}</span>
                  </div>
                </div>

                {/* Telephone contact row */}
                <div className="flex gap-3 items-start">
                  <Phone className="w-4 h-4 text-gray-500 mt-0.5 shrink-0" />
                  <div className="space-y-0.5">
                    <span className="font-bold text-white block">Central Telefónica direct</span>
                    <span className="text-gray-450 text-[11px] font-mono block">{workshop.phone}</span>
                  </div>
                </div>

                {/* WhatsApp ruteo links */}
                <div className="flex gap-3 items-start">
                  <MessageSquare className="w-4 h-4 text-gray-500 mt-0.5 shrink-0" />
                  <div className="space-y-0.5">
                    <span className="font-bold text-white block">Canal WhatsApp Oficial</span>
                    <a
                      href={workshop.whatsapp}
                      target="_blank"
                      rel="noreferrer"
                      className="text-green-400 hover:text-green-300 font-bold font-mono text-[11px] flex items-center gap-1"
                    >
                      Iniciar Conversación <ShieldCheck className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive review submission widget card */}
            <form onSubmit={handleSubmitReview} className="bg-matte-900 border border-matte-800 rounded-2xl p-5 shadow-xl space-y-4 text-xs">
              <div className="border-b border-matte-800 pb-2.5">
                <span className="text-[10px] font-mono font-bold text-gray-400 uppercase block mb-0.5">Comentarios</span>
                <h3 className="text-xs font-black text-white uppercase tracking-tight">Escribir una Valoración</h3>
              </div>

              {/* Author name */}
              <div className="space-y-1.5 animate-all">
                <label htmlFor="form-rev-author" className="text-gray-400">Tu Nombre Completo</label>
                <input
                  id="form-rev-author"
                  type="text"
                  required
                  placeholder="Ej. Roberto Sánchez"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  className="w-full bg-matte-950 border border-matte-800 text-xs text-white p-2.5 rounded-lg focus:outline-none focus:border-moto-red"
                />
              </div>

              {/* Stars click selection */}
              <div className="space-y-1">
                <span className="text-gray-400 block mb-1">Calificación</span>
                <div className="flex gap-1.5 select-none animate-all">
                  {[1, 2, 3, 4, 5].map((stars) => (
                    <button
                      key={stars}
                      type="button"
                      onClick={() => setSelectedStars(stars)}
                      className="p-1 rounded bg-matte-950 border border-matte-800 hover:border-yellow-500 cursor-pointer"
                    >
                      <Star className={`w-4 h-4 ${stars <= selectedStars ? 'fill-current text-yellow-500' : 'text-gray-600'}`} />
                    </button>
                  ))}
                </div>
              </div>

              {/* Bike model detail */}
              <div className="space-y-1.5 animate-all">
                <label htmlFor="form-rev-bike" className="text-gray-400">¿Qué moto manejas?</label>
                <input
                  id="form-rev-bike"
                  type="text"
                  placeholder="Ej. Yamaha MT-03, Honda CB250"
                  value={bikeQueryModel}
                  onChange={(e) => setBikeQueryModel(e.target.value)}
                  className="w-full bg-matte-950 border border-matte-800 text-xs text-white p-2.5 rounded-lg focus:outline-none focus:border-moto-red"
                />
              </div>

              {/* Comment text */}
              <div className="space-y-1.5 animate-all">
                <label htmlFor="form-rev-comment" className="text-gray-400">Comentario descriptivo de tu reparación</label>
                <textarea
                  id="form-rev-comment"
                  rows={3}
                  required
                  placeholder="Describe cómo te atendieron, el orden, los precios estimados y el trato de los mecánicos..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className="w-full bg-matte-950 border border-matte-800 text-xs text-white p-2.5 rounded-lg focus:outline-none focus:border-moto-red leading-relaxed font-sans"
                />
              </div>

              <button
                type="submit"
                id="form-submit-rev-btn"
                className="w-full py-2.5 bg-matte-950 hover:bg-matte-800 border border-matte-800 hover:border-gray-500 transition text-xs font-semibold text-white rounded-lg cursor-pointer"
              >
                Publicar Reseña Certificada
              </button>
            </form>

          </div>

        </div>

      </div>
    </div>
  );
}
