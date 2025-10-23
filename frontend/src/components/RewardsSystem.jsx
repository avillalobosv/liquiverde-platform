import React, { useState, useEffect } from 'react';
import { Trophy, Star, Award, Zap, TreePine, Coins, Target, Users, Leaf, Gift, ShoppingCart } from 'lucide-react';

const RewardsSystem = () => {
  const [rewardsData, setRewardsData] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRewardsData();
    loadLeaderboard();
  }, []);

  const loadRewardsData = async () => {
    try {
      const response = await fetch('/api/user-rewards/current-user');
      const data = await response.json();
      setRewardsData(data);
    } catch (error) {
      console.error('Error loading rewards:', error);
      // Datos de ejemplo si falla la API
      setRewardsData({
        user_info: {
          username: "EcoGuerrero",
          member_since: "2024-01-15",
          total_co2_saved: 45.7,
          total_money_saved: 12500,
          sustainable_purchases: 28
        },
        points: 345,
        level: "Guerrero Verde 🌿",
        level_color: "bg-green-500",
        badges: [
          { id: 1, name: "Primera Compra Sostenible", icon: "🎯", earned: true, description: "Tu primera compra eco-friendly" },
          { id: 2, name: "Ahorrador Expert@", icon: "💰", earned: true, description: "Ahorrado más de $5,000" },
          { id: 3, name: "Reductor de CO2", icon: "🌍", earned: true, description: "Reducido 20+ kg de CO2" },
          { id: 4, name: "Comprador Consciente", icon: "🛒", earned: true, description: "15+ compras sostenibles" },
          { id: 5, name: "Local Lover", icon: "🏘️", earned: false, description: "10+ compras en tiendas locales" },
          { id: 6, name: "Planeta Protector", icon: "🛡️", earned: false, description: "Alcanzado nivel Eco Champion" },
          { id: 7, name: "Héroe del Reciclaje", icon: "♻️", earned: false, description: "Productos 100% reciclables" },
          { id: 8, name: "Leyenda Sostenible", icon: "🌟", earned: false, description: "Nivel máximo alcanzado" }
        ],
        rewards: [
          { id: 1, name: "10% de descuento", points_required: 50, claimed: false, type: "discount" },
          { id: 2, name: "Envío gratuito", points_required: 80, claimed: false, type: "shipping" },
          { id: 3, name: "Producto eco gratis", points_required: 120, claimed: false, type: "product" },
          { id: 4, name: "Kit sostenible", points_required: 200, claimed: false, type: "kit" },
          { id: 5, name: "Asesoría eco-experto", points_required: 150, claimed: false, type: "service" }
        ],
        next_achievements: [
          { goal: "Llegar a 50 compras sostenibles", progress: 28, target: 50 },
          { goal: "Ahorrar $20,000", progress: 12500, target: 20000 },
          { goal: "Reducir 100kg de CO2", progress: 45.7, target: 100 },
          { goal: "Completar todos los badges", progress: 4, target: 8 }
        ],
        impact_stats: {
          co2_saved_kg: 45.7,
          trees_equivalent: 2.1,
          money_saved: 12500,
          sustainable_purchases: 28,
          water_saved_liters: 1400,
          plastic_reduced_kg: 14
        },
        leaderboard_position: 42
      });
    } finally {
      setLoading(false);
    }
  };

  const loadLeaderboard = async () => {
    try {
      const response = await fetch('/api/leaderboard?limit=15');
      const data = await response.json();
      setLeaderboard(data.leaderboard);
    } catch (error) {
      console.error('Error loading leaderboard:', error);
      // Datos de ejemplo si falla la API
      setLeaderboard([
        { position: 1, username: "EcoMaster", points: 890, level: "Héroe del Planeta", co2_saved: 120.5 },
        { position: 2, username: "GreenWarrior", points: 765, level: "Héroe del Planeta", co2_saved: 98.3 },
        { position: 3, username: "SustainableShopper", points: 654, level: "Eco Champion", co2_saved: 87.6 },
        { position: 4, username: "PlanetProtector", points: 543, level: "Eco Champion", co2_saved: 76.2 },
        { position: 5, username: "EcoExplorer", points: 432, level: "Guerrero Verde", co2_saved: 65.8 },
        { position: 6, username: "GreenThumb", points: 321, level: "Guerrero Verde", co2_saved: 54.1 },
        { position: 7, username: "SustainableLife", points: 234, level: "Aprendiz Eco", co2_saved: 43.7 },
        { position: 8, username: "EcoFriendlyUser", points: 187, level: "Aprendiz Eco", co2_saved: 32.9 },
        { position: 9, username: "GreenNewbie", points: 145, level: "Aprendiz Eco", co2_saved: 28.4 },
        { position: 10, username: "EcoBeginner", points: 98, level: "Aprendiz Eco", co2_saved: 21.6 }
      ]);
    }
  };

  const registerPurchase = async () => {
    try {
      const purchaseData = {
        co2_saved: 2.5,
        money_saved: 1500,
        products_count: 3
      };
      
      console.log('🛒 Enviando datos de compra:', purchaseData);
      
      const requestBody = {
        user_id: 'current-user',
        purchase_data: purchaseData
      };
      
      const response = await fetch('/api/register-sustainable-purchase', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });
      
      console.log('📡 Status de respuesta:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error ${response.status}: ${errorText}`);
      }
      
      const result = await response.json();
      console.log('✅ Respuesta recibida:', result);
      
      if (result.success) {
        alert(`🎉 ${result.message}`);
        loadRewardsData(); // Recargar datos
      } else {
        throw new Error('La compra no se pudo registrar');
      }
      
    } catch (error) {
      console.error('❌ Error registrando compra:', error);
      
      // Simulación local si falla la API
      alert('🎉 ¡Compra simulada! +1500 puntos ganados (modo offline)');
      
      // Actualizar localmente para simular
      setRewardsData(prev => ({
        ...prev,
        points: prev.points + 1500,
        user_info: {
          ...prev.user_info,
          total_co2_saved: prev.user_info.total_co2_saved + 2.5,
          total_money_saved: prev.user_info.total_money_saved + 1500,
          sustainable_purchases: prev.user_info.sustainable_purchases + 1
        },
        impact_stats: {
          ...prev.impact_stats,
          co2_saved_kg: prev.impact_stats.co2_saved_kg + 2.5,
          money_saved: prev.impact_stats.money_saved + 1500,
          sustainable_purchases: prev.impact_stats.sustainable_purchases + 1,
          trees_equivalent: parseFloat((prev.impact_stats.trees_equivalent + 0.1).toFixed(1)),
          water_saved_liters: prev.impact_stats.water_saved_liters + 150,
          plastic_reduced_kg: parseFloat((prev.impact_stats.plastic_reduced_kg + 1.5).toFixed(1))
        }
      }));
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (!rewardsData) {
    return (
      <div className="text-center p-8">
        <div className="text-red-500 text-lg">Error cargando datos de recompensas</div>
        <button 
          onClick={loadRewardsData}
          className="mt-4 bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg"
        >
          Reintentar
        </button>
      </div>
    );
  }

  const { 
    user_info, 
    points, 
    level,  
    badges = [], 
    rewards = [], 
    next_achievements = [], 
    impact_stats = {}, 
    leaderboard_position = 999 
  } = rewardsData;

  const earnedBadges = badges.filter(b => b.earned).length;
  const totalBadges = badges.length;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-green-800 mb-2">Sistema de Recompensas</h1>
        <p className="text-green-600 text-lg">Gana puntos, desbloquea logros y salva el planeta 🌍</p>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-lg shadow-md p-1">
        <div className="flex space-x-1">
          {['overview', 'badges', 'rewards', 'leaderboard', 'impact'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3 px-4 rounded-md font-semibold transition ${
                activeTab === tab
                  ? 'bg-green-500 text-white shadow-sm'
                  : 'text-gray-600 hover:bg-green-50'
              }`}
            >
              {tab === 'overview' && '📊 Resumen'}
              {tab === 'badges' && '🏆 Logros'}
              {tab === 'rewards' && '🎁 Recompensas'}
              {tab === 'leaderboard' && '👑 Ranking'}
              {tab === 'impact' && '🌍 Impacto'}
            </button>
          ))}
        </div>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* User Card */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl p-8 shadow-xl">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="text-center md:text-left mb-6 md:mb-0">
                <div className="flex items-center justify-center md:justify-start space-x-3 mb-4">
                  <div className="bg-white/20 p-3 rounded-full">
                    <Trophy className="h-8 w-8" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">{user_info.username}</h2>
                    <p className="text-green-100">Miembro desde {user_info.member_since}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{points}</div>
                    <div className="text-green-100 text-sm">Puntos</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{level.split(' ')[0]}</div>
                    <div className="text-green-100 text-sm">Nivel</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">#{leaderboard_position}</div>
                    <div className="text-green-100 text-sm">Ranking</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{earnedBadges}/{totalBadges}</div>
                    <div className="text-green-100 text-sm">Logros</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/20 rounded-xl p-6 text-center">
                <div className="text-3xl font-bold mb-2">{level}</div>
                <div className="w-32 bg-white/30 rounded-full h-3">
                  <div 
                    className="bg-yellow-400 h-3 rounded-full transition-all duration-1000"
                    style={{ width: `${Math.min(100, (points / 500) * 100)}%` }}
                  ></div>
                </div>
                <div className="text-green-100 text-sm mt-2">
                  {points}/500 puntos para próximo nivel
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-blue-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Compras Sostenibles</p>
                  <p className="text-2xl font-bold text-blue-700">{user_info.sustainable_purchases}</p>
                </div>
                <ShoppingCart className="h-8 w-8 text-blue-500" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-green-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">CO₂ Ahorrado</p>
                  <p className="text-2xl font-bold text-green-700">{impact_stats.co2_saved_kg}kg</p>
                </div>
                <Leaf className="h-8 w-8 text-green-500" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-yellow-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Dinero Ahorrado</p>
                  <p className="text-2xl font-bold text-yellow-700">${user_info.total_money_saved}</p>
                </div>
                <Coins className="h-8 w-8 text-yellow-500" />
              </div>
            </div>
          </div>

          {/* Recent Badges */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <Award className="mr-2" />
              Logros Recientes
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {badges.filter(b => b.earned).slice(0, 4).map((badge) => (
                <div key={badge.id} className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="text-2xl mb-2">{badge.icon}</div>
                  <div className="font-semibold text-green-800 text-sm">{badge.name}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Test Button */}
          <div className="text-center">
            <button
              onClick={registerPurchase}
              className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg transition transform hover:scale-105"
            >
              <Zap className="inline w-5 h-5 mr-2" />
              Simular Compra Sostenible (+1500 pts)
            </button>
          </div>
        </div>
      )}

      {/* Badges Tab */}
      {activeTab === 'badges' && (
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <Award className="mr-2" />
            Todos los Logros ({earnedBadges}/{totalBadges})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {badges.map((badge) => (
              <div
                key={badge.id}
                className={`p-4 rounded-xl border-2 transition ${
                  badge.earned
                    ? 'bg-green-50 border-green-400 shadow-sm'
                    : 'bg-gray-50 border-gray-200 opacity-60'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`text-2xl ${badge.earned ? '' : 'grayscale'}`}>
                    {badge.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className={`font-semibold ${badge.earned ? 'text-green-800' : 'text-gray-500'}`}>
                      {badge.name}
                    </h3>
                    <p className="text-sm text-gray-600">{badge.description}</p>
                  </div>
                  {badge.earned && (
                    <Star className="h-5 w-5 text-yellow-500 fill-current" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Rewards Tab */}
      {activeTab === 'rewards' && (
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <Gift className="mr-2" />
            Recompensas Disponibles
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {rewards.map((reward) => (
              <div
                key={reward.id}
                className={`p-6 rounded-xl border-2 transition ${
                  points >= reward.points_required
                    ? 'bg-gradient-to-r from-green-50 to-blue-50 border-green-300 hover:shadow-md'
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-lg text-gray-800">{reward.name}</h3>
                    <p className="text-sm text-gray-600">Tipo: {reward.type}</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-1 text-yellow-600">
                      <Star className="h-4 w-4" />
                      <span className="font-bold">{reward.points_required}</span>
                    </div>
                    <div className="text-xs text-gray-500">puntos requeridos</div>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    points >= reward.points_required
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-500'
                  }`}>
                    {points >= reward.points_required ? '🎁 Disponible' : '🔒 Necesitas más puntos'}
                  </span>
                  
                  <button
                    className={`px-4 py-2 rounded-lg font-semibold text-sm ${
                      points >= reward.points_required
                        ? 'bg-green-500 hover:bg-green-600 text-white'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                    disabled={points < reward.points_required}
                  >
                    Canjear
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Leaderboard Tab */}
      {activeTab === 'leaderboard' && (
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <Users className="mr-2" />
            Ranking de Eco-Héroes
          </h2>
          
          <div className="space-y-3">
            {leaderboard.map((user) => (
              <div
                key={user.position}
                className={`flex items-center space-x-4 p-4 rounded-lg border transition ${
                  user.position <= 3
                    ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200 shadow-sm'
                    : 'bg-gray-50 border-gray-200'
                } ${user.username === user_info.username ? 'ring-2 ring-green-500' : ''}`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                  user.position === 1 ? 'bg-yellow-400 text-white' :
                  user.position === 2 ? 'bg-gray-400 text-white' :
                  user.position === 3 ? 'bg-orange-400 text-white' :
                  'bg-gray-200 text-gray-600'
                }`}>
                  {user.position}
                </div>
                
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="font-semibold text-gray-800">
                        {user.username} 
                        {user.username === user_info.username && ' (Tú)'}
                      </span>
                      <span className="text-sm text-gray-500 ml-2">{user.level}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-green-700">{user.points} pts</div>
                      <div className="text-xs text-gray-500">{user.co2_saved}kg CO₂ ahorrado</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Impact Tab */}
      {activeTab === 'impact' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <TreePine className="mr-2" />
              Tu Impacto Ambiental
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-blue-50 rounded-xl">
                <Leaf className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                <div className="text-2xl font-bold text-blue-700">{impact_stats.co2_saved_kg}kg</div>
                <div className="text-sm text-blue-600">CO₂ Ahorrado</div>
              </div>
              
              <div className="text-center p-6 bg-green-50 rounded-xl">
                <TreePine className="h-8 w-8 text-green-600 mx-auto mb-3" />
                <div className="text-2xl font-bold text-green-700">{impact_stats.trees_equivalent}</div>
                <div className="text-sm text-green-600">Árboles Equivalentes</div>
              </div>
              
              <div className="text-center p-6 bg-yellow-50 rounded-xl">
                <Coins className="h-8 w-8 text-yellow-600 mx-auto mb-3" />
                <div className="text-2xl font-bold text-yellow-700">${impact_stats.money_saved}</div>
                <div className="text-sm text-yellow-600">Dinero Ahorrado</div>
              </div>
              
              <div className="text-center p-6 bg-purple-50 rounded-xl">
                <Target className="h-8 w-8 text-purple-600 mx-auto mb-3" />
                <div className="text-2xl font-bold text-purple-700">{impact_stats.sustainable_purchases}</div>
                <div className="text-sm text-purple-600">Compras Sostenibles</div>
              </div>
              
              <div className="text-center p-6 bg-red-50 rounded-xl">
                <Zap className="h-8 w-8 text-red-600 mx-auto mb-3" />
                <div className="text-2xl font-bold text-red-700">{impact_stats.water_saved_liters}L</div>
                <div className="text-sm text-red-600">Agua Ahorrada</div>
              </div>
              
              <div className="text-center p-6 bg-indigo-50 rounded-xl">
                <Award className="h-8 w-8 text-indigo-600 mx-auto mb-3" />
                <div className="text-2xl font-bold text-indigo-700">{impact_stats.plastic_reduced_kg}kg</div>
                <div className="text-sm text-indigo-600">Plástico Reducido</div>
              </div>
            </div>
          </div>

          {/* Next Achievements */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <Target className="mr-2" />
              Próximos Logros
            </h3>
            <div className="space-y-4">
              {next_achievements.map((achievement, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-gray-700">{achievement.goal}</span>
                    <span className="text-gray-500">{achievement.progress}/{achievement.target}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full transition-all duration-1000"
                      style={{ width: `${Math.min(100, (achievement.progress / achievement.target) * 100)}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RewardsSystem;