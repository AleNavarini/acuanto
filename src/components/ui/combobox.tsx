"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

interface ComboboxProps {
    items: { value: string; label: string }[];
    placeholder?: string;
    selectedValue?: string;
    onChange: (value: string) => void;
    allowCustomInput?: boolean;
}

export function Combobox({
    items,
    placeholder = "Select...",
    selectedValue,
    onChange,
    allowCustomInput = false
}: ComboboxProps) {
    const [open, setOpen] = React.useState(false);
    const [value, setValue] = React.useState(selectedValue || "");
    const [inputValue, setInputValue] = React.useState("");
    const [localItems, setLocalItems] = React.useState([...items]);

    // Keep local state in sync with props
    React.useEffect(() => {
        setValue(selectedValue || "");
    }, [selectedValue]);

    React.useEffect(() => {
        setLocalItems([...items]);
    }, [items]);

    const handleSelect = (currentValue: string) => {
        const newValue = currentValue === value ? "" : currentValue;
        setValue(newValue);
        onChange(newValue);
        setOpen(false);
    };

    const handleInputChange = (newInput: string) => {
        setInputValue(newInput);
        if (allowCustomInput) {
            setValue(newInput);
            onChange(newInput);
        }
    };

    const handleCustomSelect = (customValue: string) => {
        // First add to local items
        if (!localItems.some(item => item.value === customValue)) {
            setLocalItems(prev => [...prev, { label: customValue, value: customValue }]);
        }

        // Then select it
        setValue(customValue);
        onChange(customValue);
        setOpen(false);
    };

    const isCustomInput = allowCustomInput && inputValue && !localItems.some((item) => item.value === inputValue);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="justify-between w-full"
                >
                    {value
                        ? (localItems.find((item) => item.value === value)?.label || value)
                        : placeholder}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0 w-[var(--radix-popover-trigger-width)]">
                <Command>
                    <CommandInput
                        placeholder={`Search ${placeholder.toLowerCase()}...`}
                        value={inputValue}
                        onValueChange={handleInputChange}
                    />
                    <CommandList>
                        <CommandEmpty>
                            {allowCustomInput && inputValue ? (
                                <CommandItem onSelect={() => handleCustomSelect(inputValue)}>
                                    Use "{inputValue}"
                                </CommandItem>
                            ) : (
                                "No results found."
                            )}
                        </CommandEmpty>
                        <CommandGroup>
                            {localItems.map((item) => (
                                <CommandItem
                                    key={item.value}
                                    value={item.value}
                                    onSelect={() => handleSelect(item.value)}
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            value === item.value ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                    {item.label}
                                </CommandItem>
                            ))}
                            {isCustomInput && (
                                <CommandItem
                                    key="custom-input"
                                    value={inputValue}
                                    onSelect={() => handleCustomSelect(inputValue)}
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            value === inputValue ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                    Use "{inputValue}"
                                </CommandItem>
                            )}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}