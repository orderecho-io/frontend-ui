import React from 'react';
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const countries = [
  { code: '+1', name: 'CA', flag: '🇨🇦' },
  { code: '+1', name: 'US', flag: '🇺🇸' },
];

export default function PhoneInput({ value, onChange }) {
  const code = value?.startsWith('+1 ') ? '+1' : '';
  const number = value?.startsWith('+1 ') ? value.substring(3) : value;

  const handleCodeChange = (newCode) => {
    onChange(`${newCode} ${number}`);
  };

  const handleNumberChange = (e) => {
    onChange(`${code} ${e.target.value}`);
  };

  return (
    <div className="flex">
      <Select onValueChange={handleCodeChange} defaultValue={code}>
        <SelectTrigger className="w-28 rounded-r-none">
          <SelectValue placeholder="Code" />
        </SelectTrigger>
        <SelectContent>
          {countries.map(c => (
            <SelectItem key={c.name} value={c.code}>
              <div className="flex items-center gap-2">
                <span>{c.flag}</span>
                <span>{c.code}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Input
        type="tel"
        value={number}
        onChange={handleNumberChange}
        placeholder="555-123-4567"
        className="rounded-l-none"
      />
    </div>
  );
}

