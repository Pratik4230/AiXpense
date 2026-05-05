"use client";

import { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { updateCurrency } from "@/actions/user";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CURRENCIES, type CurrencyCode } from "@/constants/currency";
import { cn } from "@/lib/utils";

interface CurrencyCardProps {
  currentCurrency: string;
}

export function CurrencyCard({ currentCurrency }: CurrencyCardProps) {
  const [selected, setSelected] = useState<CurrencyCode>(
    (currentCurrency as CurrencyCode) ?? "INR",
  );
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  const selectedData = CURRENCIES.find((c) => c.code === selected)!;
  const isDirty = selected !== currentCurrency;

  const handleSave = async () => {
    setError("");
    setIsLoading(true);
    setSaved(false);

    const result = await updateCurrency(selected, selectedData.country);

    if (result.error) {
      setError(result.error);
    } else {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }

    setIsLoading(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Currency</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-full justify-between h-10"
              disabled={isLoading}
              type="button"
            >
              <span>
                {selectedData.flag} {selectedData.code} — {selectedData.name}
              </span>
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0" align="start">
            <Command>
              <CommandInput placeholder="Search currency or country..." />
              <CommandList>
                <CommandEmpty>No currency found.</CommandEmpty>
                <CommandGroup>
                  {CURRENCIES.map((c) => (
                    <CommandItem
                      key={c.code}
                      value={`${c.code} ${c.name}`}
                      onSelect={() => {
                        setSelected(c.code as CurrencyCode);
                        setOpen(false);
                        setSaved(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          selected === c.code ? "opacity-100" : "opacity-0",
                        )}
                      />
                      {c.flag} {c.code} — {c.name}
                      <span className="ml-auto text-xs text-muted-foreground">
                        {c.symbol}
                      </span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        {error && <p className="text-xs text-destructive">{error}</p>}
        {saved && (
          <p className="text-xs text-green-500">Currency updated successfully.</p>
        )}

        <Button
          onClick={handleSave}
          disabled={isLoading || !isDirty}
          size="sm"
        >
          {isLoading ? "Saving..." : "Save Currency"}
        </Button>
      </CardContent>
    </Card>
  );
}
