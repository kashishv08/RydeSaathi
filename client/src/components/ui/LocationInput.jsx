import { useState, useEffect, useRef } from 'react';
import { Description, Label, ListBox, ListLayout, Virtualizer } from "@heroui/react";
import useAutoCompleteAdd from '../../hooks/rider';

export default function LocationInput({ placeholder, onSelectLocation }) {
    const [inputValue, setInputValue] = useState("");
    const [debouncedValue, setDebouncedValue] = useState("");
    const isSelecting = useRef(false);

    const { data } = useAutoCompleteAdd(debouncedValue);

    useEffect(() => {
        if (isSelecting.current) {
            isSelecting.current = false;
            return;
        }
        const timer = setTimeout(() => setDebouncedValue(inputValue), 400);
        return () => clearTimeout(timer);
    }, [inputValue]);

    console.log(inputValue)

    return (
        <div className="relative mb-4">
            <div className="relative">
                <input
                    type="text"
                    placeholder={placeholder}
                    className="w-full bg-gray-100 border-none rounded-lg py-3 pl-10 pr-4 focus:ring-2 focus:ring-black outline-none font-medium"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                />
            </div>

            {data?.data?.results?.length > 0 && (
                <div className="absolute z-50 w-full mt-1 bg-white rounded-lg shadow-lg">
                    <Virtualizer layout={ListLayout} layoutOptions={{ rowHeight: 50 }}>
                        <ListBox
                            className="max-h-[300px] overflow-y-auto"
                            items={data.data.results}
                            onAction={(key) => {
                                let val = data.data.results.find((x) => x.place_id == key)
                                console.log(val);
                                setInputValue(val.formatted)
                                isSelecting.current = true;
                                // onSelectLocation({val.lan, val.lon})
                                setDebouncedValue("")
                            }}
                        >
                            {(address) => (
                                <ListBox.Item id={`${address.place_id}`} textValue={address.name}>
                                    <div className="flex flex-col">
                                        <Label>{address.address_line1}</Label>
                                        <Description>{address.address_line2}</Description>
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
