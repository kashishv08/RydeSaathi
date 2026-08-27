import { useState, useEffect, useRef } from 'react';
import { Description, Label, ListBox, ListLayout, Virtualizer } from "@heroui/react";
import { MapPin } from 'lucide-react';
import useAutoCompleteAdd from "../../../hooks/rider";

export default function LocationInput({ placeholder, onSelectLocation, initialValue = "", isActive = true, onFocus, icon }) {
    const [inputValue, setInputValue] = useState(initialValue);
    const [debouncedValue, setDebouncedValue] = useState("");
    const timerRef = useRef(null);
    const userTyped = useRef(false);

    useEffect(() => {
        clearTimeout(timerRef.current);
        setInputValue(initialValue);
    }, [initialValue]);

    const { data } = useAutoCompleteAdd(debouncedValue);

    useEffect(() => {
        if (!userTyped.current) return;
        userTyped.current = false;
        timerRef.current = setTimeout(() => setDebouncedValue(inputValue), 400);
        return () => clearTimeout(timerRef.current);
    }, [inputValue]);

    return (
        <div className="relative w-full">
            <div className="relative group">
                {/* Leading icon */}
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 z-10">
                    {icon}
                </div>

                <input
                    type="text"
                    placeholder={placeholder}
                    style={{
                        background: 'var(--clr-card)',
                        border: '1px solid var(--clr-border)',
                        color: 'var(--clr-foreground)',
                        outline: 'none',
                        transition: 'border-color 0.2s, background 0.2s, box-shadow 0.2s',
                    }}
                    className="w-full rounded-xl py-3 pl-10 pr-4 text-sm font-medium placeholder-[var(--clr-muted)] focus:placeholder-[var(--clr-muted)] shadow-sm"
                    value={inputValue}
                    onChange={(e) => {
                        userTyped.current = true;
                        setInputValue(e.target.value);
                    }}
                    onFocus={(e) => {
                        e.target.style.borderColor = 'color-mix(in srgb, var(--clr-primary) 40%, transparent)';
                        e.target.style.background = 'var(--clr-primary-subtle)';
                        e.target.style.boxShadow = '0 0 0 3px var(--clr-primary-subtle)';
                        onFocus?.();
                    }}
                    onBlur={(e) => {
                        e.target.style.borderColor = 'var(--clr-border)';
                        e.target.style.background = 'var(--clr-card)';
                        e.target.style.boxShadow = 'none';
                    }}
                />
            </div>

            {/* Autocomplete dropdown */}
            {isActive && data?.data?.length > 0 && (
                <div
                    className="absolute z-50 w-full mt-1.5 rounded-xl overflow-hidden"
                    style={{
                        background: 'var(--clr-card)',
                        border: '1px solid color-mix(in srgb, var(--clr-primary) 20%, transparent)',
                        boxShadow: '0 12px 40px rgba(27,54,58,0.1)',
                    }}
                >
                    <Virtualizer layout={ListLayout} layoutOptions={{ rowHeight: 56 }}>
                        <ListBox
                            aria-label="Location suggestions"
                            className="max-h-[280px] overflow-y-auto custom-scrollbar"
                            items={data.data}
                            onAction={(key) => {
                                clearTimeout(timerRef.current);
                                const val = data.data.find((x) => x.place_id == key);
                                setInputValue(val.display_name);
                                const name = val.display_place || val.display_name.split(',')[0];
                                onSelectLocation({ lat: val.lat, lon: val.lon, name });
                                setDebouncedValue("");
                            }}
                        >
                            {(address) => (
                                <ListBox.Item
                                    id={`${address.place_id}`}
                                    textValue={address.display_name}
                                    style={{
                                        background: 'transparent',
                                        borderBottom: '1px solid var(--clr-border)',
                                        cursor: 'pointer',
                                        padding: '10px 14px',
                                    }}
                                    className="hover:bg-[var(--clr-primary-subtle)] transition-colors"
                                >
                                    <div className="flex items-start gap-2.5">
                                        <MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0" style={{ color: 'var(--clr-primary)' }} />
                                        <div className="flex flex-col min-w-0">
                                            <Label className="text-sm font-semibold truncate block" style={{ color: 'var(--clr-foreground)' }}>
                                                {address.display_place || address.display_name.split(',')[0]}
                                            </Label>
                                            <Description className="text-xs text-gray-600 truncate block">
                                                {address.display_address || address.display_name}
                                            </Description>
                                        </div>
                                    </div>
                                </ListBox.Item>
                            )}
                        </ListBox>
                    </Virtualizer>
                </div>
            )}
        </div>
    );
}
