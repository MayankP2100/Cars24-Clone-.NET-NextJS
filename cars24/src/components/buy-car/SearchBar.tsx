import React from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export type SearchBarProps = {
  query: string;
  setQuery: (v: string) => void;
  suggestions: string[];
  onSubmit: (text: string) => void;
};

const SearchBar: React.FC<SearchBarProps> = ({ query, setQuery, suggestions, onSubmit }) => {
  return (
    <div className="relative">
      <Input
        type="text"
        placeholder="Search cars..."
        className="pl-10"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            onSubmit(query);
          }
        }}
      />
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />

      {suggestions.length > 0 && (
        <ul className="absolute left-0 right-0 bg-white border rounded shadow mt-1 z-20">
          {suggestions.map((s, idx) => (
            <li
              key={s + idx}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                setQuery(s);
                onSubmit(s);
              }}
            >
              {s}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;
