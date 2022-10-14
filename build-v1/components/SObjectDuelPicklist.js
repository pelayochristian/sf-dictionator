import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ButtonPrimary from './misc/ButtonPrimary';
import DualListBox from 'react-dual-listbox';
import 'react-dual-listbox/lib/react-dual-listbox.css';
import IndeterminateProgressBar from './misc/IndeterminateProgressBar';

const SObjectDuelPicklist = ({ setSObjectsWithDetails }) => {
    const [selected, setSelected] = useState([]);
    const [sObjects, setSObjects] = useState([]);
    const [showProgressBar, setShowProgressBar] = useState(false);

    useEffect(() => {
        onChange.bind(this);
        getCustomizableSObjects();
    }, []);

    const onChange = (selected) => {
        setSelected(selected);
    };

    /**
     * Call API to retrieve Salesforce Customizable Objects.
     */
    const getCustomizableSObjects = async () => {
        await axios
            .get('/sobject/get-customizable-sobjects')
            .then((response) => {
                setSObjects(response.data);
            })
            .catch((error) => {
                console.error(`Error ${error}`);
            });
    };

    const retrieveSObjectFields = async () => {
        setShowProgressBar(true);
        await axios
            .post('/sobject/get-sobjects-with-fields', selected, {
                headers: {
                    'Content-Type': 'application/json',
                },
            })
            .then((res) => {
                // Set Response Data to the Parent State.
                setSObjectsWithDetails(res.data);
                setShowProgressBar(false);
            })
            .catch((err) => {
                console.error(`Error in retrieveSObjectFields: ${err}`);
            });
    };

    return (
        <>
            <section className="mt-28 container flex flex-wrap justify-between items-center mx-auto dark:bg-gray-800 rounded-lg">
                <div className="shadow-md w-full p-14">
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
                                <p className="font-medium font text-lg">
                                    Select SObject(s)
                                </p>
                            </div>
                            <DualListBox
                                canFilter
                                options={sObjects}
                                selected={selected}
                                onChange={onChange}
                                className="mb-7 h-72"
                                icons={{
                                    moveLeft: (
                                        <svg
                                            className="w-6 h-6"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M15 19l-7-7 7-7"></path>
                                        </svg>
                                    ),
                                    moveAllLeft: (
                                        <svg
                                            className="w-6 h-6"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M11 19l-7-7 7-7m8 14l-7-7 7-7"></path>
                                        </svg>
                                    ),
                                    moveRight: (
                                        <svg
                                            className="w-6 h-6"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M9 5l7 7-7 7"></path>
                                        </svg>
                                    ),
                                    moveAllRight: (
                                        <svg
                                            className="w-6 h-6"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M13 5l7 7-7 7M5 5l7 7-7 7"></path>
                                        </svg>
                                    ),
                                }}
                            />

                            {showProgressBar ? (
                                <div>
                                    <IndeterminateProgressBar label="Retrieving . . ." />
                                </div>
                            ) : (
                                <ButtonPrimary onClick={retrieveSObjectFields}>
                                    Retrieve
                                </ButtonPrimary>
                            )}
                        </div>

                        {/* Addition Configuration */}
                        <div className="col-span-2 px-6">
                            {/* <div className="mb-4">
                                <p className="font-medium font text-lg ">
                                    Choose your toppings
                                </p>
                            </div>
                            <div className="">
                                <input
                                    id="default-checkbox"
                                    type="checkbox"
                                    value=""
                                    className="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                />
                                <label className="ml-2 font-light">
                                    Include Manage Package
                                </label>
                            </div> */}
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default SObjectDuelPicklist;
