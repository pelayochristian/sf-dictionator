import React, { useState } from "react";
import { trpc } from "../utils/trpc";
import DualListBox from "react-dual-listbox";
import "react-dual-listbox/lib/react-dual-listbox.css";
import { CustomizableSObject } from "schema-object";

const SObjectDuelPicklist = () => {
    const [selected, setSelected] = useState([]);

    /**
     * Get Customizable SObjects.
     */
    let customizableSObjects: CustomizableSObject[] = [];
    const { data, isLoading } =
        trpc.schemaObjectRouter.getCustomizableSObjects.useQuery();
    if (!isLoading) {
        customizableSObjects = data as CustomizableSObject[];
    }

    /**
     * Handle Duel Selector Change event.
     * @param selected
     */
    const onChange = (selected: any) => {
        setSelected(selected);
    };

    return (
        <section className="container mx-auto mt-28 flex flex-wrap items-center justify-between rounded-lg dark:bg-gray-800">
            <div className="w-full p-14 shadow-md">
                <div className="mb-4 border-l-4 border-l-green-400 p-2 text-sm">
                    <p>
                        Lorem ipsum dolor sit, amet consectetur adipisicing
                        elit. Molestiae ullam magni tempora, quidem veritatis.
                    </p>
                </div>
                <div className="grid grid-cols-5 gap-6">
                    {/* Duel Picklist */}
                    <div className="col-span-3">
                        <div className="mb-4">
                            <p className="font text-lg font-medium">
                                Select SObject(s)
                            </p>
                        </div>
                        <DualListBox
                            canFilter
                            options={customizableSObjects}
                            selected={selected}
                            onChange={onChange}
                            className="mb-7 h-72"
                            icons={{
                                moveLeft: (
                                    <svg
                                        className="h-6 w-6"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M15 19l-7-7 7-7"
                                        ></path>
                                    </svg>
                                ),
                                moveAllLeft: (
                                    <svg
                                        className="h-6 w-6"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
                                        ></path>
                                    </svg>
                                ),
                                moveRight: (
                                    <svg
                                        className="h-6 w-6"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M9 5l7 7-7 7"
                                        ></path>
                                    </svg>
                                ),
                                moveAllRight: (
                                    <svg
                                        className="h-6 w-6"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M13 5l7 7-7 7M5 5l7 7-7 7"
                                        ></path>
                                    </svg>
                                ),
                            }}
                        />

                        {/* {showProgressBar ? (
                            <div>
                                <IndeterminateProgressBar label="Retrieving . . ." />
                            </div>
                        ) : (
                            <ButtonPrimary onClick={retrieveSObjectFields}>
                                Retrieve
                            </ButtonPrimary>
                        )} */}
                    </div>

                    {/* Addition Configuration */}
                    <div className="col-span-2 px-6"></div>
                </div>
            </div>
        </section>
    );
};

export default SObjectDuelPicklist;
