import React, { useState } from "react";
import { trpc } from "../utils/trpc";
import DualListBox from "react-dual-listbox";
import "react-dual-listbox/lib/react-dual-listbox.css";
import { Button } from "flowbite-react";
import IndeterminateProgressBar from "./misc/IndeterminateProgressBar";
import SObjectTable from "./SObjectTable";
import { CustomizableSObjectDTO } from "@schema/sobject-customizable";
import ExportPOC from "./ExportPOC";

const SObjectDuelPicklist = () => {
    const [selected, setSelected] = useState<string[]>([]);

    /**
     * Get Customizable SObjects.
     */
    let customizableSObjects: CustomizableSObjectDTO[] = [];
    const { data: ctmSObjects, isLoading } =
        trpc.schemaObjectRouter.getCustomizableSObjects.useQuery();
    if (!isLoading) {
        customizableSObjects = ctmSObjects as CustomizableSObjectDTO[];
    }

    /**
     * Get Selected SObjects with Fields.
     */
    const {
        data,
        isLoading: sObjFieldsIsLoading,
        refetch: refetchSObjectWithFields,
        isFetching,
    } = trpc.schemaObjectRouter.getSObjectsWithFields.useQuery(
        { selectedSObject: selected },
        { enabled: false }
    );

    /**
     * Method handler to refetch SObject with Fields.
     */
    const retrieveSObjectFields = () => {
        refetchSObjectWithFields();
    };

    /**
     * Handle Duel Selector Change event.
     * @param selected
     */
    const onChange = (selected: string[]) => {
        setSelected(selected);
    };

    return (
        <>
            <section className="container mx-auto mt-36 flex flex-wrap items-center justify-between rounded-md dark:bg-gray-800">
                <div className="w-full p-14 shadow-md">
                    <div className="mb-4 border-l-4 border-l-green-400 p-2 text-sm">
                        <p>
                            Lorem ipsum dolor sit, amet consectetur adipisicing
                            elit. Molestiae ullam magni tempora, quidem
                            veritatis.
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

                            {sObjFieldsIsLoading && isFetching ? (
                                <div>
                                    <IndeterminateProgressBar label="Retrieving . . ." />
                                </div>
                            ) : (
                                <div className="flex flex-wrap justify-start">
                                    <div className="basis-1/4">
                                        <Button
                                            gradientDuoTone="greenToBlue"
                                            onClick={() =>
                                                retrieveSObjectFields()
                                            }
                                        >
                                            Generate
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Addition Configuration */}
                        <div className="col-span-2 px-6"></div>
                    </div>
                </div>
            </section>
            <ExportPOC />
            {/* <SObjectTable sObjectsWithDetailsData={data ?? {}} /> */}
        </>
    );
};

export default SObjectDuelPicklist;
