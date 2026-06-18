import React, { useState, useEffect, useRef } from 'react';
import { Settings, RefreshCw, Play, ChevronLeft, ChevronRight, ChevronDown, Bell, BellOff, Circle, CheckCircle2, Check, X, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { FX_EVENTS, FxEvent } from '../fxEvents';
import InteractiveNewsTitle, { InteractiveNewsHeader } from './InteractiveNewsTitle';
import SideRays from './SideRays';

// ============================================================================
// 🌐 REMOTE LIVE NEWS SYNC CONFIGURATION
// ============================================================================
// To automatically push new news events to all users of this app:
// 1. Host your scraped news JSON file on a public GitHub repository or Gist.
// 2. Locate the "Raw" file link (it should start with 'https://raw.githubusercontent.com/...').
// 3. Paste that raw link into the REMOTE_JSON_URL variable below.
// 4. Anytime you update the file on GitHub, all active apps of your users will 
//    automatically load your updated content on launch - no app download or update needed!
// ============================================================================
export const REMOTE_JSON_URL: string = "";

// Define the synthesizer chime trigger
export const playSynthSound = (profile: string) => {
  const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
  if (!AudioContextClass) return;
  const ctx = new AudioContextClass();
  
  const playCrystallineDeskBell = (timeOffset = 0, volume = 0.5) => {
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(1320, ctx.currentTime + timeOffset);
    
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(2640, ctx.currentTime + timeOffset);
    
    gainNode.gain.setValueAtTime(volume, ctx.currentTime + timeOffset);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + timeOffset + 1.2);
    
    osc1.connect(gainNode);
    osc2.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    osc1.start(ctx.currentTime + timeOffset);
    osc2.start(ctx.currentTime + timeOffset);
    osc1.stop(ctx.currentTime + timeOffset + 1.3);
    osc2.stop(ctx.currentTime + timeOffset + 1.3);
  };

  const playSchoolBell = () => {
    // 13 rapid strikes with natural decay resonance
    const strikeInterval = 0.10; // 100ms
    const totalStrikes = 13;
    const strikeGain = ctx.createGain();
    strikeGain.connect(ctx.destination);
    
    for (let i = 0; i < totalStrikes; i++) {
       const time = ctx.currentTime + i * strikeInterval;
       const osc = ctx.createOscillator();
       const strikeEnvelope = ctx.createGain();
       
       osc.type = 'triangle';
       osc.frequency.setValueAtTime(620 + Math.random() * 6, time);
       
       strikeEnvelope.gain.setValueAtTime(0.35, time);
       strikeEnvelope.gain.linearRampToValueAtTime(0.015, time + 0.14);
       
       osc.connect(strikeEnvelope);
       strikeEnvelope.connect(strikeGain);
       
       osc.start(time);
       osc.stop(time + 0.16);
    }
    
    // lingering echo
    strikeGain.gain.setValueAtTime(0.5, ctx.currentTime);
    strikeGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + totalStrikes * strikeInterval + 1.2);
  };

  const playPrincessBell = () => {
    const freqs = [1046.50, 1174.66, 1318.51, 1567.98, 1760.00, 2093.00, 2637.02, 3135.96];
    freqs.forEach((freq, idx) => {
      const time = ctx.currentTime + idx * 0.06;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, time);
      osc.detune.setValueAtTime((Math.random() - 0.5) * 12, time);
      
      gain.gain.setValueAtTime(0.2, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.8);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start(time);
      osc.stop(time + 0.9);
    });
  };

  const playPokemonHeal = () => {
    const freqs = [523.25, 587.33, 659.25, 783.99, 880.00, 1046.50];
    freqs.forEach((freq, idx) => {
      const time = ctx.currentTime + idx * 0.11;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, time);
      
      gain.gain.setValueAtTime(0.25, time);
      gain.gain.linearRampToValueAtTime(0.001, time + 0.16);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start(time);
      osc.stop(time + 0.18);
    });
  };

  switch (profile) {
    case 'pokemon':
      playPokemonHeal();
      break;
    case 'princess':
      playPrincessBell();
      break;
    case 'school':
      playSchoolBell();
      break;
    case 'desk':
    default:
      playCrystallineDeskBell();
      break;
  }
};

interface FxCalendarProps {
  isLight: boolean;
  scale: number;
  onBackToChecklist?: () => void;
  settingsPanelOpen?: boolean;
  setSettingsPanelOpen?: (open: boolean) => void;
  minimized?: boolean;
  setMinimized?: (minimized: boolean) => void;
}

const FLAG_MAP: Record<string, string> = {
  GBP: '🇬🇧',
  JPY: '🇯🇵',
  EUR: '🇪🇺',
  USD: '🇺🇸',
  CAD: '🇨🇦',
  AUD: '🇦🇺',
  NZD: '🇳🇿',
  CHF: '🇨🇭',
  CNY: '🇨🇳'
};

const DISPLAY_COUNTRY_MAP: Record<string, string> = {
  GBP: 'GB',
  JPY: 'JP',
  EUR: 'EU',
  USD: 'US',
  CAD: 'CA',
  AUD: 'AU',
  NZD: 'NZ',
  CHF: 'CH',
  CNY: 'CN'
};

const getFlagUrl = (currency: string): string => {
  if (!currency || typeof currency !== 'string') {
    return 'https://flagcdn.com/w40/un.png';
  }
  const code = DISPLAY_COUNTRY_MAP[currency] || (currency.length >= 2 ? currency.slice(0, 2) : 'un');
  let lowerCode = code.toLowerCase();
  if (lowerCode === 'uk') lowerCode = 'gb';
  return `https://flagcdn.com/w40/${lowerCode}.png`;
};

const FlagImage = ({ country }: { country: string }) => {
  const [imgFailed, setImgFailed] = useState(false);
  const emoji = (country && FLAG_MAP[country]) || '🌐';

  if (!country || imgFailed) {
    return <span style={{ fontSize: '11px', display: 'inline-flex', alignItems: 'center', lineHeight: 1 }}>{emoji}</span>;
  }

  return (
    <img 
      src={getFlagUrl(country)} 
      alt={`${country} Flag`} 
      onError={() => setImgFailed(true)}
      style={{ 
        width: '13px', 
        height: '9px', 
        objectFit: 'cover', 
        borderRadius: '1.5px',
        boxShadow: '0 1px 2px rgba(0,0,0,0.15)' 
      }} 
      referrerPolicy="no-referrer"
    />
  );
};

const getImpactColor = (impact: FxEvent['impact']) => {
  switch (impact) {
    case 'High':
      return '#ef4444'; // Red
    case 'Medium':
      return '#f97316'; // Orange
    case 'Low':
      return '#f59e0b'; // Gold / Yellow
    case 'Holiday':
      return '#a855f7'; // Purple
    case 'Non-Econ':
    default:
      return '#3b82f6'; // Blue
  }
};

const getImpactBadgeStyles = (impact: FxEvent['impact'], isLight: boolean) => {
  switch (impact) {
    case 'High':
      return isLight
        ? { background: 'rgba(239, 68, 68, 0.08)', color: '#dc2626' }
        : { background: 'rgba(239, 68, 68, 0.15)', color: '#f87171' };
    case 'Medium':
      return isLight
        ? { background: 'rgba(249, 115, 22, 0.08)', color: '#ea580c' }
        : { background: 'rgba(249, 115, 22, 0.15)', color: '#fb923c' };
    case 'Holiday':
      return isLight
        ? { background: 'rgba(168, 85, 247, 0.08)', color: '#7c3aed' }
        : { background: 'rgba(168, 85, 247, 0.15)', color: '#c084fc' };
    case 'Low':
    default:
      return isLight
        ? { background: 'rgba(245, 158, 11, 0.08)', color: '#b45309' }
        : { background: 'rgba(245, 158, 11, 0.12)', color: '#f59e0b' };
  }
};

const getEventDescription = (e: FxEvent): string => {
  const titleLower = e.title.toLowerCase();
  
  if (titleLower.includes('lagarde') || titleLower.includes('ecb president') || titleLower.includes('ecb')) {
    return 'European Central Bank President Christine Lagarde speaks on monetary policy, inflation control, and the economic outlook for the Eurozone.';
  }
  if (titleLower.includes('fed ') || titleLower.includes('powell') || titleLower.includes('fomc') || titleLower.includes('feds')) {
    return 'The Federal Reserve chair discusses interest rate projections, labor market stability, and monetary strategy in response to economic data.';
  }
  if (titleLower.includes('buba') || titleLower.includes('nagel')) {
    return 'Deutsche Bundesbank President Joachim Nagel speaks about inflation trends, banking sector health, and Eurozone monetary interventions.';
  }
  if (titleLower.includes('pmi')) {
    return `The ${e.title} measures purchasing managers activities, serving as a leading indicator of health in the service and manufacturing sectors.`;
  }
  if (titleLower.includes('reserves')) {
    return `The ${e.title} report details the total foreign exchange reserves owned by the central bank, representing currency liquidity and financial defense.`;
  }
  if (titleLower.includes('cpi') || titleLower.includes('inflation')) {
    return `Consumer Price Index (CPI) measures the average change over time in prices paid by consumers, serving as a key benchmark for inflation.`;
  }
  if (titleLower.includes('unemployment') || titleLower.includes('jobs') || titleLower.includes('payrolls')) {
    return 'Labor market metrics detailing employment changes, participation rate, and wage growth, guiding central bank interest rate decisions.';
  }
  if (titleLower.includes('gdp') || titleLower.includes('growth')) {
    return 'Gross Domestic Product (GDP) reports the annualized change in the inflation-adjusted value of all goods and services produced by the economy.';
  }
  if (titleLower.includes('retail sales')) {
    return 'Retail Sales measures changes in the total value of sales at the retail level, acting as a crucial indicator of consumer spending and confidence.';
  }
  if (titleLower.includes('meeting') || titleLower.includes('summit') || titleLower.includes('g7')) {
    return 'Global financial and political leaders convene to discuss strategic trade relations, inflation coordination, and geopolitical risk mitigation.';
  }
  
  const level = e.impact === 'High' ? 'critical economic report' : e.impact === 'Medium' ? 'noteworthy market update' : 'routine statistical release';
  return `The ${e.title} is a ${level} for the ${e.country} currency region, reflecting specific sector activity or macroeconomic performance tracking.`;
};

