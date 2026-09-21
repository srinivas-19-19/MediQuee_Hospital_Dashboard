import { 
  Bell, BellOff, ArrowLeft, Calendar, AlertCircle, Video, 
  Home, Activity, CheckCircle, FileText, CheckCheck, Volume2, 
  Building2, UserPlus, Loader2
} from "lucide-react"
import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"
import { EmptyState } from "../components/ui/EmptyState"
import { useNotifications } from "@/context/NotificationContext"

function formatTimeAgo(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    const now = new Date();
    const diffSec = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffSec < 45) return "Just now";
    if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`;
    if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`;
    if (diffSec < 172800) return "Yesterday";
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  } catch (e) {
    return "Recently";
  }
}

export function Notifications() {
  const navigate = useNavigate();
  const { 
    notifications, 
    unreadCount, 
    isLoading, 
    pushEnabled, 
    togglePushNotifications, 
    markAsRead, 
    markAllAsRead, 
    playChime 
  } = useNotifications();

  const getIconForType = (type: string) => {
    switch (type) {
      case 'appointment': return <Calendar className="w-5 h-5 text-blue-600" />;
      case 'department': return <Building2 className="w-5 h-5 text-indigo-600" />;
      case 'staff': return <UserPlus className="w-5 h-5 text-purple-600" />;
      case 'alert': return <AlertCircle className="w-5 h-5 text-red-600" />;
      case 'video': return <Video className="w-5 h-5 text-purple-600" />;
      case 'home': return <Home className="w-5 h-5 text-emerald-600" />;
      case 'activity': return <Activity className="w-5 h-5 text-orange-600" />;
      case 'success': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'document': return <FileText className="w-5 h-5 text-indigo-600" />;
      default: return <Bell className="w-5 h-5 text-blue-600" />;
    }
  };

  const getBgForType = (type: string) => {
    switch (type) {
      case 'appointment': return "bg-blue-50 border-blue-100";
      case 'department': return "bg-indigo-50 border-indigo-100";
      case 'staff': return "bg-purple-50 border-purple-100";
      case 'alert': return "bg-red-50 border-red-100";
      case 'video': return "bg-purple-50 border-purple-100";
      case 'home': return "bg-emerald-50 border-emerald-100";
      case 'activity': return "bg-orange-50 border-orange-100";
      case 'success': return "bg-green-50 border-green-100";
      case 'document': return "bg-indigo-50 border-indigo-100";
      default: return "bg-blue-50 border-blue-100";
    }
  };

  const handleNotificationClick = async (notif: any) => {
    if (!notif.read) {
      await markAsRead(notif.id);
    }
    if (notif.type === 'appointment') {
      navigate('/appointments');
    } else if (notif.type === 'department') {
      navigate('/profile/departments');
    } else if (notif.type === 'staff') {
      navigate('/profile/staff');
    }
  };

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.05 } }
  };
  const item = {
    hidden: { opacity: 0, y: 8 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="flex flex-col bg-white min-h-[calc(100vh-80px)] pb-24">
      {/* Sticky Header */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md pt-4 pb-3 px-4 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-gray-500 hover:text-gray-900 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-gray-900">Notifications</h1>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 bg-blue-600 text-white text-[10px] font-black rounded-full">
                {unreadCount} new
              </span>
            )}
          </div>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-[#1769E0] text-xs font-semibold rounded-xl transition-colors active:scale-95"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            <span>Mark all read</span>
          </button>
        )}
      </div>

      <div className="p-4 flex flex-col gap-6 max-w-2xl mx-auto w-full">
        
        {/* Push Notifications Toggle Card */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between p-4 bg-slate-50/80 rounded-2xl border border-gray-200/70 shadow-sm">
          <div className="flex items-center gap-3.5">
            <div className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-colors shadow-sm ${pushEnabled ? 'bg-blue-600 text-white shadow-blue-600/20' : 'bg-gray-200 text-gray-500'}`}>
              {pushEnabled ? <Bell className="w-5 h-5 animate-pulse" /> : <BellOff className="w-5 h-5" />}
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-gray-900 text-[15px]">Push Notifications</span>
              <span className="text-xs text-gray-500">
                {pushEnabled ? "Active: alerts received even if tab/app is closed" : "Receive real-time alerts on your device"}
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => playChime()}
              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
              title="Test notification chime sound"
            >
              <Volume2 className="w-4 h-4" />
            </button>

            <button 
              onClick={togglePushNotifications}
              type="button"
              className={`w-12 h-7 rounded-full p-1 transition-colors relative cursor-pointer ${pushEnabled ? 'bg-blue-600' : 'bg-gray-300'}`}
              title={pushEnabled ? "Turn off push notifications" : "Enable push notifications"}
            >
              <div className={`w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${pushEnabled ? 'translate-x-5' : 'translate-x-0'}`} />
            </button>
          </div>
        </motion.div>

        {/* Notification History List */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Recent Activity</h2>
            <span className="text-xs text-gray-400">{notifications.length} alerts</span>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-[#1769E0]" />
            </div>
          ) : (
            <motion.div variants={container} initial="hidden" animate="show" className="flex flex-col gap-2.5">
              {notifications.length === 0 ? (
                <EmptyState
                  icon={Bell}
                  title="No Notifications"
                  description="Real-time alerts for new appointments, department updates, and staff additions will appear here automatically."
                />
              ) : notifications.map((notif) => (
                <motion.div 
                  key={notif.id} 
                  variants={item}
                  onClick={() => handleNotificationClick(notif)}
                  className={`flex gap-3.5 p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden ${
                    notif.read 
                      ? 'bg-white border-gray-100 hover:border-gray-200' 
                      : 'bg-blue-50/30 border-blue-100 shadow-[0_2px_12px_rgba(23,105,224,0.06)]'
                  }`}
                >
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border ${getBgForType(notif.type)}`}>
                    {getIconForType(notif.type)}
                  </div>
                  <div className="flex flex-col flex-1 justify-center pr-3">
                    <div className="flex items-center justify-between gap-2 mb-0.5">
                      <span className={`text-[14px] leading-snug ${notif.read ? 'font-semibold text-gray-800' : 'font-bold text-gray-900'}`}>
                        {notif.title}
                      </span>
                      <span className="text-[11px] font-semibold text-gray-400 whitespace-nowrap">
                        {formatTimeAgo(notif.createdAt)}
                      </span>
                    </div>
                    <span className="text-xs text-gray-600 leading-relaxed">{notif.message}</span>
                  </div>
                  {!notif.read && (
                    <div className="absolute top-4 right-3 w-2 h-2 bg-blue-600 rounded-full ring-4 ring-blue-100" />
                  )}
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>

      </div>
    </div>
  )
}
