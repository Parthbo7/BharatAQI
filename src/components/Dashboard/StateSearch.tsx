import React, { useState, useRef, useEffect } from "react";
import { Search, X, Check } from "lucide-react";
import { REGIONS } from "@/lib/regions";

interface StateSearchProps {
  selected: string | string[];
  onChange: (selected: string | string[]) => void;
  multi?: boolean;
  placeholder?: string;
  className?: string;
}

export const StateSearch: React.FC<StateSearchProps> = ({
  selected,
  onChange,
  multi = false,
  placeholder = "Search state...",
  className = ""
}) => {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const allStates = Object.values(REGIONS);
  const filteredStates = allStates.filter(
    (s) => s.name.toLowerCase().includes(query.toLowerCase()) || s.id.toLowerCase().includes(query.toLowerCase())
  );

  const isSelected = (id: string) => {
    if (multi) return (selected as string[]).includes(id);
    return selected === id;
  };

  const toggleSelection = (id: string) => {
    if (multi) {
      const sel = selected as string[];
      if (sel.includes(id)) {
        onChange(sel.filter((s) => s !== id));
      } else {
        onChange([...sel, id]);
      }
    } else {
      onChange(id);
      setOpen(false);
      setQuery("");
    }
  };

  const removeState = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (multi) {
      onChange((selected as string[]).filter((s) => s !== id));
    }
  };

  return (
    <div className={`relative ${className}`} ref={wrapperRef}>
      <div 
        className="flex items-center min-h-[36px] bg-[#0f172a] border border-[#1e293b] rounded-xl px-3 py-1 cursor-text flex-wrap gap-1"
        onClick={() => setOpen(true)}
      >
        <Search className="w-4 h-4 text-white/40 shrink-0 mr-1" />
        
        {multi && (selected as string[]).map((id) => (
          <span key={id} className="flex items-center gap-1 bg-white/10 text-white text-[10px] px-2 py-0.5 rounded-md font-bold">
            {REGIONS[id]?.name || id}
            <button onClick={(e) => removeState(id, e)} className="hover:text-red-400">
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}

        {!multi && !open && selected && (
          <span className="text-white text-xs font-bold mr-2">
            {REGIONS[selected as string]?.name || selected}
          </span>
        )}

        <input
          type="text"
          className="flex-1 bg-transparent text-white text-xs focus:outline-none min-w-[80px]"
          placeholder={multi && (selected as string[]).length > 0 ? "" : (!multi && selected && !open ? "" : placeholder)}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
        />
      </div>

      {open && (
        <div className="absolute z-50 top-full left-0 right-0 mt-1 max-h-60 overflow-y-auto bg-[#03050a] border border-[#1e293b] rounded-xl shadow-2xl py-2 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
          {filteredStates.length === 0 ? (
            <div className="px-4 py-2 text-xs text-white/40">No states found.</div>
          ) : (
            filteredStates.map((state) => {
              const sel = isSelected(state.id);
              return (
                <button
                  key={state.id}
                  onClick={() => toggleSelection(state.id)}
                  className={`w-full text-left px-4 py-2 text-xs font-bold transition-colors flex items-center justify-between ${
                    sel ? "bg-emerald-500/20 text-emerald-400" : "text-white/70 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <span>{state.name} <span className="text-[10px] text-white/30 ml-2 uppercase">({state.id})</span></span>
                  {sel && <Check className="w-3 h-3" />}
                </button>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};