export default function FxCalendar({ 
  isLight, 
  onBackToChecklist,
  settingsPanelOpen: externalSettingsPanelOpen,
  setSettingsPanelOpen: externalSetSettingsPanelOpen,
  minimized,
  setMinimized
}: FxCalendarProps) {
  // Settings Persistence
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    return localStorage.getItem('fx_sound_enabled') !== 'false';
  });
  const [soundEnabled30Min, setSoundEnabled30Min] = useState<boolean>(() => {
    return localStorage.getItem('fx_sound_enabled_30min') !== 'false';
  });
  const [alertedTimestamps30Min, setAlertedTimestamps30Min] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('fx_alerted_30min');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (_) {}
    return [];
  });
  const [soundProfile, setSoundProfile] = useState<string>(() => {
    return localStorage.getItem('fx_sound_profile') || 'desk'; // desk, princess, school, pokemon, mp3_desk, mp3_princess, mp3_school, mp3_pokemon
  });
  const [mutedKeywords, setMutedKeywords] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('fx_muted_keywords');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (_) {}
    return ['speak', 'Nagel', 'Lagarde'];
  });
  const [newKeyword, setNewKeyword] = useState<string>('');
  
  const [activeImpacts, setActiveImpacts] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('fx_active_impacts');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (_) {}
    return ['High', 'Medium', 'Low', 'Holiday', 'Non-Econ'];
  });
  const [activeCurrencies, setActiveCurrencies] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('fx_active_currencies');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (_) {}
    return ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'NZD', 'CHF'];
  });
  const [showActual, setShowActual] = useState<boolean>(() => {
    return localStorage.getItem('fx_show_actual') !== 'false';
  });
  const [showForecast, setShowForecast] = useState<boolean>(() => {
    return localStorage.getItem('fx_show_forecast') !== 'false';
  });
  const [showPrevious, setShowPrevious] = useState<boolean>(() => {
    return localStorage.getItem('fx_show_previous') !== 'false';
  });
  const [clockFormat, setClockFormat] = useState<'12' | '24'>(() => {
    return (localStorage.getItem('fx_clock_format') as '12' | '24') || '12';
  });

  useEffect(() => {
    localStorage.setItem('fx_active_impacts', JSON.stringify(activeImpacts));
  }, [activeImpacts]);

  useEffect(() => {
    localStorage.setItem('fx_active_currencies', JSON.stringify(activeCurrencies));
  }, [activeCurrencies]);

  useEffect(() => {
    localStorage.setItem('fx_show_actual', String(showActual));
  }, [showActual]);

  useEffect(() => {
    localStorage.setItem('fx_show_forecast', String(showForecast));
  }, [showForecast]);

  useEffect(() => {
    localStorage.setItem('fx_show_previous', String(showPrevious));
  }, [showPrevious]);

  useEffect(() => {
    localStorage.setItem('fx_clock_format', clockFormat);
  }, [clockFormat]);

  // Helper to obtain current local date string (YYYY-MM-DD):
  const getTodayString = () => {
    try {
      const d = new Date();
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      return `${yyyy}-${mm}-${dd}`;
    } catch (_) {
      return '2026-06-19';
    }
  };

  // Simulator Time state - initialized to current date and time (if within range) or relative to fallback:
  const [simDate, setSimDate] = useState<Date>(() => {
    try {
      const todayStr = getTodayString();
      const list = [];
      const start = new Date('2026-06-14T12:00:00');
      for (let i = 0; i <= 14; i++) {
        const d = new Date(start.getTime() + i * 24 * 60 * 60 * 1000);
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const dd = String(d.getDate()).padStart(2, '0');
        list.push(`${yyyy}-${mm}-${dd}`);
      }
      if (list.includes(todayStr)) {
        return new Date();
      }
    } catch (_) {}
    return new Date('2026-06-19T00:00:01+01:00');
  });
  const [simActive, setSimActive] = useState<boolean>(true);
  const [simSpeed, setSimSpeed] = useState<number>(1); // multiplier

  // Checked observed status checklist persist state
  const [observedEvents, setObservedEvents] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('fx_observed_events');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (_) {}
    return [];
  });

  // Track individual muted events toggled via the bell icon
  const [customMutedEvents, setCustomMutedEvents] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('fx_custom_muted_events');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (_) {}
    return [];
  });

  // Track individual unmuted events toggled via the bell icon (to override keyword mutes)
  const [customUnmutedEvents, setCustomUnmutedEvents] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('fx_custom_unmuted_events');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (_) {}
    return [];
  });

  // To display current selected date to navigate days - default to local date if in range!
  const [selectedDayString, setSelectedDayString] = useState<string>(() => {
    try {
      const todayStr = getTodayString();
      const list = [];
      const start = new Date('2026-06-14T12:00:00');
      for (let i = 0; i <= 14; i++) {
        const d = new Date(start.getTime() + i * 24 * 60 * 60 * 1000);
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const dd = String(d.getDate()).padStart(2, '0');
        list.push(`${yyyy}-${mm}-${dd}`);
      }
      if (list.includes(todayStr)) {
        return todayStr;
      }
    } catch (_) {}
    return '2026-06-19';
  });

  // Toggle Advanced Settings Drawer
  const [localSettingsPanelOpen, localSetSettingsPanelOpen] = useState<boolean>(false);
  const settingsPanelOpen = externalSettingsPanelOpen !== undefined ? externalSettingsPanelOpen : localSettingsPanelOpen;
  const setSettingsPanelOpen = externalSetSettingsPanelOpen !== undefined ? externalSetSettingsPanelOpen : localSetSettingsPanelOpen;

  // Set of already alerted event timestamps to avoid duplicate strikes
  const [alertedTimestamps, setAlertedTimestamps] = useState<string[]>([]);
  
  // Track active alerts for user feedback
  const [activeAlertText, setActiveAlertText] = useState<string | null>(null);

  // Centralized Reset All function to restore all initial states, including active filters, muted/alarm settings, and dismissed events
  const handleResetAll = () => {
    setActiveImpacts(['High', 'Medium', 'Low', 'Holiday', 'Non-Econ']);
    setActiveCurrencies(['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'NZD', 'CHF']);
    setSoundEnabled(true);
    setSoundEnabled30Min(true);
    setSoundProfile('school');
    setShowActual(true);
    setShowForecast(true);
    setShowPrevious(true);
    setClockFormat('12');
    setObservedEvents([]);
    setCustomMutedEvents([]);
    setCustomUnmutedEvents([]);
    setMutedKeywords(['speak', 'Nagel', 'Lagarde']);
    setAlertedTimestamps([]);
    setAlertedTimestamps30Min([]);
    setActiveAlertText(null);
    
    // Explicitly update/clear localStorage to make sure changes apply
    localStorage.setItem('fx_active_impacts', JSON.stringify(['High', 'Medium', 'Low', 'Holiday', 'Non-Econ']));
    localStorage.setItem('fx_active_currencies', JSON.stringify(['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'NZD', 'CHF']));
    localStorage.setItem('fx_sound_enabled', 'true');
    localStorage.setItem('fx_sound_enabled_30min', 'true');
    localStorage.setItem('fx_sound_profile', 'school');
    localStorage.setItem('fx_show_actual', 'true');
    localStorage.setItem('fx_show_forecast', 'true');
    localStorage.setItem('fx_show_previous', 'true');
    localStorage.setItem('fx_clock_format', '12');
    localStorage.setItem('fx_observed_events', JSON.stringify([]));
    localStorage.setItem('fx_custom_muted_events', JSON.stringify([]));
    localStorage.setItem('fx_custom_unmuted_events', JSON.stringify([]));
    localStorage.setItem('fx_alerted_30min', JSON.stringify([]));
    localStorage.setItem('fx_muted_keywords', JSON.stringify(['speak', 'Nagel', 'Lagarde']));
  };

  const prevSimDateRef = useRef<Date>(simDate);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // --- Remote live JSON data sync setup ---
  const [eventsSource, setEventsSource] = useState<FxEvent[]>(FX_EVENTS);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [syncError, setSyncError] = useState<string>('');

  const fetchRemoteEvents = async (explicitUrl?: string) => {
    // Generate the candidates based on user's username Bl3551nq and repos
    const urlsToTry: string[] = [];
    if (explicitUrl && explicitUrl.trim() !== "") {
      urlsToTry.push(explicitUrl.trim());
    } else if (REMOTE_JSON_URL && REMOTE_JSON_URL.trim() !== "") {
      urlsToTry.push(REMOTE_JSON_URL.trim());
    } else {
      urlsToTry.push(
        "/src/ff_data.json",
        "/ff_data.json",
        "https://raw.githubusercontent.com/Bl3551nq/overdesk-checklist/main/src/ff_data.json",
        "https://raw.githubusercontent.com/Bl3551nq/overdesk-nexus/main/src/ff_data.json",
        "https://raw.githubusercontent.com/Bl3551nq/overdesk-checklist/main/ff_data.json",
        "https://raw.githubusercontent.com/Bl3551nq/overdesk-nexus/main/ff_data.json"
      );
    }

    setSyncStatus('loading');
    setSyncError('');

    for (let i = 0; i < urlsToTry.length; i++) {
      let targetUrl = urlsToTry[i];
      // Convert standard github web links to Raw CDN paths
      if (targetUrl.includes('github.com') && !targetUrl.includes('raw.githubusercontent.com') && !targetUrl.includes('/raw/')) {
        targetUrl = targetUrl
          .replace('github.com', 'raw.githubusercontent.com')
          .replace('/blob/', '/');
      }

      try {
        console.log(`Live remote loader trying: ${targetUrl}`);
        const res = await fetch(targetUrl);
        if (!res.ok) {
          throw new Error(`HTTP error ${res.status}`);
        }
        const data = await res.json();
        if (!Array.isArray(data)) {
          throw new Error("JSON is not a list array");
        }

        const validated: FxEvent[] = data.map((item: any, idx: number) => {
          let impactVal: "Low" | "Medium" | "High" | "Holiday" | "Non-Econ" = 'Low';
          const rawImpact = String(item.impact || '').toLowerCase();
          if (rawImpact.includes('high')) impactVal = 'High';
          else if (rawImpact.includes('med')) impactVal = 'Medium';
          else if (rawImpact.includes('low')) impactVal = 'Low';
          else if (rawImpact.includes('hol')) impactVal = 'Holiday';
          else if (rawImpact.includes('non')) impactVal = 'Non-Econ';

          return {
            country: String(item.country || 'USD'),
            date: String(item.date || new Date().toISOString()),
            title: String(item.title || `Event #${idx}`),
            impact: impactVal,
            actual: item.actual !== undefined ? String(item.actual) : null,
            forecast: item.forecast !== undefined ? String(item.forecast) : null,
            previous: item.previous !== undefined ? String(item.previous) : null,
          };
        });

        if (validated.length === 0) {
          throw new Error("Events list array is empty");
        }

        setEventsSource(validated);
        setSyncStatus('success');
        console.log(`Successfully synced live news! Loaded ${validated.length} events from ${targetUrl}`);
        return; // Success, exit function
      } catch (err: any) {
        console.warn(`Candidate path [${targetUrl}] failed:`, err.message || err);
        // If it was the last candidate, report sync error and fall back
        if (i === urlsToTry.length - 1) {
          setSyncStatus('error');
          setSyncError(err.message || 'Failed to match clean online source');
          setEventsSource(FX_EVENTS);
        }
      }
    }
  };

  useEffect(() => {
    fetchRemoteEvents();
  }, []);

  const getElapsedWeeks = () => {
    const baseDate = new Date('2026-06-14T00:00:00Z');
    const elapsedWeeks = Math.max(0, Math.floor((simDate.getTime() - baseDate.getTime()) / (7 * 24 * 60 * 60 * 1000)));
    return elapsedWeeks;
  };

  const getDayList = () => {
    const elapsedWeeks = getElapsedWeeks();
    const baseDate = new Date('2026-06-14T12:00:00');
    const start = new Date(baseDate.getTime() + elapsedWeeks * 7 * 24 * 60 * 60 * 1000);
    const list: string[] = [];
    for (let i = 0; i < 28; i++) { // 4 weeks = 28 days
      const d = new Date(start.getTime() + i * 24 * 60 * 60 * 1000);
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      list.push(`${yyyy}-${mm}-${dd}`);
    }
    return list;
  };

  const getDynamicEvents = () => {
    const baseDate = new Date('2026-06-14T00:00:00Z');
    const elapsedWeeks = getElapsedWeeks();
    const windowStartMs = baseDate.getTime() + elapsedWeeks * 7 * 24 * 60 * 60 * 1000;
    const cycleMs = 14 * 24 * 60 * 60 * 1000;
    const list: FxEvent[] = [];
    eventsSource.forEach(e => {
      const eDate = new Date(e.date);
      const offsetMs = eDate.getTime() - baseDate.getTime();
      const offsetInCycle = ((offsetMs % cycleMs) + cycleMs) % cycleMs;
      
      const date1 = new Date(windowStartMs + offsetInCycle);
      const date2 = new Date(windowStartMs + offsetInCycle + cycleMs);
      
      list.push({
        ...e,
        date: date1.toISOString().replace('.000Z', '+01:00'),
      });
      list.push({
        ...e,
        date: date2.toISOString().replace('.000Z', '+01:00'),
      });
    });
    return list;
  };

  const dynamicEventsList = getDynamicEvents();

  // Keep selectedDayString within the valid 4-week dayList
  useEffect(() => {
    const list = getDayList();
    if (!list.includes(selectedDayString)) {
      const todayStr = getTodayString();
      if (list.includes(todayStr)) {
        setSelectedDayString(todayStr);
      } else {
        setSelectedDayString(list[0]);
      }
    }
  }, [simDate]);

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
  }, [selectedDayString]);

  // Play chimes (either synthesized on-the-fly, or using direct static fallback mp3 urls)
  const triggerAlarmSound = (profileTarget: string) => {
    if (!soundEnabled) return;
    
    if (profileTarget.startsWith('mp3_')) {
      const realProfile = profileTarget.replace('mp3_', '');
      let url = "https://raw.githubusercontent.com/Bl3551nq/bell-sound/main/school_bell.mp3";
      if (realProfile === 'princess') {
        url = "https://raw.githubusercontent.com/Bl3551nq/bell-sound/main/princess_bell.mp3";
      } else if (realProfile === 'pokemon') {
        url = "https://raw.githubusercontent.com/Bl3551nq/bell-sound/main/pokemon_colo_heal.mp3";
      } else if (realProfile === 'desk') {
        // Fallback or direct happy bell
        url = "https://raw.githubusercontent.com/Bl3551nq/bell-sound/main/princess_bell.mp3"; 
      }
      
      const audio = new Audio(url);
      audio.volume = 0.75;
      audio.play().catch(() => {
        // Fallback to synth if play blocked or offline
        playSynthSound(realProfile);
      });
    } else {
      playSynthSound(profileTarget);
    }
  };

  // Sound chimes 5 times beautifully paced
  const executeFiveStrikeAlarm = (eventTitle: string, profile: string) => {
    setActiveAlertText(`ALERT: 5-MIN SLM FOR HIGH VOLATILITY EVENT: "${eventTitle}"`);
    let strike = 0;
    
    const nextStrike = () => {
      if (strike >= 5) {
        setTimeout(() => setActiveAlertText(null), 3000);
        return;
      }
      triggerAlarmSound(profile);
      strike++;
      setTimeout(nextStrike, 1100); // 1.1s spacing
    };
    nextStrike();
  };

  // Clock updating in real-time or simulated multiplier
  useEffect(() => {
    let interval: any = null;
    if (simActive) {
      interval = setInterval(() => {
        setSimDate((prev) => {
          const next = new Date(prev.getTime() + 1000 * simSpeed);
          return next;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [simActive, simSpeed]);

  // Synchronous economic calendar trigger poller - running precisely every 5 seconds
  useEffect(() => {
    const pollInterval = setInterval(() => {
      const currTimeMs = simDate.getTime();
      const currentDynamicEvents = getDynamicEvents();
      
      // ---- 5 MINUTES PRE-ALERT ----
      if (soundEnabled) {
        const upcoming5MinEvents = currentDynamicEvents.filter((e) => {
          if (e.impact !== 'High') return false;
          
          const eventId = `${e.country}-${e.date}-${e.title}`;
          if (customMutedEvents.includes(eventId)) return false;

          const isExplicitlyUnmuted = customUnmutedEvents.includes(eventId);
          const isMuted = mutedKeywords.some((key) => 
            e.title.toLowerCase().includes(key.toLowerCase())
          );
          if (isMuted && !isExplicitlyUnmuted) return false;

          const eventTimeMs = new Date(e.date).getTime();
          const diffMs = eventTimeMs - currTimeMs;
          const diffSeconds = diffMs / 1000;
          
          return diffSeconds >= 285 && diffSeconds <= 315;
        });

        if (upcoming5MinEvents.length > 0) {
          const representativeEvent = upcoming5MinEvents[0];
          const eventStamp = representativeEvent.date;

          if (!alertedTimestamps.includes(eventStamp)) {
            setAlertedTimestamps((prev) => [...prev, eventStamp]);
            
            const consolidatedTitles = upcoming5MinEvents.map((ue) => `[${ue.country}] ${ue.title}`).join(', ');
            executeFiveStrikeAlarm(`[5m Alarm] ${consolidatedTitles}`, soundProfile);
          }
        }
      }

      // ---- 30 MINUTES PRE-ALERT ----
      if (soundEnabled30Min) {
        const upcoming30MinEvents = currentDynamicEvents.filter((e) => {
          if (e.impact !== 'High') return false;
          
          const eventId = `${e.country}-${e.date}-${e.title}`;
          if (customMutedEvents.includes(eventId)) return false;

          const isExplicitlyUnmuted = customUnmutedEvents.includes(eventId);
          const isMuted = mutedKeywords.some((key) => 
            e.title.toLowerCase().includes(key.toLowerCase())
          );
          if (isMuted && !isExplicitlyUnmuted) return false;

          const eventTimeMs = new Date(e.date).getTime();
          const diffMs = eventTimeMs - currTimeMs;
          const diffSeconds = diffMs / 1000;
          
          return diffSeconds >= 1785 && diffSeconds <= 1815;
        });

        if (upcoming30MinEvents.length > 0) {
          const representativeEvent = upcoming30MinEvents[0];
          const eventStamp = representativeEvent.date;

          if (!alertedTimestamps30Min.includes(eventStamp)) {
            setAlertedTimestamps30Min((prev) => [...prev, eventStamp]);
            
            const consolidatedTitles = upcoming30MinEvents.map((ue) => `[${ue.country}] ${ue.title}`).join(', ');
            executeFiveStrikeAlarm(`[30m Alarm] ${consolidatedTitles}`, soundProfile);
          }
        }
      }
    }, 5000); // Poll every 5 seconds exactly

    return () => clearInterval(pollInterval);
  }, [simDate, soundProfile, soundEnabled, soundEnabled30Min, mutedKeywords, alertedTimestamps, alertedTimestamps30Min, customMutedEvents, customUnmutedEvents, eventsSource]);

  // Handle local persistence of settings
  useEffect(() => {
    localStorage.setItem('fx_sound_enabled', String(soundEnabled));
  }, [soundEnabled]);

  useEffect(() => {
    localStorage.setItem('fx_sound_enabled_30min', String(soundEnabled30Min));
  }, [soundEnabled30Min]);

  useEffect(() => {
    localStorage.setItem('fx_alerted_30min', JSON.stringify(alertedTimestamps30Min));
  }, [alertedTimestamps30Min]);

  useEffect(() => {
    localStorage.setItem('fx_sound_profile', soundProfile);
  }, [soundProfile]);

  useEffect(() => {
    localStorage.setItem('fx_observed_events', JSON.stringify(observedEvents));
  }, [observedEvents]);

  useEffect(() => {
    localStorage.setItem('fx_custom_muted_events', JSON.stringify(customMutedEvents));
  }, [customMutedEvents]);

  useEffect(() => {
    localStorage.setItem('fx_custom_unmuted_events', JSON.stringify(customUnmutedEvents));
  }, [customUnmutedEvents]);

  const saveKeywords = (words: string[]) => {
    setMutedKeywords(words);
    localStorage.setItem('fx_muted_keywords', JSON.stringify(words));
  };

  const addKeyword = () => {
    if (newKeyword.trim() && !mutedKeywords.includes(newKeyword.trim())) {
      saveKeywords([...mutedKeywords, newKeyword.trim()]);
      setNewKeyword('');
    }
  };

  const removeKeyword = (word: string) => {
    saveKeywords(mutedKeywords.filter((w) => w !== word));
  };

  const toggleObservedEvent = (eventId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setObservedEvents((prev) =>
      prev.includes(eventId) ? prev.filter((id) => id !== eventId) : [...prev, eventId]
    );
  };

  const toggleMutedEvent = (eventId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();

    // Find the event to determine if the name matches a default mute keyword
    const event = dynamicEventsList.find((ev) => `${ev.country}-${ev.date}-${ev.title}` === eventId);
    const isDefaultMuted = event 
      ? mutedKeywords.some((key) => event.title.toLowerCase().includes(key.toLowerCase()))
      : false;

    // Check if it is currently muted under our full logic
    const isCurrentlyMuted = customMutedEvents.includes(eventId) || 
      (isDefaultMuted && !customUnmutedEvents.includes(eventId));

    if (isCurrentlyMuted) {
      // Unmute it! (Turn alarm back ON - play sound)
      try {
        playSynthSound('desk');
      } catch (_) {}
      setCustomMutedEvents((prev) => prev.filter((id) => id !== eventId));
      if (isDefaultMuted) {
        setCustomUnmutedEvents((prev) => {
          if (!prev.includes(eventId)) return [...prev, eventId];
          return prev;
        });
      }
    } else {
      // Mute it! (Turn alarm OFF - do NOT play sound)
      setCustomUnmutedEvents((prev) => prev.filter((id) => id !== eventId));
      if (!isDefaultMuted) {
        setCustomMutedEvents((prev) => {
          if (!prev.includes(eventId)) return [...prev, eventId];
          return prev;
        });
      }
    }
  };

  // Filtering lists
  const filteredEventsForSelectedDay = dynamicEventsList.filter((e) => {
    // Exact Day representation match
    const eventDayString = e.date.split('T')[0];
    if (eventDayString !== selectedDayString) return false;

    // Filters of currency
    if (!activeCurrencies.includes(e.country)) return false;

    // Filter by impact (map Holiday to Non-Econ)
    let mappedImpact = e.impact;
    if (mappedImpact === 'Holiday') mappedImpact = 'Non-Econ';
    if (!activeImpacts.includes(mappedImpact)) return false;

    return true;
  });

  const visibleEvents = filteredEventsForSelectedDay.filter((e) => {
    const eventId = `${e.country}-${e.date}-${e.title}`;
    return !observedEvents.includes(eventId);
  });

  const dayList = getDayList();

  const handlePrevDay = () => {
    const currentIdx = dayList.indexOf(selectedDayString);
    if (currentIdx > 0) {
      const prevDay = dayList[currentIdx - 1];
      setSelectedDayString(prevDay);
      // Synchronize simulator to the morning of the newly selected day:
      setSimDate(new Date(`${prevDay}T08:00:00+01:00`));
    }
  };

  const handleNextDay = () => {
    const currentIdx = dayList.indexOf(selectedDayString);
    if (currentIdx < dayList.length - 1) {
      const nextDay = dayList[currentIdx + 1];
      setSelectedDayString(nextDay);
      // Synchronize simulator to the morning of the newly selected day:
      setSimDate(new Date(`${nextDay}T08:00:00+01:00`));
    }
  };

  // Format Helper to give exactly "HH:MM AM/PM" with leading zeroes (e.g. 12:01 AM, 07:00 AM)
  const format12Hour = (isoString: string) => {
    try {
      const d = new Date(isoString);
      let hours = d.getHours();
      let minutes = d.getMinutes();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12; // 0 is 12

      const strHours = String(hours).padStart(2, '0');
      const strMinutes = String(minutes).padStart(2, '0');

      return `${strHours}:${strMinutes} ${ampm}`;
    } catch (e) {
      return "00:00 AM";
    }
  };

  const formatTime = (isoString: string) => {
    try {
      const d = new Date(isoString);
      if (clockFormat === '24') {
        const hours = String(d.getHours()).padStart(2, '0');
        const minutes = String(d.getMinutes()).padStart(2, '0');
        return `${hours}:${minutes}`;
      } else {
        return format12Hour(isoString);
      }
    } catch (_) {
      return "00:00";
    }
  };

  const getHeaderDateDetails = () => {
    try {
      const d = new Date(selectedDayString + 'T12:00:00Z');
      const weekdayName = d.toLocaleDateString('en-US', { weekday: 'long', timeZone: 'UTC' }); // Friday, Wednesday, Mon...
      const formattedDate = d.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        timeZone: 'UTC'
      }); // Fri, Jun 19
      
      const isToday = selectedDayString === getTodayString();
      
      return {
        title: isToday ? "Today's News" : `${weekdayName}'s News`,
        subtitle: formattedDate
      };
    } catch (err) {
      return {
        title: "Economic News",
        subtitle: selectedDayString
      };
    }
  };

  const headerDetails = getHeaderDateDetails();

  if (minimized) {
    // Velocity Regulation: programmatically sum up character lengths of announcements
    // and dynamically adjust CSS animation duration to lock speed at ~100px/sec Comfortable constant rate.
    const textLength = visibleEvents.map(e => `${e.country} ${e.title} ${formatTime(e.date)}`).join('   ');
    const charCount = textLength.length || 41; // "No scheduled news announcements active." is 41 chars
    // Estimate width: ~7.5px per character.
    // Comfort speed: ~100px/sec means duration = (estimated width) / 100
    const calculatedDuration = Math.max(6, Math.round((charCount * 7.5) / 100));

    const renderMarqueeItem = (e: any, index: string | number) => {
      let impactColor = '#94a3b8'; // Default grey for Holiday / Non-Econ
      if (e.impact === 'High') impactColor = '#ef4444';
      else if (e.impact === 'Medium') impactColor = '#f97316';
      else if (e.impact === 'Low') impactColor = '#f59e0b';

      return (
        <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingRight: '28px', flexShrink: 0 }}>
          {/* Impact Ring Dot */}
          <span style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            backgroundColor: impactColor,
            boxShadow: `0 0 6px ${impactColor}`,
            flexShrink: 0
          }} />
          
          {/* National Flag */}
          <img 
            src={getFlagUrl(e.country)} 
            alt={e.country} 
            style={{ width: '13px', height: '9px', objectFit: 'cover', borderRadius: '1px', flexShrink: 0 }}
            referrerPolicy="no-referrer"
          />

          {/* Title and Country Badge */}
          <span style={{ fontSize: '10px', fontWeight: '800', color: isLight ? '#334155' : '#f1f5f9', fontFamily: 'var(--font-sans)', flexShrink: 0 }}>
            {e.country}
          </span>

          <span style={{ 
            fontSize: '10px', 
            fontWeight: '500',
            color: isLight ? '#475569' : '#cbd5e1', 
            maxWidth: '120px', 
            overflow: 'hidden', 
            textOverflow: 'ellipsis', 
            whiteSpace: 'nowrap',
            fontFamily: 'var(--font-sans)',
            flexShrink: 1
          }}>
            {e.title}
          </span>

          {/* Time Tag */}
          <span style={{ 
            fontSize: '9px', 
            padding: '1px 4px', 
            borderRadius: '4px', 
            background: isLight ? 'rgba(0, 0, 0, 0.05)' : 'rgba(255, 255, 255, 0.08)', 
            color: isLight ? '#64748b' : '#94a3b8',
            fontFamily: 'var(--font-mono)',
            flexShrink: 0
          }}>
            {formatTime(e.date)}
          </span>
        </div>
      );
    };

    return (
      <div 
        className="fx-container minimized-marquee font-sans" 
        onClick={() => setMinimized?.(false)}
        style={{
          width: '100%',
          height: '40px',
          boxSizing: 'border-box',
          overflow: 'hidden',
          position: 'relative',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          background: 'transparent',
          padding: 0,
          margin: 0,
        }}
      >
        {/* Seamless Fade-in Mask Container */}
        <div className="marquee-wrapper" style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          overflow: 'hidden',
          position: 'relative',
        }}>
          <div 
            className="marquee-content" 
            style={{ 
              display: 'flex', 
              alignItems: 'center',
              whiteSpace: 'nowrap', 
              animation: `marquee ${calculatedDuration}s linear infinite`,
              width: 'max-content',
            }}
          >
            {/* Seamless Duplication Group 1 */}
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {visibleEvents.length > 0 ? (
                visibleEvents.map((e, idx) => renderMarqueeItem(e, idx))
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingRight: '28px', color: isLight ? '#64748b' : '#94a3b8', fontSize: '10px', fontWeight: '500' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#94a3b8', boxShadow: '0 0 6px #94a3b8', flexShrink: 0 }} />
                  <span>No scheduled Events</span>
                </div>
              )}
            </div>

            {/* Seamless Duplication Group 2 */}
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {visibleEvents.length > 0 ? (
                visibleEvents.map((e, idx) => renderMarqueeItem(e, `dup-${idx}`))
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingRight: '28px', color: isLight ? '#64748b' : '#94a3b8', fontSize: '10px', fontWeight: '500' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#94a3b8', boxShadow: '0 0 6px #94a3b8', flexShrink: 0 }} />
                  <span>No scheduled Events</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fx-container font-sans" style={{
      display: 'flex',
      flexDirection: 'column',
      height: '338px',
      boxSizing: 'border-box',
      overflow: 'hidden',
      position: 'relative',
      background: isLight 
        ? 'rgba(255, 255, 255, 0.45)' 
        : 'radial-gradient(circle at 50% 20%, #121030 0%, #070617 100%)',
      backdropFilter: isLight ? 'blur(16px)' : undefined,
      WebkitBackdropFilter: isLight ? 'blur(16px)' : undefined,
      borderRadius: '24px',
      padding: '14px 10px 10px 10px',
      border: isLight ? '1px solid rgba(255, 255, 255, 0.5)' : '1px solid rgba(255, 255, 255, 0.05)',
      boxShadow: isLight 
        ? 'inset 0 1px 1px rgba(255, 255, 255, 0.4), 0 8px 32px 0 rgba(31, 38, 135, 0.05)' 
        : 'inset 0 1px 1px rgba(255,255,255,0.03), 0 10px 40px rgba(0,0,0,0.35)',
    }}>
      
      {/* SideRays lighting effect for app 2 in dark mode */}
      {!isLight && (
        <SideRays
          speed={1.5}
          rayColor1="#a855f7"
          rayColor2="#3b82f6"
          intensity={1.1}
          spread={1.8}
          origin="top-right"
          tilt={0}
          saturation={1.2}
          blend={0.65}
          falloff={1.5}
          opacity={0.45}
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 0,
            pointerEvents: 'none',
          }}
        />
      )}

      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', height: '100%', flex: 1, overflow: 'hidden' }}>
        {/* Dynamic Alert Overlay Banner when alarm triggers */}
        {activeAlertText && (
        <div style={{
          background: 'rgba(239, 68, 68, 0.95)',
          color: '#ffffff',
          fontSize: '11px',
          fontWeight: '700',
          padding: '8px 12px',
          borderRadius: '10px',
          textAlign: 'center',
          marginBottom: '10px',
          boxShadow: '0 8px 20px rgba(239, 68, 68, 0.3)',
          animation: 'pulse 1s infinite alternate',
          fontFamily: 'var(--font-sans)',
        }}>
          🚨 {activeAlertText}
        </div>
      )}

      {/* Header section identical to screenshot */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '16px',
        paddingRight: '2px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div>
            <InteractiveNewsHeader title={headerDetails.title} isLight={isLight} />
            <p style={{
              fontSize: '12px',
              fontWeight: 600,
              color: isLight ? '#64748b' : '#94a3b8',
              margin: '3px 0 0 0',
              fontFamily: 'var(--font-sans)'
            }}>
              {headerDetails.subtitle}
            </p>
          </div>
        </div>

        {/* Carousel controls - Next button glows beautifully */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          {/* Back Chevron Button */}
          <button
            onClick={handlePrevDay}
            disabled={dayList.indexOf(selectedDayString) === 0}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: 'none',
              cursor: dayList.indexOf(selectedDayString) === 0 ? 'not-allowed' : 'pointer',
              background: isLight ? '#eef2f6' : 'rgba(255, 255, 255, 0.08)',
              color: isLight ? '#334155' : '#ffffff',
              opacity: dayList.indexOf(selectedDayString) === 0 ? 0.35 : 1,
              transition: 'all 0.15s ease-in-out',
            }}
            title="Previous Day"
          >
            <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>
          
          {/* Next Chevron Button - Radiant blue button with gentle soft shadow */}
          <button
            onClick={handleNextDay}
            disabled={dayList.indexOf(selectedDayString) === dayList.length - 1}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: 'none',
              cursor: dayList.indexOf(selectedDayString) === dayList.length - 1 ? 'not-allowed' : 'pointer',
              background: 'linear-gradient(135deg, #0082ff 0%, #0056da 100%)',
              color: '#ffffff',
              opacity: dayList.indexOf(selectedDayString) === dayList.length - 1 ? 0.35 : 1,
              boxShadow: isLight 
                ? '0 2px 6px rgba(0, 130, 255, 0.25)' 
                : '0 2px 8px rgba(0, 130, 255, 0.4)',
              transition: 'all 0.15s ease-in-out',
            }}
            title="Next Day"
          >
            <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
        </div>
      </div>

      <div style={{ height: '1px', background: isLight ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.08)', marginBottom: '8px' }} />

      {/* Scrolling Events list track */}
      <div ref={scrollContainerRef} className="custom-scroll no-drag" style={{
        flex: 1,
        overflowY: 'auto',
        paddingRight: '4px',
        touchAction: 'pan-y',
        pointerEvents: 'auto'
      }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedDayString}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.22, ease: "easeInOut" }}
            style={{ minHeight: '100%', display: 'flex', flexDirection: 'column' }}
          >
            {visibleEvents.length === 0 ? (
              <div style={{
                textAlign: 'center', 
                color: isLight ? 'rgba(0,0,0,0.45)' : 'rgba(255,255,255,0.4)', 
                padding: '45px 10px', 
                fontSize: '11px', 
                fontWeight: '600',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px'
              }}>
                <span>No scheduled Events</span>
              </div>
            ) : (
              <AnimatePresence initial={false}>
                {visibleEvents.map((e, idx) => {
                  const eventId = `${e.country}-${e.date}-${e.title}`;
                  const isObserved = observedEvents.includes(eventId);
                  const isDefaultMuted = mutedKeywords.some((key) => e.title.toLowerCase().includes(key.toLowerCase()));
                  const isEventMuted = customMutedEvents.includes(eventId) || (isDefaultMuted && !customUnmutedEvents.includes(eventId));
                  const hasMetrics = (e.actual || e.forecast || e.previous) && (showActual || showForecast || showPrevious);

                  return (
                    <motion.div 
                      key={eventId}
                      layout
                      initial={{ opacity: 0, y: 15 }}
                      animate={{
                        opacity: 1,
                        scale: 1,
                        x: 0,
                        y: 0
                      }}
                      exit={{
                        opacity: 0,
                        scale: 0.9,
                        x: 50,
                        transition: { duration: 0.25 }
                      }}
                      transition={{
                        type: 'spring',
                        stiffness: 260,
                        damping: 24,
                      }}
                      style={{
                        display: 'flex',
                        padding: '6px 0',
                        alignItems: 'stretch',
                        transformOrigin: 'left center',
                        position: 'relative'
                      }}
                    >
                      {/* Left Column: Time & PM/AM */}
                      {(() => {
                        const eDate = new Date(e.date);
                        const isEventActiveHour = eDate.getHours() === simDate.getHours() &&
                                                 eDate.getDate() === simDate.getDate() &&
                                                 eDate.getMonth() === simDate.getMonth();
                        return (
                          <div style={{
                            width: '38px',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'flex-start',
                            paddingTop: '11px',
                            textAlign: 'right',
                            paddingRight: '4px',
                            flexShrink: 0
                          }}>
                            <span style={{
                              fontFamily: 'var(--font-mono), monospace',
                              fontSize: '10px',
                              fontWeight: 700,
                              color: isLight 
                                ? 'rgba(15, 23, 42, 0.75)' 
                                : (isEventActiveHour ? '#3b82f6' : 'rgba(255, 255, 255, 0.8)'),
                              letterSpacing: '-0.02em',
                              lineHeight: '1.2'
                            }}>
                              {formatTime(e.date).split(' ')[0]}
                            </span>
                            {formatTime(e.date).includes(' ') && (
                              <span style={{
                                fontSize: '8px',
                                fontWeight: 700,
                                opacity: isEventActiveHour && !isLight ? 1 : 0.6,
                                color: isLight 
                                  ? '#475569' 
                                  : (isEventActiveHour ? '#3b82f6' : '#94a3b8'),
                                textTransform: 'uppercase',
                                marginTop: '1px'
                              }}>
                                {formatTime(e.date).split(' ')[1]}
                              </span>
                            )}
                          </div>
                        );
                      })()}

                      {/* Central Column: Timeline Connector */}
                      <div style={{
                        width: '16px',
                        position: 'relative',
                        flexShrink: 0,
                        display: 'flex',
                        justifyContent: 'center'
                      }}>
                        {/* Continuous vertical line */}
                        <div style={{
                          position: 'absolute',
                          top: 0,
                          bottom: 0,
                          left: '7px',
                          width: '2px',
                          background: idx === 0 && !isLight
                            ? 'linear-gradient(to bottom, #0082ff 0%, rgba(99, 102, 241, 0.15) 100%)'
                            : (isLight ? 'rgba(0, 0, 0, 0.08)' : 'rgba(255, 255, 255, 0.08)'),
                          boxShadow: idx === 0 && !isLight ? '0 0 8px rgba(0, 130, 255, 0.4)' : 'none',
                          zIndex: 1
                        }} />

                        {/* Timeline Node dot */}
                        <motion.div
                          animate={e.impact === 'High' ? { scale: [1, 1.2, 1] } : {}}
                          transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
                          style={{
                            position: 'absolute',
                            top: '13px',
                            left: '4px',
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            backgroundColor: getImpactColor(e.impact),
                            border: isLight ? '1.5px solid #ffffff' : '1.5px solid #0d0c24',
                            boxShadow: `0 0 8px 1.5px ${getImpactColor(e.impact)}99`,
                            zIndex: 2,
                            transformOrigin: 'center'
                          }}
                        />
                      </div>

                      {/* Right Column: Glassy Card */}
                      <div style={{
                        flex: 1,
                        paddingLeft: '2px',
                        paddingRight: '1px'
                      }}>
                        <motion.div
                          style={{
                            background: isLight 
                              ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.75) 0%, rgba(241, 245, 249, 0.65) 100%)' 
                              : 'linear-gradient(135deg, rgba(23, 21, 56, 0.5) 0%, rgba(13, 11, 33, 0.7) 100%)',
                            backdropFilter: 'blur(16px)',
                            WebkitBackdropFilter: 'blur(16px)',
                            border: isLight 
                              ? '1px solid rgba(255, 255, 255, 0.8)' 
                              : '1px solid rgba(255, 255, 255, 0.08)',
                            borderRadius: '12px',
                            padding: '8px 11px',
                            boxShadow: isLight 
                              ? '0 4px 14px rgba(0, 0, 0, 0.02), inset 0 1px 1px rgba(255,255,255,0.8)' 
                              : '0 6px 20px rgba(0, 0, 0, 0.3), inset 0 1px 1px rgba(255,255,255,0.05)',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '4px',
                            position: 'relative',
                            transformOrigin: 'left center'
                          }}
                          whileHover={{ 
                            y: -1,
                            boxShadow: isLight
                              ? '0 6px 16px rgba(0,0,0,0.04), inset 0 1px 1px rgba(255,255,255,0.9)'
                              : '0 8px 20px rgba(0, 130, 255, 0.1), inset 0 1px 1px rgba(255,255,255,0.08)',
                            borderColor: isLight
                              ? 'rgba(255, 255, 255, 0.95)'
                              : 'rgba(255, 255, 255, 0.15)'
                          }}
                        >
                          {/* Title & Badge Header line */}
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: '8px'
                          }}>
                            <InteractiveNewsTitle title={e.title} isLight={isLight} />
                            
                            {/* Currency Flag/Code Badge */}
                            <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                              borderRadius: '6px',
                              padding: '2px 5px',
                              background: isLight ? 'rgba(0,0,0,0.03)' : 'rgba(255, 255, 255, 0.06)',
                              border: isLight ? '1px solid rgba(0,0,0,0.02)' : '1px solid rgba(255, 255, 255, 0.04)',
                              fontSize: '9px',
                              fontWeight: 700,
                              color: isLight ? '#475569' : '#cbd5e1',
                              flexShrink: 0
                            }}>
                              <FlagImage country={e.country} />
                              <span style={{ fontFamily: 'var(--font-mono), monospace' }}>{e.country}</span>
                            </div>
                          </div>

                          {/* Metrics and Buttons Unified Row */}
                          <div style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            alignItems: 'center',
                            gap: '4px',
                            marginTop: '3px',
                            marginBottom: '2px'
                          }}>
                            {showActual && (
                              <div style={{
                                flex: '0 0 65px',
                                width: '65px',
                                padding: '3px 5px',
                                borderRadius: '6px',
                                background: isLight ? 'rgba(0,0,0,0.02)' : 'rgba(255,255,255,0.03)',
                                border: isLight ? '1px solid rgba(0,0,0,0.03)' : '1px solid rgba(255,255,255,0.05)',
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                minHeight: '18px'
                              }}>
                                <span style={{ fontSize: '7px', fontWeight: 800, color: isLight ? '#64748b' : '#94a3b8', letterSpacing: '0.02em', marginRight: '3px', flexShrink: 0 }}>ACT</span>
                                <span style={{
                                  fontSize: '9.5px',
                                  fontWeight: 800,
                                  fontFamily: 'var(--font-mono), monospace',
                                  color: e.actual 
                                    ? (isLight ? '#16a34a' : '#4ade80') 
                                    : (isLight ? '#94a3b8' : 'rgba(255,255,255,0.35)'),
                                  whiteSpace: 'nowrap',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis'
                                }}>
                                  {e.actual || '--'}
                                </span>
                              </div>
                            )}

                            {showForecast && (
                              <div style={{
                                flex: '0 0 65px',
                                width: '65px',
                                padding: '3px 5px',
                                borderRadius: '6px',
                                background: isLight ? 'rgba(0,0,0,0.02)' : 'rgba(255,255,255,0.03)',
                                border: isLight ? '1px solid rgba(0,0,0,0.03)' : '1px solid rgba(255,255,255,0.05)',
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                minHeight: '18px'
                              }}>
                                <span style={{ fontSize: '7px', fontWeight: 800, color: isLight ? '#64748b' : '#94a3b8', letterSpacing: '0.02em', marginRight: '3px', flexShrink: 0 }}>FOR</span>
                                <span style={{
                                  fontSize: '9.5px',
                                  fontWeight: 700,
                                  fontFamily: 'var(--font-mono), monospace',
                                  color: e.forecast
                                    ? (isLight ? '#334155' : '#ffffff')
                                    : (isLight ? '#94a3b8' : 'rgba(255,255,255,0.35)'),
                                  whiteSpace: 'nowrap',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis'
                                }}>
                                  {e.forecast || '--'}
                                </span>
                              </div>
                            )}

                            {showPrevious && (
                              <div style={{
                                flex: '0 0 65px',
                                width: '65px',
                                padding: '3px 5px',
                                borderRadius: '6px',
                                background: isLight ? 'rgba(0,0,0,0.02)' : 'rgba(255,255,255,0.03)',
                                border: isLight ? '1px solid rgba(0,0,0,0.03)' : '1px solid rgba(255,255,255,0.05)',
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                minHeight: '18px'
                              }}>
                                <span style={{ fontSize: '7px', fontWeight: 800, color: isLight ? '#64748b' : '#94a3b8', letterSpacing: '0.02em', marginRight: '3px', flexShrink: 0 }}>PREV</span>
                                <span style={{
                                  fontSize: '9.5px',
                                  fontWeight: 700,
                                  fontFamily: 'var(--font-mono), monospace',
                                  color: e.previous
                                    ? (isLight ? '#475569' : '#cbd5e1')
                                    : (isLight ? '#94a3b8' : 'rgba(255,255,255,0.35)'),
                                  whiteSpace: 'nowrap',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis'
                                }}>
                                  {e.previous || '--'}
                                </span>
                              </div>
                            )}

                            {/* Interactive Buttons: Mute bell & Check done */}
                            <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '5px',
                              marginLeft: 'auto',
                              flexShrink: 0
                            }}>
                              {/* Bell status */}
                              <button
                                onClick={(ev) => toggleMutedEvent(eventId, ev)}
                                style={{
                                  background: isLight ? 'rgba(0,0,0,0.02)' : 'rgba(255,255,255,0.03)',
                                  border: 'none',
                                  borderRadius: '5px',
                                  width: '18px',
                                  height: '18px',
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  color: isLight ? '#475569' : '#94a3b8',
                                  transition: 'all 0.1s ease',
                                }}
                                className="hover:scale-110 active:scale-95"
                                title={isEventMuted ? "Alarm muted. Click to activate!" : "Alarm active! Click to mute."}
                              >
                                {isEventMuted ? (
                                  <BellOff size={10} style={{ color: isLight ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.35)' }} />
                                ) : (
                                  <Bell size={10} fill="currentColor" style={{ 
                                    color: e.impact === 'High' ? '#ef4444' :
                                           e.impact === 'Medium' ? '#f97316' :
                                           e.impact === 'Low' ? '#f59e0b' :
                                           (isLight ? '#475569' : '#94a3b8')
                                  }} />
                                )}
                              </button>

                              {/* Dismiss / X Close */}
                              <button
                                onClick={(ev) => toggleObservedEvent(eventId, ev)}
                                style={{
                                  background: isLight ? 'rgba(0,0,0,0.02)' : 'rgba(255,255,255,0.03)',
                                  border: 'none',
                                  borderRadius: '5px',
                                  width: '18px',
                                  height: '18px',
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  color: isLight ? '#475569' : '#94a3b8',
                                  transition: 'all 0.1s ease',
                                }}
                                className="hover:scale-110 active:scale-95"
                                title={isObserved ? "Observed" : "Dismiss News"}
                              >
                                <X size={10} style={{ color: isLight ? 'rgba(0,0,0,0.35)' : 'rgba(255,255,255,0.45)' }} />
                              </button>
                            </div>
                          </div>

                        </motion.div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
      </div>

      {/* Sleek, absolutely positioned settings overlay mimicking screenshot */}
      {settingsPanelOpen && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: isLight ? '#f4f6fc' : '#0b0a1a',
          color: isLight ? '#1e293b' : '#f8fafc',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 100,
          padding: '14px 16px',
          boxSizing: 'border-box',
          fontFamily: 'var(--font-sans), sans-serif',
        }}>
          {/* Header row */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '4px',
            flexShrink: 0,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Settings size={16} className={isLight ? 'text-indigo-600' : 'text-indigo-400'} />
              <span style={{ fontSize: '13px', fontWeight: '800', tracking: '-0.01em', color: isLight ? '#312e81' : '#e0e7ff' }}>
                Preset Filters
              </span>
            </div>
            {/* Reset All */}
            <button
              onClick={handleResetAll}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#4f46e5';
                e.currentTarget.style.color = '#ffffff';
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(79, 70, 229, 0.35)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = isLight ? '#e0e7ff' : 'rgba(99, 102, 241, 0.15)';
                e.currentTarget.style.color = isLight ? '#4338ca' : '#c7d2fe';
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = 'none';
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                padding: '4px 12px',
                background: isLight ? '#e0e7ff' : 'rgba(99, 102, 241, 0.15)',
                color: isLight ? '#4338ca' : '#c7d2fe',
                border: 'none',
                borderRadius: '999px',
                fontSize: '11px',
                fontWeight: '700',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              <RefreshCw size={10} />
              Reset All
            </button>
          </div>

          {/* Scrollable controls list */}
          <div 
            style={{ 
              flex: 1, 
              overflowY: 'auto', 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '12px', 
              marginTop: '10px',
              paddingRight: '4px',
              touchAction: 'pan-y',
              pointerEvents: 'auto'
            }} 
            className="custom-scroll no-drag"
          >
            {/* Expected Impact */}
            <div>
              <div style={{ fontSize: '9px', fontWeight: '800', letterSpacing: '0.05em', color: isLight ? '#64748b' : '#94a3b8', textTransform: 'uppercase', marginBottom: '6px' }}>
                Expected Impact
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {[
                  { id: 'High', label: 'High', color: '#ef4444', activeBg: isLight ? '#fee2e2' : 'rgba(239, 68, 68, 0.15)', activeBorder: '#ef4444', activeText: isLight ? '#991b1b' : '#fee2e2' },
                  { id: 'Medium', label: 'Medium', color: '#f97316', activeBg: isLight ? '#ffedd5' : 'rgba(249, 115, 22, 0.15)', activeBorder: '#f97316', activeText: isLight ? '#9a3412' : '#ffedd5' },
                  { id: 'Low', label: 'Low', color: '#f59e0b', activeBg: isLight ? '#fef9c3' : 'rgba(250, 204, 21, 0.15)', activeBorder: '#f59e0b', activeText: isLight ? '#854d0e' : '#fef9c3' },
                  { id: 'Non-Econ', label: 'Non-Econ', color: '#94a3b8', activeBg: isLight ? '#f1f5f9' : 'rgba(148, 163, 184, 0.15)', activeBorder: '#94a3b8', activeText: isLight ? '#334155' : '#f1f5f9' },
                ].map((item) => {
                  const active = item.id === 'Non-Econ' 
                    ? (activeImpacts.includes('Non-Econ') || activeImpacts.includes('Holiday'))
                    : activeImpacts.includes(item.id);

                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveImpacts((prev) => {
                          const list = [...prev];
                          if (item.id === 'Non-Econ') {
                            if (list.includes('Non-Econ') || list.includes('Holiday')) {
                              return list.filter(x => x !== 'Non-Econ' && x !== 'Holiday');
                            } else {
                              return [...list, 'Non-Econ', 'Holiday'];
                            }
                          } else {
                            if (list.includes(item.id)) {
                              return list.filter(x => x !== item.id);
                            } else {
                              return [...list, item.id];
                            }
                          }
                        });
                      }}
                      style={{
                        padding: '4px 10px',
                        borderRadius: '999px',
                        fontSize: '11px',
                        fontWeight: '700',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '5px',
                        cursor: 'pointer',
                        border: active ? `2px solid ${item.activeBorder}` : (isLight ? '1px solid #cbd5e1' : '1px solid rgba(255,255,255,0.08)'),
                        background: active ? item.activeBg : 'transparent',
                        color: active ? item.activeText : (isLight ? '#64748b' : '#94a3b8'),
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: item.color }} />
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Tiny Division Line */}
            <div style={{
              height: '1px',
              background: isLight ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.06)',
              margin: '2px 0'
            }} />

            {/* Filter Currencies */}
            <div>
              <div style={{ fontSize: '9px', fontWeight: '800', letterSpacing: '0.05em', color: isLight ? '#64748b' : '#94a3b8', textTransform: 'uppercase', marginBottom: '6px' }}>
                Filter Currencies
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
                {[
                  { code: 'USD', display: 'US', flag: '🇺🇸' },
                  { code: 'EUR', display: 'EU', flag: '🇪🇺' },
                  { code: 'GBP', display: 'GB', flag: '🇬🇧' },
                  { code: 'JPY', display: 'JP', flag: '🇯🇵' },
                  { code: 'CAD', display: 'CA', flag: '🇨🇦' },
                  { code: 'AUD', display: 'AU', flag: '🇦🇺' },
                  { code: 'NZD', display: 'NZ', flag: '🇳🇿' },
                  { code: 'CHF', display: 'CH', flag: '🇨🇭' },
                ].map((item) => {
                  const active = activeCurrencies.includes(item.code);
                  return (
                    <button
                      key={item.code}
                      onClick={() => {
                        setActiveCurrencies((prev) => {
                          if (prev.includes(item.code)) {
                            if (prev.length === 1) return prev;
                            return prev.filter(c => c !== item.code);
                          } else {
                            return [...prev, item.code];
                          }
                        });
                      }}
                      style={{
                        padding: '6px 4px',
                        borderRadius: '8px',
                        fontSize: '11px',
                        fontWeight: '700',
                        cursor: 'pointer',
                        textAlign: 'center',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '4px',
                        border: active 
                          ? (isLight ? '1px solid #818cf8' : '1px solid #6366f1') 
                          : (isLight ? '1px solid #cbd5e1' : '1px solid rgba(255,255,255,0.06)'),
                        background: active 
                          ? (isLight ? '#e0e7ff' : 'rgba(99, 102, 241, 0.25)') 
                          : 'transparent',
                        color: active 
                          ? (isLight ? '#4338ca' : '#c7d2fe') 
                          : (isLight ? '#8e9aa8' : 'rgba(255,255,255,0.3)'),
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <FlagImage country={item.code} />
                      <span>{item.display}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Tiny Division Line */}
            <div style={{
              height: '1px',
              background: isLight ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.06)',
              margin: '2px 0'
            }} />

            {/* Event Alert Signals */}
            <div>
              <div style={{ fontSize: '9px', fontWeight: '800', letterSpacing: '0.05em', color: isLight ? '#64748b' : '#94a3b8', textTransform: 'uppercase', marginBottom: '6px' }}>
                🔔 Event Alert Signals & Display Options
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {/* Toggle switch: 5 Min before alerts */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '11.5px', fontWeight: '600', color: isLight ? '#0f172a' : '#ffffff' }}>
                    Trigger 5 min before alerts
                  </span>
                  <button
                    onClick={() => setSoundEnabled(!soundEnabled)}
                    style={{
                      width: '44px',
                      height: '24px',
                      borderRadius: '12px',
                      background: soundEnabled ? '#6366f1' : (isLight ? '#cbd5e1' : '#222'),
                      border: 'none',
                      position: 'relative',
                      cursor: 'pointer',
                      padding: 0,
                      outline: 'none',
                      transition: 'background 0.2s',
                    }}
                  >
                    <div style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      background: '#ffffff',
                      position: 'absolute',
                      top: '2px',
                      left: soundEnabled ? '22px' : '2px',
                      transition: 'left 0.2s cubic-bezier(0.2, 0.8, 0.2, 1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.18)',
                    }}>
                      <span style={{ fontSize: '10px' }}>🔔</span>
                    </div>
                  </button>
                </div>

                {/* Toggle switch: 30 Min before alerts */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '11.5px', fontWeight: '600', color: isLight ? '#0f172a' : '#ffffff' }}>
                    Trigger 30 min before alerts
                  </span>
                  <button
                    onClick={() => setSoundEnabled30Min(!soundEnabled30Min)}
                    style={{
                      width: '44px',
                      height: '24px',
                      borderRadius: '12px',
                      background: soundEnabled30Min ? '#6366f1' : (isLight ? '#cbd5e1' : '#222'),
                      border: 'none',
                      position: 'relative',
                      cursor: 'pointer',
                      padding: 0,
                      outline: 'none',
                      transition: 'background 0.2s',
                    }}
                  >
                    <div style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      background: '#ffffff',
                      position: 'absolute',
                      top: '2px',
                      left: soundEnabled30Min ? '22px' : '2px',
                      transition: 'left 0.2s cubic-bezier(0.2, 0.8, 0.2, 1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.18)',
                    }}>
                      <span style={{ fontSize: '10px' }}>⏰</span>
                    </div>
                  </button>
                </div>

                {/* Sound Carousel */}
                <div style={{
                  background: isLight ? '#e2e8f0' : 'transparent',
                  border: isLight ? '1px solid #cbd5e1' : 'none',
                  borderRadius: '10px',
                  padding: isLight ? '6px 10px' : '6px 0px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                  <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                    <button
                      onClick={() => {
                        const profiles = [
                          { id: 'school', name: 'School Bell' },
                          { id: 'desk', name: 'Desk Bell' },
                          { id: 'pokemon', name: 'Pokémon Heal' },
                          { id: 'princess', name: 'Princess Bell' },
                        ];
                        const idx = profiles.findIndex(p => p.id === soundProfile);
                        const prevIdx = (idx - 1 + profiles.length) % profiles.length;
                        setSoundProfile(profiles[prevIdx].id);
                      }}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px', color: '#6366f1' }}
                    >
                      <ChevronLeft size={16} />
                    </button>
                    
                    <span style={{ fontSize: '11px', fontWeight: '700', color: isLight ? '#1e293b' : '#f8fafc', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      {soundProfile === 'school' ? '🔔 School Bell' :
                       soundProfile === 'pokemon' ? '🎒 Pokémon Heal' :
                       soundProfile === 'princess' ? '👸 Princess Bell' : '🔔 Desk Bell'}
                    </span>

                    <button
                      onClick={() => {
                        const profiles = [
                          { id: 'school', name: 'School Bell' },
                          { id: 'desk', name: 'Desk Bell' },
                          { id: 'pokemon', name: 'Pokémon Heal' },
                          { id: 'princess', name: 'Princess Bell' },
                        ];
                        const idx = profiles.findIndex(p => p.id === soundProfile);
                        const nextIdx = (idx + 1) % profiles.length;
                        setSoundProfile(profiles[nextIdx].id);
                      }}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px', color: '#6366f1' }}
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <button
                      onClick={() => {
                        try {
                          playSynthSound(soundProfile);
                        } catch (_) {}
                      }}
                      style={{
                        background: '#6366f1',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '50%',
                        width: '22px',
                        height: '22px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        transition: 'opacity 0.2s'
                      }}
                      className="hover:opacity-90"
                    >
                      <Play size={10} fill="currentColor" style={{ marginLeft: '1px' }} />
                    </button>
                    <ChevronDown size={14} style={{ opacity: 0.6 }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Tiny Division Line */}
            <div style={{
              height: '1px',
              background: isLight ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.06)',
              margin: '2px 0'
            }} />

            {/* Disclosure Metrics */}
            <div>
              <div style={{ fontSize: '9px', fontWeight: '800', letterSpacing: '0.05em', color: isLight ? '#64748b' : '#94a3b8', textTransform: 'uppercase', marginBottom: '6px' }}>
                📊 Disclosure Metrics
              </div>
              <div style={{ display: 'flex', gap: '6px' }}>
                {[
                  { id: 'actual', label: 'ACTUAL', state: showActual, setter: setShowActual },
                  { id: 'forecast', label: 'FORECAST', state: showForecast, setter: setShowForecast },
                  { id: 'previous', label: 'PREVIOUS', state: showPrevious, setter: setShowPrevious },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => item.setter(!item.state)}
                    style={{
                      flex: 1,
                      padding: '6px 4px',
                      borderRadius: '8px',
                      fontSize: '10px',
                      fontWeight: '800',
                      textAlign: 'center',
                      cursor: 'pointer',
                      border: item.state 
                        ? (isLight ? '1px solid #818cf8' : '1px solid #6366f1') 
                        : (isLight ? '1px solid #cbd5e1' : '1px solid rgba(255,255,255,0.06)'),
                      background: item.state 
                        ? (isLight ? '#e0e7ff' : 'rgba(99, 102, 241, 0.25)') 
                        : 'transparent',
                      color: item.state 
                        ? (isLight ? '#4338ca' : '#c7d2fe') 
                        : (isLight ? '#8e9aa8' : 'rgba(255,255,255,0.3)'),
                      transition: 'all 0.1s ease',
                    }}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tiny Division Line */}
            <div style={{
              height: '1px',
              background: isLight ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.06)',
              margin: '2px 0'
            }} />

            {/* Time Display Region */}
            <div>
              <div style={{ fontSize: '9px', fontWeight: '800', letterSpacing: '0.05em', color: isLight ? '#64748b' : '#94a3b8', textTransform: 'uppercase', marginBottom: '6px' }}>
                🕒 Time Display Region
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '11.5px', fontWeight: '600', color: isLight ? '#0f172a' : '#ffffff' }}>
                  Clock Format
                </span>
                <div style={{
                  display: 'flex',
                  background: isLight ? '#e2e8f0' : 'transparent',
                  borderRadius: '8px',
                  padding: '2px',
                }}>
                  <button
                    onClick={() => setClockFormat('12')}
                    style={{
                      padding: '4px 8px',
                      borderRadius: '6px',
                      fontSize: '10px',
                      fontWeight: '800',
                      cursor: 'pointer',
                      border: clockFormat === '12' && !isLight ? '1px solid rgba(59, 130, 246, 0.4)' : '1px solid transparent',
                      background: clockFormat === '12' ? (isLight ? '#ffffff' : 'rgba(59, 130, 246, 0.15)') : 'transparent',
                      color: clockFormat === '12' ? (isLight ? '#4338ca' : '#3b82f6') : (isLight ? '#64748b' : '#94a3b8'),
                      boxShadow: clockFormat === '12' ? (isLight ? '0 1px 2px rgba(0,0,0,0.08)' : '0 0 10px rgba(59, 130, 246, 0.35)') : 'none',
                      transition: 'all 0.15s',
                    }}
                  >
                    12 Hour
                  </button>
                  <button
                    onClick={() => setClockFormat('24')}
                    style={{
                      padding: '4px 8px',
                      borderRadius: '6px',
                      fontSize: '10px',
                      fontWeight: '800',
                      cursor: 'pointer',
                      border: clockFormat === '24' && !isLight ? '1px solid rgba(59, 130, 246, 0.4)' : '1px solid transparent',
                      background: clockFormat === '24' ? (isLight ? '#ffffff' : 'rgba(59, 130, 246, 0.15)') : 'transparent',
                      color: clockFormat === '24' ? (isLight ? '#4338ca' : '#3b82f6') : (isLight ? '#64748b' : '#94a3b8'),
                      boxShadow: clockFormat === '24' ? (isLight ? '0 1px 2px rgba(0,0,0,0.08)' : '0 0 10px rgba(59, 130, 246, 0.35)') : 'none',
                      transition: 'all 0.15s',
                    }}
                  >
                    24 Hour
                  </button>
                </div>
              </div>
            </div>

          </div>

          {/* Footer Save & Done Button */}
          <div style={{ marginTop: '8px', flexShrink: 0, borderTop: isLight ? '1px solid #e2e8f0' : '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '8px', display: 'flex', justifyContent: 'flex-end' }}>
            <button
              onClick={() => setSettingsPanelOpen(false)}
              style={{
                background: '#6366f1',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                padding: '6px 14px',
                fontSize: '11px',
                fontWeight: '700',
                cursor: 'pointer',
                transition: 'opacity 0.2s',
              }}
              className="hover:opacity-90"
            >
              Done
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
