import { useState, useEffect, useRef } from 'react';
import { Description, Label, ListBox, ListLayout, Virtualizer } from "@heroui/react";
import useAutoCompleteAdd from "../../../hooks/rider";

export default function LocationInput({ placeholder, onSelectLocation, initialValue = "", isActive = true, onFocus }) {
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
            <div className="relative">
                <input
                    type="text"
                    placeholder={placeholder}
                    className="w-full bg-gray-100 border-none rounded-lg py-3 pl-10 pr-4 focus:ring-2 focus:ring-black outline-none font-medium"
                    value={inputValue}
                    onChange={(e) => {
                        userTyped.current = true;
                        setInputValue(e.target.value);
                    }}
                    onFocus={onFocus}
                />
            </div>

            {isActive && data?.data?.length > 0 && (
                <div className="absolute z-50 w-full mt-1 bg-white rounded-lg shadow-lg">
                    <Virtualizer layout={ListLayout} layoutOptions={{ rowHeight: 50 }}>
                        <ListBox
                            aria-label="Location suggestions"
                            className="max-h-[300px] overflow-y-auto"
                            items={data.data}
                            onAction={(key) => {
                                clearTimeout(timerRef.current);
                                let val = data.data.find((x) => x.place_id == key)

                                setInputValue(val.display_name);

                                const name = val.display_place || val.display_name.split(',')[0];
                                onSelectLocation({ lat: val.lat, lon: val.lon, name: name });

                                setDebouncedValue("");
                            }}
                        >
                            {(address) => (
                                <ListBox.Item id={`${address.place_id}`} textValue={address.display_name}>
                                    <div className="flex flex-col">
                                        <Label>{address.display_place || address.display_name.split(',')[0]}</Label>
                                        <Description>{address.display_address || address.display_name}</Description>
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
